"""
Provenance Service - Tracks the origin and history of data.
"""
import logging
from typing import Dict, Any, List
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class ProvenanceService:
    """Service for retrieving data provenance information."""
    
    async def get_entity_provenance(self, entity_id_val: str, entity_type: str) -> Dict[str, Any]:
        """Get provenance metadata for a specific entity."""
        id_field = f"{entity_type.lower()}_id"
        query = f"""
        MATCH (n:{entity_type} {{{id_field}: $entity_id}})
        RETURN n._source as source, n._hash as hash, n._ingested_at as ingested_at
        """
        result = neo4j_client.execute_query(query, {"entity_id": entity_id_val})
        if result:
            return result[0]
        return {}

    async def get_full_trace(self, entity_id_val: str, entity_type: str) -> List[Dict[str, Any]]:
        """
        In a full version, this would follow the chain of evidence.
        For Mini Gotham, we'll return documents that mention this entity.
        """
        id_field = f"{entity_type.lower()}_id"
        query = f"""
        MATCH (d:Document)-[r:DOC_MENTIONS_ENTITY]->(n:{entity_type} {{{id_field}: $entity_id}})
        RETURN d.doc_id as doc_id, d.title as title, r.context as context, d.classification as classification
        """
        return neo4j_client.execute_query(query, {"entity_id": entity_id_val})


# Global instance
provenance_service = ProvenanceService()
