
import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---
export type RequestStatus = 'Submitted' | 'Approved' | 'Rejected';
export type RequestType = 'Leave Request' | 'Shift Change';

export interface AppRequest {
    id: string;
    type: RequestType;
    status: RequestStatus;
    employeeId: string;
    employeeName: string;
    employeeRole: string;
    employeeAvatar: string;
    departmentName: string;
    managerName: string;
    submittedAt: string; // ISO string
    lastModifiedBy: string;
    dateModified: string;
    setupName: string;
    // Leave-specific
    leaveType?: string;
    leaveDates?: string[]; // formatted date strings
    leaveDateObjects?: number[];
    leaveCredits?: number;
    leaveBalanceAfter?: number;
    leaveReason?: string;
    leaveAttachment?: string;
    isPaid?: boolean; // Payment status for leave
    // Shift-specific
    shiftFromName?: string;
    shiftToId?: string;
    shiftToName?: string;
    shiftReason?: string;
    shiftChangeType?: 'Full Cutoff' | 'Single Day';
    shiftChangeDate?: string; // ISO date string for Single Day changes
    // Expiration fields
    expirationDate?: string; // ISO date string
    isExpired?: boolean;
    // Approval trail
    timeline: {
        id: number;
        title: string;
        description?: string;
        timestamp?: string;
        status: 'completed' | 'current' | 'pending';
    }[];
    // Rejection reason (if rejected)
    rejectionReason?: string;
}

