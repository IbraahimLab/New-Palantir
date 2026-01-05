"""
API v1 Router Aggregator.
"""
from fastapi import APIRouter
from api.v1.endpoints import entities, search, analytics, cases, documents, alerts, audit

api_router = APIRouter()

api_router.include_router(entities.router, prefix="/entities", tags=["Entities"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(cases.router, prefix="/cases", tags=["Investigation Cases"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Persistent Alerts"])
api_router.include_router(audit.router, prefix="/audit", tags=["Compliance & Audit"])
