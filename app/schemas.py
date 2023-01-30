from typing import Union, List
from pydantic import BaseModel


class roles_input(BaseModel):
    role_id: int
    role_name: str


class account(BaseModel):
    role_id: int
    username: str


class account_input(account):
    password: str
    email: str
    id_card: int
    name: str


class project(BaseModel):
    name_project: str
    description: str


class project_status(project):
    id_project: int
    status: bool

    class Config:
        orm_mode: True


class project_description(BaseModel):
    id_project: int
    type: str
    description: str


class LoginUser(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    # name: str
    username: str

    # class Config:
    #     orm_mode: True


class UserInput(User):
    password: str


class TokenData(BaseModel):
    username: Union[str, None] = None
    scopes: List[str] = []


class project_description(BaseModel):
    id_project: int
    type: str
    description: str


class task(BaseModel):
    id_project: int
    id_employee: int
    description: str


class task_status(BaseModel):
    id_task: int
    status: str
