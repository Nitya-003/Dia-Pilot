from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base


class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)  # Simplified for now
    image_path = Column(String, nullable=False)
    carbs_estimate = Column(Float, nullable=False)
    meal_type = Column(String, nullable=True)  # breakfast, lunch, dinner, snack
    confidence = Column(Float, default=0.0)  # Confidence score 0-1
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<MealLog(id={self.id}, carbs={self.carbs_estimate}g, created={self.created_at})>"
