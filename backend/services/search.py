"""
Search Service - Provides elastic-like search capabilities over the knowledge graph.
"""
import logging
from typing import List, Dict, Any, Optional
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class SearchService:
    """Service for searching entities and relationships."""
    
    async def global_search(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Global search across all entity types for a string.
        Matches on any string property.
        """
        cypher = """
        MATCH (n)
        WHERE any(prop in keys(n) WHERE n[prop] CONTAINS $query)
        RETURN n, labels(n)[0] as type
        LIMIT $limit
        """
        results = neo4j_client.execute_query(cypher, {"query": query, "limit": limit})
        return self._format_results(results)

    async def typed_search(self, entity_type: str, filters: Dict[str, Any], limit: int = 20) -> List[Dict[str, Any]]:
        """Search entities of a specific type with filters."""
        # Simple implementation: match any filter
        filter_clause = " AND ".join([f"n.{k} CONTAINS ${k}" for k in filters.keys()])
        cypher = f"""
        MATCH (n:{entity_type})
        WHERE {filter_clause}
        RETURN n, '{entity_type}' as type
        LIMIT $limit
        """
        results = neo4j_client.execute_query(cypher, {**filters, "limit": limit})
        return self._format_results(results)

    def _format_results(self, results: List[Dict]) -> List[Dict]:
        formatted = []
        for r in results:
            node = r["n"]
            node_type = r["type"]
            # Extract common fields
            formatted.append({
                "id": str(node.id),
                "type": node_type,
                "label": self._get_label_for_node(node, node_type),
                "properties": dict(node)
            })
        return formatted

    def _get_label_for_node(self, node: Any, node_type: str) -> str:
        """Get a human-readable label for a node based on its type."""
        props = dict(node)
        if node_type == "Person":
            return props.get("full_name", "Unknown Person")
        if node_type == "Organisation":
            return props.get("org_name", "Unknown Org")
        if node_type == "Location":
            return props.get("name", "Unknown Location")
        if node_type == "Phone":
            return props.get("msisdn", "Unknown Phone")
        if node_type == "Document":
            return props.get("title", "Untitled Document")
        return props.get("id", "Unknown Entity")


# Global instance
search_service = SearchService()
