from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MealLogResponse(BaseModel):
    id: int
    user_id: int
    image_path: str
    carbs_estimate: float
    meal_type: Optional[str] = None
    confidence: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MealAnalysisResponse(BaseModel):
    carbs_estimate: float
    meal_type: Optional[str] = None
    confidence: float
    message: str
