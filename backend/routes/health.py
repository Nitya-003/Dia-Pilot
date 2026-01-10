from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from datetime import datetime

from database import get_db
from models import HealthProfile, DiagnosisRecord
from schemas import HealthProfileCreate, HealthProfileResponse, DiagnosisResponse
from services.health_analyzer import health_analyzer

router = APIRouter(prefix="/api/health", tags=["health"])


@router.post("/profile", response_model=HealthProfileResponse)
async def create_or_update_health_profile(
    profile_data: HealthProfileCreate,
    db: Session = Depends(get_db)
):
    """
    Create or update user's health profile with comprehensive metrics.
    """
    # Check if profile exists
    existing_profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == 1  # Default user
    ).first()
    
    if existing_profile:
        # Update existing profile
        for field, value in profile_data.dict(exclude_unset=True).items():
            setattr(existing_profile, field, value)
        existing_profile.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_profile)
        return existing_profile
    else:
        # Create new profile
        new_profile = HealthProfile(
            **profile_data.dict(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return new_profile


@router.get("/profile", response_model=HealthProfileResponse)
async def get_health_profile(db: Session = Depends(get_db)):
    """
    Get user's current health profile.
    """
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == 1
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Health profile not found. Please create one first.")
    
    return profile


@router.post("/diagnose", response_model=DiagnosisResponse)
async def get_ai_diagnosis(db: Session = Depends(get_db)):
    """
    Get AI-powered health diagnosis based on current health profile.
    Analyzes vitals, lab values, lifestyle, and generates personalized recommendations.
    """
    # Get health profile
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == 1
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="No health profile found. Please submit health data first."
        )
    
    # Convert profile to dict for analysis
    profile_dict = {
        "weight_kg": profile.weight_kg,
        "height_cm": profile.height_cm,
        "blood_pressure_systolic": profile.blood_pressure_systolic,
        "blood_pressure_diastolic": profile.blood_pressure_diastolic,
        "heart_rate": profile.heart_rate,
        "hba1c": profile.hba1c,
        "cholesterol_total": profile.cholesterol_total,
        "cholesterol_ldl": profile.cholesterol_ldl,
        "cholesterol_hdl": profile.cholesterol_hdl,
        "triglycerides": profile.triglycerides,
        "exercise_hours_per_week": profile.exercise_hours_per_week,
        "sleep_hours_per_night": profile.sleep_hours_per_night,
        "stress_level": profile.stress_level,
        "smoking_status": profile.smoking_status,
        "alcohol_drinks_per_week": profile.alcohol_drinks_per_week,
        "diabetes_type": profile.diabetes_type,
        "years_since_diagnosis": profile.years_since_diagnosis,
    }
    
    # Run AI analysis
    analysis = health_analyzer.analyze_health_profile(profile_dict)
    
    # Save diagnosis record
    diagnosis = DiagnosisRecord(
        user_id=1,
        overall_health_score=analysis["overall_health_score"],
        risk_level=analysis["risk_level"],
        key_concerns=json.dumps(analysis["key_concerns"]),
        positive_factors=json.dumps(analysis["positive_factors"]),
        predicted_complications=json.dumps(analysis["predicted_complications"]),
        recommendations=json.dumps(analysis["recommendations"]),
        action_items=json.dumps(analysis["action_items"]),
        created_at=datetime.utcnow()
    )
    
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    
    # Format response
    return DiagnosisResponse(
        id=diagnosis.id,
        overall_health_score=diagnosis.overall_health_score,
        risk_level=diagnosis.risk_level,
        key_concerns=json.loads(diagnosis.key_concerns),
        positive_factors=json.loads(diagnosis.positive_factors),
        predicted_complications=json.loads(diagnosis.predicted_complications),
        recommendations=json.loads(diagnosis.recommendations),
        action_items=json.loads(diagnosis.action_items),
        created_at=diagnosis.created_at
    )


@router.get("/diagnoses", response_model=list[DiagnosisResponse])
async def get_diagnosis_history(
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    Get history of AI diagnoses.
    """
    diagnoses = db.query(DiagnosisRecord).filter(
        DiagnosisRecord.user_id == 1
    ).order_by(DiagnosisRecord.created_at.desc()).limit(limit).all()
    
    return [
        DiagnosisResponse(
            id=d.id,
            overall_health_score=d.overall_health_score,
            risk_level=d.risk_level,
            key_concerns=json.loads(d.key_concerns),
            positive_factors=json.loads(d.positive_factors),
            predicted_complications=json.loads(d.predicted_complications),
            recommendations=json.loads(d.recommendations),
            action_items=json.loads(d.action_items),
            created_at=d.created_at
        )
        for d in diagnoses
    ]
