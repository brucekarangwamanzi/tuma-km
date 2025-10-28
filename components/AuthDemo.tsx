import React from 'react';

const AuthDemo: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isDemo = !googleClientId || googleClientId === 'demo-client-id' || googleClientId === 'your_actual_google_client_id_here';

  if (isDemo) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h4 className="text-blue-300 font-semibold mb-2">🧪 Google OAuth Demo Mode</h4>
        <p className="text-blue-200 text-sm mb-2">
          Click "Continue with Google" to test the OAuth flow in demo mode.
        </p>
        <div className="text-xs text-blue-300 space-y-1">
          <p>• Simulates real Google OAuth experience</p>
          <p>• Creates accounts with realistic Google emails</p>
          <p>• No Google credentials required for testing</p>
        </div>
        <div className="mt-3 p-2 bg-blue-600/20 rounded text-xs text-blue-200">
          <strong>Production:</strong> Add VITE_GOOGLE_CLIENT_ID to .env.local for real Google OAuth
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
      <h4 className="text-green-300 font-semibold mb-2">🔐 Google OAuth Production Mode</h4>
      <p className="text-green-200 text-sm mb-2">
        Real Google OAuth is configured and ready to use.
      </p>
      <div className="text-xs text-green-300 space-y-1">
        <p>• Uses real Google authentication</p>
        <p>• Creates accounts with actual Google emails</p>
        <p>• Secure OAuth 2.0 flow implementation</p>
      </div>
      <div className="mt-3 p-2 bg-green-600/20 rounded text-xs text-green-200">
        <strong>Client ID:</strong> {googleClientId?.substring(0, 30)}...
      </div>
    </div>
  );
};

export default AuthDemo;