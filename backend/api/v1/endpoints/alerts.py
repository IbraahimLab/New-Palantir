"""
Persistent queries and monitoring alerts.
"""
from fastapi import APIRouter, Query
from typing import List, Dict, Any
from services.alert_service import alert_service

router = APIRouter()

@router.post("/")
async def create_alert(alert_input: Dict[str, Any]):
    """Create a persistent query alert."""
    return await alert_service.create_alert(
        user_id=alert_input["user_id"],
        name=alert_input["name"],
        query=alert_input["query"]
    )

@router.get("/user/{user_id}")
async def list_alerts(user_id: str):
    """List active alerts for a user."""
    return await alert_service.list_user_alerts(user_id)
