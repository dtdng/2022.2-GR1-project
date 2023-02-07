from importlib.metadata import metadata
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlalchemy
import databases

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost:5432/gr1_project"
# SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
database = databases.Database(SQLALCHEMY_DATABASE_URL)

metadata = sqlalchemy.MetaData()

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
# connect_args={"check_same_thread": False} #need for sqlite
metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
