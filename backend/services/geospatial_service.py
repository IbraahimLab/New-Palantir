"""
Geospatial Analysis Service - Location-based queries.
"""
import logging
from typing import List, Dict, Any
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class GeospatialService:
    """Service for spatial investigation."""
    
    async def get_entities_in_area(self, min_lat: float, max_lat: float, min_lon: float, max_lon: float) -> List[Dict[str, Any]]:
        """Find entities located within a bounding box."""
        query = """
        MATCH (n)
        WHERE n.lat IS NOT NULL AND n.lon IS NOT NULL
          AND n.lat >= $min_lat AND n.lat <= $max_lat
          AND n.lon >= $min_lon AND n.lon <= $max_lon
        RETURN n, labels(n)[0] as type
        """
        results = neo4j_client.execute_query(query, {
            "min_lat": min_lat, "max_lat": max_lat,
            "min_lon": min_lon, "max_lon": max_lon
        })
        return [{"id": str(r["n"].id), "type": r["type"], "properties": dict(r["n"])} for r in results]

    async def get_entity_sightings(self, entity_id: str, entity_type: str) -> List[Dict[str, Any]]:
        """Get history of sightings for an entity (especially vehicles/persons)."""
        id_field = f"{entity_type.lower()}_id"
        query = f"""
        MATCH (n:{entity_type} {{{id_field}: $id}})
        MATCH (n)-[r:SIGHTED_AT|LOCATED_AT]-(l:Location)
        RETURN l.name as name, l.lat as lat, l.lon as lon, r.timestamp as time
        ORDER BY time ASC
        """
        return neo4j_client.execute_query(query, {"id": entity_id})


# Global instance
geospatial_service = GeospatialService()
