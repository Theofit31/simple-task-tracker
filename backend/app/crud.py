from sqlalchemy.orm import Session
from app import models, schemas

# READ: baca semua tugas
def get_tasks(db: Session):
    return db.query(models.Task).order_by(
        models.Task.id.asc()
    ).all()

# CREATE: tambah tugas baru
def create_task(db: Session, task: schemas.TaskCreate):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# UPDATE: perbarui tugas yang ada
def update_task(
    db: Session,
    task_id: int,
    task: schemas.TaskUpdate
):
    db_task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()
    if db_task is None:
        return None
    update_data = task.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task

# DELETE: hapus tugas yang ada
def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(
        models.Task.id == task_id
    ).first()
    if db_task is None:
        return None

    db.delete(db_task)
    db.commit()
    return db_task