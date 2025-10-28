// Environment Logger Utility
// Logs environment configuration to console for debugging

export const logEnvironmentConfig = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const mode = import.meta.env.MODE;
  const dev = import.meta.env.DEV;

  console.group('🔧 Environment Configuration');
  
  console.log('📊 General Info:');
  console.log(`  Mode: ${mode}`);
  console.log(`  Development: ${dev}`);
  console.log(`  Base URL: ${import.meta.env.BASE_URL}`);
  
  console.log('\n🔐 API Keys:');
  
  // Google OAuth
  if (googleClientId && googleClientId !== 'your_actual_google_client_id_here') {
    console.log('  ✅ Google OAuth: CONFIGURED');
    console.log(`  📋 Client ID: ${googleClientId}`);
    console.log('  🚀 Status: Production Mode (Real Google OAuth)');
  } else {
    console.log('  ⚠️  Google OAuth: DEMO MODE');
    console.log('  📋 Client ID: Not configured');
    console.log('  🧪 Status: Using simulated Google OAuth');
  }
  
  // Gemini API
  if (geminiApiKey && geminiApiKey !== 'PLACEHOLDER_API_KEY' && geminiApiKey.length > 10) {
    console.log('  ✅ Gemini API: CONFIGURED');
    console.log(`  📋 API Key: ${geminiApiKey.substring(0, 20)}...`);
    console.log('  🤖 Status: AI features available');
  } else {
    console.log('  ❌ Gemini API: NOT CONFIGURED');
    console.log('  📋 API Key: Missing or placeholder');
    console.log('  🤖 Status: AI features unavailable');
  }
  
  console.log('\n📝 Environment Variables:');
  console.log('  VITE_GOOGLE_CLIENT_ID:', googleClientId || 'undefined');
  console.log('  VITE_GEMINI_API_KEY:', geminiApiKey ? `${geminiApiKey.substring(0, 20)}...` : 'undefined');
  
  console.groupEnd();
  
  return {
    googleConfigured: !!(googleClientId && googleClientId !== 'your_actual_google_client_id_here'),
    geminiConfigured: !!(geminiApiKey && geminiApiKey !== 'PLACEHOLDER_API_KEY' && geminiApiKey.length > 10),
    mode,
    dev
  };
};

// Auto-log on import in development
if (import.meta.env.DEV) {
  logEnvironmentConfig();
}