"""
Temporal Analysis Service - Chronological event reconstruction.
"""
import logging
from typing import List, Dict, Any
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class TemporalService:
    """Service for time-based investigation."""
    
    async def get_entity_timeline(self, entity_id: str, entity_type: str) -> List[Dict[str, Any]]:
        """Get chronologically sorted events connected to an entity."""
        id_field = f"{entity_type.lower()}_id"
        
        # This query looks for any connected nodes that have a timestamp-like property
        # and also relationships that have timestamps (like CALL, TRANSFER)
        query = f"""
        MATCH (n:{entity_type} {{{id_field}: $id}})
        OPTIONAL MATCH (n)-[r]-(e)
        WITH n, r, e
        WHERE e.timestamp IS NOT NULL OR r.timestamp IS NOT NULL OR e.start_time IS NOT NULL
        RETURN 
            CASE 
                WHEN e.timestamp IS NOT NULL THEN e.timestamp
                WHEN e.start_time IS NOT NULL THEN e.start_time
                WHEN r.timestamp IS NOT NULL THEN r.timestamp
            END as time,
            labels(e)[0] as type,
            type(r) as relationship,
            properties(e) as entity_props,
            properties(r) as rel_props
        ORDER BY time ASC
        """
        return neo4j_client.execute_query(query, {"id": entity_id})


# Global instance
temporal_service = TemporalService()
