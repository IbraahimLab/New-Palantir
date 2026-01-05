"""
Document Service - Handles file storage, retrieval, and entity mentions.
"""
import logging
from typing import List, Dict, Any, Optional
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class DocumentService:
    """Service for document-related operations."""
    
    async def get_document(self, doc_id: str) -> Optional[Dict[str, Any]]:
        """Get document metadata and content (simulated)."""
        query = "MATCH (d:Document {doc_id: $id}) RETURN d"
        result = neo4j_client.execute_query(query, {"id": doc_id})
        if result:
             return dict(result[0]["n"])
        return None

    async def get_mentions(self, doc_id: str) -> List[Dict[str, Any]]:
        """Get entities mentioned in a document."""
        query = """
        MATCH (d:Document {doc_id: $id})-[r:DOC_MENTIONS_ENTITY]->(e)
        RETURN e, labels(e)[0] as type, r.mention as mention
        """
        results = neo4j_client.execute_query(query, {"id": doc_id})
        return [
            {
                "id": str(r["e"].id),
                "type": r["type"],
                "mention": r["mention"],
                "properties": dict(r["e"])
            } 
            for r in results
        ]

    async def search_documents(self, text_query: str) -> List[Dict[str, Any]]:
        """Search documents by title or content (simulated)."""
        query = """
        MATCH (d:Document)
        WHERE d.title CONTAINS $q OR d.path CONTAINS $q
        RETURN d
        """
        results = neo4j_client.execute_query(query, {"q": text_query})
        return [dict(r["d"]) for r in results]


# Global instance
document_service = DocumentService()
