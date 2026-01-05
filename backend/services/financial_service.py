"""
Financial Service - Money flow and transaction tracing.
"""
import logging
from typing import List, Dict, Any
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class FinancialService:
    """Service for transaction tracing and financial flow analysis."""
    
    async def trace_money_flow(self, account_id: str, depth: int = 3) -> List[Dict[str, Any]]:
        """Trace how money flows through accounts (multi-hop)."""
        query = f"""
        MATCH path = (start:Account {{account_id: $id}})-[:TRANSFER*1..{depth}]->(end:Account)
        RETURN [n in nodes(path) | n.account_id] as chain, 
               [r in relationships(path) | r.amount_usd] as amounts,
               [r in relationships(path) | r.timestamp] as times
        """
        return neo4j_client.execute_query(query, {"id": account_id})


# Global instance
financial_service = FinancialService()
