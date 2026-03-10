import React, { useState, useRef } from 'react';
import {
    BellRing,
    Mail,
    Bell,
    Search,
    Check,
    User,
    Users,
    ShieldAlert,
    Briefcase,
    Clock,
    Save,
    X,
    ToggleLeft,
    ToggleRight,
    Settings,
    FileText,
    Smartphone,
    Zap,
    Play,
    Eye,
    Plus,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Info,
    ExternalLink,
    Shield,
    MailOpen,
    LayoutTemplate,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Indent,
    Link,
    Image,
    Paperclip,
    Smile,
    MousePointerClick,
    Type,
    Palette,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';

// --- Types ---
type NotificationType = 'Info' | 'Success' | 'Warning' | 'Error' | 'Critical' | 'Reminder';
type TriggerType = 'Event-Based' | 'Schedule-Based' | 'One-Time';

interface NotificationTemplate {
    emailSubject: string;
    emailBody: string;
    inAppTitle: string;
    inAppBody: string;
    // Advanced Config
    type: NotificationType;
    senderName: string;
    actionLabel?: string;
    actionUrl?: string;
}

interface NotificationRule {
    id: string;
    module: string;
    event: string;
    description: string;
    triggerType: TriggerType; // Added Trigger Type
    recipientRoles: string[]; // Role IDs
    inAppEnabled: boolean;
    emailEnabled: boolean;
    template: NotificationTemplate;
}

const ROLES = [
    { id: 'Superadmin', name: 'Superadmin' },
    { id: 'HR Admin', name: 'HR Admin' },
    { id: 'HR Payroll Personnel', name: 'Payroll' },
    { id: 'HR Attendance Personnel', name: 'Attendance' },
    { id: 'Approver', name: 'Approver' },
    { id: 'Employee', name: 'Employee (Self)' },
    { id: 'HR Recruiter', name: 'Recruiter' },
];

const MODULES = ['Core HR', 'Time & Attendance', 'Payroll', 'System', 'Recruitment', 'Performance'];

const DEFAULT_TEMPLATE: NotificationTemplate = {
    emailSubject: '',
    emailBody: '',
    inAppTitle: '',
    inAppBody: '',
    type: 'Info',
    senderName: 'System Bot',
    actionLabel: 'View Details',
    actionUrl: '/dashboard'
};

const INITIAL_RULES: NotificationRule[] = [
    // Core HR
    {
        id: 'hr-1',
        module: 'Core HR',
        event: 'New Employee Created',
        triggerType: 'Event-Based',
        description: 'When a new employee profile is added to the system.',
        recipientRoles: ['Superadmin', 'HR Admin', 'HR Recruiter'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Welcome to the team, {{employee_name}}!',
            emailBody: 'Dear Team,\n\nPlease welcome {{employee_name}} to the {{department}} department as our new {{position}}.\n\nBest,\nHR Team',
            inAppTitle: 'New Hire: {{employee_name}}',
            inAppBody: '{{employee_name}} has joined the {{department}} team.',
            type: 'Success',
            senderName: 'HR System',
            actionLabel: 'View Profile',
            actionUrl: '/manage/employee'
        }
    },
    {
        id: 'hr-2',
        module: 'Core HR',
        event: 'Profile Update Request',
        triggerType: 'Event-Based',
        description: 'When an employee requests an update to their personal details.',
        recipientRoles: ['HR Admin'],
        inAppEnabled: true,
        emailEnabled: false,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Profile Update Request: {{employee_name}}',
            emailBody: '{{employee_name}} has requested changes to their profile.\n\nPlease review in the dashboard.',
            inAppTitle: 'Profile Update Request',
            inAppBody: '{{employee_name}} requested a profile update.',
            type: 'Info',
            senderName: '{{employee_name}}',
            actionLabel: 'Review Request',
            actionUrl: '/manage/employee'
        }
    },

    {
        id: 'hr-3',
        module: 'Core HR',
        event: 'Probationary 5th Month Alert',
        triggerType: 'Schedule-Based',
        description: 'Notify HR admins when employees reach their 5th month of probation.',
        recipientRoles: ['HR Admin', 'Superadmin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Probationary Alert: 5th Month Reached',
            emailBody: 'Dear HR Team,\n\nThis is an automated alert that {{count}} employee(s) are now on their 5th month of probation.\n\nPlease review their performance for regularization or contract extension.\n\nBest,\nHRIS Automations',
            inAppTitle: 'Probationary Period Alert',
            inAppBody: '{{count}} employees are currently in their 5th month of probation.',
            type: 'Warning',
            senderName: 'HR System',
            actionLabel: 'Review Employees',
            actionUrl: '/manage/employees'
        }
    },

    // Time & Attendance
    {
        id: 'ta-1',
        module: 'Time & Attendance',
        event: 'Leave Request Submitted',
        triggerType: 'Event-Based',
        description: 'When an employee submits a leave request.',
        recipientRoles: ['Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Leave Request: {{employee_name}}',
            emailBody: '{{employee_name}} has filed a leave request for {{date}}.\nType: {{leave_type}}\nReason: {{reason}}',
            inAppTitle: 'Leave Request Received',
            inAppBody: '{{employee_name}} - {{leave_type}} ({{date}})',
            type: 'Warning',
            senderName: 'Timekeeping Bot',
            actionLabel: 'Approve/Reject',
            actionUrl: '/monitor/approvals'
        }
    },
    {
        id: 'ta-2',
        module: 'Time & Attendance',
        event: 'Leave Request Approved/Rejected',
        triggerType: 'Event-Based',
        description: 'Notify the employee of the decision.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Leave Request Update',
            emailBody: 'Your leave request for {{date}} has been {{status}} by {{approver_name}}.',
            inAppTitle: 'Leave Request {{status}}',
            inAppBody: 'Your request for {{date}} was {{status}}.',
            type: 'Success',
            senderName: '{{approver_name}}',
            actionLabel: 'View Schedule',
            actionUrl: '/manage/schedule'
        }
    },
    {
        id: 'ta-3',
        module: 'Time & Attendance',
        event: 'Leave Request Cancelled',
        triggerType: 'Event-Based',
        description: 'When an employee cancels a previously submitted leave request.',
        recipientRoles: ['Approver', 'HR Admin'],
        inAppEnabled: true,
        emailEnabled: false,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Leave Request Cancelled: {{employee_name}}',
            emailBody: '{{employee_name}} has cancelled their {{leave_type}} request for {{date}}.',
            inAppTitle: 'Leave Request Cancelled',
            inAppBody: '{{employee_name}} cancelled their {{leave_type}} request for {{date}}.',
            type: 'Warning',
            senderName: '{{employee_name}}',
            actionLabel: 'View Schedule',
            actionUrl: '/manage/schedule'
        }
    },
    {
        id: 'ta-4',
        module: 'Time & Attendance',
        event: 'Leave Request Modified',
        triggerType: 'Event-Based',
        description: 'When an employee updates a pending leave request.',
        recipientRoles: ['Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Leave Request Updated: {{employee_name}}',
            emailBody: '{{employee_name}} has modified their {{leave_type}} request.\n\nUpdated Date: {{date}}\nReason: {{reason}}',
            inAppTitle: 'Leave Request Modified',
            inAppBody: '{{employee_name}} updated their {{leave_type}} request for {{date}}.',
            type: 'Info',
            senderName: 'Timekeeping Bot',
            actionLabel: 'Review Request',
            actionUrl: '/monitor/approvals'
        }
    },
    {
        id: 'ta-5',
        module: 'Time & Attendance',
        event: 'Leave Request Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind the employee of an upcoming approved leave.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Upcoming Leave Reminder: {{date}}',
            emailBody: 'This is a reminder that your {{leave_type}} leave is scheduled for {{date}}.',
            inAppTitle: 'Upcoming Leave Reminder',
            inAppBody: 'Your {{leave_type}} leave starts on {{date}}.',
            type: 'Reminder',
            senderName: 'Timekeeping Bot',
            actionLabel: 'View Schedule',
            actionUrl: '/manage/schedule'
        }
    },
    {
        id: 'ta-6',
        module: 'Time & Attendance',
        event: 'Leave Balance Low Reminder',
        triggerType: 'Schedule-Based',
        description: 'Notify the employee when their leave balance is running low.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Low Leave Balance: {{leave_type}}',
            emailBody: 'Your {{leave_type}} balance is running low. Please plan accordingly.',
            inAppTitle: 'Low Leave Balance',
            inAppBody: 'Your {{leave_type}} balance is running low.',
            type: 'Warning',
            senderName: 'HR System',
            actionLabel: 'View Leave Balances',
            actionUrl: '/manage/leave-balances'
        }
    },
    {
        id: 'ta-7',
        module: 'Time & Attendance',
        event: 'Leave Balance Fully Consumed',
        triggerType: 'Event-Based',
        description: 'Notify the employee when a leave type balance reaches zero.',
        recipientRoles: ['Employee', 'HR Admin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Leave Balance Fully Used: {{leave_type}}',
            emailBody: 'Your {{leave_type}} leave balance has been fully consumed for the period {{period}}.',
            inAppTitle: 'Leave Balance Exhausted',
            inAppBody: 'Your {{leave_type}} balance is now at zero.',
            type: 'Error',
            senderName: 'HR System',
            actionLabel: 'View Leave Balances',
            actionUrl: '/manage/leave-balances'
        }
    },
    {
        id: 'ta-8',
        module: 'Time & Attendance',
        event: 'Employee Clocked In/Out',
        triggerType: 'Event-Based',
        description: 'Log notification when an employee records a time entry.',
        recipientRoles: ['HR Attendance Personnel'],
        inAppEnabled: true,
        emailEnabled: false,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Time Entry Recorded: {{employee_name}}',
            emailBody: '{{employee_name}} clocked in/out on {{date}}.',
            inAppTitle: 'Time Entry: {{employee_name}}',
            inAppBody: '{{employee_name}} recorded a time entry on {{date}}.',
            type: 'Info',
            senderName: 'Timekeeping Bot',
            actionLabel: 'View Attendance',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-9',
        module: 'Time & Attendance',
        event: 'Late Attendance Detected',
        triggerType: 'Event-Based',
        description: 'Alert when an employee clocks in past the scheduled start time.',
        recipientRoles: ['HR Attendance Personnel', 'Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Late Attendance: {{employee_name}} — {{date}}',
            emailBody: '{{employee_name}} was detected as late on {{date}}.\n\nDepartment: {{department}}',
            inAppTitle: 'Late Attendance: {{employee_name}}',
            inAppBody: '{{employee_name}} clocked in late on {{date}}.',
            type: 'Warning',
            senderName: 'Timekeeping Bot',
            actionLabel: 'View Record',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-10',
        module: 'Time & Attendance',
        event: 'Early Checkout Detected',
        triggerType: 'Event-Based',
        description: 'Alert when an employee clocks out before the scheduled end time.',
        recipientRoles: ['HR Attendance Personnel', 'Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Early Checkout: {{employee_name}} — {{date}}',
            emailBody: '{{employee_name}} checked out early on {{date}}.\n\nDepartment: {{department}}',
            inAppTitle: 'Early Checkout: {{employee_name}}',
            inAppBody: '{{employee_name}} checked out early on {{date}}.',
            type: 'Warning',
            senderName: 'Timekeeping Bot',
            actionLabel: 'View Record',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-11',
        module: 'Time & Attendance',
        event: 'Absence Detected',
        triggerType: 'Event-Based',
        description: 'Alert when an employee has no time log for a scheduled workday.',
        recipientRoles: ['HR Attendance Personnel', 'Approver', 'Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Absence Detected: {{employee_name}} — {{date}}',
            emailBody: '{{employee_name}} was recorded as absent on {{date}} with no approved leave.\n\nDepartment: {{department}}',
            inAppTitle: 'Absence Detected',
            inAppBody: '{{employee_name}} has no attendance record for {{date}}.',
            type: 'Error',
            senderName: 'Timekeeping Bot',
            actionLabel: 'View Attendance',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-12',
        module: 'Time & Attendance',
        event: 'Missing Time Log Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind the employee to log missing time entries.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Missing Time Log Reminder',
            emailBody: 'You have one or more missing time log entries for {{period}}. Please complete your timekeeping records.',
            inAppTitle: 'Missing Time Log',
            inAppBody: 'You have missing time entries for {{period}}.',
            type: 'Reminder',
            senderName: 'Timekeeping Bot',
            actionLabel: 'Update Time Logs',
            actionUrl: '/manage/schedule'
        }
    },
    {
        id: 'ta-13',
        module: 'Time & Attendance',
        event: 'Incomplete Attendance Record Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind HR Attendance Personnel of employees with incomplete records.',
        recipientRoles: ['HR Attendance Personnel'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Incomplete Attendance Records — {{period}}',
            emailBody: 'There are employees with incomplete attendance records for {{period}}. Please review and finalize.',
            inAppTitle: 'Incomplete Attendance Records',
            inAppBody: 'Employees have incomplete records for {{period}}.',
            type: 'Reminder',
            senderName: 'Timekeeping Bot',
            actionLabel: 'Review Attendance',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-14',
        module: 'Time & Attendance',
        event: 'Pending Leave Approval Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind approvers of leave requests still awaiting action.',
        recipientRoles: ['Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Pending Leave Approvals — Action Required',
            emailBody: 'You have pending leave requests awaiting your approval.\n\nPlease review them as soon as possible.',
            inAppTitle: 'Pending Leave Approvals',
            inAppBody: 'You have leave requests pending your review.',
            type: 'Reminder',
            senderName: 'HR System',
            actionLabel: 'Review Approvals',
            actionUrl: '/monitor/approvals'
        }
    },
    {
        id: 'ta-15',
        module: 'Time & Attendance',
        event: 'Leave Approval Overdue Reminder',
        triggerType: 'Schedule-Based',
        description: 'Alert HR when a leave request has not been acted on past its due date.',
        recipientRoles: ['HR Admin', 'Approver'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Overdue Leave Approval Alert',
            emailBody: 'One or more leave requests have exceeded their approval deadline and require immediate attention.',
            inAppTitle: 'Overdue Leave Approval',
            inAppBody: 'Leave requests are past their approval deadline.',
            type: 'Critical',
            senderName: 'HR System',
            actionLabel: 'Review Approvals',
            actionUrl: '/monitor/approvals'
        }
    },
    {
        id: 'ta-16',
        module: 'Time & Attendance',
        event: 'Attendance Correction Request Submitted',
        triggerType: 'Event-Based',
        description: 'When an employee submits a request to correct an attendance record.',
        recipientRoles: ['HR Attendance Personnel'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Attendance Correction Request: {{employee_name}}',
            emailBody: '{{employee_name}} has submitted an attendance correction request for {{date}}.\n\nReason: {{reason}}',
            inAppTitle: 'Correction Request: {{employee_name}}',
            inAppBody: '{{employee_name}} submitted an attendance correction for {{date}}.',
            type: 'Info',
            senderName: '{{employee_name}}',
            actionLabel: 'Review Correction',
            actionUrl: '/monitor/attendance'
        }
    },
    {
        id: 'ta-17',
        module: 'Time & Attendance',
        event: 'Attendance Correction Approved/Rejected',
        triggerType: 'Event-Based',
        description: 'Notify the employee of the decision on their correction request.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Attendance Correction {{status}}',
            emailBody: 'Your attendance correction request for {{date}} has been {{status}} by {{approver_name}}.',
            inAppTitle: 'Correction {{status}}',
            inAppBody: 'Your attendance correction for {{date}} was {{status}}.',
            type: 'Success',
            senderName: '{{approver_name}}',
            actionLabel: 'View Attendance',
            actionUrl: '/monitor/attendance'
        }
    },

    // Payroll
    {
        id: 'pay-1',
        module: 'Payroll',
        event: 'Payslip Generated',
        triggerType: 'Schedule-Based',
        description: 'Notify employee when their payslip is ready.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Payslip Available: {{period}}',
            emailBody: 'Your payslip for {{period}} is now available. \n\nNet Pay: {{amount}}',
            inAppTitle: 'Payslip Generated',
            inAppBody: 'Your payslip for {{period}} is ready for viewing.',
            type: 'Success',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-2',
        module: 'Payroll',
        event: 'Payslip Available for Viewing',
        triggerType: 'Schedule-Based',
        description: 'Remind the employee that their payslip is available and ready to view.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Your Payslip Is Ready: {{period}}',
            emailBody: 'Your payslip for {{period}} is now available in the portal.\n\nNet Pay: {{amount}}\n\nPlease log in to view your payslip.',
            inAppTitle: 'Payslip Ready to View',
            inAppBody: 'Your payslip for {{period}} is available.',
            type: 'Success',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-3',
        module: 'Payroll',
        event: 'Payroll Processed Successfully',
        triggerType: 'Event-Based',
        description: 'Notify payroll staff when a payroll run is completed without errors.',
        recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Payroll Processed: {{period}}',
            emailBody: 'The payroll run for {{period}} has been completed successfully.\n\nTotal Payout: {{amount}}',
            inAppTitle: 'Payroll Run Complete',
            inAppBody: 'Payroll for {{period}} has been processed successfully.',
            type: 'Success',
            senderName: 'Payroll System',
            actionLabel: 'View Payroll',
            actionUrl: '/manage/payroll'
        }
    },
    {
        id: 'pay-4',
        module: 'Payroll',
        event: 'Payroll Processing Failed Alert',
        triggerType: 'Event-Based',
        description: 'Alert payroll staff when a payroll run encounters a critical error.',
        recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Payroll Processing Failed: {{period}}',
            emailBody: 'The payroll run for {{period}} has failed and requires immediate attention.\n\nPlease review the payroll batch for errors.',
            inAppTitle: 'Payroll Processing Failed',
            inAppBody: 'The payroll run for {{period}} failed. Immediate action required.',
            type: 'Critical',
            senderName: 'Payroll System',
            actionLabel: 'View Payroll',
            actionUrl: '/manage/payroll'
        }
    },
    {
        id: 'pay-5',
        module: 'Payroll',
        event: 'Salary Updated Notification',
        triggerType: 'Event-Based',
        description: 'Notify the employee and payroll staff when a base salary is updated.',
        recipientRoles: ['Employee', 'HR Payroll Personnel'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Salary Update Notice',
            emailBody: 'Your base salary has been updated effective {{date}}.\n\nNew Amount: {{amount}}\n\nPlease contact HR if you have any questions.',
            inAppTitle: 'Salary Updated',
            inAppBody: 'Your salary has been updated effective {{date}}.',
            type: 'Info',
            senderName: 'Payroll System',
            actionLabel: 'View Details',
            actionUrl: '/manage/payroll'
        }
    },
    {
        id: 'pay-6',
        module: 'Payroll',
        event: 'Allowance Added or Updated',
        triggerType: 'Event-Based',
        description: 'Notify the employee when an allowance is added or updated in their pay structure.',
        recipientRoles: ['Employee', 'HR Payroll Personnel'],
        inAppEnabled: true,
        emailEnabled: false,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Allowance Update Notice',
            emailBody: 'An allowance has been added to or updated in your pay structure effective {{date}}.',
            inAppTitle: 'Allowance Updated',
            inAppBody: 'An allowance in your pay structure was updated.',
            type: 'Info',
            senderName: 'Payroll System',
            actionLabel: 'View Pay Structure',
            actionUrl: '/manage/payroll'
        }
    },
    {
        id: 'pay-7',
        module: 'Payroll',
        event: 'Deduction Applied Notification',
        triggerType: 'Event-Based',
        description: 'Notify the employee when a deduction is applied to their payroll.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: false,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Payroll Deduction Applied',
            emailBody: 'A deduction of {{amount}} has been applied to your payroll for {{period}}.',
            inAppTitle: 'Deduction Applied',
            inAppBody: 'A deduction of {{amount}} was applied for {{period}}.',
            type: 'Warning',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-8',
        module: 'Payroll',
        event: 'Bonus Added Notification',
        triggerType: 'Event-Based',
        description: 'Notify the employee when a bonus is added to their payroll.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Bonus Added to Your Payroll',
            emailBody: 'A bonus of {{amount}} has been added to your payroll for {{period}}.',
            inAppTitle: 'Bonus Added',
            inAppBody: 'A bonus of {{amount}} was added for {{period}}.',
            type: 'Success',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-9',
        module: 'Payroll',
        event: 'Incentive Added Notification',
        triggerType: 'Event-Based',
        description: 'Notify the employee when an incentive is credited to their payroll.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Incentive Added to Your Payroll',
            emailBody: 'An incentive of {{amount}} has been added to your payroll for {{period}}.',
            inAppTitle: 'Incentive Added',
            inAppBody: 'An incentive of {{amount}} was added for {{period}}.',
            type: 'Success',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-10',
        module: 'Payroll',
        event: 'Payslip Viewing Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind employees who have not yet opened their payslip.',
        recipientRoles: ['Employee'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Reminder: View Your Payslip for {{period}}',
            emailBody: 'Your payslip for {{period}} is still unread. Please log in to review your payslip.',
            inAppTitle: 'Payslip Unread Reminder',
            inAppBody: 'You have not yet viewed your payslip for {{period}}.',
            type: 'Reminder',
            senderName: 'Payroll System',
            actionLabel: 'View Payslip',
            actionUrl: '/my-profile'
        }
    },
    {
        id: 'pay-11',
        module: 'Payroll',
        event: 'Missing Payroll Information Reminder',
        triggerType: 'Schedule-Based',
        description: 'Alert payroll staff of employees with incomplete payroll data.',
        recipientRoles: ['HR Payroll Personnel'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Missing Payroll Information — Action Required',
            emailBody: 'One or more employees have missing payroll information for {{period}}. Please review and complete the data before processing.',
            inAppTitle: 'Incomplete Payroll Data',
            inAppBody: 'Employees have missing payroll info for {{period}}.',
            type: 'Warning',
            senderName: 'Payroll System',
            actionLabel: 'View Payroll',
            actionUrl: '/manage/payroll'
        }
    },
    {
        id: 'pay-12',
        module: 'Payroll',
        event: 'Bank Details Missing Reminder',
        triggerType: 'Schedule-Based',
        description: 'Remind employees and payroll staff when bank details are not on file.',
        recipientRoles: ['Employee', 'HR Payroll Personnel'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Action Required: Bank Details Missing',
            emailBody: 'Your bank details are missing from the system. Please update your bank information to ensure timely salary disbursement.',
            inAppTitle: 'Bank Details Required',
            inAppBody: 'Your bank details are missing. Please update to receive your salary.',
            type: 'Critical',
            senderName: 'Payroll System',
            actionLabel: 'Update Profile',
            actionUrl: '/manage/employee'
        }
    },
    {
        id: 'pay-13',
        module: 'Payroll',
        event: 'Bank Details Updated Notification',
        triggerType: 'Event-Based',
        description: 'Notify payroll staff when an employee updates their bank details.',
        recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Bank Details Updated: {{employee_name}}',
            emailBody: '{{employee_name}} has updated their bank details on {{date}}.\n\nPlease verify the information before the next payroll run.',
            inAppTitle: 'Bank Details Updated',
            inAppBody: '{{employee_name}} updated their bank details on {{date}}.',
            type: 'Warning',
            senderName: 'HR System',
            actionLabel: 'Verify Details',
            actionUrl: '/manage/employee'
        }
    },

    // System
    {
        id: 'sys-1',
        module: 'System',
        event: 'Security Alert',
        triggerType: 'Event-Based',
        description: 'Critical security events (e.g. failed logins).',
        recipientRoles: ['Superadmin'],
        inAppEnabled: true,
        emailEnabled: true,
        template: {
            ...DEFAULT_TEMPLATE,
            emailSubject: 'Security Alert: {{event_type}}',
            emailBody: 'A security event was detected: {{event_type}} on {{date}}.',
            inAppTitle: 'Security Alert',
            inAppBody: 'Critical: {{event_type}} detected.',
            type: 'Error',
            senderName: 'Security Watchdog',
            actionLabel: 'View Audit Logs',
            actionUrl: '/monitor/audit-logs'
        }
    },
  // Core HR
  { 
    id: 'hr-1', 
    module: 'Core HR', 
    event: 'New Employee Created', 
    triggerType: 'Event-Based',
    description: 'When a new employee profile is added to the system.', 
    recipientRoles: ['Superadmin', 'HR Admin', 'HR Recruiter'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Welcome to the team, {{employee_name}}!',
        emailBody: 'Dear Team,\n\nPlease welcome {{employee_name}} to the {{department}} department as our new {{position}}.\n\nBest,\nHR Team',
        inAppTitle: 'New Hire: {{employee_name}}',
        inAppBody: '{{employee_name}} has joined the {{department}} team.',
        type: 'Success',
        senderName: 'HR System',
        actionLabel: 'View Profile',
        actionUrl: '/manage/employee'
    }
  },
  { 
    id: 'hr-2', 
    module: 'Core HR', 
    event: 'Profile Update Request', 
    triggerType: 'Event-Based',
    description: 'When an employee requests an update to their personal details.', 
    recipientRoles: ['HR Admin'], 
    inAppEnabled: true, 
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Profile Update Request: {{employee_name}}',
        emailBody: '{{employee_name}} has requested changes to their profile.\n\nPlease review in the dashboard.',
        inAppTitle: 'Profile Update Request',
        inAppBody: '{{employee_name}} requested a profile update.',
        type: 'Info',
        senderName: '{{employee_name}}',
        actionLabel: 'Review Request',
        actionUrl: '/manage/employee'
    }
  },
    { 
    id: 'hr-3', 
    module: 'Core HR', 
    event: 'Profile Update Approved', 
    triggerType: 'Event-Based',
    description: 'Notify the employee when their profile update request is approved.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Your profile update has been approved',
        emailBody: 'Hi {{employee_name}},\n\nYour profile update request has been approved by {{approver_name}}.\n\nBest,\nHR Team',
        inAppTitle: 'Profile Update Approved',
        inAppBody: 'Your profile update request has been approved.',
        type: 'Success',
        senderName: '{{approver_name}}',
        actionLabel: 'View Profile',
        actionUrl: '/my-profile'
    }
  },
  { 
    id: 'hr-4', 
    module: 'Core HR', 
    event: 'Document Uploaded', 
    triggerType: 'Event-Based',
    description: 'When an employee uploads a new document to their profile.', 
    recipientRoles: ['HR Admin'], 
    inAppEnabled: true, 
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'New Document Uploaded: {{document_type}}',
        emailBody: '{{employee_name}} uploaded a new {{document_type}} to their profile.',
        inAppTitle: 'New Document Uploaded',
        inAppBody: '{{employee_name}} uploaded a new {{document_type}}.',
        type: 'Info',
        senderName: 'HR System',
        actionLabel: 'Review Documents',
        actionUrl: '/manage/employee'
    }
  },
  { 
    id: 'hr-5', 
    module: 'Core HR', 
    event: 'Probation Period Ending Reminder', 
    triggerType: 'Schedule-Based',
    description: 'Remind HR and managers when an employee’s probation period is about to end.', 
    recipientRoles: ['HR Admin', 'Approver'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Probation Ending: {{employee_name}}',
        emailBody: 'Probation for {{employee_name}} will end on {{date}}. Please prepare for evaluation.',
        inAppTitle: 'Probation Ending Soon',
        inAppBody: 'Probation for {{employee_name}} ends on {{date}}.',
        type: 'Reminder',
        senderName: 'HR System',
        actionLabel: 'View Employee',
        actionUrl: '/manage/employee'
    }
  },
  
  // Time & Attendance
  { 
    id: 'ta-1', 
    module: 'Time & Attendance', 
    event: 'Leave Request Submitted', 
    triggerType: 'Event-Based',
    description: 'When an employee submits a leave request.', 
    recipientRoles: ['Approver'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Leave Request: {{employee_name}}',
        emailBody: '{{employee_name}} has filed a leave request for {{date}}.\nType: {{leave_type}}\nReason: {{reason}}',
        inAppTitle: 'Leave Request Received',
        inAppBody: '{{employee_name}} - {{leave_type}} ({{date}})',
        type: 'Warning',
        senderName: 'Timekeeping Bot',
        actionLabel: 'Approve/Reject',
        actionUrl: '/monitor/approvals'
    }
  },
  { 
    id: 'ta-2', 
    module: 'Time & Attendance', 
    event: 'Leave Request Approved/Rejected', 
    triggerType: 'Event-Based',
    description: 'Notify the employee of the decision.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Leave Request Update',
        emailBody: 'Your leave request for {{date}} has been {{status}} by {{approver_name}}.',
        inAppTitle: 'Leave Request {{status}}',
        inAppBody: 'Your request for {{date}} was {{status}}.',
        type: 'Success',
        senderName: '{{approver_name}}',
        actionLabel: 'View Schedule',
        actionUrl: '/manage/schedule'
    }
  },
  {
    id: 'ta-3',
    module: 'Time & Attendance',
    event: 'Leave Request Cancelled',
    triggerType: 'Event-Based',
    description: 'When an employee cancels a previously submitted leave request.',
    recipientRoles: ['Approver', 'HR Admin'],
    inAppEnabled: true,
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Leave Request Cancelled: {{employee_name}}',
        emailBody: '{{employee_name}} has cancelled their {{leave_type}} request for {{date}}.',
        inAppTitle: 'Leave Request Cancelled',
        inAppBody: '{{employee_name}} cancelled their {{leave_type}} request for {{date}}.',
        type: 'Warning',
        senderName: '{{employee_name}}',
        actionLabel: 'View Schedule',
        actionUrl: '/manage/schedule'
    }
  },
  {
    id: 'ta-4',
    module: 'Time & Attendance',
    event: 'Leave Request Modified',
    triggerType: 'Event-Based',
    description: 'When an employee updates a pending leave request.',
    recipientRoles: ['Approver'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Leave Request Updated: {{employee_name}}',
        emailBody: '{{employee_name}} has modified their {{leave_type}} request.\n\nUpdated Date: {{date}}\nReason: {{reason}}',
        inAppTitle: 'Leave Request Modified',
        inAppBody: '{{employee_name}} updated their {{leave_type}} request for {{date}}.',
        type: 'Info',
        senderName: 'Timekeeping Bot',
        actionLabel: 'Review Request',
        actionUrl: '/monitor/approvals'
    }
  },
  {
    id: 'ta-5',
    module: 'Time & Attendance',
    event: 'Leave Request Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind the employee of an upcoming approved leave.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Upcoming Leave Reminder: {{date}}',
        emailBody: 'This is a reminder that your {{leave_type}} leave is scheduled for {{date}}.',
        inAppTitle: 'Upcoming Leave Reminder',
        inAppBody: 'Your {{leave_type}} leave starts on {{date}}.',
        type: 'Reminder',
        senderName: 'Timekeeping Bot',
        actionLabel: 'View Schedule',
        actionUrl: '/manage/schedule'
    }
  },
  {
    id: 'ta-6',
    module: 'Time & Attendance',
    event: 'Leave Balance Low Reminder',
    triggerType: 'Schedule-Based',
    description: 'Notify the employee when their leave balance is running low.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Low Leave Balance: {{leave_type}}',
        emailBody: 'Your {{leave_type}} balance is running low. Please plan accordingly.',
        inAppTitle: 'Low Leave Balance',
        inAppBody: 'Your {{leave_type}} balance is running low.',
        type: 'Warning',
        senderName: 'HR System',
        actionLabel: 'View Leave Balances',
        actionUrl: '/manage/leave-balances'
    }
  },
  {
    id: 'ta-7',
    module: 'Time & Attendance',
    event: 'Leave Balance Fully Consumed',
    triggerType: 'Event-Based',
    description: 'Notify the employee when a leave type balance reaches zero.',
    recipientRoles: ['Employee', 'HR Admin'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Leave Balance Fully Used: {{leave_type}}',
        emailBody: 'Your {{leave_type}} leave balance has been fully consumed for the period {{period}}.',
        inAppTitle: 'Leave Balance Exhausted',
        inAppBody: 'Your {{leave_type}} balance is now at zero.',
        type: 'Error',
        senderName: 'HR System',
        actionLabel: 'View Leave Balances',
        actionUrl: '/manage/leave-balances'
    }
  },
  {
    id: 'ta-8',
    module: 'Time & Attendance',
    event: 'Employee Clocked In/Out',
    triggerType: 'Event-Based',
    description: 'Log notification when an employee records a time entry.',
    recipientRoles: ['HR Attendance Personnel'],
    inAppEnabled: true,
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Time Entry Recorded: {{employee_name}}',
        emailBody: '{{employee_name}} clocked in/out on {{date}}.',
        inAppTitle: 'Time Entry: {{employee_name}}',
        inAppBody: '{{employee_name}} recorded a time entry on {{date}}.',
        type: 'Info',
        senderName: 'Timekeeping Bot',
        actionLabel: 'View Attendance',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-9',
    module: 'Time & Attendance',
    event: 'Late Attendance Detected',
    triggerType: 'Event-Based',
    description: 'Alert when an employee clocks in past the scheduled start time.',
    recipientRoles: ['HR Attendance Personnel', 'Approver'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Late Attendance: {{employee_name}} — {{date}}',
        emailBody: '{{employee_name}} was detected as late on {{date}}.\n\nDepartment: {{department}}',
        inAppTitle: 'Late Attendance: {{employee_name}}',
        inAppBody: '{{employee_name}} clocked in late on {{date}}.',
        type: 'Warning',
        senderName: 'Timekeeping Bot',
        actionLabel: 'View Record',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-10',
    module: 'Time & Attendance',
    event: 'Early Checkout Detected',
    triggerType: 'Event-Based',
    description: 'Alert when an employee clocks out before the scheduled end time.',
    recipientRoles: ['HR Attendance Personnel', 'Approver'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Early Checkout: {{employee_name}} — {{date}}',
        emailBody: '{{employee_name}} checked out early on {{date}}.\n\nDepartment: {{department}}',
        inAppTitle: 'Early Checkout: {{employee_name}}',
        inAppBody: '{{employee_name}} checked out early on {{date}}.',
        type: 'Warning',
        senderName: 'Timekeeping Bot',
        actionLabel: 'View Record',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-11',
    module: 'Time & Attendance',
    event: 'Absence Detected',
    triggerType: 'Event-Based',
    description: 'Alert when an employee has no time log for a scheduled workday.',
    recipientRoles: ['HR Attendance Personnel', 'Approver', 'Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Absence Detected: {{employee_name}} — {{date}}',
        emailBody: '{{employee_name}} was recorded as absent on {{date}} with no approved leave.\n\nDepartment: {{department}}',
        inAppTitle: 'Absence Detected',
        inAppBody: '{{employee_name}} has no attendance record for {{date}}.',
        type: 'Error',
        senderName: 'Timekeeping Bot',
        actionLabel: 'View Attendance',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-12',
    module: 'Time & Attendance',
    event: 'Missing Time Log Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind the employee to log missing time entries.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Missing Time Log Reminder',
        emailBody: 'You have one or more missing time log entries for {{period}}. Please complete your timekeeping records.',
        inAppTitle: 'Missing Time Log',
        inAppBody: 'You have missing time entries for {{period}}.',
        type: 'Reminder',
        senderName: 'Timekeeping Bot',
        actionLabel: 'Update Time Logs',
        actionUrl: '/manage/schedule'
    }
  },
  {
    id: 'ta-13',
    module: 'Time & Attendance',
    event: 'Incomplete Attendance Record Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind HR Attendance Personnel of employees with incomplete records.',
    recipientRoles: ['HR Attendance Personnel'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Incomplete Attendance Records — {{period}}',
        emailBody: 'There are employees with incomplete attendance records for {{period}}. Please review and finalize.',
        inAppTitle: 'Incomplete Attendance Records',
        inAppBody: 'Employees have incomplete records for {{period}}.',
        type: 'Reminder',
        senderName: 'Timekeeping Bot',
        actionLabel: 'Review Attendance',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-14',
    module: 'Time & Attendance',
    event: 'Pending Leave Approval Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind approvers of leave requests still awaiting action.',
    recipientRoles: ['Approver'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Pending Leave Approvals — Action Required',
        emailBody: 'You have pending leave requests awaiting your approval.\n\nPlease review them as soon as possible.',
        inAppTitle: 'Pending Leave Approvals',
        inAppBody: 'You have leave requests pending your review.',
        type: 'Reminder',
        senderName: 'HR System',
        actionLabel: 'Review Approvals',
        actionUrl: '/monitor/approvals'
    }
  },
  {
    id: 'ta-15',
    module: 'Time & Attendance',
    event: 'Leave Approval Overdue Reminder',
    triggerType: 'Schedule-Based',
    description: 'Alert HR when a leave request has not been acted on past its due date.',
    recipientRoles: ['HR Admin', 'Approver'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Overdue Leave Approval Alert',
        emailBody: 'One or more leave requests have exceeded their approval deadline and require immediate attention.',
        inAppTitle: 'Overdue Leave Approval',
        inAppBody: 'Leave requests are past their approval deadline.',
        type: 'Critical',
        senderName: 'HR System',
        actionLabel: 'Review Approvals',
        actionUrl: '/monitor/approvals'
    }
  },
  {
    id: 'ta-16',
    module: 'Time & Attendance',
    event: 'Attendance Correction Request Submitted',
    triggerType: 'Event-Based',
    description: 'When an employee submits a request to correct an attendance record.',
    recipientRoles: ['HR Attendance Personnel'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Attendance Correction Request: {{employee_name}}',
        emailBody: '{{employee_name}} has submitted an attendance correction request for {{date}}.\n\nReason: {{reason}}',
        inAppTitle: 'Correction Request: {{employee_name}}',
        inAppBody: '{{employee_name}} submitted an attendance correction for {{date}}.',
        type: 'Info',
        senderName: '{{employee_name}}',
        actionLabel: 'Review Correction',
        actionUrl: '/monitor/attendance'
    }
  },
  {
    id: 'ta-17',
    module: 'Time & Attendance',
    event: 'Attendance Correction Approved/Rejected',
    triggerType: 'Event-Based',
    description: 'Notify the employee of the decision on their correction request.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Attendance Correction {{status}}',
        emailBody: 'Your attendance correction request for {{date}} has been {{status}} by {{approver_name}}.',
        inAppTitle: 'Correction {{status}}',
        inAppBody: 'Your attendance correction for {{date}} was {{status}}.',
        type: 'Success',
        senderName: '{{approver_name}}',
        actionLabel: 'View Attendance',
        actionUrl: '/monitor/attendance'
    }
  },
  
  // Payroll
  { 
    id: 'pay-1', 
    module: 'Payroll', 
    event: 'Payslip Generated', 
    triggerType: 'Schedule-Based',
    description: 'Notify employee when their payslip is ready.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Payslip Available: {{period}}',
        emailBody: 'Your payslip for {{period}} is now available. \n\nNet Pay: {{amount}}',
        inAppTitle: 'Payslip Generated',
        inAppBody: 'Your payslip for {{period}} is ready for viewing.',
        type: 'Success',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-2',
    module: 'Payroll',
    event: 'Payslip Available for Viewing',
    triggerType: 'Schedule-Based',
    description: 'Remind the employee that their payslip is available and ready to view.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Your Payslip Is Ready: {{period}}',
        emailBody: 'Your payslip for {{period}} is now available in the portal.\n\nNet Pay: {{amount}}\n\nPlease log in to view your payslip.',
        inAppTitle: 'Payslip Ready to View',
        inAppBody: 'Your payslip for {{period}} is available.',
        type: 'Success',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-3',
    module: 'Payroll',
    event: 'Payroll Processed Successfully',
    triggerType: 'Event-Based',
    description: 'Notify payroll staff when a payroll run is completed without errors.',
    recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Payroll Processed: {{period}}',
        emailBody: 'The payroll run for {{period}} has been completed successfully.\n\nTotal Payout: {{amount}}',
        inAppTitle: 'Payroll Run Complete',
        inAppBody: 'Payroll for {{period}} has been processed successfully.',
        type: 'Success',
        senderName: 'Payroll System',
        actionLabel: 'View Payroll',
        actionUrl: '/manage/payroll'
    }
  },
  {
    id: 'pay-4',
    module: 'Payroll',
    event: 'Payroll Processing Failed Alert',
    triggerType: 'Event-Based',
    description: 'Alert payroll staff when a payroll run encounters a critical error.',
    recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Payroll Processing Failed: {{period}}',
        emailBody: 'The payroll run for {{period}} has failed and requires immediate attention.\n\nPlease review the payroll batch for errors.',
        inAppTitle: 'Payroll Processing Failed',
        inAppBody: 'The payroll run for {{period}} failed. Immediate action required.',
        type: 'Critical',
        senderName: 'Payroll System',
        actionLabel: 'View Payroll',
        actionUrl: '/manage/payroll'
    }
  },
  {
    id: 'pay-5',
    module: 'Payroll',
    event: 'Salary Updated Notification',
    triggerType: 'Event-Based',
    description: 'Notify the employee and payroll staff when a base salary is updated.',
    recipientRoles: ['Employee', 'HR Payroll Personnel'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Salary Update Notice',
        emailBody: 'Your base salary has been updated effective {{date}}.\n\nNew Amount: {{amount}}\n\nPlease contact HR if you have any questions.',
        inAppTitle: 'Salary Updated',
        inAppBody: 'Your salary has been updated effective {{date}}.',
        type: 'Info',
        senderName: 'Payroll System',
        actionLabel: 'View Details',
        actionUrl: '/manage/payroll'
    }
  },
  {
    id: 'pay-6',
    module: 'Payroll',
    event: 'Allowance Added or Updated',
    triggerType: 'Event-Based',
    description: 'Notify the employee when an allowance is added or updated in their pay structure.',
    recipientRoles: ['Employee', 'HR Payroll Personnel'],
    inAppEnabled: true,
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Allowance Update Notice',
        emailBody: 'An allowance has been added to or updated in your pay structure effective {{date}}.',
        inAppTitle: 'Allowance Updated',
        inAppBody: 'An allowance in your pay structure was updated.',
        type: 'Info',
        senderName: 'Payroll System',
        actionLabel: 'View Pay Structure',
        actionUrl: '/manage/payroll'
    }
  },
  {
    id: 'pay-7',
    module: 'Payroll',
    event: 'Deduction Applied Notification',
    triggerType: 'Event-Based',
    description: 'Notify the employee when a deduction is applied to their payroll.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: false,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Payroll Deduction Applied',
        emailBody: 'A deduction of {{amount}} has been applied to your payroll for {{period}}.',
        inAppTitle: 'Deduction Applied',
        inAppBody: 'A deduction of {{amount}} was applied for {{period}}.',
        type: 'Warning',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-8',
    module: 'Payroll',
    event: 'Bonus Added Notification',
    triggerType: 'Event-Based',
    description: 'Notify the employee when a bonus is added to their payroll.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Bonus Added to Your Payroll',
        emailBody: 'A bonus of {{amount}} has been added to your payroll for {{period}}.',
        inAppTitle: 'Bonus Added',
        inAppBody: 'A bonus of {{amount}} was added for {{period}}.',
        type: 'Success',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-9',
    module: 'Payroll',
    event: 'Incentive Added Notification',
    triggerType: 'Event-Based',
    description: 'Notify the employee when an incentive is credited to their payroll.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Incentive Added to Your Payroll',
        emailBody: 'An incentive of {{amount}} has been added to your payroll for {{period}}.',
        inAppTitle: 'Incentive Added',
        inAppBody: 'An incentive of {{amount}} was added for {{period}}.',
        type: 'Success',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-10',
    module: 'Payroll',
    event: 'Payslip Viewing Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind employees who have not yet opened their payslip.',
    recipientRoles: ['Employee'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Reminder: View Your Payslip for {{period}}',
        emailBody: 'Your payslip for {{period}} is still unread. Please log in to review your payslip.',
        inAppTitle: 'Payslip Unread Reminder',
        inAppBody: 'You have not yet viewed your payslip for {{period}}.',
        type: 'Reminder',
        senderName: 'Payroll System',
        actionLabel: 'View Payslip',
        actionUrl: '/my-profile'
    }
  },
  {
    id: 'pay-11',
    module: 'Payroll',
    event: 'Missing Payroll Information Reminder',
    triggerType: 'Schedule-Based',
    description: 'Alert payroll staff of employees with incomplete payroll data.',
    recipientRoles: ['HR Payroll Personnel'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Missing Payroll Information — Action Required',
        emailBody: 'One or more employees have missing payroll information for {{period}}. Please review and complete the data before processing.',
        inAppTitle: 'Incomplete Payroll Data',
        inAppBody: 'Employees have missing payroll info for {{period}}.',
        type: 'Warning',
        senderName: 'Payroll System',
        actionLabel: 'View Payroll',
        actionUrl: '/manage/payroll'
    }
  },
  {
    id: 'pay-12',
    module: 'Payroll',
    event: 'Bank Details Missing Reminder',
    triggerType: 'Schedule-Based',
    description: 'Remind employees and payroll staff when bank details are not on file.',
    recipientRoles: ['Employee', 'HR Payroll Personnel'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Action Required: Bank Details Missing',
        emailBody: 'Your bank details are missing from the system. Please update your bank information to ensure timely salary disbursement.',
        inAppTitle: 'Bank Details Required',
        inAppBody: 'Your bank details are missing. Please update to receive your salary.',
        type: 'Critical',
        senderName: 'Payroll System',
        actionLabel: 'Update Profile',
        actionUrl: '/manage/employee'
    }
  },
  {
    id: 'pay-13',
    module: 'Payroll',
    event: 'Bank Details Updated Notification',
    triggerType: 'Event-Based',
    description: 'Notify payroll staff when an employee updates their bank details.',
    recipientRoles: ['HR Payroll Personnel', 'Superadmin'],
    inAppEnabled: true,
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Bank Details Updated: {{employee_name}}',
        emailBody: '{{employee_name}} has updated their bank details on {{date}}.\n\nPlease verify the information before the next payroll run.',
        inAppTitle: 'Bank Details Updated',
        inAppBody: '{{employee_name}} updated their bank details on {{date}}.',
        type: 'Warning',
        senderName: 'HR System',
        actionLabel: 'Verify Details',
        actionUrl: '/manage/employee'
    }
  },
  
  // System
    { 
    id: 'sys-2', 
    module: 'System', 
    event: 'Suspicious Login Attempt', 
    triggerType: 'Event-Based',
    description: 'When a login attempt is detected from an unusual location or device.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Suspicious Login Attempt Detected',
        emailBody: 'We detected a suspicious login attempt on your account from {{location}} at {{date}}.',
        inAppTitle: 'Suspicious Login Attempt',
        inAppBody: 'Suspicious login attempt detected from {{location}}.',
        type: 'Warning',
        senderName: 'Security Watchdog',
        actionLabel: 'Review Activity',
        actionUrl: '/monitor/audit-logs'
    }
  },
  { 
    id: 'sys-3', 
    module: 'System', 
    event: 'Login from New Device', 
    triggerType: 'Event-Based',
    description: 'Notify user when their account is accessed from a new device.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'New Device Login Detected',
        emailBody: 'Your account was accessed from a new device: {{device_name}} on {{date}}.',
        inAppTitle: 'New Device Login',
        inAppBody: 'Your account was accessed from {{device_name}}.',
        type: 'Info',
        senderName: 'Security Watchdog',
        actionLabel: 'Manage Devices',
        actionUrl: '/monitor/security/devices'
    }
  },
  { 
    id: 'sys-4', 
    module: 'System', 
    event: 'Multiple Failed Login Attempts', 
    triggerType: 'Event-Based',
    description: 'When several failed login attempts occur in a short period.', 
    recipientRoles: ['Employee', 'Superadmin'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Multiple Failed Login Attempts',
        emailBody: 'We detected multiple failed login attempts on your account on {{date}}.',
        inAppTitle: 'Multiple Failed Login Attempts',
        inAppBody: 'Multiple failed login attempts were detected on your account.',
        type: 'Error',
        senderName: 'Security Watchdog',
        actionLabel: 'Secure Account',
        actionUrl: '/monitor/security'
    }
  },
  { 
    id: 'sys-5', 
    module: 'System', 
    event: 'Password Changed', 
    triggerType: 'Event-Based',
    description: 'Notify user when their password is updated.', 
    recipientRoles: ['Employee'], 
    inAppEnabled: true, 
    emailEnabled: true,
    template: {
        ...DEFAULT_TEMPLATE,
        emailSubject: 'Your Password Was Changed',
        emailBody: 'Your account password was successfully changed on {{date}}. If this was not you, contact support immediately.',
        inAppTitle: 'Password Changed',
        inAppBody: 'Your password has been successfully updated.',
        type: 'Success',
        senderName: 'Security Watchdog',
        actionLabel: 'Review Security Settings',
        actionUrl: '/my-profile'
    }
  },
];

