from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import random

from database import get_db
from models import PatientRiskProfile, GlucoseReading
from schemas import PatientRiskProfileResponse, ExecutiveSummaryResponse

router = APIRouter(prefix="/api/clinician", tags=["clinician"])


@router.get("/triage", response_model=List[PatientRiskProfileResponse])
async def get_patient_triage(db: Session = Depends(get_db)):
    """
    Get patient triage list sorted by risk level.
    """
    # Get or create patient profiles
    profiles = db.query(PatientRiskProfile).all()
    
    if not profiles:
        # Create mock patient profiles
        mock_patients = [
            {"user_id": 1, "name": "Sarah Johnson", "age": 34, "risk_level": "low", "avg_glucose": 112.0, "trend": "stable"},
            {"user_id": 2, "name": "Michael Chen", "age": 52, "risk_level": "high", "avg_glucose": 178.0, "trend": "rising"},
            {"user_id": 3, "name": "Emma Davis", "age": 28, "risk_level": "medium", "avg_glucose": 145.0, "trend": "falling"},
            {"user_id": 4, "name": "James Wilson", "age": 45, "risk_level": "low", "avg_glucose": 105.0, "trend": "stable"},
        ]
        
        for patient in mock_patients:
            profile = PatientRiskProfile(
                **patient,
                time_in_range=random.uniform(70, 95),
                last_reading_time=datetime.utcnow() - timedelta(minutes=random.randint(5, 45)),
                updated_at=datetime.utcnow()
            )
            db.add(profile)
        
        db.commit()
        profiles = db.query(PatientRiskProfile).all()
    
    # Sort by risk level (high, medium, low)
    risk_order = {"high": 0, "medium": 1, "low": 2}
    profiles.sort(key=lambda p: risk_order.get(p.risk_level, 999))
    
    return profiles


@router.get("/summary/{patient_id}", response_model=ExecutiveSummaryResponse)
async def get_executive_summary(
    patient_id: int,
    db: Session = Depends(get_db)
):
    """
    Get executive summary for a specific patient.
    """
    # Get patient profile
    profile = db.query(PatientRiskProfile).filter(
        PatientRiskProfile.user_id == patient_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get patient's glucose readings from last 30 days
    since = datetime.utcnow() - timedelta(days=30)
    readings = db.query(GlucoseReading).filter(
        GlucoseReading.user_id == patient_id,
        GlucoseReading.timestamp >= since
    ).all()
    
    # Calculate metrics
    if readings:
        values = [r.value for r in readings]
        avg_glucose = sum(values) / len(values)
        
        # Time in range
        in_range = [v for v in values if 70 <= v <= 180]
        time_in_range = (len(in_range) / len(values)) * 100
        
        # Count events
        hypo_events = len([v for v in values if v < 70])
        hyper_events = len([v for v in values if v > 180])
        
        trend = profile.trend
    else:
        # Use profile defaults
        avg_glucose = profile.avg_glucose or 110.0
        time_in_range = profile.time_in_range or 85.0
        hypo_events = random.randint(0, 3)
        hyper_events = random.randint(1, 5)
        trend = profile.trend
    
    # Generate key insights
    insights = []
    
    if avg_glucose > 140:
        insights.append("Average glucose elevated - consider medication adjustment")
    
    if time_in_range < 70:
        insights.append(f"Time in range ({time_in_range:.0f}%) below target - needs intervention")
    elif time_in_range > 85:
        insights.append(f"Excellent glucose control with {time_in_range:.0f}% time in range")
    
    if hypo_events > 2:
        insights.append(f"{hypo_events} hypoglycemic events - assess for overtreatment")
    
    if trend == "rising":
        insights.append("Upward glucose trend detected - monitor closely")
    elif trend == "falling":
        insights.append("Downward trend - watch for hypoglycemia risk")
    
    if not insights:
        insights.append("Glucose patterns stable and within targets")
    
    return ExecutiveSummaryResponse(
        patient_name=profile.name,
        avg_glucose=round(avg_glucose, 1),
        time_in_range=round(time_in_range, 1),
        hypo_events=hypo_events,
        hyper_events=hyper_events,
        trend=trend,
        key_insights=insights
    )
