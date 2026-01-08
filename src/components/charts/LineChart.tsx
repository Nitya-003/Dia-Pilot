interface DataPoint {
  time: string;
  value: number;
  predicted?: boolean;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  showPrediction?: boolean;
  targetRange?: { min: number; max: number };
}

export default function LineChart({
  data,
  height = 200,
  showPrediction = false,
  targetRange = { min: 70, max: 140 },
}: LineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), targetRange.max + 20);
  const minValue = Math.min(...data.map((d) => d.value), targetRange.min - 20);
  const range = maxValue - minValue;

  const getY = (value: number) => {
    return height - ((value - minValue) / range) * height;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * 100;
  };

  const actualData = showPrediction ? data.filter((d) => !d.predicted) : data;
  const predictedData = showPrediction ? data.filter((d) => d.predicted) : [];

  const createPath = (points: DataPoint[], startIndex = 0) => {
    return points
      .map((point, i) => {
        const x = getX(startIndex + i);
        const y = getY(point.value);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(' ');
  };

  const targetMinY = getY(targetRange.min);
  const targetMaxY = getY(targetRange.max);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg className="w-full h-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <rect
          x="0"
          y={targetMaxY}
          width="100"
          height={targetMinY - targetMaxY}
          fill="rgb(16 185 129 / 0.05)"
          stroke="rgb(16 185 129 / 0.2)"
          strokeWidth="0.2"
          strokeDasharray="2,2"
        />

        {actualData.length > 0 && (
          <path
            d={createPath(actualData)}
            fill="none"
            stroke="rgb(37 99 235)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {showPrediction && predictedData.length > 0 && (
          <>
            <path
              d={createPath([actualData[actualData.length - 1], ...predictedData], actualData.length - 1)}
              fill="none"
              stroke="rgb(37 99 235)"
              strokeWidth="2"
              strokeDasharray="4,4"
              vectorEffect="non-scaling-stroke"
              opacity="0.6"
            />
          </>
        )}

        {data.map((point, i) => {
          const isPredicted = point.predicted;
          return (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(point.value)}
              r="1.5"
              fill={isPredicted ? 'rgb(37 99 235 / 0.5)' : 'rgb(37 99 235)'}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
        {data.map((point, i) => (
          <span key={i} className={i % 2 === 0 ? '' : 'opacity-0'}>
            {point.time}
          </span>
        ))}
      </div>
    </div>
  );
}
