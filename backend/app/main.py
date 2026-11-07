from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, get_db, Base
from app import models, schemas, crud

# 1. Inisialisasi tabel database secara otomatis
Base.metadata.create_all(bind=engine)

# 2. Membuat aplikasi FastAPI
app = FastAPI(
    title="Task Tracker API",
    description="REST API for managing tasks",
    version="1.0.0"
)

# 3. Mengaktifkan CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Endpoint untuk mengecek API
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Task Tracker API"
    }

# 5. GET: Mengambil semua task
@app.get("/tasks", response_model=list[schemas.TaskResponse])
def read_tasks(db: Session = Depends(get_db)):
    return crud.get_tasks(db)

# 6. POST: Membuat task baru
@app.post(
    "/tasks",
    response_model=schemas.TaskResponse,
    status_code=201
)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    task.title = task.title.strip()
    if not task.title:
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty"
        )
    return crud.create_task(db, task)

# 7. PUT: Memperbarui task berdasarkan ID
@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task: schemas.TaskUpdate,
    db: Session = Depends(get_db)
):
    # Validasi title jika dikirim dalam request
    if "title" in task.model_fields_set:
        if task.title is None or not task.title.strip():
            raise HTTPException(
                status_code=400,
                detail="Title cannot be empty"
            )

        task.title = task.title.strip()

    # Validasi status jika dikirim dalam request
    if "status" in task.model_fields_set and task.status is None:
        raise HTTPException(
            status_code=400,
            detail="Status cannot be empty"
        )

    updated_task = crud.update_task(db, task_id, task)

    if updated_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return updated_task

# 8. DELETE: Menghapus task berdasarkan ID
@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    deleted_task = crud.delete_task(db, task_id)
    if deleted_task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    return {
        "message": "Task deleted successfully",
        "task": deleted_task
    }