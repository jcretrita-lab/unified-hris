
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequest } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft,
    Check,
    Download,
    Eye,
    FileText,
    CalendarDays,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    TrendingUp,
    X
} from 'lucide-react';
import { motion } from 'framer-motion';

// MOCK_DATA removed as we are using RequestContext live store

const ApprovalDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRequestById, approveRequest, rejectRequest } = useRequest();
    const { user } = useAuth();

    const data = getRequestById(id || '');

    if (!data) {
        return (
            <div className="p-8 text-center space-y-4">
                <AlertCircle className="mx-auto text-slate-300" size={48} />
                <h2 className="text-xl font-bold text-slate-900">Request Not Found</h2>
                <button onClick={() => navigate('/monitor/approvals')} className="text-indigo-600 font-bold">Back to List</button>
            </div>
        );
    }

    const handleApprove = () => {
        approveRequest(data.id, user?.name || 'Approver');
    };

    const handleReject = () => {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
            rejectRequest(data.id, user?.name || 'Approver', reason);
        }
    };

    // --- Components ---

    const Timeline = () => (
        <div className="flex items-start w-full border-b border-slate-200 bg-slate-50/50">
            {data.timeline.map((step, idx) => (
                <div key={step.id} className="flex-1 p-4 border-r border-slate-200 last:border-none relative group min-h-[100px]">
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'current' ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                            {step.status === 'completed' ? <Check size={12} strokeWidth={4} /> : step.id}
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-1">{step.description}</p>
                            {step.timestamp && (
                                <p className="text-[10px] text-slate-400 mt-2 font-mono">{step.timestamp}</p>
                            )}
                        </div>
                    </div>
                    {/* Progress Bar Line at bottom of active steps */}
                    {step.status === 'completed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>}
                    {step.status === 'current' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500"></div>}
                </div>
            ))}
        </div>
    );

    const LeaveCalendar = () => {
        // Static Calendar for visualization
        const days = Array.from({ length: 30 }, (_, i) => i + 1);
        const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        // Dates from the request
        const selectedDays = data.leaveDateObjects || [];
        const offset = 1;

        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <button className="p-1 text-slate-400 hover:text-slate-600 cursor-default"><ArrowLeft size={16} /></button>
                    <span className="text-sm font-bold text-slate-900">Month View</span>
                    <button className="p-1 text-slate-400 hover:text-slate-600 cursor-default"><ArrowRight size={16} /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {weekDays.map(d => <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: offset }).map((_, i) => <div key={`empty-${i}`} />)}
                    {days.map(d => {
                        const isSelected = selectedDays.includes(d);
                        return (
                            <div
                                key={d}
                                className={`
                                h-10 w-full flex items-center justify-center text-sm font-bold rounded-lg
                                ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-700 hover:bg-slate-50'}
                            `}
                            >
                                {d}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ShiftComparison = () => {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
                <div className="flex items-center justify-between gap-12">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Shift</label>
                        <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50">
                            <span className="text-lg font-bold text-slate-700">{data.shiftFromName}</span>
                        </div>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                        <ArrowRight className="text-indigo-600" size={24} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right block">Target Shift</label>
                        <div className="p-5 border border-indigo-100 rounded-2xl bg-indigo-50/30 text-right">
                            <span className="text-lg font-bold text-indigo-700">{data.shiftToName}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-500" />
                        Reason for Request
                    </h4>
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl italic text-slate-600 text-sm leading-relaxed">
                        "{data.shiftReason}"
                    </div>
                </div>
            </div>
        );
    };

    const ComparisonTable = () => {
        // Keep placeholder for non-HRIS direct pay changes if needed, but not primarily used by this flow
        const changes = [] as any[];
        return (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left">Component</th>
                            <th className="px-6 py-4 text-right">Current</th>
                            <th className="px-6 py-4 text-right">Proposed</th>
                            <th className="px-6 py-4 text-right">Diff</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {changes.length > 0 ? changes.map((c, i) => {
                            const diff = c.proposed - c.current;
                            return (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-700">{c.component}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-500">₱{c.current.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">₱{c.proposed.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold">
                                        {diff !== 0 ? (
                                            <span className={`${diff > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-lg text-xs`}>
                                                {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                            </span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                </tr>
                            );
                        }) : <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic font-medium">No pay components modified.</td></tr>}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Approval Process</h1>
                <button
                    onClick={() => navigate('/monitor/approvals')}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Approval Management
                </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">

                {/* Timeline Header */}
                <div className="px-8 py-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">{data.type}</h2>
                </div>
                <Timeline />

                {/* Content Area */}
                <div className="flex-1 p-8 bg-slate-50/30">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Left Panel: Dynamic based on Type */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                {data.type === 'Leave Request' ? <CalendarDays size={20} className="text-indigo-600" /> : <TrendingUp size={20} className="text-indigo-600" />}
                                {data.type === 'Leave Request' ? 'Leave Dates' : 'Summary'}
                            </h3>

                            {data.type === 'Leave Request' && <LeaveCalendar />}
                            {data.type === 'Shift Change' && (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                            {data.employeeAvatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{data.employeeName}</p>
                                            <p className="text-xs text-slate-500">{data.employeeRole}</p>
                                        </div>
                                    </div>
                                    <hr className="border-slate-100" />
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Department</span>
                                        <span className="text-slate-700">{data.departmentName}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Panel: Request Details */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-600" />
                                {data.type} Details
                            </h3>

                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl border-l-4 flex items-center gap-4 shadow-sm 
                        ${data.status === 'Approved' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' :
                                    data.status === 'Rejected' ? 'bg-rose-50 border-rose-500 text-rose-900' :
                                        'bg-amber-50 border-amber-500 text-amber-900'}`}>
                                {data.status === 'Approved' && <CheckCircle2 size={24} className="text-emerald-600" />}
                                {data.status === 'Rejected' && <X size={24} className="text-rose-600" />}
                                {data.status === 'Submitted' && <Clock size={24} className="text-amber-600" />}
                                <span className="text-2xl font-bold tracking-tight">{data.status}</span>
                            </div>

                            {/* Dynamic Content */}
                            {data.type === 'Shift Change' ? <ShiftComparison /> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.employeeName}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.departmentName}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manager</label>
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.managerName}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Type</label>
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700">{data.leaveType || 'General Leave'}</div>
                                    </div>
                                    <div className="col-span-full space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason for Leave</label>
                                        <div className="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 italic">
                                            "{data.leaveReason}"
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dates</label>
                                        <div className="p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex flex-col">
                                            {data.leaveDates?.map((d, i) => <span key={i}>{d}</span>)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">File Attachment</label>
                                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                                            <span className="text-sm font-bold text-slate-600">{data.leaveAttachment || 'None Attached'}</span>
                                            {data.leaveAttachment && (
                                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                                                    <Eye size={14} /> View File
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons if Pending */}
                            {data.status === 'Submitted' && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleApprove}
                                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} /> Approve Request
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={18} /> Reject Request
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetail;
