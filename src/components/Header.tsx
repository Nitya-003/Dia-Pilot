import { Bell, User } from 'lucide-react';

interface HeaderProps {
  onViewChange?: (view: 'patient' | 'clinician') => void;
  currentView?: 'patient' | 'clinician';
}

export default function Header({ onViewChange, currentView = 'patient' }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dia-Pilot</h1>
              <p className="text-xs text-gray-500">Proactive Diabetes Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onViewChange && (
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('patient')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    currentView === 'patient'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Patient View
                </button>
                <button
                  onClick={() => onViewChange('clinician')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    currentView === 'clinician'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Clinician View
                </button>
              </div>
            )}

            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>

            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
