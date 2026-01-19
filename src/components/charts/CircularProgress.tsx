import { useEffect, useState } from 'react';

interface CircularProgressProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    showValue?: boolean;
}

export default function CircularProgress({
    value,
    max,
    size = 120,
    strokeWidth = 10,
    color = 'rgb(59, 130, 246)',
    label,
    showValue = true,
}: CircularProgressProps) {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / max) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(value);
        }, 100);
        return () => clearTimeout(timer);
    }, [value]);

    const percentage = Math.round((value / max) * 100);

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(0, 0, 0, 0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                {showValue && (
                    <span className="text-2xl font-bold" style={{ color }}>
                        {percentage}%
                    </span>
                )}
                {label && (
                    <span className="text-xs text-gray-600 mt-1">{label}</span>
                )}
            </div>
        </div>
    );
}
