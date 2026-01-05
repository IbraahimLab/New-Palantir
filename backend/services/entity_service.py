"""
Entity Service - Core logic for entity management and graph expansion.
"""
import logging
from typing import List, Dict, Any, Optional
from db.neo4j_client import neo4j_client
from models.schemas import Entity, GraphData, GraphNode, GraphEdge

logger = logging.getLogger(__name__)


class EntityService:
    """Service for entity-specific operations and graph navigation."""
    
    async def get_entity(self, entity_id: str, entity_type: str) -> Optional[Dict[str, Any]]:
        """Get full details for a specific entity."""
        id_field = f"{entity_type.lower()}_id"
        query = f"MATCH (n:{entity_type} {{{id_field}: $id}}) RETURN n"
        result = neo4j_client.execute_query(query, {"id": entity_id})
        if result:
            node = result[0]["n"]
            return dict(node)
        return None

    async def expand_neighbors(self, entity_id: str, entity_type: str, depth: int = 1) -> GraphData:
        """Expand neighbors for a given entity."""
        id_field = f"{entity_type.lower()}_id"
        # Cypher query to get nodes and relationships up to N hops
        query = f"""
        MATCH (start:{entity_type} {{{id_field}: $id}})
        MATCH (start)-[r*1..{depth}]-(neighbor)
        UNWIND r as rel
        RETURN start, rel, neighbor
        """
        results = neo4j_client.execute_query(query, {"id": entity_id})
        
        nodes = {}
        edges = []
        
        for record in results:
            start_node = record["start"]
            neighbor_node = record["neighbor"]
            rel = record["rel"]
            
            # Add nodes
            for node in [start_node, neighbor_node]:
                n_id = str(node.id)
                if n_id not in nodes:
                    n_type = list(node.labels)[0]
                    nodes[n_id] = GraphNode(
                        id=n_id,
                        label=self._get_label_for_node(node, n_type),
                        type=n_type,
                        properties=dict(node)
                    )
            
            # Add edge
            edges.append(GraphEdge(
                id=str(rel.id),
                source=str(rel.start_node.id),
                target=str(rel.end_node.id),
                type=rel.type,
                properties=dict(rel)
            ))
            
        return GraphData(nodes=list(nodes.values()), edges=edges)

    def _get_label_for_node(self, node: Any, node_type: str) -> str:
        props = dict(node)
        if node_type == "Person": return props.get("full_name", "Unknown")
        if node_type == "Phone": return props.get("msisdn", "Unknown")
        if node_type == "Organisation": return props.get("org_name", "Unknown")
        if node_type == "Location": return props.get("name", "Unknown")
        if node_type == "Document": return props.get("title", "Unknown")
        return props.get("id", "Unknown")


# Global instance
entity_service = EntityService()
