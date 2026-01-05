"""
Configuration management for Mini Gotham backend.
Loads environment variables and provides centralized config access.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    environment: str = "development"
    secret_key: str = "change-this-secret-key-in-production"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # Neo4j Configuration
    neo4j_uri: str
    neo4j_username: str
    neo4j_password: str
    
    # Supabase Configuration
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    
    # Optional Mapbox (for later phases)
    mapbox_access_token: Optional[str] = None
    
    # Security
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
