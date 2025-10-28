import React, { useState } from 'react';
import { Role } from '../types';
import UserRoleDisplay from './UserRoleDisplay';

const TestAccountsDisplay: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const testAccounts = [
    // Customers
    { 
      email: 'alice.johnson@gmail.com', 
      fullName: 'Alice Johnson', 
      role: Role.CUSTOMER,
      description: 'Regular customer with 12 orders'
    },
    { 
      email: 'david.mugisha@yahoo.com', 
      fullName: 'David Mugisha', 
      role: Role.CUSTOMER,
      description: 'Verified customer with 8 orders'
    },
    { 
      email: 'sarah.uwimana@outlook.com', 
      fullName: 'Sarah Uwimana', 
      role: Role.CUSTOMER,
      description: 'New customer (unverified)'
    },

    // Staff
    { 
      email: 'marie.uwase@tumalink.com', 
      fullName: 'Marie Uwase', 
      role: Role.ORDER_PROCESSOR,
      description: 'Processes customer orders'
    },
    { 
      email: 'jean.habimana@tumalink.com', 
      fullName: 'Jean Baptiste Habimana', 
      role: Role.ORDER_PROCESSOR,
      description: 'Senior order processor'
    },
    { 
      email: 'eric.nzeyimana@tumalink.com', 
      fullName: 'Eric Nzeyimana', 
      role: Role.WAREHOUSE_MANAGER,
      description: 'Manages warehouse operations'
    },

    // Management
    { 
      email: 'grace.mukamana@tumalink.com', 
      fullName: 'Grace Mukamana', 
      role: Role.ADMIN,
      description: 'System administrator'
    },
    { 
      email: 'patrick.nkurunziza@tumalink.com', 
      fullName: 'Patrick Nkurunziza', 
      role: Role.SUPER_ADMIN,
      description: 'Company owner & super admin'
    },

    // Legacy
    { 
      email: 'user@test.com', 
      fullName: 'Test Customer', 
      role: Role.CUSTOMER,
      description: 'Legacy test account'
    },
  ];

  const groupedAccounts = {
    customers: testAccounts.filter(acc => acc.role === Role.CUSTOMER),
    staff: testAccounts.filter(acc => 
      acc.role === Role.ORDER_PROCESSOR || acc.role === Role.WAREHOUSE_MANAGER
    ),
    management: testAccounts.filter(acc => 
      acc.role === Role.ADMIN || acc.role === Role.SUPER_ADMIN
    ),
  };

  return (
    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold flex items-center gap-2">
          <span>👥</span>
          Test Accounts
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show'} All
        </button>
      </div>

      {!isExpanded ? (
        <div className="space-y-2">
          <p className="text-gray-300 text-sm">
            <strong>Quick Test:</strong> alice.johnson@gmail.com / Password123
          </p>
          <p className="text-gray-400 text-xs">
            Click "Show All" to see all available test accounts with different roles
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Customers */}
          <div>
            <h5 className="text-blue-300 font-medium text-sm mb-2 flex items-center gap-1">
              <span>👤</span>
              Customers ({groupedAccounts.customers.length})
            </h5>
            <div className="space-y-2">
              {groupedAccounts.customers.map((account) => (
                <div key={account.email} className="bg-gray-800/50 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <UserRoleDisplay 
                      role={account.role} 
                      fullName={account.fullName} 
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-300 font-mono">{account.email}</p>
                    <p className="text-gray-400">{account.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <h5 className="text-green-300 font-medium text-sm mb-2 flex items-center gap-1">
              <span>👷</span>
              Staff ({groupedAccounts.staff.length})
            </h5>
            <div className="space-y-2">
              {groupedAccounts.staff.map((account) => (
                <div key={account.email} className="bg-gray-800/50 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <UserRoleDisplay 
                      role={account.role} 
                      fullName={account.fullName} 
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-300 font-mono">{account.email}</p>
                    <p className="text-gray-400">{account.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Management */}
          <div>
            <h5 className="text-purple-300 font-medium text-sm mb-2 flex items-center gap-1">
              <span>👔</span>
              Management ({groupedAccounts.management.length})
            </h5>
            <div className="space-y-2">
              {groupedAccounts.management.map((account) => (
                <div key={account.email} className="bg-gray-800/50 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <UserRoleDisplay 
                      role={account.role} 
                      fullName={account.fullName} 
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-300 font-mono">{account.email}</p>
                    <p className="text-gray-400">{account.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-4">
            <p className="text-blue-300 text-xs">
              <strong>Password for all accounts:</strong> Password123
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Each role has different dashboard permissions and features.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAccountsDisplay;