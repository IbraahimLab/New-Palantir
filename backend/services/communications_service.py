"""
Communications Service - Analysis of calls and messages.
"""
import logging
from typing import List, Dict, Any
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class CommunicationsService:
    """Service for CDR (Call Detail Record) and messaging analysis."""
    
    async def get_comm_network(self, phone_id: str) -> Dict[str, Any]:
        """Get the communication network (1-hop) for a phone."""
        query = """
        MATCH (p:Phone {phone_id: $id})
        MATCH (p)-[r:CALL|MESSAGE]-(neighbor:Phone)
        RETURN p, r, neighbor
        """
        results = neo4j_client.execute_query(query, {"id": phone_id})
        # Logic to format as network graph (similar to expand_neighbors)
        return results

    async def get_frequent_contacts(self, phone_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Identify top contacts by volume of communications."""
        query = """
        MATCH (p:Phone {phone_id: $id})-[r:CALL|MESSAGE]-(neighbor:Phone)
        RETURN neighbor.msisdn as msisdn, count(r) as volume
        ORDER BY volume DESC
        LIMIT $limit
        """
        return neo4j_client.execute_query(query, {"id": phone_id, "limit": limit})


# Global instance
communications_service = CommunicationsService()
