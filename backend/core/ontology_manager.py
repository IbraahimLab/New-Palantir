"""
Ontology Manager - Loads and validates the Mini Gotham ontology schema.
Provides schema validation for data ingestion.
"""
import yaml
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class PropertyDefinition(BaseModel):
    """Definition of a property for an object type."""
    name: str
    type: str = "string"  # string, int, float, date, datetime, boolean
    required: bool = False


class ObjectType(BaseModel):
    """Definition of an entity object type in the ontology."""
    name: str
    key: str  # Primary key field name
    properties: List[str]  # Property names
    
    def get_node_label(self) -> str:
        """Get Neo4j node label for this object type."""
        return self.name


class RelationshipType(BaseModel):
    """Definition of a relationship type in the ontology."""
    name: str
    from_type: str = Field(..., alias="from")
    to_type: str = Field(..., alias="to")
    dataset: Optional[str] = None  # Source CSV file
    properties: List[str] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True


class OntologySchema(BaseModel):
    """Complete ontology schema definition."""
    version: int
    objects: Dict[str, ObjectType]
    relationships: Dict[str, RelationshipType]
    security_markings: Optional[Dict[str, List[str]]] = None
    
    @classmethod
    def from_yaml(cls, yaml_path: Path) -> "OntologySchema":
        """
        Load ontology from YAML file.
        
        Args:
            yaml_path: Path to ontology.yaml file
            
        Returns:
            OntologySchema instance
        """
        with open(yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        # Parse objects
        objects = {}
        for obj_name, obj_def in data.get('objects', {}).items():
            objects[obj_name] = ObjectType(
                name=obj_name,
                key=obj_def['key'],
                properties=obj_def.get('properties', [])
            )
        
        # Parse relationships
        relationships = {}
        for rel_name, rel_def in data.get('relationships', {}).items():
            relationships[rel_name] = RelationshipType(
                name=rel_name,
                **rel_def
            )
        
        return cls(
            version=data.get('version', 1),
            objects=objects,
            relationships=relationships,
            security_markings=data.get('security_markings')
        )
    
    def get_object_type(self, name: str) -> Optional[ObjectType]:
        """Get object type definition by name."""
        return self.objects.get(name)
    
    def get_relationship_type(self, name: str) -> Optional[RelationshipType]:
        """Get relationship type definition by name."""
        return self.relationships.get(name)
    
    def validate_entity_data(self, entity_type: str, data: Dict[str, Any]) -> bool:
        """
        Validate that entity data conforms to ontology.
        
        Args:
            entity_type: Type of entity (e.g., "Person", "Phone")
            data: Entity data dictionary
            
        Returns:
            True if valid, raises ValueError if invalid
        """
        obj_type = self.get_object_type(entity_type)
        if not obj_type:
            raise ValueError(f"Unknown entity type: {entity_type}")
        
        # Check that primary key exists
        if obj_type.key not in data:
            raise ValueError(f"Missing primary key '{obj_type.key}' for {entity_type}")
        
        # Check that only defined properties are present (allow extra fields for provenance)
        allowed_fields = set(obj_type.properties + [obj_type.key])
        provenance_fields = {'_source', '_ingested_at', '_hash'}
        
        for field in data.keys():
            if field not in allowed_fields and field not in provenance_fields:
                logger.warning(f"Unknown field '{field}' for {entity_type}")
        
        return True


class OntologyManager:
    """Manager for loading and accessing ontology schema."""
    
    def __init__(self):
        self._schema: Optional[OntologySchema] = None
    
    def load_ontology(self, yaml_path: Path):
        """
        Load ontology from YAML file.
        
        Args:
            yaml_path: Path to ontology.yaml
        """
        logger.info(f"Loading ontology from {yaml_path}")
        self._schema = OntologySchema.from_yaml(yaml_path)
        logger.info(f"Loaded ontology version {self._schema.version}")
        logger.info(f"Object types: {list(self._schema.objects.keys())}")
        logger.info(f"Relationship types: {list(self._schema.relationships.keys())}")
    
    @property
    def schema(self) -> OntologySchema:
        """Get loaded ontology schema."""
        if not self._schema:
            raise RuntimeError("Ontology not loaded. Call load_ontology() first.")
        return self._schema
    
    def get_node_label(self, entity_type: str) -> str:
        """Get Neo4j node label for entity type."""
        obj_type = self.schema.get_object_type(entity_type)
        if not obj_type:
            raise ValueError(f"Unknown entity type: {entity_type}")
        return obj_type.get_node_label()


# Global ontology manager instance
ontology_manager = OntologyManager()
