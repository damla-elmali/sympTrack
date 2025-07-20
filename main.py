from fastapi import FastAPI, Request
from models import Base
from database import engine


app = FastAPI()
Base.metadata.create_all(bind=engine)


def get_db():
    from database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def read_all(db: A):
    from models import User
    return db.query(User).all()