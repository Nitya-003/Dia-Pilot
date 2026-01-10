import re
import json
from typing import Tuple, Optional


class VoiceProcessor:
    """
    Service for processing voice commands and extracting structured data.
    Uses NLP patterns (average accuracy implementation).
    """
    
    def __init__(self):
        # Intent patterns
        self.patterns = {
            "meal": [
                r"ate|eating|had|meal|breakfast|lunch|dinner|snack|food",
                r"carbs|carbohydrates|pizza|rice|bread|pasta"
            ],
            "exercise": [
                r"exercise|workout|walk|run|gym|jog|bike|cycling",
                r"minutes|hours|mile|kilometer"
            ],
            "medication": [
                r"insulin|medication|medicine|dose|units|pill|took",
                r"metformin|glipizide"
            ],
            "glucose": [
                r"glucose|sugar|blood sugar|reading|level|bg",
                r"\d+\s*(mg/dl|mg|mmol)"
            ],
            "note": [
                r"note|remember|feeling|tired|dizzy|headache"
            ]
        }
    
    def process_command(self, transcript: str) -> Tuple[str, Optional[dict], str]:
        """
        Process voice transcript and extract intent and data.
        
        Args:
            transcript: Voice command transcript
            
        Returns:
            Tuple of (intent, extracted_data, message)
        """
        transcript_lower = transcript.lower()
        
        # Detect intent
        intent = self._detect_intent(transcript_lower)
        
        # Extract data based on intent
        extracted_data = {}
        
        if intent == "meal":
            carbs = self._extract_carbs(transcript_lower)
            meal_type = self._extract_meal_type(transcript_lower)
            extracted_data = {
                "type": "meal",
                "carbs": carbs,
                "meal_type": meal_type,
                "description": transcript
            }
            message = f"Logged {meal_type or 'meal'}" + (f" with ~{carbs}g carbs" if carbs else "")
        
        elif intent == "exercise":
            duration = self._extract_duration(transcript_lower)
            activity = self._extract_activity(transcript_lower)
            extracted_data = {
                "type": "exercise",
                "activity": activity,
                "duration": duration
            }
            message = f"Logged {activity or 'exercise'}" + (f" for {duration} minutes" if duration else "")
        
        elif intent == "medication":
            dose = self._extract_number(transcript_lower, ["units", "unit", "u"])
            med_name = self._extract_medication(transcript_lower)
            extracted_data = {
                "type": "medication",
                "name": med_name,
                "dose": dose
            }
            message = f"Logged {med_name or 'medication'}" + (f" {dose} units" if dose else "")
        
        elif intent == "glucose":
            value = self._extract_number(transcript_lower, ["mg/dl", "mg", "glucose"])
            extracted_data = {
                "type": "glucose",
                "value": value
            }
            message = f"Logged glucose reading: {value} mg/dL" if value else "Logged glucose note"
        
        else:
            extracted_data = {
                "type": "note",
                "text": transcript
            }
            message = "Note logged successfully"
        
        return intent, extracted_data, message
    
    def _detect_intent(self, text: str) -> str:
        """Detect the primary intent from transcript."""
        scores = {}
        
        for intent, pattern_list in self.patterns.items():
            score = 0
            for pattern in pattern_list:
                if re.search(pattern, text):
                    score += 1
            scores[intent] = score
        
        # Return intent with highest score, or 'note' as default
        max_intent = max(scores.items(), key=lambda x: x[1])
        return max_intent[0] if max_intent[1] > 0 else "note"
    
    def _extract_carbs(self, text: str) -> Optional[float]:
        """Extract carb amount from text."""
        match = re.search(r'(\d+)\s*(?:g|grams?|carbs?|carbohydrates?)', text)
        return float(match.group(1)) if match else None
    
    def _extract_duration(self, text: str) -> Optional[int]:
        """Extract duration in minutes."""
        match = re.search(r'(\d+)\s*(?:min|minute|minutes)', text)
        if match:
            return int(match.group(1))
        match = re.search(r'(\d+)\s*(?:hour|hours|hr|hrs)', text)
        return int(match.group(1)) * 60 if match else None
    
    def _extract_number(self, text: str, keywords: list) -> Optional[float]:
        """Extract number near specific keywords."""
        for keyword in keywords:
            pattern = rf'(\d+(?:\.\d+)?)\s*{keyword}'
            match = re.search(pattern, text)
            if match:
                return float(match.group(1))
        # Try to find any number
        match = re.search(r'\d+(?:\.\d+)?', text)
        return float(match.group(0)) if match else None
    
    def _extract_meal_type(self, text: str) -> Optional[str]:
        """Extract meal type."""
        meal_types = ["breakfast", "lunch", "dinner", "snack"]
        for meal in meal_types:
            if meal in text:
                return meal
        return None
    
    def _extract_activity(self, text: str) -> Optional[str]:
        """Extract exercise activity."""
        activities = ["walk", "run", "jog", "bike", "cycling", "swim", "gym", "workout"]
        for activity in activities:
            if activity in text:
                return activity
        return None
    
    def _extract_medication(self, text: str) -> Optional[str]:
        """Extract medication name."""
        medications = ["insulin", "metformin", "glipizide", "lantus", "humalog", "novolog"]
        for med in medications:
            if med in text:
                return med
        return "medication"


# Singleton instance
voice_processor = VoiceProcessor()
