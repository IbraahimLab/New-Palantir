"""
FastAPI main application.
Mini Gotham backend server.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from datetime import datetime

from core.config import settings
from db.neo4j_client import neo4j_client
from db.supabase_client import supabase_client
from models.schemas import HealthStatus

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info("Starting Mini Gotham backend...")
    logger.info(f"Environment: {settings.environment}")
    
    # Connect to databases
    try:
        neo4j_client.connect()
        supabase_client.connect()
        logger.info("Database connections established")
    except Exception as e:
        logger.error(f"Failed to connect to databases: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Mini Gotham backend...")
    neo4j_client.close()
    logger.info("Cleanup completed")


# Create FastAPI app
app = FastAPI(
    title="Mini Gotham API",
    description="Investigative intelligence platform - Palantir Gotham clone",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== Health Check Endpoints =====

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Mini Gotham API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthStatus)
def health_check():
    """
    Health check endpoint.
    Returns status of all services.
    """
    return HealthStatus(
        status="healthy",
        neo4j=neo4j_client.health_check(),
        supabase=supabase_client.health_check(),
        timestamp=datetime.utcnow()
    )


@app.get("/health/neo4j")
def health_neo4j():
    """Neo4j specific health check."""
    is_healthy = neo4j_client.health_check()
    return {
        "service": "neo4j",
        "status": "healthy" if is_healthy else "unhealthy",
        "uri": settings.neo4j_uri
    }


@app.get("/health/supabase")
def health_supabase():
    """Supabase specific health check."""
    is_healthy = supabase_client.health_check()
    return {
        "service": "supabase",
        "status": "healthy" if is_healthy else "unhealthy",
        "url": settings.supabase_url
    }


# ===== API Routes (will be added in later phases) =====

# TODO: Phase 2 - Entity routes
# TODO: Phase 3 - Graph routes
# TODO: Phase 3 - Search routes
# TODO: Phase 4 - Case management routes
# TODO: Phase 4 - Auth routes


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True if settings.environment == "development" else False
    )
