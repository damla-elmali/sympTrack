from fastapi import APIRouter, Depends, Path, HTTPException, Request, Response
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import RedirectResponse


router = APIRouter(
    prefix="/symptoms",
    tags=["Symptoms"]
)