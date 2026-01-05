"""
Data Ingestion Service - Ingests CSV data from the sample dataset into Neo4j.
Uses the ontology to map columns to properties and create relationships.
"""
import csv
import hashlib
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import logging

from core.ontology_manager import ontology_manager
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class DataIngestor:
    """Service for ingesting structured data into the Mini Gotham graph."""
    
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
    
    @property
    def ontology(self):
        return ontology_manager.schema

    
    def _get_file_hash(self, file_path: Path) -> str:
        """Calculate SHA256 hash of a file."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def ingest_objects(self):
        """Ingest all primary objects defined in the ontology."""
        for obj_name, obj_type in self.ontology.objects.items():
            # Special case for Transaction and Document handled differently or mapped to files
            # For this dataset, most objects have their own CSV files matching lowercase name + 's'
            file_name = f"{obj_name.lower()}s.csv"
            file_path = self.data_dir / file_name
            
            if not file_path.exists():
                logger.warning(f"Data file for {obj_name} not found at {file_path}")
                continue
                
            logger.info(f"Ingesting {obj_name} from {file_name}")
            file_hash = self._get_file_hash(file_path)
            ingested_at = datetime.utcnow().isoformat()
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self._create_node(obj_name, obj_type, row, file_name, file_hash, ingested_at)

    def _create_node(self, label: str, obj_type: Any, properties: Dict[str, Any], source: str, file_hash: str, ingested_at: str):
        """Create a single node in Neo4j with provenance."""
        # Clean up empty strings and ensure correct keys
        cleaned_props = {k: v for k, v in properties.items() if v != ""}
        
        # Add provenance
        cleaned_props["_source"] = source
        cleaned_props["_hash"] = file_hash
        cleaned_props["_ingested_at"] = ingested_at
        
        # Build Cypher query
        key_field = obj_type.key
        key_value = cleaned_props.get(key_field)
        
        if not key_value:
            logger.error(f"Missing key field {key_field} for {label}")
            return

        # MERGE node based on primary key
        # We use UNWIND/Map approach for cleaner code but for simple ingestion MERGE is fine
        query = f"""
        MERGE (n:{label} {{{key_field}: $key_value}})
        SET n += $props
        RETURN n
        """
        
        neo4j_client.execute_write(query, {
            "key_value": key_value,
            "props": cleaned_props
        })

    def ingest_relationships(self):
        """Ingest all relationships defined in the ontology."""
        for rel_name, rel_def in self.ontology.relationships.items():
            if not rel_def.dataset:
                continue
                
            file_path = self.data_dir / rel_def.dataset
            if not file_path.exists():
                logger.warning(f"Dataset for relationship {rel_name} not found: {file_path}")
                continue
                
            logger.info(f"Ingesting relationship {rel_name} from {rel_def.dataset}")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self._create_relationship(rel_name, rel_def, row)

    def _create_relationship(self, rel_type: str, rel_def: Any, row: Dict[str, Any]):
        """Create a single relationship between two nodes."""
        from_type = rel_def.from_type
        to_type = rel_def.to_type
        
        # Determine from_key
        try:
            from_key = self.ontology.objects[from_type].key
        except KeyError:
            logger.error(f"From type {from_type} not found in ontology for {rel_type}")
            return

        # Handle generic '*' to_type
        if to_type == "*":
            to_label = row.get("entity_type")
            to_val = row.get("entity_id")
            from_val = row.get("doc_id") # Specifically for DOC_MENTIONS_ENTITY
            if to_label and to_val and from_val:
                self._create_generic_rel(from_val, from_type, to_val, to_label, rel_type, row)
            return

        try:
            to_key = self.ontology.objects[to_type].key
        except KeyError:
            logger.error(f"To type {to_type} not found in ontology for {rel_type}")
            return
        
        # Determine which columns in the CSV map to the from/to keys
        # This is a bit heuristic for this dataset
        from_val = None
        to_val = None
        
        # Look for from_type_id etc.
        potential_from_keys = [from_key, f"from_{from_key}", f"from_{from_type.lower()}", f"from_{from_type.lower()}_id"]
        potential_to_keys = [to_key, f"to_{to_key}", f"to_{to_type.lower()}", f"to_{to_key}_id"]
        
        # Special logic for some files in this dataset
        if "from_phone" in row and from_type == "Phone": from_val = row["from_phone"]
        if "to_phone" in row and to_type == "Phone": to_val = row["to_phone"]
        if "person_id" in row and from_type == "Person": from_val = row["person_id"]
        if "phone_id" in row and to_type == "Phone": to_val = row["phone_id"]
        if "device_id" in row and to_type == "Device": to_val = row["device_id"]
        if "vehicle_id" in row and to_type == "Vehicle": to_val = row["vehicle_id"]
        if "org_id" in row and to_type == "Organisation": to_val = row["org_id"]
        if "event_id" in row and to_type == "Event": to_val = row["event_id"]
        if "account_id" in row:
            if from_type == "Account" and "from_account" in row: from_val = row["from_account"]
            if to_type == "Account" and "to_account" in row: to_val = row["to_account"]
        
        # Fallback to direct key matching
        if not from_val: from_val = row.get(from_key) or row.get(f"from_{from_key}")
        if not to_val: to_val = row.get(to_key) or row.get(f"to_{to_key}")

        if not from_val or not to_val:
            # Try specific column names from the dataset
            if rel_type == "CALL" or rel_type == "MESSAGE":
                from_val = row.get("from_phone")
                to_val = row.get("to_phone")
            elif rel_type == "TRANSFER":
                from_val = row.get("from_account")
                to_val = row.get("to_account")
            elif rel_type == "DOC_MENTIONS_ENTITY":
                from_val = row.get("doc_id")
                # Handle generic "*" to-type in ontology
                to_label = row.get("entity_type")
                to_val = row.get("entity_id")
                if from_val and to_val and to_label:
                    self._create_generic_rel(from_val, "Document", to_val, to_label, rel_type, row)
                    return

        if not from_val or not to_val:
            # logger.debug(f"Could not find IDs for {rel_type} in row {row}")
            return

        query = f"""
        MATCH (a:{from_type} {{{from_key}: $from_val}})
        MATCH (b:{to_type} {{{to_key}: $to_val}})
        MERGE (a)-[r:{rel_type}]->(b)
        SET r += $props
        """
        
        props = {k: v for k, v in row.items() if v != "" and k not in [from_key, to_key, 'from_phone', 'to_phone', 'from_account', 'to_account']}
        
        neo4j_client.execute_write(query, {
            "from_val": from_val,
            "to_val": to_val,
            "props": props
        })

    def _create_generic_rel(self, from_val, from_label, to_val, to_label, rel_type, props):
        from_key = self.ontology.objects[from_label].key
        to_key = self.ontology.objects[to_label].key
        
        query = f"""
        MATCH (a:{from_label} {{{from_key}: $from_val}})
        MATCH (b:{to_label} {{{to_key}: $to_val}})
        MERGE (a)-[r:{rel_type}]->(b)
        SET r += $props
        """
        
        clean_props = {k: v for k, v in props.items() if k not in ['doc_id', 'entity_id', 'entity_type']}
        
        neo4j_client.execute_write(query, {
            "from_val": from_val,
            "to_val": to_val,
            "props": clean_props
        })


def run_ingestion(data_path: str):
    """Convenience function to run the full ingestion."""
    ingestor = DataIngestor(Path(data_path))
    
    # Load ontology first
    ontology_manager.load_ontology(Path(data_path) / "ontology.yaml")
    
    # Ingest objects
    ingestor.ingest_objects()
    
    # Ingest relationships
    ingestor.ingest_relationships()
    
    logger.info("Ingestion complete!")
