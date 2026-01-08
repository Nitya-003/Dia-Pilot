import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Camera, Check } from 'lucide-react';

export default function SnapAndSync() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleUpload = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
      setTimeout(() => setScanned(false), 3000);
    }, 2000);
  };

  return (
    <Card className="p-6" hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Camera size={20} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Snap & Sync</h3>
          <p className="text-sm text-gray-500">Photo-based meal logging</p>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center overflow-hidden">
        {!isScanning && !scanned && (
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Camera size={28} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Upload a photo of your meal</p>
          </div>
        )}

        {isScanning && (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 animate-pulse"></div>
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-700 mt-4 font-medium">Analyzing meal...</p>
            </div>
          </div>
        )}

        {scanned && (
          <div className="text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">Meal logged successfully!</p>
            <p className="text-xs text-gray-600 mt-1">Est. 42g carbs detected</p>
          </div>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={handleUpload}
        className="w-full"
        disabled={isScanning || scanned}
      >
        {scanned ? 'Logged ✓' : 'Upload Meal Photo'}
      </Button>
    </Card>
  );
}
