
import React, { useState } from 'react';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    Table as TableIcon,
    Calendar,
    Clock,
    User,
    Building2,
    FileText,
    Eye,
    Download,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Plane,
    Coffee,
    Fingerprint,
    Timer,
    MoreHorizontal,
    TrendingUp,
    FileBarChart,
    ArrowUpRight,
    X,
    History,
    ClipboardCheck,
    Zap,
    Star,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { TimekeepingFileTemplate } from '../components/TimekeepingFileTemplate';

// --- Types ---
type AttendanceStatus = 'Verified' | 'Pending' | 'Absent' | 'On Leave' | 'Holiday' | 'Approved' | 'Late';
type FileType = 'Biometrics' | 'ODTR' | 'System';

interface AttendanceRecord {
    id: string;
    employee: {
        name: string;
        role: string;
        avatar: string;
        department: string;
    };
    date: string;
    shift: string;
    timeIn: string;
    timeOut: string;
    status: AttendanceStatus;
    fileType: FileType;
}

interface OvertimeRecord {
    id: string;
    employee: {
        name: string;
        role: string;
        avatar: string;
        department: string;
    };
    date: string;
    shift: string;
    clockOut: string;
    duration: number;
    reason: string;
    status: 'Approved' | 'Pending' | 'Rejected';
}

interface SummaryRecord {
    id: string;
    employee: {
        name: string;
        role: string;
        avatar: string;
        department: string;
    };
    period: string;
    dtrStatus: 'Complete' | 'Incomplete' | 'Pending Review';
    fileStatus: 'Uploaded' | 'Missing';
}

// --- Mock Data ---
const MOCK_RECORDS: AttendanceRecord[] = [
    {
        id: 'att-1',
        employee: { name: 'James Cordon', role: 'IT Developer Intern', avatar: 'JC', department: 'IT Department' },
        date: 'Aug 09, 2025',
        shift: '8:00 AM - 6:00 PM',
        timeIn: '8:01:00 AM',
        timeOut: '6:00:00 PM',
        status: 'Verified',
        fileType: 'Biometrics'
    },
    {
        id: 'att-2',
        employee: { name: 'James Cordon', role: 'IT Developer Intern', avatar: 'JC', department: 'IT Department' },
        date: 'Aug 08, 2025',
        shift: '8:00 AM - 6:00 PM',
        timeIn: '9:45:00 AM',
        timeOut: '6:00:00 PM',
        status: 'Late',
        fileType: 'ODTR'
    },
    {
        id: 'att-3',
        employee: { name: 'Louis Panganiban', role: 'Senior Developer', avatar: 'LP', department: 'IT Department' },
        date: 'Aug 08, 2025',
        shift: '7:00 AM - 5:00 PM',
        timeIn: '-',
        timeOut: '-',
        status: 'Pending',
        fileType: 'ODTR'
    },
    {
        id: 'att-4',
        employee: { name: 'Sarah Wilson', role: 'HR Manager', avatar: 'SW', department: 'HR Department' },
        date: 'Aug 08, 2025',
        shift: '9:00 AM - 6:00 PM',
        timeIn: '8:55:00 AM',
        timeOut: '6:05:00 PM',
        status: 'Verified',
        fileType: 'Biometrics'
    },
    {
        id: 'att-5',
        employee: { name: 'Mike Brown', role: 'Payroll Specialist', avatar: 'MB', department: 'Finance' },
        date: 'Aug 08, 2025',
        shift: '8:00 AM - 5:00 PM',
        timeIn: '-',
        timeOut: '-',
        status: 'On Leave',
        fileType: 'System'
    },
    {
        id: 'att-6',
        employee: { name: 'Louis Panganiban', role: 'Senior Developer', avatar: 'LP', department: 'IT Department' },
        date: 'Aug 09, 2025',
        shift: '7:00 AM - 5:00 PM',
        timeIn: '-',
        timeOut: '-',
        status: 'Absent',
        fileType: 'System'
    },
];

const MOCK_OVERTIME: OvertimeRecord[] = [
    {
        id: 'ot-1',
        employee: { name: 'James Cordon', role: 'IT Developer Intern', avatar: 'JC', department: 'IT Department' },
        date: 'Aug 04, 2025',
        shift: '8:00 AM - 5:00 PM',
        clockOut: '08:30 PM',
        duration: 3.5,
        reason: 'Urgent Bug Fixes for Production',
        status: 'Approved'
    },
    {
        id: 'ot-2',
        employee: { name: 'Louis Panganiban', role: 'Senior Developer', avatar: 'LP', department: 'IT Department' },
        date: 'Aug 05, 2025',
        shift: '8:00 AM - 5:00 PM',
        clockOut: '07:00 PM',
        duration: 2.0,
        reason: 'Server Maintenance and Upgrades',
        status: 'Pending'
    },
    {
        id: 'ot-3',
        employee: { name: 'Sarah Wilson', role: 'HR Manager', avatar: 'SW', department: 'HR Department' },
        date: 'Aug 06, 2025',
        shift: '9:00 AM - 6:00 PM',
        clockOut: '08:00 PM',
        duration: 2.0,
        reason: 'End of Month Payroll Processing',
        status: 'Approved'
    },
    {
        id: 'ot-4',
        employee: { name: 'Mike Brown', role: 'Payroll Specialist', avatar: 'MB', department: 'Finance' },
        date: 'Aug 07, 2025',
        shift: '8:00 AM - 5:00 PM',
        clockOut: '09:00 PM',
        duration: 4.0,
        reason: 'Audit Preparation',
        status: 'Rejected'
    }
];

const MOCK_SUMMARY: SummaryRecord[] = [
    {
        id: 'sum-1',
        employee: { name: 'James Cordon', role: 'IT Developer Intern', avatar: 'JC', department: 'IT Department' },
        period: 'Aug 6 - Aug 20, 2025',
        dtrStatus: 'Complete',
        fileStatus: 'Uploaded'
    },
    {
        id: 'sum-2',
        employee: { name: 'Louis Panganiban', role: 'Senior Developer', avatar: 'LP', department: 'IT Department' },
        period: 'Aug 6 - Aug 20, 2025',
        dtrStatus: 'Pending Review',
        fileStatus: 'Uploaded'
    },
    {
        id: 'sum-3',
        employee: { name: 'Sarah Wilson', role: 'HR Manager', avatar: 'SW', department: 'HR Department' },
        period: 'Aug 6 - Aug 20, 2025',
        dtrStatus: 'Complete',
        fileStatus: 'Uploaded'
    },
    {
        id: 'sum-4',
        employee: { name: 'Mike Brown', role: 'Payroll Specialist', avatar: 'MB', department: 'Finance' },
        period: 'Aug 6 - Aug 20, 2025',
        dtrStatus: 'Incomplete',
        fileStatus: 'Missing'
    }
];

// Helper to generate heatmap data
const HEATMAP_DATES = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(2025, 7, 6 + i); // Aug 6 start
    return {
        day: d.getDate(),
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: d.toISOString().split('T')[0]
    };
});

const EMPLOYEES = [
    { id: 'e1', name: 'James Cordon', role: 'IT Developer Intern' },
    { id: 'e2', name: 'Louis Panganiban', role: 'Senior Developer' },
    { id: 'e3', name: 'Sarah Wilson', role: 'HR Manager' },
    { id: 'e4', name: 'Mike Brown', role: 'Payroll Specialist' },
];

const generateHeatmapStatus = (empId: string, day: number): AttendanceStatus => {
    // Deterministic mock generation
    const sum = empId.charCodeAt(1) + day;
    if (day === 13) return 'Holiday';
    if (sum % 13 === 0) return 'Absent';
    if (sum % 11 === 0) return 'Late';
    if (sum % 9 === 0) return 'On Leave';
    if (sum % 7 === 0) return 'Pending';
    return 'Verified';
};

