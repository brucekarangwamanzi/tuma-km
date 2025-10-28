import React, { useState } from 'react';
import { GoogleAuthService } from '../services/googleAuthService';

const GoogleAuthTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGoogleAuth = async () => {
    setIsLoading(true);
    setTestResult('Testing Google OAuth...');
    
    try {
      const googleUser = await GoogleAuthService.signInWithPopup();
      setTestResult(`✅ Success! 
User: ${googleUser.name}
Email: ${googleUser.email}
ID: ${googleUser.id}`);
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = googleClientId && googleClientId !== 'your_actual_google_client_id_here';

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mt-4">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>🧪</span>
        Google OAuth Test
      </h4>
      
      <div className="space-y-3">
        <div className="text-sm">
          <p className="text-gray-300 mb-2">
            <strong>Status:</strong> {isConfigured ? '✅ Real Google OAuth' : '⚠️ Demo Mode'}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Client ID:</strong> 
            <span className="font-mono text-xs ml-2">
              {googleClientId ? `${googleClientId.substring(0, 30)}...` : 'Not configured'}
            </span>
          </p>
        </div>

        <button
          onClick={testGoogleAuth}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors text-sm"
        >
          {isLoading ? 'Testing...' : 'Test Google OAuth'}
        </button>

        {testResult && (
          <div className="bg-gray-800 border border-gray-600 rounded p-3 text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-400 space-y-1">
          <p>• This test directly calls the Google OAuth service</p>
          <p>• In demo mode: Returns simulated user data</p>
          <p>• In production mode: Opens real Google OAuth popup</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthTest;