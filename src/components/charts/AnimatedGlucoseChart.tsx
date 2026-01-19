import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AnimatedGlucoseChartProps {
    data: Array<{ time: string; value: number; predicted?: boolean }>;
    height?: number;
}

export default function AnimatedGlucoseChart({ data, height = 300 }: AnimatedGlucoseChartProps) {
    const chartRef = useRef<any>(null);

    const actualData = data.filter(d => !d.predicted);
    const predictedData = data.filter(d => d.predicted);

    const chartData = {
        labels: data.map(d => d.time),
        datasets: [
            {
                label: 'Glucose Level',
                data: data.map((d, i) => d.predicted ? null : d.value),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: data.map(d => {
                    if (d.value < 70) return 'rgb(220, 38, 38)';
                    if (d.value > 180) return 'rgb(245, 158, 11)';
                    return 'rgb(34, 197, 94)';
                }),
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: 'Predicted',
                data: data.map((d, i) => d.predicted ? d.value : null),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(168, 85, 247)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart' as const,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: (context: any) => {
                        return `${context.dataset.label}: ${context.parsed.y} mg/dL`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 50,
                max: 250,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: (value: any) => `${value} mg/dL`,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    useEffect(() => {
        // Trigger animation on mount
        if (chartRef.current) {
            chartRef.current.update('active');
        }
    }, []);

    return (
        <div style={{ height: `${height}px` }}>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
}
