"""
Pydantic models for API requests and responses.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class EntityType(str, Enum):
    """Supported entity types."""
    PERSON = "Person"
    ORGANISATION = "Organisation"
    LOCATION = "Location"
    PHONE = "Phone"
    DEVICE = "Device"
    VEHICLE = "Vehicle"
    EVENT = "Event"
    ACCOUNT = "Account"
    TRANSACTION = "Transaction"
    DOCUMENT = "Document"


class RiskLevel(str, Enum):
    """Risk level classification."""
    LOW = "LOW"
    MED = "MED"
    HIGH = "HIGH"
    UNKNOWN = "UNKNOWN"


class DataClassification(str, Enum):
    """Data classification levels."""
    PUBLIC = "PUBLIC"
    RESTRICTED = "RESTRICTED"
    SENSITIVE_PII = "SENSITIVE_PII"


class UserRole(str, Enum):
    """User roles for access control."""
    ANALYST = "analyst"
    INVESTIGATOR = "investigator"
    ADMIN = "admin"


# ===== Entity Models =====

class EntityBase(BaseModel):
    """Base model for all entities."""
    entity_id: str
    entity_type: str
    properties: Dict[str, Any] = Field(default_factory=dict)


class Entity(EntityBase):
    """Full entity model with provenance."""
    source: Optional[str] = None
    ingested_at: Optional[datetime] = None
    hash: Optional[str] = None


class Relationship(BaseModel):
    """Relationship between entities."""
    relationship_id: Optional[str] = None
    relationship_type: str
    from_entity_id: str
    from_entity_type: str
    to_entity_id: str
    to_entity_type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[datetime] = None


# ===== Search Models =====

class SearchQuery(BaseModel):
    """Search query parameters."""
    q: str = Field(..., description="Search query string")
    entity_types: Optional[List[str]] = None
    limit: int = Field(default=50, le=100)
    offset: int = Field(default=0, ge=0)


class SearchResult(BaseModel):
    """Search result item."""
    entity: Entity
    score: float = Field(ge=0.0, le=1.0)
    snippet: Optional[str] = None


# ===== Graph Models =====

class GraphNode(BaseModel):
    """Graph node for visualization."""
    id: str
    label: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    risk_level: Optional[RiskLevel] = None


class GraphEdge(BaseModel):
    """Graph edge for visualization."""
    id: Optional[str] = None
    source: str
    target: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[datetime] = None


class GraphData(BaseModel):
    """Complete graph data for visualization."""
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class GraphExpandRequest(BaseModel):
    """Request to expand graph from entity."""
    entity_id: str
    entity_type: str
    relationship_types: Optional[List[str]] = None
    depth: int = Field(default=1, ge=1, le=3)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


# ===== Case Management Models =====

class CaseStatus(str, Enum):
    """Investigation case status."""
    OPEN = "open"
    CLOSED = "closed"
    ARCHIVED = "archived"


class CaseCreate(BaseModel):
    """Create investigation case request."""
    case_name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class Case(BaseModel):
    """Investigation case."""
    case_id: str
    case_name: str
    description: Optional[str] = None
    status: CaseStatus
    created_by: str
    created_at: datetime
    updated_at: datetime
    entity_count: int = 0


class CaseEntityAdd(BaseModel):
    """Add entity to case."""
    entity_type: str
    entity_id: str
    notes: Optional[str] = None


# ===== User Models =====

class UserCreate(BaseModel):
    """Create user request."""
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=8)
    role: UserRole = UserRole.ANALYST


class User(BaseModel):
    """User model."""
    user_id: str
    username: str
    email: str
    role: UserRole
    created_at: datetime


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """JWT token payload."""
    user_id: str
    username: str
    role: UserRole


# ===== Health Check =====

class HealthStatus(BaseModel):
    """System health status."""
    status: str
    neo4j: bool
    supabase: bool
    timestamp: datetime
