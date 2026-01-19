import { useState, useEffect } from 'react';
import Header from './components/Header';
import GlucoseOutlook from './components/dashboard/GlucoseOutlook';
import CrashGuard from './components/dashboard/CrashGuard';
import HealthMetrics from './components/dashboard/HealthMetrics';
import WhatIfSimulator from './components/predictive/WhatIfSimulator';
import SnapAndSync from './components/input/SnapAndSync';
import VoiceIntercom from './components/input/VoiceIntercom';
import ContextualCoaching from './components/behavioral/ContextualCoaching';
import GlucoseTwins from './components/behavioral/GlucoseTwins';
import TriagePortal from './components/clinician/TriagePortal';
import ExecutiveSummary from './components/clinician/ExecutiveSummary';
import HealthProfile from './components/HealthProfile';
import GlucoseHeatmap from './components/charts/GlucoseHeatmap';
import EmergencyMode from './components/EmergencyMode';
import EmergencyButton from './components/EmergencyButton';
import AlertSystem, { Alert } from './components/AlertSystem';
import { getCrashGuard } from './lib/api';

function App() {
  const [currentView, setCurrentView] = useState<'patient' | 'clinician'>('patient');
  const [isEmergency, setIsEmergency] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Monitor glucose and generate alerts
  useEffect(() => {
    const checkGlucose = async () => {
      try {
        const crashGuard = await getCrashGuard();

        // Generate alerts based on risk level
        if (crashGuard.risk_level === 'high' && !alerts.some(a => a.type === 'danger' && !a.dismissed)) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: 'danger',
            title: 'CRITICAL: Hypoglycemia Risk',
            message: `Glucose predicted to drop to ${crashGuard.predicted_glucose} mg/dL. ${crashGuard.estimated_time ? `Potential low in ${crashGuard.estimated_time}` : 'Take action now!'}`,
            timestamp: new Date(),
          };
          setAlerts(prev => [...prev, newAlert]);
        } else if (crashGuard.risk_level === 'medium' && !alerts.some(a => a.type === 'warning' && !a.dismissed)) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            type: 'warning',
            title: 'Glucose Trending Down',
            message: crashGuard.recommendations[0] || 'Monitor your glucose closely',
            timestamp: new Date(),
          };
          setAlerts(prev => [...prev, newAlert]);
        }
      } catch (error) {
        console.error('Error checking glucose:', error);
      }
    };

    // Check immediately and then every 30 seconds
    checkGlucose();
    const interval = setInterval(checkGlucose, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const handleEmergency = () => {
    setIsEmergency(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onViewChange={setCurrentView} currentView={currentView} />

      {/* Alert System */}
      <AlertSystem
        alerts={alerts}
        onDismiss={handleDismissAlert}
        onEmergency={handleEmergency}
      />

      {/* Emergency Mode Overlay */}
      <EmergencyMode
        isEmergency={isEmergency}
        onDismiss={() => setIsEmergency(false)}
        glucoseLevel={65}
      />

      {/* Emergency Button (always visible) */}
      <EmergencyButton onClick={handleEmergency} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'patient' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlucoseOutlook />
              </div>
              <div>
                <CrashGuard />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthMetrics />
              <WhatIfSimulator />
            </div>

            <GlucoseHeatmap />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContextualCoaching />
              <GlucoseTwins />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SnapAndSync />
              <VoiceIntercom />
            </div>

            <HealthProfile />
          </div>
        ) : (
          <div className="space-y-6">
            <TriagePortal />
            <ExecutiveSummary />
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12">
        <div className="text-center text-sm text-gray-500">
          <p>Dia-Pilot - AI-Powered Diabetes Management Platform</p>
          <p className="mt-1">Helping 537M diabetics worldwide stay safe 🏥</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
