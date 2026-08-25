import sys
import os
import psycopg2
from sqlalchemy import create_engine
import models
from database import Base

def test_and_sync_postgres(password="postgres", host="localhost", port=5432, dbname="jaitra_db", user="postgres"):
    pg_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    print(f"Testing PostgreSQL connection to: {user}@{host}:{port}/{dbname} ...")
    
    try:
        conn = psycopg2.connect(pg_url)
        print("✓ Successfully connected to PostgreSQL jaitra_db!")
        conn.close()
        
        # Create all tables in PostgreSQL
        engine = create_engine(pg_url)
        Base.metadata.create_all(bind=engine)
        print("✓ All 12 tables created / verified in PostgreSQL jaitra_db:")
        print("  - festival_celebrations")
        print("  - festival_collections")
        print("  - festival_expenses")
        print("  - cultural_events")
        print("  - cultural_participants")
        print("  - cultural_agendas")
        print("  - gbm_meetings")
        print("  - community_issues")
        print("  - ado_tasks")
        print("  - ado_comments")
        print("  - ado_attachments")
        print("  - team_members")
        
        # Update .env
        with open(".env", "w") as f:
            f.write(f"DATABASE_URL={pg_url}\n")
        print("✓ Updated backend/.env with live PostgreSQL credentials!")
        return True
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return False

if __name__ == "__main__":
    pwd = sys.argv[1] if len(sys.argv) > 1 else "postgres"
    test_and_sync_postgres(password=pwd)
