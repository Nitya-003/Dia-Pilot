import Card from '../ui/Card';
import { Brain, TrendingUp } from 'lucide-react';

export default function ContextualCoaching() {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-white" hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Coach</h3>
          <p className="text-sm text-gray-500">Personalized insights</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">
                Great job! Your glucose has been stable for 3 hours. I noticed you had a 15-minute
                walk after lunch — this helped prevent a post-meal spike.
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <TrendingUp size={14} className="text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">+12% improvement this week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs font-medium text-blue-900 mb-2">💡 Tip for Tomorrow</p>
          <p className="text-sm text-gray-700">
            You tend to have better control when you eat lunch between 12-1pm. Try to maintain this
            timing.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-700 mb-2">Pattern Detected</p>
          <p className="text-sm text-gray-600">
            Your glucose drops slightly on Wednesdays around 3pm. Consider a small snack at 2:30pm.
          </p>
        </div>
      </div>
    </Card>
  );
}
