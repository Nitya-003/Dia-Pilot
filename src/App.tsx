import { useState } from 'react';
import Header from './components/Header';
import GlucoseOutlook from './components/dashboard/GlucoseOutlook';
import CrashGuard from './components/dashboard/CrashGuard';
import WhatIfSimulator from './components/predictive/WhatIfSimulator';
import SnapAndSync from './components/input/SnapAndSync';
import VoiceIntercom from './components/input/VoiceIntercom';
import ContextualCoaching from './components/behavioral/ContextualCoaching';
import GlucoseTwins from './components/behavioral/GlucoseTwins';
import TriagePortal from './components/clinician/TriagePortal';
import ExecutiveSummary from './components/clinician/ExecutiveSummary';

function App() {
  const [currentView, setCurrentView] = useState<'patient' | 'clinician'>('patient');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onViewChange={setCurrentView} currentView={currentView} />

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
              <WhatIfSimulator />
              <ContextualCoaching />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SnapAndSync />
              <VoiceIntercom />
              <GlucoseTwins />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <TriagePortal />
            <ExecutiveSummary />
          </div>
        )}
      </main>

      <footer className="mt-16 pb-8 text-center">
        <p className="text-sm text-gray-500">
          Dia-Pilot © 2026 • Proactive Diabetes Management Platform
        </p>
      </footer>
    </div>
  );
}

export default App;
