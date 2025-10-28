import React from 'react';

const GoogleAccountInfo: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isDemo = !googleClientId || googleClientId === 'demo-client-id' || googleClientId === 'your_actual_google_client_id_here';

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
      <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
        <span>👤</span>
        Google Account Selection
      </h4>
      
      {isDemo ? (
        <div className="text-sm text-blue-200 space-y-2">
          <p>In demo mode, account selection is simulated:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-blue-300 ml-4">
            <li>Random demo account will be selected</li>
            <li>Simulates real Google account picker</li>
            <li>No real Google authentication required</li>
          </ul>
        </div>
      ) : (
        <div className="text-sm text-blue-200 space-y-2">
          <p>Google account selection is enabled:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-blue-300 ml-4">
            <li>You'll see Google's account picker</li>
            <li>Choose from your signed-in Google accounts</li>
            <li>Or sign in with a different account</li>
            <li>No automatic sign-in with last used account</li>
          </ul>
        </div>
      )}
      
      <div className="mt-3 p-2 bg-blue-600/20 rounded text-xs text-blue-200">
        <strong>How it works:</strong> Each time you click "Continue with Google", 
        you'll be prompted to select which Google account to use.
      </div>
    </div>
  );
};

export default GoogleAccountInfo;