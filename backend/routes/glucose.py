from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import random

from database import get_db
from models import GlucoseReading
from schemas import (
    GlucoseReadingCreate,
    GlucoseReadingResponse,
    GlucoseStatsResponse,
    GlucosePrediction,
    CrashGuardResponse
)
from services.glucose_predictor import glucose_predictor

router = APIRouter(prefix="/api/glucose", tags=["glucose"])


@router.post("/reading", response_model=GlucoseReadingResponse)
async def add_glucose_reading(
    reading: GlucoseReadingCreate,
    db: Session = Depends(get_db)
):
    """Add a new glucose reading."""
    glucose_reading = GlucoseReading(
        value=reading.value,
        timestamp=reading.timestamp or datetime.utcnow(),
        source=reading.source,
        notes=reading.notes
    )
    db.add(glucose_reading)
    db.commit()
    db.refresh(glucose_reading)
    return glucose_reading


@router.get("/readings", response_model=List[GlucoseReadingResponse])
async def get_glucose_readings(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get recent glucose readings."""
    readings = db.query(GlucoseReading).order_by(
        GlucoseReading.timestamp.desc()
    ).limit(limit).all()
    return readings


@router.get("/stats", response_model=GlucoseStatsResponse)
async def get_glucose_stats(db: Session = Depends(get_db)):
    """Get glucose statistics."""
    # Get readings from last 24 hours
    since = datetime.utcnow() - timedelta(days=1)
    readings = db.query(GlucoseReading).filter(
        GlucoseReading.timestamp >= since
    ).all()
    
    if not readings:
        # Return mock data if no readings
        return GlucoseStatsResponse(
            avg_glucose=105.0,
            time_in_range=89.0,
            variability="Low",
            current_value=98.0
        )
    
    values = [r.value for r in readings]
    avg = sum(values) / len(values)
    
    # Time in range (70-180 mg/dL)
    in_range = [v for v in values if 70 <= v <= 180]
    time_in_range = (len(in_range) / len(values)) * 100
    
    # Variability
    if len(values) > 1:
        std_dev = (sum((x - avg) ** 2 for x in values) / len(values)) ** 0.5
        variability = "Low" if std_dev < 20 else ("Medium" if std_dev < 40 else "High")
    else:
        variability = "Low"
    
    return GlucoseStatsResponse(
        avg_glucose=round(avg, 1),
        time_in_range=round(time_in_range, 1),
        variability=variability,
        current_value=values[0] if values else 98.0
    )


@router.get("/predictions", response_model=List[GlucosePrediction])
async def get_glucose_predictions(db: Session = Depends(get_db)):
    """Get predicted glucose values for next 3 hours."""
    # Get most recent reading
    latest = db.query(GlucoseReading).order_by(
        GlucoseReading.timestamp.desc()
    ).first()
    
    current_value = latest.value if latest else 98.0
    
    # Generate predictions
    predictions = glucose_predictor.predict_next_hours(current_value, hours=3)
    
    return [GlucosePrediction(**p) for p in predictions]


@router.get("/crash-guard", response_model=CrashGuardResponse)
async def get_crash_guard_alert(db: Session = Depends(get_db)):
    """Get hypoglycemia risk assessment."""
    # Get recent readings
    readings = db.query(GlucoseReading).order_by(
        GlucoseReading.timestamp.desc()
    ).limit(5).all()
    
    if not readings:
        # Mock data if no readings
        current = 98.0
        predicted = 95.0
        risk = "low"
        time_est = None
        recommendations = ["Keep monitoring glucose levels"]
    else:
        values = [r.value for r in readings]
        current = values[0]
        
        # Check hypoglycemia risk
        risk, time_est, predicted = glucose_predictor.check_hypo_risk(
            current, values
        )
        
        # Generate recommendations
        recommendations = []
        if risk == "high":
            recommendations = [
                "Consume 15g fast-acting carbs immediately",
                "Recheck glucose in 15 minutes",
                "Alert emergency contact if < 54 mg/dL"
            ]
        elif risk == "medium":
            recommendations = [
                "Consider having a small snack",
                "Monitor closely for next 30 minutes",
                "Keep fast-acting carbs nearby"
            ]
        else:
            recommendations = [
                "Glucose levels stable",
                "Continue normal monitoring"
            ]
    
    return CrashGuardResponse(
        risk_level=risk,
        estimated_time=time_est,
        current_glucose=current,
        predicted_glucose=predicted,
        recommendations=recommendations
    )
