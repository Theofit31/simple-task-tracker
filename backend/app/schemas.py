from pydantic import BaseModel, Field
from typing import Literal

# Schema for creating a new task
class TaskCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255
    )
    description: str = ""
    status: Literal["Todo", "In Progress", "Done"] = "Todo"

# Schema for updating an existing task
class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )
    description: str | None = None
    status: Literal["Todo", "In Progress", "Done"] | None = None

# Schema for returning task data
class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str

    model_config = {
        "from_attributes": True
    }