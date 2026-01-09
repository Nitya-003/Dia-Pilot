from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime
from typing import List

from database import get_db
from models import MealLog
from schemas import MealLogResponse, MealAnalysisResponse
from services.meal_analyzer import meal_analyzer
from config import settings

router = APIRouter(prefix="/api/meals", tags=["meals"])


@router.post("/snap", response_model=MealAnalysisResponse)
async def upload_meal_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a meal photo and get carbohydrate estimate.
    """
    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    try:
        # Save uploaded file
        contents = await file.read()
        
        # Check file size
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
        
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Validate image
        if not meal_analyzer.validate_image(file_path):
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Analyze image
        carbs_estimate, meal_type, confidence = meal_analyzer.analyze_image(file_path)
        
        # Save to database
        meal_log = MealLog(
            image_path=file_path,
            carbs_estimate=carbs_estimate,
            meal_type=meal_type,
            confidence=confidence,
            created_at=datetime.utcnow()
        )
        db.add(meal_log)
        db.commit()
        db.refresh(meal_log)
        
        return MealAnalysisResponse(
            carbs_estimate=carbs_estimate,
            meal_type=meal_type,
            confidence=confidence,
            message=f"Meal logged successfully! Estimated {carbs_estimate}g carbs."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if error occurs
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.get("/history", response_model=List[MealLogResponse])
async def get_meal_history(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get recent meal logs.
    """
    meals = db.query(MealLog).order_by(MealLog.created_at.desc()).limit(limit).all()
    return meals


@router.get("/{meal_id}", response_model=MealLogResponse)
async def get_meal(
    meal_id: int,
    db: Session = Depends(get_db)
):
    """
    Get specific meal details.
    """
    meal = db.query(MealLog).filter(MealLog.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal
