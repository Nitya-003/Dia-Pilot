import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LineChart from '../charts/LineChart';
import { FileText, Download } from 'lucide-react';
import Button from '../ui/Button';
import { glucoseData } from '../../data/mockData';

export default function ExecutiveSummary() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Weekly Executive Summary
          </h2>
          <p className="text-sm text-gray-500">Patient: Sarah Johnson • Jan 1-7, 2026</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={16} className="mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-emerald-700 font-medium mb-1">Time in Range</p>
          <p className="text-3xl font-bold text-emerald-900">87%</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 5% from last week</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs text-blue-700 font-medium mb-1">Avg Glucose</p>
          <p className="text-3xl font-bold text-blue-900">112</p>
          <p className="text-xs text-blue-600 mt-1">mg/dL • Target: 70-140</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs text-amber-700 font-medium mb-1">Hypoglycemic Events</p>
          <p className="text-3xl font-bold text-amber-900">2</p>
          <p className="text-xs text-amber-600 mt-1">↓ 1 from last week</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Glucose Trend</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <LineChart data={glucoseData} height={150} />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Highlights</h3>
        <div className="space-y-2">
          <div className="flex items-start space-x-3 bg-amber-50 rounded-lg p-3">
            <Badge variant="warning" size="sm">
              ⚠️
            </Badge>
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                Two hypoglycemic events detected on Jan 3 and Jan 5
              </p>
              <p className="text-xs text-gray-600 mt-1">Occurred around 3pm both days</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-emerald-50 rounded-lg p-3">
            <Badge variant="success" size="sm">
              ✓
            </Badge>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Excellent overnight glucose control</p>
              <p className="text-xs text-gray-600 mt-1">
                95% time in range during sleeping hours
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-l-blue-500">
        <div className="flex items-start space-x-3">
          <FileText size={20} className="text-blue-700 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Clinical Recommendations</p>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Consider adjusting afternoon snack timing to prevent 3pm lows</li>
              <li>• Continue current overnight basal insulin regimen</li>
              <li>• Schedule follow-up in 2 weeks to reassess afternoon patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
