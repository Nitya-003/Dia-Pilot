import random
from datetime import datetime, timedelta
from typing import List, Tuple


class GlucosePredictor:
    """
    Service for predicting glucose values.
    Uses simple time-series forecasting (average accuracy implementation).
    """
    
    def predict_next_hours(self, current_value: float, hours: int = 3) -> List[dict]:
        """
        Predict glucose values for the next N hours.
        
        Args:
            current_value: Current glucose value in mg/dL
            hours: Number of hours to predict
            
        Returns:
            List of predictions with time and value
        """
        predictions = [{"time": "Now", "value": current_value, "predicted": False}]
        
        # Simple prediction: gradual return to baseline (100 mg/dL)
        baseline = 100
        intervals = hours * 2  # Every 30 minutes
        
        for i in range(1, intervals + 1):
            # Calculate time offset
            time_offset = i * 30  # minutes
            time_label = f"+{time_offset}m" if time_offset < 60 else f"+{time_offset // 60}h"
            
            # Predict value (gradual approach to baseline with some noise)
            progress = i / intervals
            predicted_value = current_value + (baseline - current_value) * progress
            
            # Add realistic noise
            noise = random.uniform(-5, 5)
            predicted_value += noise
            
            predictions.append({
                "time": time_label,
                "value": round(predicted_value, 1),
                "predicted": True
            })
        
        return predictions
    
    def simulate_scenario(self, current_value: float, scenario: str,
                         meal_carbs: float = None,
                         exercise_duration: int = None) -> List[dict]:
        """
        Simulate glucose response to different scenarios.
        
        Args:
            current_value: Current glucose value
            scenario: One of 'baseline', 'meal', 'exercise'
            meal_carbs: Carbs in meal (for meal scenario)
            exercise_duration: Exercise duration in minutes
            
        Returns:
            List of simulated glucose values
        """
        results = [{"time": "Now", "value": current_value}]
        
        if scenario == "baseline":
            # Stable baseline
            for i, time in enumerate(["+30m", "+1h", "+1.5h", "+2h"]):
                value = current_value + random.uniform(-3, 3)
                results.append({"time": time, "value": round(value, 1)})
        
        elif scenario == "meal":
            # Glucose spike after meal
            carbs = meal_carbs or 50
            spike_factor = carbs / 10  # Simple carb ratio
            
            times = ["+30m", "+1h", "+1.5h", "+2h"]
            # Peak at 1 hour, then decline
            multipliers = [0.6, 1.0, 0.7, 0.4]
            
            for time, mult in zip(times, multipliers):
                value = current_value + (spike_factor * mult * 10)
                results.append({"time": time, "value": round(value, 1)})
        
        elif scenario == "exercise":
            # Glucose drop during exercise
            duration = exercise_duration or 30
            drop_factor = duration / 10
            
            times = ["+30m", "+1h", "+1.5h", "+2h"]
            # Drop during exercise, recovery after
            multipliers = [1.0, 0.5, 0.7, 0.9]
            
            for time, mult in zip(times, multipliers):
                drop = drop_factor * 5 * (1 - mult)
                value = current_value - drop
                results.append({"time": time, "value": round(max(value, 60), 1)})
        
        return results
    
    def check_hypo_risk(self, current_value: float,
                       recent_values: List[float]) -> Tuple[str, str, float]:
        """
        Check risk of hypoglycemia.
        
        Args:
            current_value: Current glucose reading
            recent_values: List of recent glucose values
            
        Returns:
            Tuple of (risk_level, estimated_time, predicted_value)
        """
        # High risk if current < 70 or rapid decline
        if current_value < 70:
            return "high", "Now", current_value
        
        # Check trend
        if len(recent_values) >= 2:
            trend = recent_values[-1] - recent_values[-2]
            
            if trend < -10:  # Rapid decline
                predicted = current_value + (trend * 2)  # Predict 20 min ahead
                if predicted < 70:
                    return "high", "~20 min", predicted
                return "medium", "~30-45 min", predicted
        
        if current_value < 80:
            return "medium", "~45-60 min", current_value - 10
        
        return "low", None, current_value


# Singleton instance
glucose_predictor = GlucosePredictor()