// --- Initial seed data (so approver has something to see) ---
const SEED_REQUESTS: AppRequest[] = [
    {
        id: 'req-seed-001',
        type: 'Leave Request',
        status: 'Submitted',
        employeeId: 'emp-001',
        employeeName: 'Sarah Wilson',
        employeeRole: 'HR Manager',
        employeeAvatar: 'SW',
        departmentName: 'HR Department',
        managerName: 'Alex Thompson',
        submittedAt: '2025-09-05T10:09:07',
        lastModifiedBy: 'System',
        dateModified: '9/5/2025 10:09:07 AM',
        setupName: 'HR Leave Request',
        leaveType: 'Vacation Leave',
        leaveDates: ['September 22, 2025', 'September 23, 2025'],
        leaveDateObjects: [22, 23],
        leaveCredits: 2,
        leaveBalanceAfter: 3,
        leaveReason: 'I want to have a vacation with my family',
        leaveAttachment: 'flight_ticket.pdf',
        isPaid: true,
        timeline: [
            { id: 1, title: '1. Submit Leave', description: 'Submitted leave request', timestamp: 'September 5, 2025 10:09:07 AM', status: 'completed' },
            { id: 2, title: '2. Department Approval', description: 'Pending approval from Alex Thompson', timestamp: '', status: 'current' },
            { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
            { id: 4, title: '4. Application Result', description: 'Schedule will be updated', timestamp: '', status: 'pending' },
        ],
    },
    {
        id: 'req-seed-002',
        type: 'Shift Change',
        status: 'Submitted',
        employeeId: 'emp-002',
        employeeName: 'Louis Panganiban',
        employeeRole: 'Senior Developer',
        employeeAvatar: 'LP',
        departmentName: 'IT Department',
        managerName: 'Alex Thompson',
        submittedAt: '2025-10-10T08:30:00',
        lastModifiedBy: 'System',
        dateModified: '10/10/2025 8:30:00 AM',
        setupName: 'IT Shift Change',
        shiftFromName: 'Shift 8',
        shiftToId: '2',
        shiftToName: 'Sales Flexi Group',
        shiftChangeType: 'Full Cutoff',
        shiftReason: 'Requesting to move to Sales Flexi Group starting next cutoff due to personal transportation changes.',
        timeline: [
            { id: 1, title: '1. Submit Request', description: 'Submitted shift change request', timestamp: 'October 10, 2025 8:30:00 AM', status: 'completed' },
            { id: 2, title: '2. Department Approval', description: 'Pending approval from Alex Thompson', timestamp: '', status: 'current' },
            { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
            { id: 4, title: '4. Application Result', description: 'Shift assignment will be updated', timestamp: '', status: 'pending' },
        ],
    },
    {
        id: 'req-seed-003',
        type: 'Shift Change',
        status: 'Submitted',
        employeeId: 'emp-003',
        employeeName: 'Jane Smith',
        employeeRole: 'Junior Developer',
        employeeAvatar: 'JS',
        departmentName: 'IT Department',
        managerName: 'Alex Thompson',
        submittedAt: '2025-10-12T09:15:00',
        lastModifiedBy: 'System',
        dateModified: '10/12/2025 9:15:00 AM',
        setupName: 'IT Shift Change',
        shiftFromName: 'Standard Regular Shift',
        shiftToId: '4',
        shiftToName: 'NSWP',
        shiftChangeType: 'Single Day',
        shiftChangeDate: '2025-10-20',
        shiftReason: 'Need to switch to NSWP shift on October 20 for a medical appointment in the morning.',
        timeline: [
            { id: 1, title: '1. Submit Request', description: 'Submitted shift change request', timestamp: 'October 12, 2025 9:15:00 AM', status: 'completed' },
            { id: 2, title: '2. Department Approval', description: 'Pending approval from Alex Thompson', timestamp: '', status: 'current' },
            { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
            { id: 4, title: '4. Application Result', description: 'Shift assignment will be updated', timestamp: '', status: 'pending' },
        ],
    },
    {
        id: 'req-seed-004',
        type: 'Shift Change',
        status: 'Submitted',
        employeeId: 'emp-004',
        employeeName: 'Mike Brown',
        employeeRole: 'Payroll Specialist',
        employeeAvatar: 'MB',
        departmentName: 'Finance Department',
        managerName: 'Alex Thompson',
        submittedAt: '2025-09-01T10:00:00',
        lastModifiedBy: 'System',
        dateModified: '9/1/2025 10:00:00 AM',
        setupName: 'Finance Shift Change',
        shiftFromName: 'Standard Regular Shift',
        shiftToId: '2',
        shiftToName: 'Sales Flexi Group',
        shiftChangeType: 'Full Cutoff',
        shiftReason: 'Requesting flexible schedule to accommodate client meetings in different time zones.',
        expirationDate: '2025-09-05',
        isExpired: true,
        timeline: [
            { id: 1, title: '1. Submit Request', description: 'Submitted shift change request', timestamp: 'September 1, 2025 10:00:00 AM', status: 'completed' },
            { id: 2, title: '2. Department Approval', description: 'Expired — not approved in time', timestamp: '', status: 'current' },
            { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
            { id: 4, title: '4. Application Result', description: 'Shift assignment will be updated', timestamp: '', status: 'pending' },
        ],
    },
];

// --- Context Interface ---
interface RequestContextType {
    requests: AppRequest[];
    shiftRequestApprovalDeadlineDays: number;
    setShiftRequestApprovalDeadlineDays: (days: number) => void;
    submitLeaveRequest: (req: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => AppRequest;
    submitShiftRequest: (req: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => AppRequest;
    approveRequest: (id: string, approverName: string, isPaid?: boolean) => void;
    rejectRequest: (id: string, approverName: string, reason: string) => void;
    getRequestById: (id: string) => AppRequest | undefined;
    isRequestStillValid: (id: string) => boolean;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

// --- Provider ---
export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [requests, setRequests] = useState<AppRequest[]>(SEED_REQUESTS);
    const [shiftRequestApprovalDeadlineDays, setShiftRequestApprovalDeadlineDays] = useState(5);

    const now = () => {
        const d = new Date();
        return d.toLocaleDateString('en-US', {
            month: 'numeric', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
    };

    const submitLeaveRequest = (partial: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });

        const newReq: AppRequest = {
            ...partial,
            id: `req-${Date.now()}`,
            status: 'Submitted',
            lastModifiedBy: 'System',
            dateModified: now(),
            setupName: 'Employee Leave Request',
            timeline: [
                { id: 1, title: '1. Submit Leave', description: 'Leave request submitted by employee', timestamp, status: 'completed' },
                { id: 2, title: '2. Department Approval', description: `Pending approval from ${partial.managerName}`, timestamp: '', status: 'current' },
                { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
                { id: 4, title: '4. Application Result', description: 'Schedule will be updated upon approval', timestamp: '', status: 'pending' },
            ],
        };
        setRequests(prev => [newReq, ...prev]);
        return newReq;
    };

    const submitShiftRequest = (partial: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });

        // Compute expiration date based on deadline days
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + shiftRequestApprovalDeadlineDays);
        const expirationDate = expDate.toISOString().split('T')[0];

        const newReq: AppRequest = {
            ...partial,
            id: `req-${Date.now()}`,
            status: 'Submitted',
            lastModifiedBy: 'System',
            dateModified: now(),
            setupName: 'Employee Shift Change',
            expirationDate,
            isExpired: false,
            timeline: [
                { id: 1, title: '1. Submit Request', description: 'Shift change request submitted by employee', timestamp, status: 'completed' },
                { id: 2, title: '2. Department Approval', description: `Pending approval from ${partial.managerName}`, timestamp: '', status: 'current' },
                { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
                { id: 4, title: '4. Application Result', description: 'Shift assignment will be updated upon approval', timestamp: '', status: 'pending' },
            ],
        };
        setRequests(prev => [newReq, ...prev]);
        return newReq;
    };

    const approveRequest = (id: string, approverName: string, isPaid?: boolean) => {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
        setRequests(prev =>
            prev.map(r => {
                if (r.id !== id) return r;
                const payStatus = isPaid !== undefined ? (isPaid ? 'With Pay' : 'Without Pay') : '';
                return {
                    ...r,
                    status: 'Approved',
                    isPaid: isPaid !== undefined ? isPaid : r.isPaid,
                    lastModifiedBy: approverName,
                    dateModified: now(),
                    timeline: r.timeline.map(step => {
                        const baseDesc = r.type === 'Leave Request' && payStatus ? `Approved ${payStatus} by ${approverName}` : `Approved by ${approverName}`;
                        if (step.status === 'current') return { ...step, status: 'completed' as const, description: baseDesc, timestamp };
                        if (step.status === 'pending') {
                            // Cascade approvals
                            const isLast = step.id === r.timeline[r.timeline.length - 1].id;
                            return isLast
                                ? { ...step, status: 'completed' as const, description: 'Request applied — record updated', timestamp }
                                : { ...step, status: 'completed' as const, description: baseDesc, timestamp };
                        }
                        return step;
                    }),
                };
            })
        );
    };

    const rejectRequest = (id: string, approverName: string, reason: string) => {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
        setRequests(prev =>
            prev.map(r => {
                if (r.id !== id) return r;
                return {
                    ...r,
                    status: 'Rejected',
                    rejectionReason: reason,
                    lastModifiedBy: approverName,
                    dateModified: now(),
                    timeline: r.timeline.map(step =>
                        step.status === 'current'
                            ? { ...step, description: `Rejected by ${approverName}: ${reason}`, timestamp }
                            : step
                    ),
                };
            })
        );
    };

    const getRequestById = (id: string) => requests.find(r => r.id === id);

    const isRequestStillValid = (id: string): boolean => {
        const req = requests.find(r => r.id === id);
        if (!req) return false;
        if (req.isExpired) return false;
        if (!req.expirationDate) return true;
        return new Date() <= new Date(req.expirationDate + 'T23:59:59');
    };

    return (
        <RequestContext.Provider value={{ requests, shiftRequestApprovalDeadlineDays, setShiftRequestApprovalDeadlineDays, submitLeaveRequest, submitShiftRequest, approveRequest, rejectRequest, getRequestById, isRequestStillValid }}>
            {children}
        </RequestContext.Provider>
    );
};

export const useRequest = () => {
    const ctx = useContext(RequestContext);
    if (!ctx) throw new Error('useRequest must be used within a RequestProvider');
    return ctx;
};
