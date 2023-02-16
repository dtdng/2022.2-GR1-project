from db.database import SessionLocal
from fastapi import FastAPI, Request, Response
from db.database import engine, database
from models import models
from routers import main_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

models.Base.metadata.create_all(engine)

app.include_router(main_router.router)

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await database.connect()


@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


@app.get("/")
def read_root():
    return {"Hello": "World"}
