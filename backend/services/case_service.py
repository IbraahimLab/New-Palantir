"""
Case Service - Manages investigative cases.
"""
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from db.supabase_client import supabase_client

logger = logging.getLogger(__name__)


class CaseService:
    """Service for case management operations."""
    
    async def create_case(self, name: str, description: str, created_by: str) -> Dict[str, Any]:
        """Create a new investigative case."""
        case_data = {
            "name": name,
            "description": description,
            "created_by": created_by,
            "status": "OPEN",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        return await supabase_client.insert("cases", case_data)

    async def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve case details."""
        results = await supabase_client.query("cases", {"id": f"eq.{case_id}"})
        return results[0] if results else None

    async def list_cases(self) -> List[Dict[str, Any]]:
        """List all cases."""
        return await supabase_client.query("cases", {"order": "updated_at.desc"})

    async def add_entity_to_case(self, case_id: str, entity_id: str, entity_type: str, notes: str = ""):
        """Link an entity to a case."""
        data = {
            "case_id": case_id,
            "entity_id": entity_id,
            "entity_type": entity_type,
            "notes": notes,
            "added_at": datetime.utcnow().isoformat()
        }
        return await supabase_client.insert("case_entities", data)

    async def get_case_entities(self, case_id: str) -> List[Dict[str, Any]]:
        """Get all entities linked to a case."""
        return await supabase_client.query("case_entities", {"case_id": f"eq.{case_id}"})

    async def add_case_note(self, case_id: str, user_id: str, content: str):
        """Add an investigator note to a case."""
        data = {
            "case_id": case_id,
            "user_id": user_id,
            "content": content,
            "created_at": datetime.utcnow().isoformat()
        }
        return await supabase_client.insert("case_notes", data)


# Global instance
case_service = CaseService()
