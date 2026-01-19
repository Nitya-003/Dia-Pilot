import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const mockPatients: any[] = []; // Will be populated when integrated with API

export default function TriagePortal() {
  const getRiskVariant = (risk: string) => {
    if (risk === 'high') return 'danger';
    if (risk === 'medium') return 'warning';
    return 'success';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <TrendingUp size={14} className="text-red-600" />;
    if (trend === 'falling') return <TrendingDown size={14} className="text-blue-600" />;
    return <Minus size={14} className="text-gray-600" />;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Patient Triage Portal</h2>
        <p className="text-sm text-gray-500">Real-time monitoring dashboard</p>
      </div>

      {mockPatients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No patient data available</p>
          <p className="text-sm text-gray-400">Connect to API to view patient triage</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Risk Level
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Avg Glucose
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Trend
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Last Reading
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">Age {patient.age}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getRiskVariant(patient.risk)} size="sm">
                        {patient.risk.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {patient.avgGlucose} mg/dL
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(patient.trend)}
                        <span className="text-xs text-gray-600 capitalize">{patient.trend}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{patient.lastReading}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {mockPatients.length} patients •{' '}
              <span className="text-red-600 font-medium">
                {mockPatients.filter((p) => p.risk === 'high').length} high priority
              </span>
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Export Report →
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
