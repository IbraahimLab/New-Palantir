"""
Entity and Graph exploration endpoints.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services.entity_service import entity_service
from models.schemas import GraphData

router = APIRouter()

@router.get("/{entity_type}/{entity_id}")
async def get_entity_details(entity_type: str, entity_id: str):
    """Get full details for a specific entity."""
    entity = await entity_service.get_entity(entity_id, entity_type)
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity

@router.get("/{entity_type}/{entity_id}/expand", response_model=GraphData)
async def expand_entity(
    entity_type: str, 
    entity_id: str, 
    depth: int = Query(1, ge=1, le=3)
):
    """Expand the graph from a specific entity."""
    try:
        return await entity_service.expand_neighbors(entity_id, entity_type, depth)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
