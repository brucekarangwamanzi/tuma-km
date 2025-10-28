import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showSuggestions?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showSuggestions = false 
}) => {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    return { score, checks };
  };

  const { score, checks } = getPasswordStrength(password);
  
  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: '', color: '' };
    if (score <= 2) return { label: 'Weak', color: 'text-red-400' };
    if (score <= 3) return { label: 'Fair', color: 'text-yellow-400' };
    if (score <= 4) return { label: 'Good', color: 'text-blue-400' };
    return { label: 'Strong', color: 'text-green-400' };
  };

  const getStrengthBarColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (!password) return null;

  const { label, color } = getStrengthLabel(score);

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor(score)}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>

      {/* Requirements Checklist */}
      <div className="text-xs space-y-1">
        <div className={`flex items-center gap-2 ${checks.length ? 'text-green-400' : 'text-gray-400'}`}>
          <span>{checks.length ? '✓' : '○'}</span>
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
          <span>{checks.lowercase ? '✓' : '○'}</span>
          <span>One lowercase letter</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
          <span>{checks.uppercase ? '✓' : '○'}</span>
          <span>One uppercase letter</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.number ? 'text-green-400' : 'text-gray-400'}`}>
          <span>{checks.number ? '✓' : '○'}</span>
          <span>One number</span>
        </div>
        <div className={`flex items-center gap-2 ${checks.special ? 'text-green-400' : 'text-gray-400'}`}>
          <span>{checks.special ? '✓' : '○'}</span>
          <span>One special character</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;