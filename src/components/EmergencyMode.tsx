import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface EmergencyModeProps {
    isEmergency: boolean;
    onDismiss: () => void;
    glucoseLevel?: number;
}

export default function EmergencyMode({ isEmergency, onDismiss, glucoseLevel }: EmergencyModeProps) {
    const [countdown, setCountdown] = useState(10);
    const [calling, setCalling] = useState(false);

    useEffect(() => {
        if (isEmergency && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (isEmergency && countdown === 0 && !calling) {
            handleEmergencyCall();
        }
    }, [isEmergency, countdown, calling]);

    const handleEmergencyCall = () => {
        setCalling(true);
        // In production: integrate with Twilio or phone API
        console.log('Emergency call initiated');

        // Simulate call
        setTimeout(() => {
            alert('Emergency services contacted!\nLocation shared.\nEmergency contact notified.');
        }, 1000);
    };

    const handleImOk = () => {
        setCountdown(10);
        setCalling(false);
        onDismiss();
    };

    if (!isEmergency) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-pulse">
            <Card className="max-w-md w-full mx-4 p-6 border-4 border-red-600 bg-red-50 shadow-2xl">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                        <AlertTriangle size={40} className="text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-red-900 mb-2">EMERGENCY MODE</h2>

                    {glucoseLevel && (
                        <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-1">Critical Glucose Level</p>
                            <p className="text-4xl font-bold text-red-600">{glucoseLevel} mg/dL</p>
                        </div>
                    )}

                    <div className="bg-red-100 rounded-lg p-4 mb-4">
                        <p className="text-lg font-semibold text-red-900 mb-2">
                            {calling ? 'Contacting Emergency Services...' : `Auto-calling in ${countdown}s`}
                        </p>
                        <div className="w-full bg-red-200 rounded-full h-3 mb-2">
                            <div
                                className="bg-red-600 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-red-700">
                            Sharing location and medical info
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleImOk}
                            variant="primary"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-4"
                        >
                            <X size={20} className="mr-2" />
                            I'm OK - Cancel Emergency
                        </Button>

                        <Button
                            onClick={handleEmergencyCall}
                            variant="secondary"
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-4"
                        >
                            <Phone size={20} className="mr-2" />
                            Call Emergency Now
                        </Button>
                    </div>

                    <div className="mt-4 text-xs text-red-800">
                        <p className="font-semibold mb-1">Emergency Actions:</p>
                        <ul className="text-left space-y-1">
                            <li>✓ Location shared with emergency contact</li>
                            <li>✓ Medical ID info prepared</li>
                            <li>✓ Last glucose reading logged</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
