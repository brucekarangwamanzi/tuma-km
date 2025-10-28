import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { CheckCircleIcon, ClockIcon, TruckIcon, PackageIcon, XCircleIcon } from './Icons';

interface LiveOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
  showLiveUpdates?: boolean;
}

interface StatusUpdate {
  status: OrderStatus;
  timestamp: string;
  message: string;
  location?: string;
  isLive?: boolean;
}

const LiveOrderStatus: React.FC<LiveOrderStatusProps> = ({ 
  orderId, 
  currentStatus, 
  onStatusChange,
  showLiveUpdates = true 
}) => {
  const [liveUpdates, setLiveUpdates] = useState<StatusUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const statusSteps = [
    { status: OrderStatus.REQUESTED, label: 'Order Requested', icon: ClockIcon },
    { status: OrderStatus.PURCHASED, label: 'Purchased in China', icon: CheckCircleIcon },
    { status: OrderStatus.IN_WAREHOUSE, label: 'In Warehouse', icon: PackageIcon },
    { status: OrderStatus.IN_TRANSIT, label: 'In Transit', icon: TruckIcon },
    { status: OrderStatus.ARRIVED, label: 'Arrived in Rwanda', icon: PackageIcon },
    { status: OrderStatus.COMPLETED, label: 'Delivered', icon: CheckCircleIcon },
  ];

  useEffect(() => {
    if (!showLiveUpdates) return;

    // Mock live updates
    const mockUpdates: StatusUpdate[] = [
      {
        status: OrderStatus.IN_TRANSIT,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        message: 'Package departed from Beijing sorting facility',
        location: 'Beijing, China',
        isLive: true
      },
      {
        status: OrderStatus.IN_TRANSIT,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        message: 'Package loaded onto cargo flight CA8888',
        location: 'Beijing Capital Airport',
        isLive: false
      },
      {
        status: OrderStatus.IN_WAREHOUSE,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        message: 'Package processed and ready for shipment',
        location: 'Guangzhou Warehouse',
        isLive: false
      }
    ];

    setLiveUpdates(mockUpdates);

    // Simulate live updates
    const interval = setInterval(() => {
      const newUpdate: StatusUpdate = {
        status: currentStatus,
        timestamp: new Date().toISOString(),
        message: `Live tracking update - ${new Date().toLocaleTimeString()}`,
        location: 'In Transit',
        isLive: true
      };

      setLiveUpdates(prev => [newUpdate, ...prev.slice(0, 4)]); // Keep only 5 updates
    }, 60000); // New update every minute

    return () => clearInterval(interval);
  }, [currentStatus, showLiveUpdates]);

  const getStatusIndex = (status: OrderStatus) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  const getCurrentStatusIndex = () => {
    return getStatusIndex(currentStatus);
  };

  const isStatusCompleted = (stepIndex: number) => {
    return stepIndex <= getCurrentStatusIndex();
  };

  const isStatusCurrent = (stepIndex: number) => {
    return stepIndex === getCurrentStatusIndex();
  };

  const getStatusColor = (stepIndex: number) => {
    if (currentStatus === OrderStatus.DECLINED) {
      return stepIndex === 0 ? 'text-red-400 bg-red-500/20' : 'text-gray-500 bg-gray-500/10';
    }
    
    if (isStatusCompleted(stepIndex)) {
      return 'text-green-400 bg-green-500/20';
    } else if (isStatusCurrent(stepIndex)) {
      return 'text-cyan-400 bg-cyan-500/20 animate-pulse';
    } else {
      return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (currentStatus === OrderStatus.DECLINED) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <XCircleIcon className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-300">Order Declined</h3>
            <p className="text-red-400 text-sm">This order could not be processed</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          We were unable to fulfill this order. Please contact support for more information or to place a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {showLiveUpdates && (
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-300">
              {isConnected ? 'Live tracking active' : 'Connection lost'}
            </span>
          </div>
          <span className="text-xs text-gray-400">Order {orderId}</span>
        </div>
      )}

      {/* Status Progress */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = isStatusCompleted(index);
            const isCurrent = isStatusCurrent(index);
            
            return (
              <div key={step.status} className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(index)} ${
                  isCurrent ? 'border-cyan-400' : isCompleted ? 'border-green-400' : 'border-gray-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${
                  isCurrent ? 'text-cyan-300 font-medium' : isCompleted ? 'text-green-300' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      Current
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-600 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-1000"
            style={{ width: `${(getCurrentStatusIndex() / (statusSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Live Updates */}
      {showLiveUpdates && liveUpdates.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Tracking Updates
            </h4>
          </div>
          <div className="divide-y divide-gray-700/50">
            {liveUpdates.map((update, index) => (
              <div key={index} className={`p-4 ${update.isLive ? 'bg-cyan-500/5' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">{update.message}</p>
                      {update.isLive && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                          LIVE
                        </span>
                      )}
                    </div>
                    {update.location && (
                      <p className="text-xs text-gray-400">📍 {update.location}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {formatTimeAgo(update.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {currentStatus !== OrderStatus.COMPLETED && currentStatus !== OrderStatus.DECLINED && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="text-sm font-medium text-blue-300">Estimated Delivery</h4>
              <p className="text-blue-200 text-sm">
                {currentStatus === OrderStatus.IN_TRANSIT ? '2-3 business days' : 
                 currentStatus === OrderStatus.IN_WAREHOUSE ? '5-7 business days' :
                 '10-14 business days'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveOrderStatus;