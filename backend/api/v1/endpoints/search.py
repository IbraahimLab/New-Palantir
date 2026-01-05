"""
Search endpoints.
"""
from fastapi import APIRouter, Query
from typing import List, Dict, Any
from services.search import search_service

router = APIRouter()

@router.get("/")
async def search(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=100)
):
    """Global search across the knowledge graph."""
    return await search_service.global_search(q, limit)

@router.get("/type/{entity_type}")
async def targeted_search(
    entity_type: str,
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Targeted search on a specific entity type."""
    # Using the 'q' as a generic filter for any property
    filters = {"_any": q} # This logic should be refined in search_service if needed
    return await search_service.typed_search(entity_type, { "full_name": q }, limit)
