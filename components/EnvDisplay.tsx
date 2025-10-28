import React from 'react';

const EnvDisplay: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  // Check if we're in demo mode or production mode
  const isGoogleConfigured = googleClientId && googleClientId !== 'your_actual_google_client_id_here';
  const isGeminiConfigured = geminiApiKey && geminiApiKey !== 'PLACEHOLDER_API_KEY' && geminiApiKey.length > 10;

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
      <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
        <span>🔧</span>
        Environment Configuration
      </h3>
      
      <div className="space-y-3 text-sm">
        {/* Google OAuth Status */}
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1 ${isGoogleConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">Google OAuth:</span>
              <span className={`px-2 py-1 rounded text-xs ${isGoogleConfigured ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {isGoogleConfigured ? 'Production Mode' : 'Demo Mode'}
              </span>
            </div>
            {isGoogleConfigured ? (
              <div className="text-gray-300">
                <p>Client ID: <span className="font-mono text-cyan-300">{googleClientId}</span></p>
                <p className="text-green-300 text-xs mt-1">✓ Real Google OAuth enabled</p>
              </div>
            ) : (
              <div className="text-gray-300">
                <p className="text-yellow-300 text-xs">Using simulated Google OAuth for development</p>
                <p className="text-xs mt-1">Add VITE_GOOGLE_CLIENT_ID to enable real Google OAuth</p>
              </div>
            )}
          </div>
        </div>

        {/* Gemini API Status */}
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1 ${isGeminiConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-medium">Gemini API:</span>
              <span className={`px-2 py-1 rounded text-xs ${isGeminiConfigured ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {isGeminiConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
            {isGeminiConfigured ? (
              <div className="text-gray-300">
                <p>API Key: <span className="font-mono text-cyan-300">{geminiApiKey?.substring(0, 20)}...</span></p>
                <p className="text-green-300 text-xs mt-1">✓ Gemini AI features available</p>
              </div>
            ) : (
              <div className="text-gray-300">
                <p className="text-red-300 text-xs">Gemini API key not configured</p>
                <p className="text-xs mt-1">Add VITE_GEMINI_API_KEY to enable AI features</p>
              </div>
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="border-t border-gray-600 pt-3 mt-3">
          <div className="text-gray-400 text-xs space-y-1">
            <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Base URL:</strong> {import.meta.env.BASE_URL}</p>
            <p><strong>Dev:</strong> {import.meta.env.DEV ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvDisplay;