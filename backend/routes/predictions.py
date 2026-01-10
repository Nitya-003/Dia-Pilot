from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import SimulationRequest, SimulationDataPoint
from services.glucose_predictor import glucose_predictor
from models import GlucoseReading
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.post("/simulate", response_model=List[SimulationDataPoint])
async def simulate_glucose(
    request: SimulationRequest,
    db: Session = Depends(get_db)
):
    """
    Simulate glucose response to different scenarios.
    """
    # Get current glucose value
    latest = db.query(GlucoseReading).order_by(
        GlucoseReading.timestamp.desc()
    ).first()
    
    current_value = latest.value if latest else 98.0
    
    # Run simulation
    results = glucose_predictor.simulate_scenario(
        current_value=current_value,
        scenario=request.scenario,
        meal_carbs=request.meal_carbs,
        exercise_duration=request.exercise_duration
    )
    
    return [SimulationDataPoint(**r) for r in results]
