import { useState, useRef } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Camera, Check, AlertCircle } from 'lucide-react';
import { uploadMealPhoto } from '../../lib/api';

export default function SnapAndSync() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carbsEstimate, setCarbsEstimate] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max size is 10MB');
      return;
    }

    setError(null);
    setIsScanning(true);
    setCarbsEstimate(null);

    try {
      const result = await uploadMealPhoto(file);
      setCarbsEstimate(result.carbs_estimate);
      setIsScanning(false);
      setScanned(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setScanned(false);
        setCarbsEstimate(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (err) {
      setIsScanning(false);
      setError(err instanceof Error ? err.message : 'Failed to upload meal photo');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
        {!isScanning && !scanned && !error && (
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

        {scanned && carbsEstimate !== null && (
          <div className="text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-emerald-700">Meal logged successfully!</p>
            <p className="text-xs text-gray-600 mt-1">Est. {carbsEstimate}g carbs detected</p>
          </div>
        )}

        {error && (
          <div className="text-center animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <p className="text-sm font-semibold text-red-700">Upload failed</p>
            <p className="text-xs text-gray-600 mt-1 px-4">{error}</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        variant="secondary"
        onClick={handleUploadClick}
        className="w-full"
        disabled={isScanning || scanned}
      >
        {scanned ? 'Logged ✓' : 'Upload Meal Photo'}
      </Button>
    </Card>
  );
}
