"""
Script to load the sample data into the Mini Gotham graph.
"""
import sys
import os
from pathlib import Path
import logging

# Add the current directory to sys.path to import local modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from services.data_ingestion import run_ingestion
from db.neo4j_client import neo4j_client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    # Set up paths
    data_path = Path(parent_dir).parent / "Data" / "mini_gotham_sample_dataset"
    
    if not data_path.exists():
        logger.error(f"Data path not found at {data_path}")
        return

    try:
        # Connect to Neo4j
        neo4j_client.connect()
        
        # Run ingestion
        run_ingestion(str(data_path))
        
    except Exception as e:
        logger.error(f"An error occurred during loading: {e}")
    finally:
        neo4j_client.close()

if __name__ == "__main__":
    main()
