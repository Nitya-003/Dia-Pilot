from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# Meal Schemas
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


# Glucose Schemas
class GlucoseReadingCreate(BaseModel):
    value: float
    timestamp: Optional[datetime] = None
    source: Optional[str] = "manual"
    notes: Optional[str] = None


class GlucoseReadingResponse(BaseModel):
    id: int
    user_id: int
    value: float
    timestamp: datetime
    source: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class GlucoseStatsResponse(BaseModel):
    avg_glucose: float
    time_in_range: float
    variability: str
    current_value: float


class GlucosePrediction(BaseModel):
    time: str
    value: float
    predicted: bool


# Voice Schemas
class VoiceCommandRequest(BaseModel):
    transcript: str


class VoiceCommandResponse(BaseModel):
    intent: str
    extracted_data: Optional[dict] = None
    message: str
    success: bool


# Simulation Schemas
class SimulationRequest(BaseModel):
    scenario: str  # baseline, meal, exercise
    meal_carbs: Optional[float] = None
    exercise_duration: Optional[int] = None


class SimulationDataPoint(BaseModel):
    time: str
    value: float


# Behavioral Schemas
class CoachingNudgeResponse(BaseModel):
    id: int
    title: str
    message: str
    category: str
    priority: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GlucoseTwinResponse(BaseModel):
    id: int
    name: str
    age: int
    match_score: int
    avatar: str
    strategy: str


# Clinician Schemas
class PatientRiskProfileResponse(BaseModel):
    id: int
    user_id: int
    name: str
    age: int
    risk_level: str
    avg_glucose: Optional[float] = None
    time_in_range: Optional[float] = None
    last_reading_time: Optional[datetime] = None
    trend: str

    class Config:
        from_attributes = True


class ExecutiveSummaryResponse(BaseModel):
    patient_name: str
    avg_glucose: float
    time_in_range: float
    hypo_events: int
    hyper_events: int
    trend: str
    key_insights: List[str]


# Crash Guard Schema
class CrashGuardResponse(BaseModel):
    risk_level: str  # low, medium, high
    estimated_time: Optional[str] = None
    current_glucose: float
    predicted_glucose: float
    recommendations: List[str]


# Health Profile Schemas
class HealthProfileCreate(BaseModel):
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    hba1c: Optional[float] = None
    cholesterol_total: Optional[float] = None
    cholesterol_ldl: Optional[float] = None
    cholesterol_hdl: Optional[float] = None
    triglycerides: Optional[float] = None
    exercise_hours_per_week: Optional[float] = None
    sleep_hours_per_night: Optional[float] = None
    stress_level: Optional[str] = None
    smoking_status: Optional[str] = None
    alcohol_drinks_per_week: Optional[int] = None
    diabetes_type: Optional[str] = None
    years_since_diagnosis: Optional[int] = None
    current_medications: Optional[str] = None
    comorbidities: Optional[str] = None


class HealthProfileResponse(BaseModel):
    id: int
    user_id: int
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    heart_rate: Optional[int] = None
    hba1c: Optional[float] = None
    cholesterol_total: Optional[float] = None
    cholesterol_ldl: Optional[float] = None
    cholesterol_hdl: Optional[float] = None
    triglycerides: Optional[float] = None
    exercise_hours_per_week: Optional[float] = None
    sleep_hours_per_night: Optional[float] = None
    stress_level: Optional[str] = None
    smoking_status: Optional[str] = None
    alcohol_drinks_per_week: Optional[int] = None
    diabetes_type: Optional[str] = None
    years_since_diagnosis: Optional[int] = None
    current_medications: Optional[str] = None
    comorbidities: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DiagnosisResponse(BaseModel):
    id: int
    overall_health_score: float
    risk_level: str
    key_concerns: List[str]
    positive_factors: List[str]
    predicted_complications: List[str]
    recommendations: List[dict]
    action_items: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
