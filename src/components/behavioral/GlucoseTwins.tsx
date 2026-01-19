import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Users } from 'lucide-react';

const glucoseTwins: any[] = []; // Will be populated when integrated with API

export default function GlucoseTwins() {
  return (
    <Card className="p-6" hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Users size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Glucose Twins</h3>
          <p className="text-sm text-gray-500">Learn from similar profiles</p>
        </div>
      </div>

      {glucoseTwins.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Connect to API to view glucose twins</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {glucoseTwins.map((twin) => (
            <div
              key={twin.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{twin.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{twin.name}</p>
                    <p className="text-xs text-gray-500">Age {twin.age}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  {twin.matchScore}% match
                </Badge>
              </div>

              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Successful Strategy:</p>
                <p className="text-sm text-gray-800 font-medium">{twin.strategy}</p>
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-2">
                View Full Strategy
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-xs text-blue-900 font-medium mb-1">Community Insight</p>
        <p className="text-sm text-blue-800">
          People with similar patterns found success with pre-meal walks and protein-rich breakfasts.
        </p>
      </div>
    </Card>
  );
}
