"""
Neo4j database client for graph operations.
"""
from neo4j import GraphDatabase, Driver
from typing import Optional, Dict, List, Any
from core.config import settings
import logging

logger = logging.getLogger(__name__)


class Neo4jClient:
    """Neo4j database client wrapper."""
    
    def __init__(self):
        self._driver: Optional[Driver] = None
    
    def connect(self):
        """Initialize Neo4j driver connection."""
        try:
            self._driver = GraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_username, settings.neo4j_password)
            )
            # Test connection
            self._driver.verify_connectivity()
            logger.info(f"Connected to Neo4j at {settings.neo4j_uri}")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise
    
    def close(self):
        """Close Neo4j driver connection."""
        if self._driver:
            self._driver.close()
            logger.info("Neo4j connection closed")
    
    def execute_query(self, query: str, parameters: Dict[str, Any] = None) -> List[Dict]:
        """
        Execute a Cypher query and return results.
        
        Args:
            query: Cypher query string
            parameters: Query parameters
            
        Returns:
            List of result records as dictionaries
        """
        if not self._driver:
            raise RuntimeError("Neo4j driver not connected. Call connect() first.")
        
        with self._driver.session() as session:
            result = session.run(query, parameters or {})
            return [dict(record) for record in result]
    
    def execute_write(self, query: str, parameters: Dict[str, Any] = None) -> List[Dict]:
        """
        Execute a write transaction (CREATE, MERGE, UPDATE, DELETE).
        
        Args:
            query: Cypher query string
            parameters: Query parameters
            
        Returns:
            List of result records as dictionaries
        """
        if not self._driver:
            raise RuntimeError("Neo4j driver not connected. Call connect() first.")
        
        def _transaction_function(tx):
            result = tx.run(query, parameters or {})
            return [dict(record) for record in result]
        
        with self._driver.session() as session:
            return session.execute_write(_transaction_function)
    
    def health_check(self) -> bool:
        """Check if Neo4j connection is healthy."""
        try:
            if not self._driver:
                return False
            self._driver.verify_connectivity()
            return True
        except Exception as e:
            logger.error(f"Neo4j health check failed: {e}")
            return False


# Global Neo4j client instance
neo4j_client = Neo4jClient()
