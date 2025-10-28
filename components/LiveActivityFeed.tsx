import React, { useState, useEffect } from 'react';
import { User, OrderStatus } from '../types';
import { ClockIcon, TruckIcon, PackageIcon, CheckCircleIcon, ShoppingCartIcon, EyeIcon } from './Icons';

interface ActivityItem {
  id: string;
  type: 'order_created' | 'status_change' | 'message_sent' | 'payment_processed' | 'shipment_update';
  title: string;
  description: string;
  timestamp: string;
  orderId?: string;
  status?: OrderStatus;
  isNew: boolean;
}

interface LiveActivityFeedProps {
  user: User;
  onOrderClick?: (orderId: string) => void;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ user, onOrderClick }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock initial activities
    const initialActivities: ActivityItem[] = [
      {
        id: 'act1',
        type: 'status_change',
        title: 'Order In Transit',
        description: 'Your Ergonomic Office Chair has left the warehouse and is on its way to Rwanda',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        orderId: 'order1',
        status: OrderStatus.IN_TRANSIT,
        isNew: true
      },
      {
        id: 'act2',
        type: 'message_sent',
        title: 'Message from Order Processor',
        description: 'Marie Uwase replied to your inquiry about delivery timeline',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        orderId: 'order1',
        isNew: true
      },
      {
        id: 'act3',
        type: 'status_change',
        title: 'Order Purchased',
        description: 'We have successfully purchased your Mechanical Keyboard from the supplier',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        orderId: 'order2',
        status: OrderStatus.PURCHASED,
        isNew: false
      },
      {
        id: 'act4',
        type: 'order_created',
        title: 'New Order Received',
        description: 'Your order for 4K Webcam has been received and is being processed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        orderId: 'order3',
        isNew: false
      },
      {
        id: 'act5',
        type: 'shipment_update',
        title: 'Shipment Tracking Update',
        description: 'Your package has cleared customs and is now in local delivery network',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        orderId: 'order1',
        isNew: false
      }
    ];

    setActivities(initialActivities);
    setIsLoading(false);

    // Simulate live updates
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: `act_${Date.now()}`,
        type: 'status_change',
        title: 'Live Status Update',
        description: `Order status updated at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        orderId: 'order1',
        isNew: true
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 9)]; // Keep only 10 items
        // Mark previous new items as not new
        return updated.map((item, index) => ({
          ...item,
          isNew: index === 0 ? true : false
        }));
      });
    }, 45000); // New update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string, status?: OrderStatus) => {
    switch (type) {
      case 'order_created':
        return <ShoppingCartIcon className="w-5 h-5 text-blue-400" />;
      case 'status_change':
        if (status === OrderStatus.IN_TRANSIT) return <TruckIcon className="w-5 h-5 text-orange-400" />;
        if (status === OrderStatus.COMPLETED) return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
        return <PackageIcon className="w-5 h-5 text-cyan-400" />;
      case 'message_sent':
        return <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white">💬</div>;
      case 'payment_processed':
        return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">💳</div>;
      case 'shipment_update':
        return <TruckIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 bg-gray-700/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            Live Activity Feed
          </h3>
          <span className="text-xs text-gray-400">Real-time updates</span>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <ClockIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`p-4 hover:bg-gray-700/30 transition-colors ${
                  activity.isNew ? 'bg-cyan-500/5 border-l-4 border-l-cyan-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${activity.isNew ? 'text-white' : 'text-gray-300'}`}>
                        {activity.title}
                        {activity.isNew && (
                          <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">
                      {activity.description}
                    </p>

                    {/* Order Link */}
                    {activity.orderId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOrderClick?.(activity.orderId!)}
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <EyeIcon className="w-3 h-3" />
                          View Order {activity.orderId}
                        </button>
                        {activity.status && (
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            activity.status === OrderStatus.COMPLETED ? 'bg-green-500/20 text-green-300' :
                            activity.status === OrderStatus.IN_TRANSIT ? 'bg-orange-500/20 text-orange-300' :
                            activity.status === OrderStatus.PURCHASED ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {activity.status}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline connector */}
                {index < activities.length - 1 && (
                  <div className="ml-2.5 mt-2 w-0.5 h-4 bg-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700/50 bg-gray-700/30">
        <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View Full Activity History
        </button>
      </div>
    </div>
  );
};

export default LiveActivityFeed;