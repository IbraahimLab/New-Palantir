"""
Alert Service - Manages persistent queries and entity alerts.
"""
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from db.supabase_client import supabase_client
from db.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)


class AlertService:
    """Service for managing persistent search queries and alerts."""
    
    async def create_alert(self, user_id: str, name: str, query: str, entity_type: str = "Person"):
        """Save a persistent query to be monitored."""
        alert_data = {
            "user_id": user_id,
            "name": name,
            "query_string": query,
            "entity_type": entity_type,
            "status": "ACTIVE",
            "created_at": datetime.utcnow().isoformat()
        }
        return await supabase_client.insert("alerts", alert_data)

    async def check_alerts(self):
        """
        Scan active alerts and find new matches in Neo4j.
        In a real system, this would run on a schedule.
        """
        active_alerts = await supabase_client.query("alerts", {"status": "eq.ACTIVE"})
        
        for alert in active_alerts:
            # Simple demo logic: execute the query in Neo4j
            # Note: This requires careful query sanitization in production
            matches = neo4j_client.execute_query(alert["query_string"])
            
            if matches:
                logger.info(f"Alert '{alert['name']}' matched {len(matches)} entities.")
                # Record alert matches in Supabase
                for match in matches:
                    # Logic to check if match is new...
                    pass

    async def list_user_alerts(self, user_id: str) -> List[Dict[str, Any]]:
        """List alerts for a specific user."""
        return await supabase_client.query("alerts", {"user_id": f"eq.{user_id}"})


# Global instance
alert_service = AlertService()
