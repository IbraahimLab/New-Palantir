"""
Case Management endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from services.case_service import case_service

router = APIRouter()

@router.post("/")
async def create_new_case(case_input: Dict[str, Any]):
    """Create a new investigative case."""
    try:
        return await case_service.create_case(
            name=case_input["name"],
            description=case_input.get("description", ""),
            created_by=case_input["user_id"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_cases():
    """List all cases."""
    return await case_service.list_cases()

@router.get("/{case_id}")
async def get_case_details(case_id: str):
    """Get details for a specific case."""
    case = await case_service.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("/{case_id}/entities")
async def add_entity(case_id: str, entry: Dict[str, Any]):
    """Add an entity to a case."""
    return await case_service.add_entity_to_case(
        case_id=case_id,
        entity_id=entry["entity_id"],
        entity_type=entry["entity_type"],
        notes=entry.get("notes", "")
    )

@router.get("/{case_id}/entities")
async def get_case_entities(case_id: str):
    """Get all entities linked to a case."""
    return await case_service.get_case_entities(case_id)
