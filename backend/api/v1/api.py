"""
API v1 Router Aggregator.
"""
from fastapi import APIRouter
from api.v1.endpoints import entities, search, analytics

api_router = APIRouter()

api_router.include_router(entities.router, prefix="/entities", tags=["Entities"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
