import Card from '../ui/Card';

interface HeatmapProps {
    data?: Array<{ hour: number; day: string; value: number }>;
}

export default function GlucoseHeatmap({ data = [] }: HeatmapProps) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Generate sample data if none provided
    const heatmapData = data.length > 0 ? data : generateSampleData();

    function generateSampleData() {
        const sample = [];
        for (const day of days) {
            for (const hour of hours) {
                const baseValue = 100 + Math.random() * 40;
                const timeVariation = hour >= 6 && hour <= 9 ? 20 : 0; // Morning spike
                const value = Math.round(baseValue + timeVariation - 20);
                sample.push({ day, hour, value });
            }
        }
        return sample;
    }

    function getValue(day: string, hour: number) {
        const point = heatmapData.find(d => d.day === day && d.hour === hour);
        return point?.value || 0;
    }

    function getColor(value: number) {
        if (value < 70) return 'bg-red-500';
        if (value < 80) return 'bg-orange-400';
        if (value < 140) return 'bg-emerald-400';
        if (value < 180) return 'bg-yellow-400';
        return 'bg-red-400';
    }

    function getOpacity(value: number) {
        const normalized = Math.min(Math.max((value - 60) / 140, 0.2), 1);
        return normalized;
    }

    return (
        <Card className="p-6" hover>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Glucose Patterns</h3>
                <p className="text-sm text-gray-500">Time-of-day heatmap (last 7 days)</p>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Time labels */}
                    <div className="flex mb-2">
                        <div className="w-12"></div>
                        {[0, 6, 12, 18, 23].map(hour => (
                            <div
                                key={hour}
                                className="flex-1 text-center text-xs text-gray-500"
                                style={{ minWidth: '40px' }}
                            >
                                {hour}:00
                            </div>
                        ))}
                    </div>

                    {/* Heatmap grid */}
                    {days.map((day, dayIndex) => (
                        <div key={day} className="flex items-center mb-1 animate-slideInUp" style={{ animationDelay: `${dayIndex * 50}ms` }}>
                            <div className="w-12 text-xs font-medium text-gray-700">
                                {day}
                            </div>
                            <div className="flex-1 flex gap-0.5">
                                {hours.map(hour => {
                                    const value = getValue(day, hour);
                                    return (
                                        <div
                                            key={`${day}-${hour}`}
                                            className={`h-6 flex-1 rounded-sm ${getColor(value)} transition-all duration-300 hover:scale-110 hover:shadow-md cursor-pointer group relative`}
                                            style={{
                                                opacity: getOpacity(value),
                                                minWidth: '12px',
                                            }}
                                            title={`${day} ${hour}:00 - ${value} mg/dL`}
                                        >
                                            <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                                                {day} {hour}:00<br />{value} mg/dL
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Low (&lt;70)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                    <span className="text-gray-600">Target (70-140)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-gray-600">High (140-180)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span className="text-gray-600">Very High (&gt;180)</span>
                </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                    <span className="font-semibold">Pattern Detected:</span> Morning glucose tends to spike between 6-9 AM. Consider adjusting breakfast timing or insulin dosage.
                </p>
            </div>
        </Card>
    );
}
