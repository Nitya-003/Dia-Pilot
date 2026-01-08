import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LineChart from '../charts/LineChart';
import { TrendingUp } from 'lucide-react';
import { predictedGlucoseData } from '../../data/mockData';

export default function GlucoseOutlook() {
  const currentGlucose = 98;
  const status: 'stable' | 'warning' | 'danger' = 'stable';

  return (
    <Card className="p-6" hover>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Today's Glucose Outlook</h2>
          <p className="text-sm text-gray-500">Next 3 hours prediction</p>
        </div>
        <Badge variant={status} size="lg">
          <TrendingUp size={14} className="mr-1" />
          Stable
        </Badge>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-5xl font-semibold text-gray-900">{currentGlucose}</span>
          <span className="text-xl text-gray-500">mg/dL</span>
        </div>
        <p className="text-sm text-gray-600">
          Current reading • <span className="text-emerald-600">Within target range</span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <LineChart data={predictedGlucoseData} height={180} showPrediction />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Today</p>
          <p className="text-lg font-semibold text-gray-900">105</p>
        </div>
        <div className="text-center border-x border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Time in Range</p>
          <p className="text-lg font-semibold text-emerald-600">89%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Variability</p>
          <p className="text-lg font-semibold text-gray-900">Low</p>
        </div>
      </div>
    </Card>
  );
}
