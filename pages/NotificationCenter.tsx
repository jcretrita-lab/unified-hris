
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
    id: 'n-cutoff-1',
    title: 'Cutoff Period Ended',
    message: "The current cutoff period has ended. Please review your attendance records and file any missing logs or adjustments for payroll.",
    timestamp: 'Just now',
    type: 'Warning',
    isRead: false,
    link: '/my-profile/attendance'
  },
  {
    id: 'n-bio-1',
    title: 'Biometric Records Uploaded',
    message: 'HR Administrator has uploaded the latest biometric records. These will now be applied to your attendance history.',
    timestamp: '10 minutes ago',
    type: 'Success',
    isRead: false,
    link: '/my-profile/attendance'
  },
  // Leave-related notifications
  {
    id: 'leave-1',
    title: 'Leave Request Approved',
    message: 'Your sick leave request for January 15-16, 2026 has been approved by your manager.',
    timestamp: 'Just now',
    type: 'Success',
    isRead: false,
    link: '/monitor/approvals'
  },
  {
    id: 'leave-2',
    title: 'Leave Request Rejected',
    message: 'Your vacation leave request for February 10-14, 2026 has been rejected. Reason: Conflict with project deadline.',
    timestamp: '1 hour ago',
    type: 'Error',
    isRead: false,
    link: '/monitor/approvals'
  },
  {
    id: 'leave-3',
    title: 'Leave Balance Low Warning',
    message: 'Your sick leave balance is running low. You have 2.5 days remaining for the year.',
    timestamp: '2 hours ago',
    type: 'Warning',
    isRead: false,
    link: '/manage/leave-balances'
  },
  {
    id: 'ta-1',
    title: 'Leave Request Pending Approval',
    message: 'Sarah Chen - Emergency Leave (Jan 12). Requires your immediate approval.',
    timestamp: '3 hours ago',
    type: 'Warning',
    isRead: false,
    link: '/monitor/approvals'
  },
  // Attendance alerts
  {
    id: 'att-1',
    title: 'Overtime Request Approved',
    message: 'Your overtime request for January 8, 2026 (4 hours) has been approved.',
    timestamp: '4 hours ago',
    type: 'Success',
    isRead: false,
    link: '/monitor/attendance'
  },
  {
    id: 'att-2',
    title: 'Missed Clock-Out',
    message: 'You forgot to clock out on January 9, 2026. Please submit a time adjustment request.',
    timestamp: '5 hours ago',
    type: 'Warning',
    isRead: false,
    link: '/monitor/attendance'
  },
  {
    id: 'att-3',
    title: 'Biometric Device Offline',
    message: 'The biometric attendance device in Building A is currently offline. Manual logging in effect.',
    timestamp: 'Yesterday',
    type: 'Warning',
    isRead: true,
    link: '/monitor/attendance'
  },
  // Payroll notifications
  {
    id: 'pay-1',
    title: 'Payslip Available',
    message: 'Your payslip for the period January 1-15, 2026 is now available for review.',
    timestamp: 'Yesterday',
    type: 'Info',
    isRead: true,
    link: '/manage/payroll'
  },
  {
    id: 'pay-2',
    title: 'Tax Certificate Ready',
    message: 'Your BIR Form 2316 (Certificate of Compensation Payment) for Year 2025 is ready for download.',
    timestamp: '2 days ago',
    type: 'Info',
    isRead: false,
    link: '/manage/payroll'
  },
  {
    id: 'pay-3',
    title: 'Deduction Adjustment',
    message: 'Your monthly SSS contribution has been adjusted per the new 2026 contribution table.',
    timestamp: '3 days ago',
    type: 'Info',
    isRead: true,
    link: '/manage/payroll'
  },
  // Employee profile updates
  {
    id: 'profile-1',
    title: 'Profile Update Request',
    message: 'James Rodriguez has requested an update to their emergency contact information.',
    timestamp: '6 hours ago',
    type: 'Info',
    isRead: false,
    link: '/manage/employee'
  },
  {
    id: 'profile-2',
    title: 'Document Expiring Soon',
    message: 'Your NBI clearance expires on February 28, 2026. Please renew to maintain active employment status.',
    timestamp: '1 day ago',
    type: 'Warning',
    isRead: false,
    link: '/my-profile'
  },
  // HR task reminders
  {
    id: 'hr-task-1',
    title: 'Performance Review Due',
    message: 'Performance evaluation for Marcus Villanueva is due in 5 days.',
    timestamp: '8 hours ago',
    type: 'Warning',
    isRead: false,
    link: '/manage/employee'
  },
  {
    id: 'hr-task-2',
    title: 'Contract Renewal Reminder',
    message: '3 employee contracts are expiring within the next 30 days. Review required.',
    timestamp: '1 day ago',
    type: 'Warning',
    isRead: false,
    link: '/manage/employee'
  },
  {
    id: 'hr-task-3',
    title: 'New Employee Onboarding',
    message: 'Emily Watson - New hire starting January 20, 2026. Onboarding tasks pending assignment.',
    timestamp: '2 days ago',
    type: 'Info',
    isRead: false,
    link: '/manage/employee/onboarding'
  },
  // System alerts related to HR processes
  {
    id: 'sys-2',
    title: 'System Maintenance Scheduled',
    message: 'HRIS will undergo scheduled maintenance on January 15, 2026 (Sunday) from 2:00 AM to 6:00 AM.',
    timestamp: '3 days ago',
    type: 'Info',
    isRead: true,
    link: '/settings/overview'
  },
  {
    id: 'sys-3',
    title: 'Data Backup Complete',
    message: 'Weekly system backup completed successfully. All employee data secured.',
    timestamp: '4 days ago',
    type: 'Success',
    isRead: true,
    link: '/settings/overview'
  },
  // Legacy notifications for backward compatibility
  {
    id: 'n13',
    title: 'Bank Details Required',
    message: 'Your bank details are missing. Please update to receive your salary.',
    timestamp: 'Just now',
    type: 'Error',
    isRead: false,
    link: '/manage/employee'
  },
  {
    id: 'n12',
    title: 'Salary Updated',
    message: 'Your salary has been updated effective Sep 01, 2025.',
    timestamp: '5 minutes ago',
    type: 'Info',
    isRead: false,
    link: '/manage/payroll'
  },
  {
    id: 'n11',
    title: 'Late Attendance',
    message: 'John Doe clocked in late on Aug 28, 2025.',
    timestamp: '30 minutes ago',
    type: 'Warning',
    isRead: false,
    link: '/monitor/attendance'
  },
  {
    id: 'n0',
    title: 'Probationary Period Alert',
    message: '12 employees are currently in their 5th month of probation. Please review for potential regularization or extension.',
    timestamp: '1 hour ago',
    type: 'Warning',
    isRead: false,
    link: '/manage/employees'
  },
  {
    id: 'hr-1',
    title: 'New Hire: Isabella Stewart',
    message: 'Isabella Stewart has joined the Engineering team as a Senior Frontend Developer.',
    timestamp: '2 hours ago',
    type: 'Success',
    isRead: false,
    link: '/manage/employee'
  },
  {
    id: 'pay-4',
    title: 'Payroll Processing Failed',
    message: 'The payroll run for Aug 15 - Aug 30 failed. Immediate action required.',
    timestamp: '5 hours ago',
    type: 'Error',
    isRead: false,
    link: '/manage/payroll'
  },
  {
    id: 'sys-1',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.102.',
    timestamp: 'Yesterday',
    type: 'Error',
    isRead: true,
    link: '/settings/security'
  },
  {
    id: 'pay-5',
    title: 'Salary Updated',
    message: 'Your salary has been updated effective Sep 01, 2025. Please review the details.',
    timestamp: 'Aug 24, 2025',
    type: 'Info',
    isRead: true,
    link: '/manage/payroll'
  },
  {
    id: 'ta-11',
    title: 'Absence Detected',
    message: 'David Miller has no attendance record for Aug 23, 2025.',
    timestamp: 'Aug 23, 2025',
    type: 'Error',
    isRead: true,
    link: '/monitor/attendance'
  },
  {
    id: 'n6',
    title: 'Profile Update Approved',
    message: 'Your profile update request has been approved by Alex Thompson.',
    timestamp: 'Today, 10:15 AM',
    type: 'Success',
    isRead: false,
    link: '/my-profile'
  },
  {
    id: 'n7',
    title: 'Probation Ending Soon',
    message: 'Your probation period will end on Sep 30, 2025. Please prepare for your evaluation.',
    timestamp: '2 days ago',
    type: 'Warning',
    isRead: true,
    link: '/my-profile/evaluations'
  },
  {
    id: 'n8',
    title: 'Suspicious Login Attempt',
    message: 'We detected a suspicious login attempt from Quezon City, Philippines.',
    timestamp: '1 hour ago',
    type: 'Warning',
    isRead: false,
    link: '/monitor/audit-logs'
  },
  {
    id: 'n9',
    title: 'New Device Login',
    message: 'Your account was accessed from a new device: Windows 11 - Chrome.',
    timestamp: 'Yesterday, 8:45 PM',
    type: 'Info',
    isRead: true,
    link: '/monitor/security/devices'
  },
  {
    id: 'n10',
    title: 'Multiple Failed Login Attempts',
    message: 'Multiple failed login attempts were detected on your account.',
    timestamp: 'Yesterday, 6:10 PM',
    type: 'Error',
    isRead: true,
    link: '/monitor/security'
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
    switch (type) {
      case 'Success': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'Warning': return <AlertCircle size={18} className="text-amber-500" />;
      case 'Error': return <AlertCircle size={18} className="text-rose-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
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
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab
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
