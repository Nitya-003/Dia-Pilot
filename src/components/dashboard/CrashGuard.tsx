import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { getCrashGuard } from '../../lib/api';

export default function CrashGuard() {
  const [alert, setAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const data = await getCrashGuard();
        setAlert(data);
      } catch (error) {
        console.error('Failed to fetch crash guard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
    const interval = setInterval(fetchAlert, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  const isRisk = alert?.risk_level === 'high' || alert?.risk_level === 'medium';

  return (
    <Card className={`p-6 ${isRisk ? 'border-2 border-amber-400' : ''}`} hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRisk ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
          {isRisk ? (
            <AlertTriangle size={20} className="text-amber-600" />
          ) : (
            <Shield size={20} className="text-emerald-600" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Crash Guard</h3>
          <p className="text-sm text-gray-500">Hypoglycemia prevention</p>
        </div>
      </div>

      <div className="mb-4">
        <Badge
          variant={isRisk ? 'warning' : 'stable'}
          size="lg"
        >
          {alert?.risk_level === 'low' ? 'Low Risk' :
            alert?.risk_level === 'medium' ? 'Medium Risk' : 'High Risk'}
        </Badge>
        {alert?.estimated_time && (
          <p className="text-sm text-amber-700 font-medium mt-2 mb-2">
            ⚠️ Potential low in {alert.estimated_time}
          </p>
        )}
        <p className="text-xs text-gray-600 mt-2">
          Current: {alert?.current_glucose} mg/dL | Predicted: {alert?.predicted_glucose} mg/dL
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-700 mb-2">Recommendations:</p>
        {alert?.recommendations?.map((rec: string, idx: number) => (
          <div key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="text-gray-400">•</span>
            <span>{rec}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
