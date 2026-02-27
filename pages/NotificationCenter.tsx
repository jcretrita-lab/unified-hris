
import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  Filter,
  Trash2,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
}

// --- Mock Data ---
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Payslip Generated',
    message: 'Your payslip for the period Aug 01 - Aug 15 is now available for viewing.',
    timestamp: 'Just now',
    type: 'Success',
    isRead: false,
    link: '/my-profile' // In real app would link to payslip tab
  },
  {
    id: 'n2',
    title: 'Leave Request Approved',
    message: 'Your vacation leave request for Sep 20-22 has been approved by Alex Thompson.',
    timestamp: '2 hours ago',
    type: 'Success',
    isRead: false,
    link: '/manage/schedule'
  },
  {
    id: 'n3',
    title: 'Pending Approval Required',
    message: 'James Cordon has submitted an overtime request that requires your review.',
    timestamp: 'Yesterday, 4:30 PM',
    type: 'Warning',
    isRead: true,
    link: '/monitor/approvals'
  },
  {
    id: 'n4',
    title: 'System Maintenance',
    message: 'HRIS will be undergoing scheduled maintenance on Saturday, Aug 30 from 10 PM to 12 AM.',
    timestamp: 'Aug 24, 2025',
    type: 'Info',
    isRead: true
  },
  {
    id: 'n5',
    title: 'Attendance Discrepancy',
    message: 'You have a missing time-out record for Aug 22. Please file an ODTR.',
    timestamp: 'Aug 23, 2025',
    type: 'Error',
    isRead: true,
    link: '/monitor/attendance'
  }
];

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');
  const navigate = useNavigate();
  
  const filteredNotifications = notifications.filter(n => activeTab === 'All' ? true : !n.isRead);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (n: NotificationItem) => {
    if (!n.isRead) {
        setNotifications(notifications.map(item => item.id === n.id ? { ...item, isRead: true } : item));
    }
    navigate(`/monitor/notifications/${n.id}`);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch(type) {
        case 'Success': return <CheckCircle2 size={18} className="text-emerald-500" />;
        case 'Warning': return <AlertCircle size={18} className="text-amber-500" />;
        case 'Error': return <AlertCircle size={18} className="text-rose-500" />;
        default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch(type) {
        case 'Success': return 'bg-emerald-50 border-emerald-100';
        case 'Warning': return 'bg-amber-50 border-amber-100';
        case 'Error': return 'bg-rose-50 border-rose-100';
        default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-20">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Notification Center
                <div className="relative">
                    <Bell className="text-indigo-600" size={24} />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>}
                </div>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Stay updated with alerts, requests, and system messages.</p>
         </div>
         <button 
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
         >
            <Check size={16} /> Mark all as read
         </button>
       </div>

       <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-4 gap-6">
              {['All', 'Unread'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-sm font-bold transition-all relative ${
                        activeTab === tab 
                        ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                      {tab} {tab === 'Unread' && unreadCount > 0 && <span className="ml-1 bg-rose-50 text-rose-600 px-1.5 rounded text-[10px]">{unreadCount}</span>}
                  </button>
              ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2">
             {filteredNotifications.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                     <Inbox size={48} className="mb-4 opacity-20" />
                     <p className="text-sm font-medium">You're all caught up!</p>
                     <p className="text-xs">No {activeTab === 'Unread' ? 'unread' : ''} notifications to display.</p>
                 </div>
             ) : (
                 <div className="space-y-1">
                     <AnimatePresence>
                        {filteredNotifications.map((notification) => (
                            <motion.div 
                                key={notification.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-5 rounded-2xl border transition-all relative group cursor-pointer ${notification.isRead ? 'bg-white border-transparent hover:bg-slate-50' : 'bg-slate-50 border-slate-200 hover:border-indigo-200'}`}
                            >
                                <div className="flex gap-4 items-start">
                                    <div className={`p-3 rounded-xl shrink-0 ${getTypeStyles(notification.type)}`}>
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-sm font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{notification.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400">{notification.timestamp}</span>
                                        </div>
                                        <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${notification.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>{notification.message}</p>
                                        
                                        {notification.link && (
                                            <span className="inline-block mt-3 text-xs font-bold text-indigo-600 group-hover:underline">
                                                View Details →
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-slate-100">
                                        {!notification.isRead && (
                                            <button 
                                                onClick={(e) => markAsRead(notification.id, e)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                                title="Mark as Read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => deleteNotification(notification.id, e)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                {!notification.isRead && <div className="absolute top-5 right-5 w-2 h-2 bg-indigo-600 rounded-full"></div>}
                            </motion.div>
                        ))}
                     </AnimatePresence>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default NotificationCenter;
