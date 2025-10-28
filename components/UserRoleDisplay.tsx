import React from 'react';
import { Role } from '../types';

interface UserRoleDisplayProps {
  role: Role;
  fullName: string;
  showDescription?: boolean;
}

const UserRoleDisplay: React.FC<UserRoleDisplayProps> = ({ 
  role, 
  fullName, 
  showDescription = false 
}) => {
  const getRoleInfo = (role: Role) => {
    switch (role) {
      case Role.CUSTOMER:
        return {
          icon: '👤',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          description: 'Places orders and tracks shipments'
        };
      case Role.ORDER_PROCESSOR:
        return {
          icon: '📋',
          color: 'text-green-400 bg-green-500/10 border-green-500/30',
          description: 'Processes and manages customer orders'
        };
      case Role.WAREHOUSE_MANAGER:
        return {
          icon: '📦',
          color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
          description: 'Manages warehouse operations and inventory'
        };
      case Role.ADMIN:
        return {
          icon: '⚙️',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          description: 'System administration and user management'
        };
      case Role.SUPER_ADMIN:
        return {
          icon: '👑',
          color: 'text-red-400 bg-red-500/10 border-red-500/30',
          description: 'Full system access and control'
        };
      default:
        return {
          icon: '❓',
          color: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
          description: 'Unknown role'
        };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${roleInfo.color}`}>
      <span className="text-sm">{roleInfo.icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{fullName}</span>
        <span className="text-xs opacity-80">{role}</span>
        {showDescription && (
          <span className="text-xs opacity-60 mt-1">{roleInfo.description}</span>
        )}
      </div>
    </div>
  );
};

export default UserRoleDisplay;