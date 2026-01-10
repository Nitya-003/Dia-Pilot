"""
Seed database with sample data for testing.
"""
from datetime import datetime, timedelta
import random

from database import SessionLocal, init_db
from models import GlucoseReading, MealLog, VoiceLog, CoachingNudge, PatientRiskProfile


def seed_database():
    """Populate database with sample data."""
    db = SessionLocal()
    
    try:
        # Clear existing data (optional)
        print("Seeding database with sample data...")
        
        # Seed glucose readings
        print("Adding glucose readings...")
        base_time = datetime.utcnow() - timedelta(hours=12)
        
        for i in range(20):
            time_offset = timedelta(minutes=30 * i)
            # Generate realistic glucose pattern
            base_value = 100 + random.gauss(0, 20)
            value = max(70, min(180, base_value))
            
            reading = GlucoseReading(
                value=round(value, 1),
                timestamp=base_time + time_offset,
                source="cgm" if i % 2 == 0 else "manual"
            )
            db.add(reading)
        
        # Seed patient risk profiles
        print("Adding patient profiles...")
        patients = [
            {"user_id": 1, "name": "Sarah Johnson", "age": 34, "risk_level": "low", "avg_glucose": 112.0, "trend": "stable"},
            {"user_id": 2, "name": "Michael Chen", "age": 52, "risk_level": "high", "avg_glucose": 178.0, "trend": "rising"},
            {"user_id": 3, "name": "Emma Davis", "age": 28, "risk_level": "medium", "avg_glucose": 145.0, "trend": "falling"},
            {"user_id": 4, "name": "James Wilson", "age": 45, "risk_level": "low", "avg_glucose": 105.0, "trend": "stable"},
        ]
        
        for patient_data in patients:
            # Check if already exists
            existing = db.query(PatientRiskProfile).filter(
                PatientRiskProfile.user_id == patient_data["user_id"]
            ).first()
            
            if not existing:
                profile = PatientRiskProfile(
                    **patient_data,
                    time_in_range=random.uniform(70, 95),
                    last_reading_time=datetime.utcnow() - timedelta(minutes=random.randint(5, 45))
                )
                db.add(profile)
        
        # Seed coaching nudges
        print("Adding coaching nudges...")
        nudges = [
            {"title": "Post-Meal Walk", "message": "A 15-minute walk after meals can lower glucose by 10-20 mg/dL", "category": "exercise", "priority": "medium"},
            {"title":"Hydration Reminder", "message": "Staying hydrated helps maintain stable glucose levels", "category": "general", "priority": "low"},
            {"title": "Carb Timing Tip", "message": "Try having your largest carb portion at lunch for better glucose control", "category": "diet", "priority": "high"},
        ]
        
        for nudge_data in nudges:
            nudge = CoachingNudge(**nudge_data)
            db.add(nudge)
        
        db.commit()
        print("✓ Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    # Initialize database first
    init_db()
    # Then seed it
    seed_database()
