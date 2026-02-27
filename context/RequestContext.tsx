
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
    // Shift-specific
    shiftFromName?: string;
    shiftToId?: string;
    shiftToName?: string;
    shiftReason?: string;
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
        shiftReason: 'Requesting to move to Sales Flexi Group starting next cutoff due to personal transportation changes.',
        timeline: [
            { id: 1, title: '1. Submit Request', description: 'Submitted shift change request', timestamp: 'October 10, 2025 8:30:00 AM', status: 'completed' },
            { id: 2, title: '2. Department Approval', description: 'Pending approval from Alex Thompson', timestamp: '', status: 'current' },
            { id: 3, title: '3. HR Approval', description: 'Pending HR review', timestamp: '', status: 'pending' },
            { id: 4, title: '4. Application Result', description: 'Shift assignment will be updated', timestamp: '', status: 'pending' },
        ],
    },
];

// --- Context Interface ---
interface RequestContextType {
    requests: AppRequest[];
    submitLeaveRequest: (req: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => AppRequest;
    submitShiftRequest: (req: Omit<AppRequest, 'id' | 'status' | 'timeline' | 'dateModified' | 'lastModifiedBy' | 'setupName'>) => AppRequest;
    approveRequest: (id: string, approverName: string) => void;
    rejectRequest: (id: string, approverName: string, reason: string) => void;
    getRequestById: (id: string) => AppRequest | undefined;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

// --- Provider ---
export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [requests, setRequests] = useState<AppRequest[]>(SEED_REQUESTS);

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

        const newReq: AppRequest = {
            ...partial,
            id: `req-${Date.now()}`,
            status: 'Submitted',
            lastModifiedBy: 'System',
            dateModified: now(),
            setupName: 'Employee Shift Change',
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

    const approveRequest = (id: string, approverName: string) => {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
        setRequests(prev =>
            prev.map(r => {
                if (r.id !== id) return r;
                return {
                    ...r,
                    status: 'Approved',
                    lastModifiedBy: approverName,
                    dateModified: now(),
                    timeline: r.timeline.map(step => {
                        if (step.status === 'current') return { ...step, status: 'completed' as const, description: `Approved by ${approverName}`, timestamp };
                        if (step.status === 'pending') {
                            // Cascade approvals
                            const isLast = step.id === r.timeline[r.timeline.length - 1].id;
                            return isLast
                                ? { ...step, status: 'completed' as const, description: 'Request applied — record updated', timestamp }
                                : { ...step, status: 'completed' as const, description: `Approved by ${approverName}`, timestamp };
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

    return (
        <RequestContext.Provider value={{ requests, submitLeaveRequest, submitShiftRequest, approveRequest, rejectRequest, getRequestById }}>
            {children}
        </RequestContext.Provider>
    );
};

export const useRequest = () => {
    const ctx = useContext(RequestContext);
    if (!ctx) throw new Error('useRequest must be used within a RequestProvider');
    return ctx;
};
