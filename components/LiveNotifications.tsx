import React, { useState, useEffect } from 'react';
import { User, OrderStatus } from '../types';
import { BellIcon, CheckCircleIcon, TruckIcon, PackageIcon, XMarkIcon } from './Icons';

interface LiveNotification {
  id: string;
  type: 'order_update' | 'message' | 'system' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  orderId?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: 'bell' | 'package' | 'truck' | 'check' | 'message';
}

interface LiveNotificationsProps {
  user: User;
  onNotificationClick?: (notification: LiveNotification) => void;
}

const LiveNotifications: React.FC<LiveNotificationsProps> = ({ user, onNotificationClick }) => {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock live notifications - in real app, this would come from WebSocket/SSE
  useEffect(() => {
    const mockNotifications: LiveNotification[] = [
      {
        id: 'notif1',
        type: 'order_update',
        title: 'Order Status Updated',
        message: 'Your Ergonomic Office Chair is now in transit from China',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        orderId: 'order1',
        isRead: false,
        priority: 'high',
        icon: 'truck'
      },
      {
        id: 'notif2',
        type: 'message',
        title: 'New Message',
        message: 'Order processor replied to your inquiry about delivery',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        orderId: 'order1',
        isRead: false,
        priority: 'medium',
        icon: 'message'
      },
      {
        id: 'notif3',
        type: 'order_update',
        title: 'Order Purchased',
        message: 'We have successfully purchased your Mechanical Keyboard from the supplier',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        orderId: 'order2',
        isRead: true,
        priority: 'medium',
        icon: 'check'
      },
      {
        id: 'notif4',
        type: 'system',
        title: 'Account Verified',
        message: 'Congratulations! Your account has been successfully verified',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        priority: 'high',
        icon: 'check'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);

    // Simulate new notifications coming in
    const interval = setInterval(() => {
      const newNotification: LiveNotification = {
        id: `notif_${Date.now()}`,
        type: 'order_update',
        title: 'Live Update',
        message: `Your order status has been updated - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'medium',
        icon: 'package'
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
      setUnreadCount(prev => prev + 1);
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'truck': return <TruckIcon className="w-5 h-5" />;
      case 'package': return <PackageIcon className="w-5 h-5" />;
      case 'check': return <CheckCircleIcon className="w-5 h-5" />;
      case 'message': return <BellIcon className="w-5 h-5" />;
      default: return <BellIcon className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: LiveNotification) => {
    markAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
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

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600">
            <h3 className="text-lg font-semibold text-white">Live Updates</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors ${
                    !notification.isRead ? 'bg-cyan-500/5 border-l-4 border-l-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getIcon(notification.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.orderId && (
                        <p className="text-xs text-cyan-400 mt-1">
                          Order: {notification.orderId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-600 bg-gray-700/30">
            <button className="w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveNotifications;