"""
Audit Service - Tracks user actions for compliance and investigation history.
"""
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from db.supabase_client import supabase_client
from core.config import settings

logger = logging.getLogger(__name__)


class AuditService:
    """Service for recording and retrieving audit logs."""
    
    async def log_action(
        self, 
        user_id: str, 
        action: str, 
        resource_id: str, 
        resource_type: str, 
        details: Optional[Dict[str, Any]] = None
    ):
        """Record an action in the audit log."""
        log_entry = {
            "user_id": user_id,
            "action": action,
            "resource_id": resource_id,
            "resource_type": resource_type,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        try:
            # We'll use Supabase for persistent audit logs
            await supabase_client.insert("audit_logs", log_entry)
            logger.info(f"Audit log: {user_id} performed {action} on {resource_type}:{resource_id}")
        except Exception as e:
            logger.error(f"Failed to record audit log: {e}")

    async def get_resource_history(self, resource_id: str, resource_type: str) -> List[Dict[str, Any]]:
        """Get all actions performed on a specific resource."""
        query_params = {
            "resource_id": f"eq.{resource_id}",
            "resource_type": f"eq.{resource_type}",
            "order": "timestamp.desc"
        }
        return await supabase_client.query("audit_logs", query_params)

    async def get_user_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all actions performed by a specific user."""
        query_params = {
            "user_id": f"eq.{user_id}",
            "order": "timestamp.desc"
        }
        return await supabase_client.query("audit_logs", query_params)


# Global instance
audit_service = AuditService()
