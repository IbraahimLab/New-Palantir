"""
Verification script for Phase 4: Advanced Features.
Tests Case Management, Alerts, and Audit functionality.
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
from db.supabase_client import supabase_client
from services.case_service import case_service
from services.audit_service import audit_service
from services.alert_service import alert_service
from services.document_service import document_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def verify():
    try:
        neo4j_client.connect()
        supabase_client.connect()
        
        # 1. Test Case Creation
        logger.info("--- 1. Testing Case Management ---")
        new_case = await case_service.create_case(
            name="Verification Case", 
            description="Testing automated case creation", 
            created_by="VERIFIER_001"
        )
        case_id = new_case[0]["id"]
        logger.info(f"Created case with ID: {case_id}")
        
        # 2. Add Entity to Case
        await case_service.add_entity_to_case(case_id, "P001", "Person", "Primary suspect for verification test")
        logger.info("Added Person P001 to the case")
        
        # 3. Test Audit Logging
        logger.info("\n--- 2. Testing Audit Logging ---")
        await audit_service.log_action(
            user_id="VERIFIER_001",
            action="VIEW_ENTITY",
            resource_id="P001",
            resource_type="Person",
            details={"ip": "127.0.0.1", "browser": "AutomatedScript"}
        )
        history = await audit_service.get_resource_history("P001", "Person")
        logger.info(f"Retrieved {len(history)} audit events for P001")
        
        # 4. Test Alert Creation
        logger.info("\n--- 3. Testing Persistent Alerts ---")
        await alert_service.create_alert(
            user_id="VERIFIER_001",
            name="High Risk Person Alert",
            query="MATCH (p:Person {risk_flag: 'HIGH'}) RETURN p.full_name",
            entity_type="Person"
        )
        alerts = await alert_service.list_user_alerts("VERIFIER_001")
        logger.info(f"User has {len(alerts)} active alerts")
        
        # 5. Test Document Mentions
        logger.info("\n--- 4. Testing Document Linking ---")
        mentions = await document_service.get_mentions("DOC001")
        logger.info(f"DOC001 has {len(mentions)} linked entity mentions")
        for m in mentions:
            logger.info(f"Mentioned: {m['type']} (Mentioned in: {m['context']})")

        logger.info("\nVerification Phase 4 Successful!")

    except Exception as e:
        logger.error(f"Verification failed: {e}")
    finally:
        neo4j_client.close()

if __name__ == "__main__":
    asyncio.run(verify())