const AttendanceMonitor: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'Daily Time Record' | 'Overtime' | 'Timekeeping Summary Record'>('Daily Time Record');
    const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredData, setHoveredData] = useState<{ record: any; x: number; y: number } | null>(null);

    // Modal State for Timekeeping File
    const [selectedFileSummary, setSelectedFileSummary] = useState<SummaryRecord | null>(null);
    const MotionDiv = motion.div as any;

    // Filter Data
    const filteredRecords = MOCK_RECORDS.filter(r =>
        r.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOvertime = MOCK_OVERTIME.filter(r =>
        r.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSummary = MOCK_SUMMARY.filter(r =>
        r.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: AttendanceStatus, type: 'bg' | 'text' | 'dot') => {
        switch (status) {
            case 'Verified':
            case 'Approved':
                if (type === 'bg') return 'bg-emerald-600';
                if (type === 'text') return 'text-emerald-600 bg-emerald-50 border-emerald-100';
                return 'bg-emerald-500';
            case 'Pending':
                if (type === 'bg') return 'bg-amber-400';
                if (type === 'text') return 'text-amber-600 bg-amber-50 border-amber-100';
                return 'bg-amber-400';
            case 'Absent':
                if (type === 'bg') return 'bg-rose-500';
                if (type === 'text') return 'text-rose-600 bg-rose-50 border-rose-100';
                return 'bg-rose-500';
            case 'On Leave':
                if (type === 'bg') return 'bg-purple-500';
                if (type === 'text') return 'text-purple-600 bg-purple-50 border-purple-100';
                return 'bg-purple-500';
            case 'Holiday':
                if (type === 'bg') return 'bg-cyan-400';
                if (type === 'text') return 'text-cyan-600 bg-cyan-50 border-cyan-100';
                return 'bg-cyan-400';
            case 'Late':
                if (type === 'bg') return 'bg-orange-500';
                if (type === 'text') return 'text-orange-600 bg-orange-50 border-orange-100';
                return 'bg-orange-500';
            default:
                return 'bg-slate-200';
        }
    };

    const getFileBadge = (type: FileType) => {
        switch (type) {
            case 'Biometrics': return 'bg-blue-100 text-blue-700';
            case 'ODTR': return 'bg-purple-100 text-purple-700';
            case 'System': return 'bg-slate-100 text-slate-600';
        }
    };

    const handleMouseEnterNode = (e: React.MouseEvent, record: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        setHoveredData({ record, x, y });
    };

    const AttendanceHoverCard = ({ data, x, y }: { data: any, x: number, y: number }) => {
        const status = data.status as AttendanceStatus;
        let badgeStyle = 'bg-slate-100 text-slate-600';
        let accentColor = 'text-slate-900';

        switch (status) {
            case 'Verified':
            case 'Approved':
                badgeStyle = 'bg-emerald-100 text-emerald-700';
                accentColor = 'text-emerald-600';
                break;
            case 'Late':
                badgeStyle = 'bg-orange-100 text-orange-700';
                accentColor = 'text-orange-600';
                break;
            case 'Absent':
                badgeStyle = 'bg-rose-100 text-rose-700';
                accentColor = 'text-rose-600';
                break;
            case 'On Leave':
                badgeStyle = 'bg-purple-100 text-purple-700';
                accentColor = 'text-purple-600';
                break;
            case 'Holiday':
                badgeStyle = 'bg-cyan-100 text-cyan-700';
                accentColor = 'text-cyan-600';
                break;
            case 'Pending':
                badgeStyle = 'bg-amber-100 text-amber-700';
                accentColor = 'text-amber-600';
                break;
        }

        return (
            <div
                className="fixed z-[60] w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-12px]"
                style={{ left: x, top: y }}
            >
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 rounded-t-2xl">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${badgeStyle}`}>
                        <Activity size={12} />
                        {status}
                    </div>
                    <span className="text-xs font-bold text-slate-500">{data.date}</span>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-slate-200">
                            {data.employee.avatar}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">{data.employee.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{data.employee.department}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Time In</div>
                            <div className="text-sm font-mono font-bold text-slate-700">{data.timeIn || '--:--'}</div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Time Out</div>
                            <div className="text-sm font-mono font-bold text-slate-700">{data.timeOut || '--:--'}</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift Schedule</span>
                        <span className="text-xs font-bold text-slate-700">{data.shift}</span>
                    </div>
                </div>
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-slate-100"></div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance Monitor</h1>
                <p className="text-slate-500 font-medium mt-1">Track employee logs, manage overtime, and resolve discrepancies.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex gap-8">
                    {['Daily Time Record', 'Overtime', 'Timekeeping Summary Record'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab
                                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'Daily Time Record' && (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4">

                    {/* Controls Toolbar */}
                    <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-white">

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                            {['Role', 'Shift', 'Department', 'Status'].map(filter => (
                                <button key={filter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all group">
                                    {filter === 'Role' && <User size={14} />}
                                    {filter === 'Shift' && <Clock size={14} />}
                                    {filter === 'Department' && <Building2 size={14} />}
                                    {filter === 'Status' && <Filter size={14} />}
                                    {filter}
                                    <ChevronDown size={12} className="ml-1 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                </button>
                            ))}
                        </div>

                        {/* Right Side: View Toggle & Search */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                            <div className="bg-slate-100 p-1 rounded-xl flex shrink-0">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <TableIcon size={14} /> Table View
                                </button>
                                <button
                                    onClick={() => setViewMode('heatmap')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'heatmap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <LayoutGrid size={14} /> Heatmap View
                                </button>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- VIEW: HEATMAP --- */}
                    {viewMode === 'heatmap' && (
                        <div className="flex-1 flex flex-col p-8 animate-in fade-in slide-in-from-top-4">
                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Attendance Heatmap</h3>
                                    <p className="text-sm text-slate-500 font-medium">Visual distribution of team attendance for current period</p>
                                </div>
                                <div className="flex gap-4">
                                    {['Verified', 'Late', 'Absent', 'On Leave', 'Holiday', 'Pending'].map(st => (
                                        <div key={st} className="flex items-center gap-2">
                                            <div className={`w-3.5 h-3.5 rounded-sm ${getStatusColor(st as AttendanceStatus, 'bg')}`}></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{st}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                                <div className="min-w-max">
                                    {/* Heatmap Grid Header (Dates) */}
                                    <div className="flex mb-4 pl-[240px]">
                                        {HEATMAP_DATES.map((date, idx) => (
                                            <div key={idx} className="w-10 text-center flex flex-col items-center">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">{date.label.split(' ')[0]}</span>
                                                <span className="text-xs font-black text-slate-700">{date.day}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Heatmap Rows (Employees) */}
                                    <div className="space-y-4">
                                        {EMPLOYEES.map((employee) => (
                                            <div key={employee.id} className="flex items-center group">
                                                {/* Employee Label */}
                                                <div className="w-[240px] pr-8 flex items-center gap-3 shrink-0">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-slate-100 border border-white group-hover:scale-110 transition-transform">
                                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{employee.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{employee.role}</div>
                                                    </div>
                                                </div>

                                                {/* Activity Squares */}
                                                <div className="flex gap-1">
                                                    {HEATMAP_DATES.map((date, idx) => {
                                                        const status = generateHeatmapStatus(employee.id, date.day);
                                                        const record = {
                                                            employee: { name: employee.name, avatar: employee.name.split(' ').map(n => n[0]).join(''), department: 'IT Department' },
                                                            date: date.label + ', 2025',
                                                            shift: '8:00 AM - 5:00 PM',
                                                            timeIn: status === 'Absent' || status === 'On Leave' ? '-' : '08:00 AM',
                                                            timeOut: status === 'Absent' || status === 'On Leave' ? '-' : '05:00 PM',
                                                            status: status
                                                        };
                                                        return (
                                                            <MotionDiv
                                                                key={idx}
                                                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                                                className={`w-10 h-10 rounded-lg cursor-pointer transition-all border-2 border-white shadow-sm ${getStatusColor(status, 'bg')} opacity-80 hover:opacity-100 hover:shadow-lg`}
                                                                onMouseEnter={(e: React.MouseEvent) => handleMouseEnterNode(e, record)}
                                                                onMouseLeave={() => setHoveredData(null)}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- VIEW: TABLE --- */}
                    {viewMode === 'table' && (
                        <div className="flex-1 overflow-x-auto animate-in fade-in">
                            <table className="min-w-full divide-y divide-slate-50">
                                <thead className="bg-slate-50/50 text-left">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                                            Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time In</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Out</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">File Type</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRecords.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                                        {item.employee.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.employee.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{item.employee.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(item.status, 'text')}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">
                                                {item.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                                                {item.shift}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-700">
                                                {item.timeIn}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-700">
                                                {item.timeOut}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getFileBadge(item.fileType)}`}>
                                                    {item.fileType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-all shadow-sm">
                                                    View File
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer Pagination */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredRecords.length} Records</span>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                            <div className="flex gap-1">
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">3</button>
                            </div>
                            <button className="flex items-center gap-1 px-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 text-xs font-bold transition-all">
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- OVERTIME TAB --- */}
            {activeTab === 'Overtime' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

                    {/* Overtime List */}
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-indigo-600" /> Overtime Requests
                            </h3>
                            <div className="relative w-full md:max-w-xs">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search overtime..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-50">
                                <thead className="bg-slate-50/50 text-left">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Shift</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clock Out</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredOvertime.map((ot) => (
                                        <tr
                                            key={ot.id}
                                            onClick={() => navigate(`/monitor/attendance/overtime/${ot.id}`)}
                                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                                        {ot.employee.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{ot.employee.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{ot.employee.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-slate-700">{ot.date}</div>
                                                <div className="text-xs text-slate-500">{ot.shift}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-slate-700 font-bold">
                                                {ot.clockOut}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                                                    {ot.duration.toFixed(1)} hrs
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-slate-600 max-w-[200px] truncate" title={ot.reason}>
                                                    {ot.reason}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${ot.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    ot.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {ot.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredOvertime.length} Requests</span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                                <div className="flex gap-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                                </div>
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TIMEKEEPING SUMMARY RECORD TAB --- */}
            {activeTab === 'Timekeeping Summary Record' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">

                        {/* Controls */}
                        <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 w-full xl:w-auto">
                                <div className="relative w-full xl:w-64">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap">
                                    <Calendar size={14} /> Aug 6 - Aug 20, 2025
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm">
                                    <Download size={14} /> Export Report
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-50">
                                <thead className="bg-slate-50/50 text-left">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Timekeeping Summary</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Timesheet PDF File</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredSummary.map((sum) => (
                                        <tr key={sum.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                                        {sum.employee.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sum.employee.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{sum.employee.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700">{sum.employee.department}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">{sum.employee.role}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => navigate(`/monitor/attendance/dtr/${sum.id}`)}
                                                    className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                                                >
                                                    View Record
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedFileSummary(sum)}
                                                    className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                                                >
                                                    View File
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredSummary.length} Employees</span>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                                <div className="flex gap-1">
                                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                                </div>
                                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Timekeeping File Modal */}
            <Modal isOpen={!!selectedFileSummary} onClose={() => setSelectedFileSummary(null)} className="max-w-7xl">
                {selectedFileSummary && (
                    <div className="flex flex-col max-h-[85vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Timekeeping File</h3>
                            <button onClick={() => setSelectedFileSummary(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
                        </div>
                        <div className="overflow-y-auto p-8 bg-gray-100 flex justify-center">
                            <div className="shadow-xl bg-white">
                                <TimekeepingFileTemplate data={selectedFileSummary} />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Hover Card Portal */}
            <AnimatePresence>
                {hoveredData && (
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <AttendanceHoverCard data={hoveredData.record} x={hoveredData.x} y={hoveredData.y} />
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AttendanceMonitor;
