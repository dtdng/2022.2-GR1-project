from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Security

from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from pydantic import BaseModel, ValidationError
from db import database


router = APIRouter(
    prefix="/manager",
    tags=["manager"],
    dependencies=None,
    responses=None
)

get_db = database.get_db


