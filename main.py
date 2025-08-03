from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse
from starlette import status
from models import Base
from database import engine
from routers.auth import router as auth_router
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:8050",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://localhost:8055",
    "http://localhost:3000",   # React veya başka frontend default portları
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Yukarıdaki adreslere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root(request: Request):
    return RedirectResponse(url="/docs", status_code=status.HTTP_302_FOUND)


app.include_router(auth_router)

Base.metadata.create_all(bind=engine)