import random
from typing import List, Tuple
from datetime import datetime, timedelta


class BehavioralCoach:
    """
    Service for generating contextual coaching nudges.
    Uses pattern analysis (average accuracy implementation).
    """
    
    def __init__(self):
        self.templates = {
            "diet": [
                ("Carb Timing Tip", "Try having your largest carb portion at lunch for better glucose control"),
                ("Fiber Power", "Adding fiber-rich vegetables can help slow glucose absorption"),
                ("Protein Balance", "Pairing carbs with protein helps prevent glucose spikes"),
            ],
            "exercise": [
                ("Post-Meal Walk", "A 15-minute walk after meals can lower glucose by 10-20 mg/dL"),
                ("Morning Movement", "Morning exercise may improve insulin sensitivity throughout the day"),
                ("Consistency Wins", "Regular activity at the same time helps stabilize glucose patterns"),
            ],
            "medication": [
                ("Timing Matters", "Taking medication at consistent times improves effectiveness"),
                ("Check Your Supplies", "Remember to check insulin expiration dates monthly"),
            ],
            "general": [
                ("Hydration", "Staying hydrated helps maintain stable glucose levels"),
                ("Sleep Quality", "Poor sleep can raise glucose levels - aim for 7-8 hours"),
                ("Stress Management", "Stress hormones can raise glucose - try deep breathing exercises"),
            ]
        }
    
    def generate_nudges(self, user_glucose_data: List[float] = None) -> List[dict]:
        """
        Generate personalized coaching nudges.
        
        Args:
            user_glucose_data: Recent glucose readings
            
        Returns:
            List of coaching nudges
        """
        nudges = []
        
        # Analyze pattern if data provided
        if user_glucose_data and len(user_glucose_data) > 0:
            avg = sum(user_glucose_data) / len(user_glucose_data)
            
            if avg > 140:
                nudges.append({
                    "id": random.randint(1000, 9999),
                    "title": "High Glucose Pattern",
                    "message": "Your average glucose has been elevated. Consider reviewing carb intake with your care team.",
                    "category": "diet",
                    "priority": "high",
                    "is_read": False,
                    "created_at": datetime.utcnow()
                })
            elif avg < 80:
                nudges.append({
                    "id": random.randint(1000, 9999),
                    "title": "Low Glucose Alert",
                    "message": "You've had several low readings. Keep fast-acting carbs handy and discuss with your doctor.",
                    "category": "general",
                    "priority": "high",
                    "is_read": False,
                    "created_at": datetime.utcnow()
                })
        
        # Add 2-3 general tips
        categories = random.sample(list(self.templates.keys()), 2)
        
        for category in categories:
            title, message = random.choice(self.templates[category])
            nudges.append({
                "id": random.randint(1000, 9999),
                "title": title,
                "message": message,
                "category": category,
                "priority": "medium",
                "is_read": False,
                "created_at": datetime.utcnow()
            })
        
        return nudges[:3]  # Return top 3
    
    def find_glucose_twins(self, user_profile: dict) -> List[dict]:
        """
        Find metabolically similar users (glucose twins).
        
        Args:
            user_profile: User's profile data
            
        Returns:
            List of matched users with strategies
        """
        # Mock glucose twins data
        twins = [
            {
                "id": 1,
                "name": "Alex M.",
                "age": user_profile.get("age", 30) + random.randint(-3, 3),
                "match_score": random.randint(88, 96),
                "avatar": "AM",
                "strategy": "Morning walks before breakfast"
            },
            {
                "id": 2,
                "name": "Jordan P.",
                "age": user_profile.get("age", 30) + random.randint(-5, 5),
                "match_score": random.randint(82, 91),
                "avatar": "JP",
                "strategy": "Low-carb lunch routine"
            },
            {
                "id": 3,
                "name": "Taylor R.",
                "age": user_profile.get("age", 30) + random.randint(-4, 4),
                "match_score": random.randint(80, 89),
                "avatar": "TR",
                "strategy": "Evening exercise + protein snacks"
            },
            {
                "id": 4,
                "name": "Morgan K.",
                "age": user_profile.get("age", 30) + random.randint(-2, 6),
                "match_score": random.randint(75, 87),
                "avatar": "MK",
                "strategy": "Intermittent fasting 16:8"
            }
        ]
        
        # Sort by match score and return top 3
        twins.sort(key=lambda x: x["match_score"], reverse=True)
        return twins[:3]


# Singleton instance
behavioral_coach = BehavioralCoach()
