// Simple authentication service for demo purposes
// In a real application, you would use proper password hashing libraries like bcrypt

export class AuthService {
  // Simple hash function for demo (NOT secure for production)
  static hashPassword(password: string): string {
    // This is just for demo - use bcrypt or similar in production
    return btoa(password + 'salt123');
  }

  // Verify password against hash
  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  // Validate password strength
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push('Password should contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate secure password suggestions
  static generatePasswordSuggestions(): string[] {
    const suggestions = [
      'SecurePass123!',
      'MyPassword2024@',
      'StrongKey456#',
      'SafeLogin789$',
      'PowerUser2024%'
    ];
    
    return suggestions;
  }
}