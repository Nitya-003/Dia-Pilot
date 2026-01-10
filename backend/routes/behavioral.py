from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import GlucoseReading
from schemas import CoachingNudgeResponse, GlucoseTwinResponse
from services.behavioral_coach import behavioral_coach

router = APIRouter(prefix="/api/behavioral", tags=["behavioral"])


@router.get("/coaching", response_model=List[CoachingNudgeResponse])
async def get_coaching_nudges(db: Session = Depends(get_db)):
    """
    Get personalized coaching nudges based on user patterns.
    """
    # Get recent glucose data
    readings = db.query(GlucoseReading).order_by(
        GlucoseReading.timestamp.desc()
    ).limit(10).all()
    
    values = [r.value for r in readings] if readings else None
    
    # Generate nudges
    nudges = behavioral_coach.generate_nudges(values)
    
    return [CoachingNudgeResponse(**n) for n in nudges]


@router.get("/twins", response_model=List[GlucoseTwinResponse])
async def get_glucose_twins():
    """
    Get glucose twins - metabolically similar users with successful strategies.
    """
    # Mock user profile (in production, would get from user session)
    user_profile = {
        "age": 32,
        "avg_glucose": 110
    }
    
    twins = behavioral_coach.find_glucose_twins(user_profile)
    
    return [GlucoseTwinResponse(**t) for t in twins]
