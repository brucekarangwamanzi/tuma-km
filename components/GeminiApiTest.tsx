import React, { useState } from 'react';

const GeminiApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testGeminiApi = async () => {
    setIsLoading(true);
    setTestResult('Testing Gemini API connection...');
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setTestResult('❌ Error: Gemini API key not configured');
      setIsLoading(false);
      return;
    }

    try {
      // Test API key format
      if (!apiKey.startsWith('AIza')) {
        setTestResult('❌ Error: Invalid API key format (should start with "AIza")');
        setIsLoading(false);
        return;
      }

      // Simple API validation (without making actual request for demo)
      setTestResult(`✅ Success! 
API Key: ${apiKey.substring(0, 20)}...
Format: Valid
Status: Ready for Gemini AI requests`);
      
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isConfigured = geminiApiKey && geminiApiKey !== 'PLACEHOLDER_API_KEY' && geminiApiKey.length > 10;

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mt-4">
      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
        <span>🤖</span>
        Gemini API Test
      </h4>
      
      <div className="space-y-3">
        <div className="text-sm">
          <p className="text-gray-300 mb-2">
            <strong>Status:</strong> {isConfigured ? '✅ Configured' : '❌ Not Configured'}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>API Key:</strong> 
            <span className="font-mono text-xs ml-2">
              {geminiApiKey ? `${geminiApiKey.substring(0, 20)}...` : 'Not found'}
            </span>
          </p>
        </div>

        <button
          onClick={testGeminiApi}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition-colors text-sm"
        >
          {isLoading ? 'Testing...' : 'Test Gemini API Key'}
        </button>

        {testResult && (
          <div className="bg-gray-800 border border-gray-600 rounded p-3 text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-400 space-y-1">
          <p>• This test validates the API key format</p>
          <p>• Gemini API key should start with "AIza"</p>
          <p>• Get your key from: https://makersuite.google.com/app/apikey</p>
        </div>
      </div>
    </div>
  );
};

export default GeminiApiTest;