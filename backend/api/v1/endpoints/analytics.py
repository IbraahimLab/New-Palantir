"""
Analytics endpoints for temporal, geospatial, and investigative analysis.
"""
from fastapi import APIRouter, Query
from typing import List, Dict, Any
from services.temporal_service import temporal_service
from services.geospatial_service import geospatial_service
from services.communications_service import communications_service
from services.financial_service import financial_service

router = APIRouter()

# --- Temporal ---
@router.get("/timeline/{entity_type}/{entity_id}")
async def get_timeline(entity_type: str, entity_id: str):
    """Get chronological timeline for an entity."""
    return await temporal_service.get_entity_timeline(entity_id, entity_type)

# --- Geospatial ---
@router.get("/geo/area")
async def get_area_entities(
    min_lat: float, max_lat: float, min_lon: float, max_lon: float
):
    """Find entities in a specific geographic area."""
    return await geospatial_service.get_entities_in_area(min_lat, max_lat, min_lon, max_lon)

@router.get("/geo/sightings/{entity_type}/{entity_id}")
async def get_sightings(entity_type: str, entity_id: str):
    """Get location history for an entity."""
    return await geospatial_service.get_entity_sightings(entity_id, entity_type)

# --- Communications ---
@router.get("/comms/frequent/{phone_id}")
async def get_top_contacts(phone_id: str, limit: int = 5):
    """Get most frequent communication contacts."""
    return await communications_service.get_frequent_contacts(phone_id, limit)

# --- Financial ---
@router.get("/finance/trace/{account_id}")
async def trace_money(account_id: str, depth: int = 3):
    """Trace money flow from an account."""
    return await financial_service.trace_money_flow(account_id, depth)
