"""
Supabase client using httpx (avoiding supabase-py C++ dependencies).
Direct REST API access to Supabase.
"""
import httpx
from core.config import settings
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)


class SupabaseClient:
    """Lightweight Supabase client using direct REST API calls."""
    
    def __init__(self):
        self._http_client: httpx.AsyncClient = None
        self._base_url = None
        self._headers = None
    
    def connect(self):
        """Initialize Supabase HTTP client."""
        try:
            self._base_url = f"{settings.supabase_url}/rest/v1"
            self._headers = {
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
            self._http_client = httpx.AsyncClient(
                base_url=self._base_url,
                headers=self._headers,
                timeout=30.0
            )
            logger.info(f"Connected to Supabase at {settings.supabase_url}")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {e}")
            raise
    
    async def query(self, table: str, select: str = "*", filters: Dict[str, Any] = None) -> List[Dict]:
        """Query Supabase table."""
        if not self._http_client:
            raise RuntimeError("Supabase client not connected. Call connect() first.")
        
        params = {"select": select}
        if filters:
            params.update(filters)
        
        response = await self._http_client.get(f"/{table}", params=params)
        response.raise_for_status()
        return response.json()
    
    async def insert(self, table: str, data: Dict[str, Any]) -> Dict:
        """Insert data into Supabase table."""
        if not self._http_client:
            raise RuntimeError("Supabase client not connected. Call connect() first.")
        
        response = await self._http_client.post(f"/{table}", json=data)
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> bool:
        """Check if Supabase connection is healthy."""
        try:
            if not self._http_client:
                return False
            # Simple sync check - just verify base URL is accessible
            response = httpx.get(settings.supabase_url, timeout=5.0)
            return response.status_code < 500
        except Exception as e:
            logger.error(f"Supabase health check failed: {e}")
            return False


# Global Supabase client instance
supabase_client = SupabaseClient()
