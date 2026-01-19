import Card from '../ui/Card';
import CircularProgress from '../charts/CircularProgress';
import { TrendingUp, Activity, Heart, Coffee } from 'lucide-react';

export default function HealthMetrics() {
    return (
        <Card className="p-6" hover>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Health Goals</h3>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center animate-scaleIn">
                    <CircularProgress
                        value={87}
                        max={100}
                        size={100}
                        strokeWidth={8}
                        color="rgb(34, 197, 94)"
                        label="Time in Range"
                    />
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">Target: 70%</p>
                        <p className="text-sm font-semibold text-emerald-600 flex items-center justify-center mt-1">
                            <TrendingUp size={14} className="mr-1" />
                            +5% this week
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center animate-scaleIn" style={{ animationDelay: '100ms' }}>
                    <CircularProgress
                        value={4}
                        max={7}
                        size={100}
                        strokeWidth={8}
                        color="rgb(59, 130, 246)"
                        label="Active Days"
                    />
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">Goal: 5 days/week</p>
                        <p className="text-sm font-semibold text-blue-600 flex items-center justify-center mt-1">
                            <Activity size={14} className="mr-1" />
                            Almost there!
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center animate-scaleIn" style={{ animationDelay: '200ms' }}>
                    <CircularProgress
                        value={6.8}
                        max={10}
                        size={100}
                        strokeWidth={8}
                        color="rgb(168, 85, 247)"
                        label="HbA1c"
                    />
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">Target: &lt;7.0%</p>
                        <p className="text-sm font-semibold text-purple-600 flex items-center justify-center mt-1">
                            <Heart size={14} className="mr-1" />
                            Great control
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center animate-scaleIn" style={{ animationDelay: '300ms' }}>
                    <CircularProgress
                        value={3}
                        max={3}
                        size={100}
                        strokeWidth={8}
                        color="rgb(245, 158, 11)"
                        label="Daily Meals"
                    />
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">Goal: 3 logged/day</p>
                        <p className="text-sm font-semibold text-amber-600 flex items-center justify-center mt-1">
                            <Coffee size={14} className="mr-1" />
                            Perfect!
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-1">🏆 7-Day Streak!</p>
                <p className="text-xs text-gray-700">
                    You're on fire! Keep logging for 3 more days to earn the "Consistency Champion" badge.
                </p>
            </div>
        </Card>
    );
}
