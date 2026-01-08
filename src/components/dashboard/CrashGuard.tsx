import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertTriangle, Activity, Thermometer, Droplets } from 'lucide-react';

export default function CrashGuard() {
  return (
    <Card className="p-6 border-l-4 border-l-amber-500" hover>
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <AlertTriangle size={20} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Crash Guard Alert</h3>
          <Badge variant="warning" size="sm">
            Monitoring
          </Badge>
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-amber-900 mb-2">Possible low in 20 minutes</p>
        <p className="text-xs text-amber-700">
          Your glucose is trending down. Consider a small snack with 15g carbs.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets size={16} className="text-blue-600" />
            <span className="text-sm text-gray-700">CGM Sensor</span>
          </div>
          <Badge variant="success" size="sm">
            Active
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity size={16} className="text-red-600" />
            <span className="text-sm text-gray-700">Heart Rate</span>
          </div>
          <span className="text-sm font-medium text-gray-900">72 bpm</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer size={16} className="text-orange-600" />
            <span className="text-sm text-gray-700">Skin Temp</span>
          </div>
          <span className="text-sm font-medium text-gray-900">97.8°F</span>
        </div>
      </div>
    </Card>
  );
}
