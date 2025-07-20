from fastapi import FastAPI, Request
from models import Base
from database import engine


app = FastAPI()
Base.metadata.create_all(bind=engine)
