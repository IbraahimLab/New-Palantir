"""
Verification script for Phase 2: Data Layer.
Checks if data is loaded correctly and if entity resolution finds duplicates.
"""
import sys
import os
import asyncio
import logging
from pathlib import Path

# Add backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.append(backend_dir)

from db.neo4j_client import neo4j_client
from services.entity_resolution import entity_resolution_service
from services.search import search_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify():
    try:
        neo4j_client.connect()
        
        # 1. Check Node Counts
        logger.info("--- 1. Checking Node Counts ---")
        counts = neo4j_client.execute_query("MATCH (n) RETURN labels(n)[0] as type, count(*) as count")
        for c in counts:
            logger.info(f"Type: {c['type']}, Count: {c['count']}")
        
        # 2. Check Relationships
        logger.info("\n--- 2. Checking Relationships ---")
        rel_counts = neo4j_client.execute_query("MATCH ()-[r]->() RETURN type(r) as type, count(*) as count")
        for rc in rel_counts:
            logger.info(f"Rel: {rc['type']}, Count: {rc['count']}")
            
        # 3. Verify Specific Demo Entities
        logger.info("\n--- 3. Verifying Demo Entities (Ayaan) ---")
        ayaans = await search_service.typed_search("Person", {"full_name": "Ayaan"})
        logger.info(f"Found {len(ayaans)} Ayaans")
        for a in ayaans:
             logger.info(f"ID: {a['properties'].get('person_id')}, Name: {a['label']}")

        # 4. Test Entity Resolution
        logger.info("\n--- 4. Testing Entity Resolution Suggestions ---")
        suggestions = await entity_resolution_service.suggest_merges()
        logger.info(f"Found {len(suggestions)} merge suggestions")
        for s in suggestions:
            logger.info(f"Suggestion: {s['reason']} for {s['entities']} ({s['preview']})")
            
        # 5. Check Document Mentions
        logger.info("\n--- 5. Checking Document Mentions ---")
        mentions = neo4j_client.execute_query("MATCH (d:Document)-[r:DOC_MENTIONS_ENTITY]->(e) RETURN d.doc_id as doc, labels(e)[0] as target, count(*) as count LIMIT 5")
        for m in mentions:
            logger.info(f"Doc {m['doc']} mentions {m['target']} (Count: {m['count']})")

    except Exception as e:
        logger.error(f"Verification failed: {e}")
    finally:
        neo4j_client.close()

if __name__ == "__main__":
    asyncio.run(verify())
