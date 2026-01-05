"""
Entity Resolution Service - Identifies potential duplicate entities and manages merges.
"""
import logging
from typing import List, Dict, Any
from db.neo4j_client import neo4j_client
from models.schemas import Entity

logger = logging.getLogger(__name__)


class EntityResolutionService:
    """Service for finding and resolving duplicate entities in the graph."""
    
    async def find_duplicates(self, entity_type: str = "Person") -> List[Dict[str, Any]]:
        """
        Find potential duplicates based on simple heuristics.
        Example: Persons with same name and DOB.
        """
        if entity_type == "Person":
            # Heuristic: Same DOB and high name similarity (sharing first and last names)
            query = """
            MATCH (p1:Person), (p2:Person)
            WHERE p1.person_id < p2.person_id
              AND p1.dob = p2.dob
              AND (
                  p1.full_name CONTAINS split(p2.full_name, ' ')[0] 
                  OR p2.full_name CONTAINS split(p1.full_name, ' ')[0]
              )
            RETURN p1.person_id as id1, p2.person_id as id2, p1.full_name as name1, p2.full_name as name2,
                   'Same DOB and similar Name' as reason
            """
            return neo4j_client.execute_query(query)
        
        # Add more heuristics for other types if needed
        return []

    async def suggest_merges(self) -> List[Dict[str, Any]]:
        """Get a list of merge suggestions for the UI."""
        duplicates = await self.find_duplicates("Person")
        suggestions = []
        for dup in duplicates:
            suggestions.append({
                "type": "Person",
                "entities": [dup["id1"], dup["id2"]],
                "confidence": 0.9,
                "reason": dup["reason"],
                "preview": f"{dup['name1']} / {dup['name2']}"
            })
        return suggestions

    async def resolve_entities(self, primary_id: str, duplicate_ids: List[str], entity_type: str):
        """
        Mark entities as resolved. 
        In Palantir, this usually creates a 'canonical' entity or links them via SAME_AS.
        For Mini Gotham, we'll use a SAME_AS relationship.
        """
        for dup_id in duplicate_ids:
            query = f"""
            MATCH (a:{entity_type} {{{entity_type.lower()}_id: $primary_id}})
            MATCH (b:{entity_type} {{{entity_type.lower()}_id: $dup_id}})
            MERGE (a)-[r:SAME_AS]->(b)
            SET r.resolved_at = datetime(), r.status = 'RESOLVED'
            """
            neo4j_client.execute_write(query, {
                "primary_id": primary_id,
                "dup_id": dup_id
            })
        
        logger.info(f"Resolved {len(duplicate_ids)} entities into {primary_id}")

    async def get_resolved_cluster(self, entity_id: str, entity_type: str) -> List[str]:
        """Get all IDs that are part of the same resolved cluster."""
        query = f"""
        MATCH (e:{entity_type} {{{entity_type.lower()}_id: $entity_id}})
        MATCH (e)-[:SAME_AS*]-(related)
        RETURN DISTINCT related.{entity_type.lower()}_id as id
        UNION
        RETURN $entity_id as id
        """
        results = neo4j_client.execute_query(query, {"entity_id": entity_id})
        return [r["id"] for r in results]


# Global instance
entity_resolution_service = EntityResolutionService()
