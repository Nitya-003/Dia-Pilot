import { useState } from 'react';
import Card from '../ui/Card';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceIntercom() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleToggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setTranscript('');
      setTimeout(() => {
        setTranscript("I'm feeling a bit tired and had a sandwich for lunch...");
        setTimeout(() => {
          setIsListening(false);
        }, 1500);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <Card className="p-6" hover>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          isListening ? 'bg-blue-500' : 'bg-blue-100'
        }`}>
          {isListening ? (
            <Mic size={20} className="text-white" />
          ) : (
            <MicOff size={20} className="text-blue-600" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Voice Intercom</h3>
          <p className="text-sm text-gray-500">Quick voice notes</p>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleToggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
            isListening
              ? 'bg-blue-600 shadow-lg shadow-blue-500/50 scale-110'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {isListening ? (
            <Mic size={32} className="text-white" />
          ) : (
            <Mic size={32} className="text-gray-600" />
          )}
        </button>

        {isListening && (
          <div className="flex justify-center items-center space-x-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-600 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.sin(Date.now() / 200 + i) * 10}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {transcript && (
        <div className="bg-gray-50 rounded-xl p-4 animate-fadeIn">
          <p className="text-sm text-gray-700 italic">"{transcript}"</p>
          <p className="text-xs text-gray-500 mt-2">Logged at {new Date().toLocaleTimeString()}</p>
        </div>
      )}

      {!transcript && !isListening && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Tap to start recording</p>
        </div>
      )}
    </Card>
  );
}
