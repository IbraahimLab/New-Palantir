"""
Document and Content endpoints.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from services.document_service import document_service

router = APIRouter()

@router.get("/{doc_id}")
async def get_document(doc_id: str):
    """Get document details."""
    doc = await document_service.get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/{doc_id}/mentions")
async def get_mentions(doc_id: str):
    """Get entities mentioned in a document."""
    return await document_service.get_mentions(doc_id)

@router.get("/search")
async def search_docs(q: str):
    """Fuzzy search for documents."""
    return await document_service.search_documents(q)
