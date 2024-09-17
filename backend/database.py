from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
from pathlib import Path

dotenv_path = Path('./secret.env')
load_dotenv(dotenv_path=dotenv_path)
password = os.getenv("password")

DATABASE_URL = f"postgresql://postgres:{password}@localhost:5432/RecipesTreasure"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
