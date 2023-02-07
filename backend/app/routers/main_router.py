from fastapi import APIRouter
from routers import login, admin, employee, manager, project, task, workflow

router = APIRouter()

router.include_router(login.router)
router.include_router(admin.router)
router.include_router(manager.router)
router.include_router(project.router)
router.include_router(employee.router)
router.include_router(task.router)
router.include_router(workflow.router)