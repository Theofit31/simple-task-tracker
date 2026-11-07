from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    # Judul tugas
    title = Column(String(255), nullable=False)
    # Deskripsi tugas
    description = Column(Text, nullable=True)
    # Status tugas
    status = Column(
        String(20),
        nullable=False,
        default="Todo"
    )