const DATA_VARIABLES = [
    { label: 'Employee Name', key: 'employee_name', mock: 'John Doe' },
    { label: 'Position', key: 'position', mock: 'Senior Developer' },
    { label: 'Department', key: 'department', mock: 'IT Department' },
    { label: 'Manager Name', key: 'manager_name', mock: 'Sarah Wilson' },
    { label: 'Approver Name', key: 'approver_name', mock: 'Alex Thompson' },
    { label: 'Date', key: 'date', mock: 'Aug 24, 2025' },
    { label: 'Period', key: 'period', mock: 'Aug 1-15, 2025' },
    { label: 'Status', key: 'status', mock: 'Approved' },
    { label: 'Amount', key: 'amount', mock: '₱ 25,000.00' },
    { label: 'Leave Type', key: 'leave_type', mock: 'Vacation Leave' },
    { label: 'Reason', key: 'reason', mock: 'Personal matters' },
    { label: 'Event Type', key: 'event_type', mock: 'Multiple Failed Logins' },
];

const NotificationSettings: React.FC = () => {
    const [rules, setRules] = useState<NotificationRule[]>(INITIAL_RULES);
    const [searchTerm, setSearchTerm] = useState('');

    // Role Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeRuleId, setActiveRuleId] = useState<string | null>(null);
    const [tempRoles, setTempRoles] = useState<string[]>([]);

    // Template Modal State
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templateForm, setTemplateForm] = useState<NotificationTemplate>(DEFAULT_TEMPLATE);
    const [templateConfig, setTemplateConfig] = useState<{ trigger: TriggerType, module: string }>({ trigger: 'Event-Based', module: 'System' });
    const [templateTab, setTemplateTab] = useState<'email' | 'inapp'>('email');
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [focusedField, setFocusedField] = useState<keyof NotificationTemplate>('emailBody');

    const modules = Array.from(new Set(rules.map(r => r.module))) as string[];

    // --- Handlers ---

    const handleToggleChannel = (id: string, channel: 'inAppEnabled' | 'emailEnabled') => {
        setRules(rules.map(r => r.id === id ? { ...r, [channel]: !r[channel] } : r));
    };

    const openRoleModal = (rule: NotificationRule) => {
        setActiveRuleId(rule.id);
        setTempRoles([...rule.recipientRoles]);
        setIsModalOpen(true);
    };

    const openTemplateModal = (rule: NotificationRule) => {
        setActiveRuleId(rule.id);
        setTemplateForm({ ...rule.template });
        setTemplateConfig({ trigger: rule.triggerType, module: rule.module });
        setIsTemplateModalOpen(true);
        setIsSimulationMode(false);
    };

    const handleSaveRoles = () => {
        if (activeRuleId) {
            setRules(rules.map(r => r.id === activeRuleId ? { ...r, recipientRoles: tempRoles } : r));
        }
        setIsModalOpen(false);
        setActiveRuleId(null);
    };

    const handleSaveTemplate = () => {
        if (activeRuleId) {
            setRules(rules.map(r => r.id === activeRuleId ? {
                ...r,
                template: templateForm,
                triggerType: templateConfig.trigger,
                module: templateConfig.module
            } : r));
        }
        setIsTemplateModalOpen(false);
        setActiveRuleId(null);
    };

    const toggleRoleSelection = (roleId: string) => {
        if (tempRoles.includes(roleId)) {
            setTempRoles(tempRoles.filter(id => id !== roleId));
        } else {
            setTempRoles([...tempRoles, roleId]);
        }
    };

    const insertVariable = (key: string) => {
        const field = focusedField;
        const currentValue = templateForm[field];
        const newValue = currentValue + ` {{${key}}} `;
        setTemplateForm({ ...templateForm, [field]: newValue });
    };

    const getSimulatedText = (text: string) => {
        let simulated = text || '';
        DATA_VARIABLES.forEach(v => {
            const regex = new RegExp(`{{${v.key}}}`, 'g');
            simulated = simulated.replace(regex, v.mock);
        });
        return simulated;
    };

    const getModuleIcon = (module: string) => {
        switch (module) {
            case 'Core HR': return <Users size={18} />;
            case 'Payroll': return <Briefcase size={18} />;
            case 'Time & Attendance': return <Clock size={18} />;
            case 'System': return <ShieldAlert size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getTypeStyles = (type: NotificationType) => {
        switch (type) {
            case 'Success': return { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 className="text-emerald-600" size={24} />, text: 'text-emerald-800' };
            case 'Warning': return { bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertCircle className="text-amber-600" size={24} />, text: 'text-amber-800' };
            case 'Error': return { bg: 'bg-rose-50', border: 'border-rose-100', icon: <XCircle className="text-rose-600" size={24} />, text: 'text-rose-800' };
            case 'Critical': return { bg: 'bg-rose-100', border: 'border-rose-200', icon: <ShieldAlert className="text-rose-700" size={24} />, text: 'text-rose-900' };
            case 'Reminder': return { bg: 'bg-purple-50', border: 'border-purple-100', icon: <Clock className="text-purple-600" size={24} />, text: 'text-purple-800' };
            default: return { bg: 'bg-blue-50', border: 'border-blue-100', icon: <Info className="text-blue-600" size={24} />, text: 'text-blue-800' };
        }
    };

    const filteredRules = rules.filter(r =>
        r.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.module.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeRule = rules.find(r => r.id === activeRuleId);

    // --- Toolbar Component ---
    const Toolbar = () => (
        <div className="border-b border-slate-100 bg-slate-50 px-2 py-2 flex flex-col gap-2 rounded-t-xl select-none">
            {/* Ribbon 1: Formatting */}
            <div className="flex items-center gap-1 flex-wrap">
                <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Bold"><Bold size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Italic"><Italic size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600" title="Underline"><Underline size={14} /></button>
                </div>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 shadow-sm px-2 py-1">
                    <Type size={14} className="text-slate-400" />
                    <select className="bg-transparent text-xs font-bold text-slate-600 outline-none w-20 cursor-pointer">
                        <option>Inter</option>
                        <option>Arial</option>
                        <option>Serif</option>
                    </select>
                </div>

                <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 shadow-sm px-2 py-1">
                    <select className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer">
                        <option>12</option>
                        <option>14</option>
                        <option>16</option>
                    </select>
                </div>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Align Left"><AlignLeft size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Align Center"><AlignCenter size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600" title="Align Right"><AlignRight size={14} /></button>
                </div>

                <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ml-1">
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Bullet List"><List size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-100" title="Numbered List"><ListOrdered size={14} /></button>
                    <button className="p-1.5 hover:bg-slate-50 text-slate-600" title="Indent"><Indent size={14} /></button>
                </div>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                <button className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-600" title="Text Color">
                    <Palette size={14} />
                </button>
            </div>

            {/* Ribbon 2: Insertions */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mr-1">Insert:</span>
                <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                    <Paperclip size={12} /> File
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                    <Link size={12} /> Link
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                    <Image size={12} /> Photo
                </button>
                <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                    <Smile size={12} /> Emoji
                </button>

                <div className="h-4 w-px bg-slate-300 mx-1"></div>

                <button className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-[10px] font-bold text-indigo-700 hover:bg-indigo-100 transition-colors">
                    <MousePointerClick size={12} /> Call-to-Action Button
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Notification Settings
                        <BellRing className="text-indigo-600" size={24} />
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Configure system alerts, recipient roles, and delivery templates.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-6">
                {modules.map(moduleName => {
                    const moduleRules = filteredRules.filter(r => r.module === moduleName);
                    if (moduleRules.length === 0) return null;

                    return (
                        <div key={moduleName} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 shadow-sm">
                                    {getModuleIcon(moduleName)}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{moduleName}</h3>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {moduleRules.map(rule => (
                                    <div key={rule.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50 transition-colors">

                                        {/* Event Info */}
                                        <div className="col-span-12 lg:col-span-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="font-bold text-slate-900 text-sm">{rule.event}</div>
                                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-bold uppercase">{rule.triggerType === 'Event-Based' ? 'Event' : rule.triggerType === 'Schedule-Based' ? 'Sched' : '1-Time'}</span>
                                            </div>
                                            <div className="text-xs text-slate-500">{rule.description}</div>
                                        </div>

                                        {/* Roles */}
                                        <div className="col-span-12 lg:col-span-4 cursor-pointer" onClick={() => openRoleModal(rule)}>
                                            <div className="flex flex-wrap gap-2">
                                                {rule.recipientRoles.length > 0 ? rule.recipientRoles.slice(0, 3).map(role => (
                                                    <span key={role} className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                                                        {role}
                                                    </span>
                                                )) : <span className="text-xs text-slate-400 italic">No recipients assigned</span>}
                                                {rule.recipientRoles.length > 3 && (
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">
                                                        +{rule.recipientRoles.length - 3}
                                                    </span>
                                                )}
                                                <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        {/* Toggles & Config */}
                                        <div className="col-span-12 lg:col-span-4 flex justify-end items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">In-App</span>
                                                    <button onClick={() => handleToggleChannel(rule.id, 'inAppEnabled')} className={`text-xl transition-colors ${rule.inAppEnabled ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                        {rule.inAppEnabled ? <ToggleRight /> : <ToggleLeft />}
                                                    </button>
                                                </div>
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Email</span>
                                                    <button onClick={() => handleToggleChannel(rule.id, 'emailEnabled')} className={`text-xl transition-colors ${rule.emailEnabled ? 'text-indigo-500' : 'text-slate-300'}`}>
                                                        {rule.emailEnabled ? <ToggleRight /> : <ToggleLeft />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-slate-200"></div>
                                            <button
                                                onClick={() => openTemplateModal(rule)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                title="Configure Template"
                                            >
                                                <Settings size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Role Selection Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Select Recipients</h3>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><User size={20} /></div>
                    </div>

                    <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-2">
                        {ROLES.map(role => (
                            <div
                                key={role.id}
                                onClick={() => toggleRoleSelection(role.id)}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${tempRoles.includes(role.id)
                                        ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <span className={`text-sm font-bold ${tempRoles.includes(role.id) ? 'text-indigo-900' : 'text-slate-700'}`}>{role.name}</span>
                                {tempRoles.includes(role.id) && <Check size={16} className="text-indigo-600" />}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveRoles} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                            Save Changes
                        </button>
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Template Configuration Modal */}
            <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} className="max-w-[1200px]">
                <div className="flex flex-col h-[800px] bg-white">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <LayoutTemplate size={20} className="text-indigo-600" />
                                Template Configuration
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Customize delivery format for: <span className="font-bold text-slate-700">{activeRule?.event}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-slate-200 p-1 rounded-lg">
                                <button
                                    onClick={() => { setTemplateTab('email'); setFocusedField('emailBody'); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${templateTab === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Mail size={14} /> Email
                                </button>
                                <button
                                    onClick={() => { setTemplateTab('inapp'); setFocusedField('inAppBody'); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${templateTab === 'inapp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Smartphone size={14} /> In-App
                                </button>
                            </div>
                            <button
                                onClick={() => setIsSimulationMode(!isSimulationMode)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSimulationMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            >
                                {isSimulationMode ? <Eye size={14} /> : <Play size={14} />} {isSimulationMode ? 'View Editor' : 'Simulate'}
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden">

                        {/* Variables Sidebar */}
                        {!isSimulationMode && (
                            <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <Zap size={14} className="text-amber-500" /> Data Variables
                                </div>
                                <div className="space-y-2 overflow-y-auto flex-1">
                                    {DATA_VARIABLES.map(v => (
                                        <button
                                            key={v.key}
                                            onClick={() => insertVariable(v.key)}
                                            className="w-full text-left p-2.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all group"
                                        >
                                            <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">{v.label}</div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{`{{${v.key}}}`}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-700">
                                    Click a variable to insert it into the active text field.
                                </div>
                            </div>
                        )}

                        {/* Editor / Simulation Area */}
                        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/20">

                            {isSimulationMode ? (
                                <div className="h-full flex flex-col items-center justify-center animate-in fade-in">
                                    <div className="w-full max-w-4xl">
                                        <div className="mb-6 text-center">
                                            <h4 className="text-lg font-bold text-slate-900 mb-1">Preview Mode</h4>
                                            <p className="text-xs text-slate-500">Simulating appearance with sample data.</p>
                                        </div>

                                        {templateTab === 'email' ? (
                                            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xl bg-white">
                                                <div className="bg-slate-100 border-b border-slate-200 p-4 flex justify-between items-center">
                                                    <div className="flex gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-medium">Mail Client</div>
                                                </div>
                                                <div className="p-8 min-h-[400px]">
                                                    <div className="border-b border-slate-100 pb-6 mb-8 space-y-3">
                                                        <h1 className="text-2xl font-bold text-slate-900">{getSimulatedText(templateForm.emailSubject)}</h1>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">HR</div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">HRIS System <span className="text-slate-400 font-normal">&lt;no-reply@company.com&gt;</span></p>
                                                                <p className="text-xs text-slate-400">To: {DATA_VARIABLES[0].mock}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-serif max-w-2xl">
                                                        {getSimulatedText(templateForm.emailBody)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // In-App Simulation replicating NotificationDetail.tsx
                                            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                                                {/* Left Col */}
                                                <div className="w-full md:w-72 bg-slate-50/50 border-r border-slate-100 p-6 flex flex-col gap-6">
                                                    {/* Status Card */}
                                                    <div className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 ${getTypeStyles(templateForm.type).bg} ${getTypeStyles(templateForm.type).border}`}>
                                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                                            {getTypeStyles(templateForm.type).icon}
                                                        </div>
                                                        <div>
                                                            <h2 className={`text-base font-bold ${getTypeStyles(templateForm.type).text}`}>{templateForm.type}</h2>
                                                            <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider">{activeRule?.module} Alert</p>
                                                        </div>
                                                    </div>

                                                    {/* Sender */}
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">From</h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-white shadow-sm bg-indigo-100 text-indigo-600">
                                                                <Shield size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900">{getSimulatedText(templateForm.senderName)}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">System Automated</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Metadata */}
                                                    <div className="space-y-3">
                                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Details</h4>
                                                        <div className="flex items-start gap-2">
                                                            <Clock size={14} className="text-slate-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-700">Received</p>
                                                                <p className="text-[10px] text-slate-500">Just Now</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <Briefcase size={14} className="text-slate-400 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs font-bold text-slate-700">Module</p>
                                                                <p className="text-[10px] text-slate-500">{activeRule?.module}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Col */}
                                                <div className="flex-1 p-8 flex flex-col">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <MailOpen size={16} className="text-indigo-500" />
                                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Message Contents</span>
                                                        </div>

                                                        <h1 className="text-xl font-extrabold text-slate-900 mb-6 leading-tight">{getSimulatedText(templateForm.inAppTitle)}</h1>

                                                        <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap">
                                                            {getSimulatedText(templateForm.inAppBody)}
                                                        </div>
                                                    </div>

                                                    {templateForm.actionLabel && (
                                                        <div className="mt-8 pt-6 border-t border-slate-100">
                                                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg w-fit">
                                                                {templateForm.actionLabel}
                                                                <ExternalLink size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">

                                    {/* --- Config Grid --- */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trigger Type</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                                value={templateConfig.trigger}
                                                onChange={(e) => setTemplateConfig({ ...templateConfig, trigger: e.target.value as TriggerType })}
                                            >
                                                <option value="Event-Based">Event-Based</option>
                                                <option value="Schedule-Based">Schedule-Based</option>
                                                <option value="One-Time">One-Time</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Module</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                                value={templateConfig.module}
                                                onChange={(e) => setTemplateConfig({ ...templateConfig, module: e.target.value })}
                                            >
                                                {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notification Severity</label>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                                                value={templateForm.type}
                                                onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value as NotificationType })}
                                            >
                                                <option value="Info">Info (Standard)</option>
                                                <option value="Success">Success (Positive)</option>
                                                <option value="Warning">Warning (Caution)</option>
                                                <option value="Error">Error (Alert)</option>
                                                <option value="Critical">Critical (High Priority)</option>
                                                <option value="Reminder">Reminder (Time-Sensitive)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* --- In-App Config --- */}
                                    {templateTab === 'inapp' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                                <div onClick={() => setFocusedField('inAppTitle')}>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notification Title</label>
                                                    <input
                                                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                        value={templateForm.inAppTitle}
                                                        onChange={(e) => setTemplateForm({ ...templateForm, inAppTitle: e.target.value })}
                                                        placeholder="Short title..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sender Name</label>
                                                    <input
                                                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                        value={templateForm.senderName}
                                                        onChange={(e) => setTemplateForm({ ...templateForm, senderName: e.target.value })}
                                                        placeholder="e.g. System Bot"
                                                    />
                                                </div>
                                            </div>

                                            <div onClick={() => setFocusedField('inAppBody')} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                                <Toolbar />
                                                <textarea
                                                    className="w-full bg-white p-4 text-sm font-medium text-slate-700 outline-none min-h-[200px] resize-none"
                                                    value={templateForm.inAppBody}
                                                    onChange={(e) => setTemplateForm({ ...templateForm, inAppBody: e.target.value })}
                                                    placeholder="Brief message displayed in the notification center..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Action Button Label (Optional)</label>
                                                    <input
                                                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                        value={templateForm.actionLabel || ''}
                                                        onChange={(e) => setTemplateForm({ ...templateForm, actionLabel: e.target.value })}
                                                        placeholder="e.g. View Details"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Action URL (Optional)</label>
                                                    <input
                                                        className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                        value={templateForm.actionUrl || ''}
                                                        onChange={(e) => setTemplateForm({ ...templateForm, actionUrl: e.target.value })}
                                                        placeholder="e.g. /dashboard"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* --- Email Config --- */}
                                    {templateTab === 'email' && (
                                        <>
                                            <div onClick={() => setFocusedField('emailSubject')}>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Subject</label>
                                                <input
                                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                                    value={templateForm.emailSubject}
                                                    onChange={(e) => setTemplateForm({ ...templateForm, emailSubject: e.target.value })}
                                                    placeholder="Enter email subject line..."
                                                />
                                            </div>
                                            <div onClick={() => setFocusedField('emailBody')} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                                <Toolbar />
                                                <textarea
                                                    className="w-full bg-white p-4 text-sm font-medium text-slate-700 outline-none min-h-[350px] leading-relaxed resize-none"
                                                    value={templateForm.emailBody}
                                                    onChange={(e) => setTemplateForm({ ...templateForm, emailBody: e.target.value })}
                                                    placeholder="Compose your email content here..."
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
                        <button onClick={() => setIsTemplateModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSaveTemplate} className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                            Save Template
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default NotificationSettings;