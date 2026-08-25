import os
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jaitra-db")

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/jaitra_db")

def init_engine(url: str):
    # Try configured DATABASE_URL
    try:
        if url.startswith("sqlite"):
            eng = create_engine(url, connect_args={"check_same_thread": False})
        else:
            eng = create_engine(url, pool_pre_ping=True, pool_recycle=3600)
        with eng.connect() as conn:
            logger.info("Successfully connected to PostgreSQL Database: %s", url.split("@")[-1] if "@" in url else url)
        return eng
    except Exception as e:
        logger.warning(
            "PostgreSQL connection with configured credentials encountered: %s. "
            "Using persistent database fallback. Update DATABASE_URL in backend/.env with your Postgres password when ready.",
            str(e)
        )
        sqlite_url = "sqlite:///./jaitra_association.db"
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = init_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
