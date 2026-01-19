import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, X, CheckCircle } from 'lucide-react';

export interface Alert {
    id: string;
    type: 'danger' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    dismissed?: boolean;
}

interface AlertSystemProps {
    alerts: Alert[];
    onDismiss: (id: string) => void;
    onEmergency?: () => void;
}

export default function AlertSystem({ alerts, onDismiss, onEmergency }: AlertSystemProps) {
    const [requestedPermission, setRequestedPermission] = useState(false);

    useEffect(() => {
        // Request browser notification permission
        if (!requestedPermission && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
            setRequestedPermission(true);
        }
    }, [requestedPermission]);

    useEffect(() => {
        // Send browser notifications for new alerts
        alerts.forEach(alert => {
            if (!alert.dismissed && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(`Dia-Pilot: ${alert.title}`, {
                    body: alert.message,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: alert.id,
                    requireInteraction: alert.type === 'danger',
                });

                // Play alert sound for danger
                if (alert.type === 'danger') {
                    playAlertSound();
                }
            }
        });
    }, [alerts]);

    const playAlertSound = () => {
        // Create simple beep sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Repeat 3 times
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 800;
            osc2.type = 'sine';
            gain2.gain.value = 0.3;
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.3);
        }, 400);
    };

    const getAlertColor = (type: Alert['type']) => {
        switch (type) {
            case 'danger':
                return 'bg-red-50 border-red-500 text-red-900';
            case 'warning':
                return 'bg-amber-50 border-amber-500 text-amber-900';
            case 'info':
                return 'bg-blue-50 border-blue-500 text-blue-900';
            case 'success':
                return 'bg-emerald-50 border-emerald-500 text-emerald-900';
        }
    };

    const getIcon = (type: Alert['type']) => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="text-red-600" size={24} />;
            case 'warning':
                return <Bell className="text-amber-600" size={24} />;
            case 'info':
                return <Bell className="text-blue-600" size={24} />;
            case 'success':
                return <CheckCircle className="text-emerald-600" size={24} />;
        }
    };

    const activeAlerts = alerts.filter(a => !a.dismissed);

    if (activeAlerts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-40 space-y-2 max-w-md">
            {activeAlerts.map(alert => (
                <div
                    key={alert.id}
                    className={`${getAlertColor(alert.type)} border-l-4 rounded-lg shadow-lg p-4 animate-slideInRight`}
                >
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(alert.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold mb-1">{alert.title}</p>
                            <p className="text-sm opacity-90">{alert.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                        </div>

                        <button
                            onClick={() => onDismiss(alert.id)}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {alert.type === 'danger' && onEmergency && (
                        <button
                            onClick={onEmergency}
                            className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            🚨 Activate Emergency Mode
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
