import { AlertTriangle } from 'lucide-react';
import Button from './ui/Button';

interface EmergencyButtonProps {
    onClick: () => void;
}

export default function EmergencyButton({ onClick }: EmergencyButtonProps) {
    return (
        <div className="fixed bottom-6 right-6 z-30">
            <Button
                onClick={onClick}
                className="bg-red-600 hover:bg-red-700 text-white shadow-2xl px-6 py-4 text-lg font-bold rounded-full animate-pulse hover:animate-none transition-all transform hover:scale-105"
            >
                <AlertTriangle size={24} className="mr-2" />
                SOS EMERGENCY
            </Button>
        </div>
    );
}
