"""
Audit and Compliance endpoints.
"""
from fastapi import APIRouter
from typing import List, Dict, Any
from services.audit_service import audit_service

router = APIRouter()

@router.get("/user/{user_id}")
async def get_user_audit(user_id: str):
    """Get audit history for a specific user."""
    return await audit_service.get_user_history(user_id)

@router.get("/resource/{resource_type}/{resource_id}")
async def get_resource_audit(resource_type: str, resource_id: str):
    """Get audit history for a specific resource (entity/document)."""
    return await audit_service.get_resource_history(resource_id, resource_type)
