from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from datetime import datetime
from database import Base


class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    image_path = Column(String, nullable=False)
    carbs_estimate = Column(Float, nullable=False)
    meal_type = Column(String, nullable=True)
    confidence = Column(Float, default=0.0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<MealLog(id={self.id}, carbs={self.carbs_estimate}g, created={self.created_at})>"


class GlucoseReading(Base):
    __tablename__ = "glucose_readings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    value = Column(Float, nullable=False)  # mg/dL
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String, default="manual")  # manual, cgm, etc.
    notes = Column(String, nullable=True)

    def __repr__(self):
        return f"<GlucoseReading(id={self.id}, value={self.value}, time={self.timestamp})>"


class VoiceLog(Base):
    __tablename__ = "voice_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    transcript = Column(Text, nullable=False)
    intent = Column(String, nullable=True)  # meal, exercise, medication, note
    extracted_data = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<VoiceLog(id={self.id}, intent={self.intent})>"


class CoachingNudge(Base):
    __tablename__ = "coaching_nudges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # diet, exercise, medication, general
    priority = Column(String, default="medium")  # low, medium, high
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<CoachingNudge(id={self.id}, title={self.title})>"


class PatientRiskProfile(Base):
    __tablename__ = "patient_risk_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    risk_level = Column(String, default="low")  # low, medium, high
    avg_glucose = Column(Float, nullable=True)
    time_in_range = Column(Float, nullable=True)  # percentage
    last_reading_time = Column(DateTime, nullable=True)
    trend = Column(String, default="stable")  # rising, falling, stable
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<PatientRiskProfile(id={self.id}, name={self.name}, risk={self.risk_level})>"


class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1, unique=True)
    
    # Vitals
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    blood_pressure_systolic = Column(Integer, nullable=True)
    blood_pressure_diastolic = Column(Integer, nullable=True)
    heart_rate = Column(Integer, nullable=True)
    
    # Lab values
    hba1c = Column(Float, nullable=True)  # %
    cholesterol_total = Column(Float, nullable=True)  # mg/dL
    cholesterol_ldl = Column(Float, nullable=True)
    cholesterol_hdl = Column(Float, nullable=True)
    triglycerides = Column(Float, nullable=True)
    
    # Lifestyle
    exercise_hours_per_week = Column(Float, nullable=True)
    sleep_hours_per_night = Column(Float, nullable=True)
    stress_level = Column(String, nullable=True)  # low, medium, high
    smoking_status = Column(String, nullable=True)  # never, former, current
    alcohol_drinks_per_week = Column(Integer, nullable=True)
    
    # Medical history
    diabetes_type = Column(String, nullable=True)  # type1, type2, prediabetes
    years_since_diagnosis = Column(Integer, nullable=True)
    current_medications = Column(Text, nullable=True)  # JSON string
    comorbidities = Column(Text, nullable=True)  # JSON string (hypertension, heart disease, etc.)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<HealthProfile(id={self.id}, user_id={self.user_id})>"


class DiagnosisRecord(Base):
    __tablename__ = "diagnosis_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    
    # Analysis results
    overall_health_score = Column(Float, nullable=False)  # 0-100
    risk_level = Column(String, nullable=False)  # low, moderate, high, critical
    key_concerns = Column(Text, nullable=False)  # JSON array
    positive_factors = Column(Text, nullable=True)  # JSON array
    
    # Predictions
    predicted_complications = Column(Text, nullable=True)  # JSON array
    time_horizon = Column(String, default="6 months")
    
    # Recommendations
    recommendations = Column(Text, nullable=False)  # JSON array with priority
    action_items = Column(Text, nullable=True)  # JSON array
    
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<DiagnosisRecord(id={self.id}, score={self.overall_health_score}, risk={self.risk_level})>"
