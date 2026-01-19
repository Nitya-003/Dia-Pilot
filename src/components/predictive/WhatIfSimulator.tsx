import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LineChart from '../charts/LineChart';
import { Zap } from 'lucide-react';

const simulatedScenarios = {
  baseline: [{ time: '0', value: 98 }, { time: '+1h', value: 100 }, { time: '+2h', value: 98 }],
  withMeal: [{ time: '0', value: 98 }, { time: '+1h', value: 145 }, { time: '+2h', value: 125 }],
  withExercise: [{ time: '0', value: 98 }, { time: '+30m', value: 85 }, { time: '+1h', value: 92 }]
};

export default function WhatIfSimulator() {
  const [carbs, setCarbs] = useState(45);
  const [exercise, setExercise] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  const getScenarioData = () => {
    if (carbs > 30 && exercise === 0) return simulatedScenarios.withMeal;
    if (exercise > 15) return simulatedScenarios.withExercise;
    return simulatedScenarios.baseline;
  };

  const getOutcomeText = () => {
    if (carbs > 50 && exercise === 0) {
      return 'Peak glucose: 165 mg/dL at +1 hour. Consider reducing portion or adding protein.';
    }
    if (exercise > 20) {
      return 'Glucose may drop to 82 mg/dL. Have a 10g carb snack before exercise.';
    }
    return 'Glucose remains stable within target range. No action needed.';
  };

  const scenarioData = getScenarioData();

  return (
    <Card className="p-6" hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Zap size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">What-If Simulator</h3>
          <p className="text-sm text-gray-500">See how choices affect your glucose</p>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Meal Carbs</label>
            <span className="text-sm font-semibold text-blue-600">{carbs}g</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={carbs}
            onChange={(e) => setCarbs(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${carbs}%, rgb(229 231 235) ${carbs}%, rgb(229 231 235) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0g</span>
            <span>50g</span>
            <span>100g</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Exercise Duration</label>
            <span className="text-sm font-semibold text-emerald-600">{exercise} min</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={exercise}
            onChange={(e) => setExercise(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, rgb(16 185 129) 0%, rgb(16 185 129) ${(exercise / 60) * 100}%, rgb(229 231 235) ${(exercise / 60) * 100}%, rgb(229 231 235) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0min</span>
            <span>30min</span>
            <span>60min</span>
          </div>
        </div>
      </div>

      <Button onClick={handleSimulate} className="w-full mb-6" disabled={isSimulating}>
        {isSimulating ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⏳</span>
            Simulating...
          </span>
        ) : (
          'Run Simulation'
        )}
      </Button>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <LineChart data={scenarioData} height={160} />
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-xs font-medium text-blue-900 mb-1">Simulated Outcome</p>
        <p className="text-sm text-blue-800">{getOutcomeText()}</p>
      </div>
    </Card>
  );
}
