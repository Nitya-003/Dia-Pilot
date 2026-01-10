"""
AI Health Diagnosis Service
Analyzes comprehensive health data and provides diagnosis, predictions, and recommendations.
"""
import json
from typing import List, Dict, Tuple


class HealthAnalyzer:
    """
    AI-powered health analyzer for diabetes management.
    Uses rule-based system with clinical thresholds (average accuracy).
    """
    
    def __init__(self):
        # Clinical thresholds
        self.thresholds = {
            "hba1c": {"good": 6.5, "fair": 7.0, "poor": 8.0, "critical": 9.0},
            "bp_systolic": {"good": 130, "fair": 140, "poor": 160},
            "bp_diastolic": {"good": 80, "fair": 90, "poor": 100},
            "cholesterol_ldl": {"good": 100, "fair": 130, "poor": 160},
            "cholesterol_hdl": {"good_min": 40, "optimal_min": 60},
            "triglycerides": {"good": 150, "fair": 200, "poor": 500},
            "bmi": {"underweight": 18.5, "normal": 25, "overweight": 30, "obese": 35}
        }
    
    def analyze_health_profile(self, profile: Dict) -> Dict:
        """
        Comprehensive health analysis producing diagnosis and recommendations.
        
        Args:
            profile: Dictionary with health metrics
            
        Returns:
            Complete diagnosis with score, risks, predictions, and recommendations
        """
        concerns = []
        positive_factors = []
        recommendations = []
        risk_factors = 0
        positive_points = 0
        
        # Analyze BMI
        if profile.get("weight_kg") and profile.get("height_cm"):
            bmi = self._calculate_bmi(profile["weight_kg"], profile["height_cm"])
            bmi_assessment = self._assess_bmi(bmi, concerns, positive_factors, recommendations)
            risk_factors += bmi_assessment["risk"]
            positive_points += bmi_assessment["positive"]
        
        # Analyze HbA1c (critical for diabetes)
        if profile.get("hba1c"):
            hba1c_assessment = self._assess_hba1c(profile["hba1c"], concerns, positive_factors, recommendations)
            risk_factors += hba1c_assessment["risk"]
            positive_points += hba1c_assessment["positive"]
        
        # Analyze blood pressure
        if profile.get("blood_pressure_systolic") and profile.get("blood_pressure_diastolic"):
            bp_assessment = self._assess_blood_pressure(
                profile["blood_pressure_systolic"],
                profile["blood_pressure_diastolic"],
                concerns, positive_factors, recommendations
            )
            risk_factors += bp_assessment["risk"]
            positive_points += bp_assessment["positive"]
        
        # Analyze cholesterol
        if profile.get("cholesterol_ldl") or profile.get("cholesterol_hdl") or profile.get("triglycerides"):
            lipid_assessment = self._assess_lipids(profile, concerns, positive_factors, recommendations)
            risk_factors += lipid_assessment["risk"]
            positive_points += lipid_assessment["positive"]
        
        # Analyze lifestyle
        lifestyle_assessment = self._assess_lifestyle(profile, concerns, positive_factors, recommendations)
        risk_factors += lifestyle_assessment["risk"]
        positive_points += lifestyle_assessment["positive"]
        
        # Calculate overall health score (0-100)
        base_score = 50
        score = base_score + (positive_points * 5) - (risk_factors * 8)
        score = max(0, min(100, score))
        
        # Determine risk level
        risk_level = self._determine_risk_level(score, risk_factors)
        
        # Generate predictions
        predictions = self._generate_predictions(profile, risk_factors, concerns)
        
        # Prioritize recommendations
        prioritized_recs = self._prioritize_recommendations(recommendations, risk_level)
        
        # Generate action items
        action_items = self._generate_action_items(concerns, risk_level)
        
        return {
            "overall_health_score": round(score, 1),
            "risk_level": risk_level,
            "key_concerns": concerns,
            "positive_factors": positive_factors,
            "predicted_complications": predictions,
            "recommendations": prioritized_recs,
            "action_items": action_items
        }
    
    def _calculate_bmi(self, weight_kg: float, height_cm: float) -> float:
        """Calculate BMI."""
        height_m = height_cm / 100
        return weight_kg / (height_m ** 2)
    
    def _assess_bmi(self, bmi: float, concerns: List, positives: List, recs: List) -> Dict:
        """Assess BMI and add findings."""
        risk = 0
        positive = 0
        
        if bmi < self.thresholds["bmi"]["underweight"]:
            concerns.append(f"Underweight (BMI: {bmi:.1f}) - May affect glucose control")
            recs.append({"priority": "high", "category": "nutrition", "message": "Consult nutritionist for healthy weight gain plan"})
            risk += 1
        elif bmi < self.thresholds["bmi"]["normal"]:
            positives.append(f"Healthy weight range (BMI: {bmi:.1f})")
            positive += 1
        elif bmi < self.thresholds["bmi"]["overweight"]:
            concerns.append(f"Overweight (BMI: {bmi:.1f}) - Increases insulin resistance")
            recs.append({"priority": "high", "category": "weight", "message": "Aim for 5-10% weight loss through diet and exercise"})
            risk += 1
        else:
            concerns.append(f"Obesity (BMI: {bmi:.1f}) - Significantly impacts diabetes control")
            recs.append({"priority": "critical", "category": "weight", "message": "Urgent: Work with healthcare team on structured weight loss program"})
            risk += 2
        
        return {"risk": risk, "positive": positive}
    
    def _assess_hba1c(self, hba1c: float, concerns: List, positives: List, recs: List) -> Dict:
        """Assess HbA1c levels."""
        risk = 0
        positive = 0
        
        if hba1c < self.thresholds["hba1c"]["good"]:
            positives.append(f"Excellent glucose control (HbA1c: {hba1c}%)")
            positive += 2
        elif hba1c < self.thresholds["hba1c"]["fair"]:
            positives.append(f"Good glucose control (HbA1c: {hba1c}%)")
            recs.append({"priority": "medium", "category": "glucose", "message": "Maintain current management plan"})
            positive += 1
        elif hba1c < self.thresholds["hba1c"]["poor"]:
            concerns.append(f"Suboptimal glucose control (HbA1c: {hba1c}%)")
            recs.append({"priority": "high", "category": "glucose", "message": "Review medication plan with doctor - target HbA1c <7%"})
            risk += 2
        elif hba1c < self.thresholds["hba1c"]["critical"]:
            concerns.append(f"Poor glucose control (HbA1c: {hba1c}%)")
            recs.append({"priority": "critical", "category": "glucose", "message": "Schedule urgent appointment - high complication risk"})
            risk += 3
        else:
            concerns.append(f"Critical glucose control (HbA1c: {hba1c}%)")
            recs.append({"priority": "critical", "category": "glucose", "message": "URGENT: Contact healthcare provider immediately"})
            risk += 4
        
        return {"risk": risk, "positive": positive}
    
    def _assess_blood_pressure(self, systolic: int, diastolic: int, concerns: List, positives: List, recs: List) -> Dict:
        """Assess blood pressure."""
        risk = 0
        positive = 0
        
        if systolic < self.thresholds["bp_systolic"]["good"] and diastolic < self.thresholds["bp_diastolic"]["good"]:
            positives.append(f"Healthy blood pressure ({systolic}/{diastolic})")
            positive += 1
        elif systolic < self.thresholds["bp_systolic"]["fair"] and diastolic < self.thresholds["bp_diastolic"]["fair"]:
            concerns.append(f"Elevated blood pressure ({systolic}/{diastolic})")
            recs.append({"priority": "medium", "category": "cardiovascular", "message": "Monitor BP regularly, reduce sodium intake"})
            risk += 1
        else:
            concerns.append(f"High blood pressure ({systolic}/{diastolic})")
            recs.append({"priority": "high", "category": "cardiovascular", "message": "Consult doctor about BP medication adjustment"})
            risk += 2
        
        return {"risk": risk, "positive": positive}
    
    def _assess_lipids(self, profile: Dict, concerns: List, positives: List, recs: List) -> Dict:
        """Assess cholesterol and triglycerides."""
        risk = 0
        positive = 0
        
        ldl = profile.get("cholesterol_ldl")
        hdl = profile.get("cholesterol_hdl")
        trig = profile.get("triglycerides")
        
        if ldl and ldl > self.thresholds["cholesterol_ldl"]["poor"]:
            concerns.append(f"High LDL cholesterol ({ldl} mg/dL)")
            recs.append({"priority": "high", "category": "cardiovascular", "message": "Discuss statin therapy with doctor"})
            risk += 2
        elif ldl and ldl > self.thresholds["cholesterol_ldl"]["fair"]:
            concerns.append(f"Borderline high LDL ({ldl} mg/dL)")
            recs.append({"priority": "medium", "category": "diet", "message": "Reduce saturated fat intake"})
            risk += 1
        
        if hdl and hdl < self.thresholds["cholesterol_hdl"]["good_min"]:
            concerns.append(f"Low HDL cholesterol ({hdl} mg/dL)")
            recs.append({"priority": "medium", "category": "exercise", "message": "Increase aerobic exercise to raise HDL"})
            risk += 1
        elif hdl and hdl >= self.thresholds["cholesterol_hdl"]["optimal_min"]:
            positives.append(f"Good HDL cholesterol ({hdl} mg/dL)")
            positive += 1
        
        if trig and trig > self.thresholds["triglycerides"]["poor"]:
            concerns.append(f"Very high triglycerides ({trig} mg/dL)")
            recs.append({"priority": "critical", "category": "cardiovascular", "message": "Urgent care needed - pancreatitis risk"})
            risk += 3
        elif trig and trig > self.thresholds["triglycerides"]["fair"]:
            concerns.append(f"High triglycerides ({trig} mg/dL)")
            recs.append({"priority": "high", "category": "diet", "message": "Limit sugar and refined carbs"})
            risk += 2
        
        return {"risk": risk, "positive": positive}
    
    def _assess_lifestyle(self, profile: Dict, concerns: List, positives: List, recs: List) -> Dict:
        """Assess lifestyle factors."""
        risk = 0
        positive = 0
        
        # Exercise
        exercise = profile.get("exercise_hours_per_week", 0)
        if exercise >= 2.5:
            positives.append(f"Meeting exercise guidelines ({exercise}h/week)")
            positive += 1
        else:
            concerns.append(f"Insufficient physical activity ({exercise}h/week)")
            recs.append({"priority": "high", "category": "exercise", "message": "Target 150 minutes/week moderate exercise"})
            risk += 1
        
        # Sleep
        sleep = profile.get("sleep_hours_per_night", 0)
        if sleep < 6:
            concerns.append(f"Insufficient sleep ({sleep}h/night)")
            recs.append({"priority": "medium", "category": "lifestyle", "message": "Aim for 7-8 hours sleep - affects glucose control"})
            risk += 1
        elif sleep >= 7 and sleep <= 9:
            positives.append(f"Healthy sleep duration ({sleep}h/night)")
            positive += 1
        
        # Smoking
        smoking = profile.get("smoking_status", "never")
        if smoking == "current":
            concerns.append("Current smoker - major complication risk")
            recs.append({"priority": "critical", "category": "lifestyle", "message": "Smoking cessation program - doubles complication risk"})
            risk += 3
        elif smoking == "never":
            positives.append("Non-smoker")
            positive += 1
        
        # Stress
        stress = profile.get("stress_level", "low")
        if stress == "high":
            concerns.append("High stress levels affect glucose control")
            recs.append({"priority": "medium", "category": "mental_health", "message": "Practice stress management techniques"})
            risk += 1
        
        return {"risk": risk, "positive": positive}
    
    def _determine_risk_level(self, score: float, risk_factors: int) -> str:
        """Determine overall risk level."""
        if score >= 80 and risk_factors <= 2:
            return "low"
        elif score >= 60 and risk_factors <= 4:
            return "moderate"
        elif score >= 40:
            return "high"
        else:
            return "critical"
    
    def _generate_predictions(self, profile: Dict, risk_factors: int, concerns: List) -> List[str]:
        """Generate complication predictions."""
        predictions = []
        time_horizon = "next 6-12 months"
        
        if risk_factors >= 6:
            predictions.append(f"High risk of cardiovascular events within {time_horizon}")
            predictions.append(f"Increased risk of diabetes complications (retinopathy, neuropathy)")
        elif risk_factors >= 4:
            predictions.append(f"Moderate risk of disease progression without intervention")
            predictions.append(f"May develop additional complications if control doesn't improve")
        elif risk_factors >= 2:
            predictions.append(f"Some risk areas need attention to prevent progression")
        else:
            predictions.append(f"Low complication risk with current management")
            predictions.append(f"Good long-term prognosis with continued adherence")
        
        return predictions
    
    def _prioritize_recommendations(self, recs: List[Dict], risk_level: str) -> List[Dict]:
        """Sort recommendations by priority."""
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        return sorted(recs, key=lambda x: priority_order.get(x["priority"], 999))[:10]  # Top 10
    
    def _generate_action_items(self, concerns: List, risk_level: str) -> List[str]:
        """Generate immediate action items."""
        actions = []
        
        if risk_level == "critical":
            actions.append("Schedule urgent appointment with healthcare provider within 48 hours")
            actions.append("Do not delay - immediate medical evaluation needed")
        elif risk_level == "high":
            actions.append("Schedule appointment with doctor within 1-2 weeks")
            actions.append("Start implementing lifestyle changes today")
        elif risk_level == "moderate":
            actions.append("Schedule routine follow-up within 1 month")
            actions.append("Focus on areas flagged in recommendations")
        else:
            actions.append("Continue current management plan")
            actions.append("Maintain healthy habits and regular monitoring")
        
        if len(concerns) > 3:
            actions.append(f"Address {len(concerns)} identified health concerns systematically")
        
        return actions


# Singleton instance
health_analyzer = HealthAnalyzer()
