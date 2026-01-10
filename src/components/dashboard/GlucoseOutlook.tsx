import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import LineChart from '../charts/LineChart';
import { TrendingUp, Loader2 } from 'lucide-react';
import { getGlucoseStats, getGlucosePredictions } from '../../lib/api';

export default function GlucoseOutlook() {
  const [stats, setStats] = useState<any>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, predsData] = await Promise.all([
          getGlucoseStats(),
          getGlucosePredictions()
        ]);
        setStats(statsData);
        setPredictions(predsData);
      } catch (error) {
        console.error('Failed to fetch glucose data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  const currentGlucose = stats?.current_value || 0;
  const status: 'stable' | 'warning' | 'danger' =
    currentGlucose < 70 || currentGlucose > 180 ? 'danger' :
      currentGlucose < 80 || currentGlucose > 140 ? 'warning' : 'stable';

  return (
    <Card className="p-6" hover>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Today's Glucose Outlook</h2>
          <p className="text-sm text-gray-500">Next 3 hours prediction</p>
        </div>
        <Badge variant={status} size="lg">
          <TrendingUp size={14} className="mr-1" />
          {status === 'stable' ? 'Stable' : status === 'warning' ? 'Monitor' : 'Alert'}
        </Badge>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-5xl font-semibold text-gray-900">{currentGlucose}</span>
          <span className="text-xl text-gray-500">mg/dL</span>
        </div>
        <p className="text-sm text-gray-600">
          Current reading • <span className={status === 'stable' ? 'text-emerald-600' : 'text-amber-600'}>
            {status === 'stable' ? 'Within target range' : 'Needs attention'}
          </span>
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <LineChart data={predictions} height={180} showPrediction />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Avg Today</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.avg_glucose?.toFixed(0) || 0}</p>
        </div>
        <div className="text-center border-x border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Time in Range</p>
          <p className="text-lg font-semibold text-emerald-600">{stats?.time_in_range?.toFixed(0) || 0}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Variability</p>
          <p className="text-lg font-semibold text-gray-900">{stats?.variability || 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
}
