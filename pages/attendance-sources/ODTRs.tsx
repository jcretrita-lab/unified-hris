
import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    Calendar,
    ChevronDown,
    Check,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    History,
    UserCheck,
    CheckCircle2,
    ShieldCheck,
    Cpu,
    X,
    Filter,
    CheckSquare,
    Square,
    ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface ODTRRecord {
    id: string;
    employee: {
        id: string;
        name: string;
        role: string;
        avatar: string;
        department: string;
    };
    status: 'Submitted' | 'Approved' | 'Verified' | 'Attendance Processed';
    lastModified: string;
    lastModifiedBy: string;
    logs: {
        date: string;
        weekday: string;
        shift: string;
        in: string;
        out: string;
        remarks: string;
    }[];
}

const CUTOFFS = [
    { id: 'past-3', range: 'Jun 21 - Jul 05, 2025', status: 'Past' },
    { id: 'past-2', range: 'Jul 06 - Jul 20, 2025', status: 'Past' },
    { id: 'past-1', range: 'Jul 21 - Aug 05, 2025', status: 'Past' },
    { id: 'current', range: 'Aug 06 - Aug 20, 2025', status: 'Present' },
    { id: 'future-1', range: 'Aug 21 - Sep 05, 2025', status: 'Future' },
    { id: 'future-2', range: 'Sep 06 - Sep 20, 2025', status: 'Future' },
];

const MOCK_ODTRS: Record<string, ODTRRecord[]> = {
    'Present': [
        {
            id: 'odtr-1',
            employee: {
                id: 'EMP-2024-001',
                name: 'John Doe',
                role: 'Senior Developer',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop',
                department: 'Engineering'
            },
            status: 'Submitted',
            lastModified: 'Aug 19, 2025 04:30 PM',
            lastModifiedBy: 'John Doe',
            logs: [
                { date: 'Aug 06, 2025', weekday: 'Wednesday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '07:55 AM', out: '05:05 PM', remarks: 'Normal' },
                { date: 'Aug 07, 2025', weekday: 'Thursday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '08:02 AM', out: '05:10 PM', remarks: 'Normal' },
                { date: 'Aug 08, 2025', weekday: 'Friday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '07:50 AM', out: '05:00 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'odtr-2',
            employee: {
                id: 'EMP-2024-005',
                name: 'Jane Smith',
                role: 'UI Designer',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop',
                department: 'Product'
            },
            status: 'Approved',
            lastModified: 'Aug 20, 2025 09:15 AM',
            lastModifiedBy: 'Sarah Connor',
            logs: [
                { date: 'Aug 06, 2025', weekday: 'Wednesday', shift: 'Reg (09:00 AM - 06:00 PM)', in: '08:55 AM', out: '06:05 PM', remarks: 'Normal' },
                { date: 'Aug 07, 2025', weekday: 'Thursday', shift: 'Reg (09:00 AM - 06:00 PM)', in: '08:58 AM', out: '06:02 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'odtr-3',
            employee: {
                id: 'EMP-2024-012',
                name: 'Robert Wilson',
                role: 'QA Engineer',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop',
                department: 'Engineering'
            },
            status: 'Verified',
            lastModified: 'Aug 21, 2025 11:45 AM',
            lastModifiedBy: 'HR Verifier',
            logs: [
                { date: 'Aug 06, 2025', weekday: 'Wednesday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '08:05 AM', out: '05:15 PM', remarks: 'Late' }
            ]
        },
        {
            id: 'odtr-4',
            employee: {
                id: 'EMP-2024-088',
                name: 'Alice Johnson',
                role: 'Marketing Manager',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&auto=format&fit=crop',
                department: 'Marketing'
            },
            status: 'Attendance Processed',
            lastModified: 'Aug 22, 2025 03:20 PM',
            lastModifiedBy: 'System Admin',
            logs: [
                { date: 'Aug 06, 2025', weekday: 'Wednesday', shift: 'Reg (09:00 AM - 06:00 PM)', in: '09:00 AM', out: '06:00 PM', remarks: 'Normal' }
            ]
        }
    ],
    'Past': [
        {
            id: 'odtr-past-1',
            employee: {
                id: 'EMP-2023-112',
                name: 'Michael Scott',
                role: 'Regional Manager',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop',
                department: 'Sales'
            },
            status: 'Attendance Processed',
            lastModified: 'Aug 06, 2025 10:00 AM',
            lastModifiedBy: 'Payroll Central',
            logs: [
                { date: 'Jul 21, 2025', weekday: 'Monday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '08:00 AM', out: '05:00 PM', remarks: 'Completed' }
            ]
        },
        {
            id: 'odtr-past-2',
            employee: {
                id: 'EMP-2023-045',
                name: 'Pam Beesly',
                role: 'Receptionist',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop',
                department: 'Admin'
            },
            status: 'Verified',
            lastModified: 'Aug 05, 2025 02:20 PM',
            lastModifiedBy: 'HR Verifier',
            logs: [
                { date: 'Jul 21, 2025', weekday: 'Monday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '07:45 AM', out: '05:15 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'odtr-past-3',
            employee: {
                id: 'EMP-2023-099',
                name: 'Dwight Schrute',
                role: 'Assistant Regional Manager',
                avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&auto=format&fit=crop',
                department: 'Sales'
            },
            status: 'Approved',
            lastModified: 'Jul 25, 2025 04:00 PM',
            lastModifiedBy: 'Michael Scott',
            logs: [
                { date: 'Jul 21, 2025', weekday: 'Monday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '07:30 AM', out: '06:00 PM', remarks: 'Overtime' }
            ]
        },
        {
            id: 'odtr-past-4',
            employee: {
                id: 'EMP-2023-110',
                name: 'Jim Halpert',
                role: 'Sales Representative',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop',
                department: 'Sales'
            },
            status: 'Submitted',
            lastModified: 'Jul 22, 2025 05:05 PM',
            lastModifiedBy: 'Jim Halpert',
            logs: [
                { date: 'Jul 21, 2025', weekday: 'Monday', shift: 'Reg (08:00 AM - 05:00 PM)', in: '08:50 AM', out: '05:00 PM', remarks: 'Normal' }
            ]
        }
    ],
    'Future': []
};

const Avatar: React.FC<{ src: string, initials: string }> = ({ src, initials }) => (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        {src ? (
            <img src={src} alt={initials} className="w-full h-full object-cover" />
        ) : (
            <span className="text-[10px] font-bold text-slate-400">{initials}</span>
        )}
    </div>
);

const StatusBadge: React.FC<{ status: ODTRRecord['status'] }> = ({ status }) => {
    const config = {
        'Submitted': { icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
        'Approved': { icon: UserCheck, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
        'Verified': { icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
        'Attendance Processed': { icon: CheckCircle2, bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
    };
    const { icon: Icon, bg, text, border } = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bg} ${text} ${border} text-[10px] font-bold uppercase tracking-tight`}>
            <Icon size={12} />
            {status}
        </span>
    );
};

const MOCK_HISTORY_LOGS = [
    { id: 'h1', date: 'Aug 20, 2025 09:15 AM', action: 'Approved ODTR-2', by: 'Sarah Connor', type: 'Approved' },
    { id: 'h2', date: 'Aug 19, 2025 04:30 PM', action: 'Submitted ODTR-1', by: 'John Doe', type: 'Submitted' },
    { id: 'h3', date: 'Aug 18, 2025 10:00 AM', action: 'Edited ODTR-1', by: 'John Doe', type: 'Edited' },
    { id: 'h4', date: 'Aug 15, 2025 02:00 PM', action: 'Created ODTR-1', by: 'John Doe', type: 'Created' },
];

export const ODTRs: React.FC<{
    activeSourceTab: string;
    setActiveSourceTab: (tab: any) => void;
}> = ({ activeSourceTab, setActiveSourceTab }) => {
    const [selectedCutoff, setSelectedCutoff] = useState(CUTOFFS[3].range);
    const [isCutoffOpen, setIsCutoffOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isBatchVerifyModalOpen, setIsBatchVerifyModalOpen] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const cutoffRef = useRef<HTMLDivElement>(null);

    const currentStatus = CUTOFFS.find(c => c.range === selectedCutoff)?.status || 'Present';

    // Logic to select records based on cutoff status
    const records = MOCK_ODTRS[currentStatus as keyof typeof MOCK_ODTRS] || [];
    const filteredRecords = records.filter(r =>
        r.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingVerification = filteredRecords.filter(r => r.status === 'Approved');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cutoffRef.current && !cutoffRef.current.contains(event.target as Node)) {
                setIsCutoffOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Controls */}
                <div className="p-6 border-b border-slate-50 flex flex-col xl:flex-row justify-between items-center gap-6 bg-white">
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <div className="relative w-full xl:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search ODTRs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative inline-block" ref={cutoffRef}>
                                <button
                                    onClick={() => setIsCutoffOpen(!isCutoffOpen)}
                                    className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 whitespace-nowrap min-w-[240px] justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>{selectedCutoff}</span>
                                        {currentStatus === 'Present' && (
                                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[8px] font-black uppercase tracking-tighter">Current</span>
                                        )}
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isCutoffOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isCutoffOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5 overflow-hidden"
                                        >
                                            {CUTOFFS.map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => {
                                                        setSelectedCutoff(c.range);
                                                        setIsCutoffOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group
                                                        ${selectedCutoff === c.range ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}
                                                        ${c.status === 'Past' ? 'text-black' :
                                                            c.status === 'Present' ? 'text-blue-600' :
                                                                'text-slate-400 opacity-60'}
                                                    `}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold">{c.range}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {c.status === 'Present' && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></div>
                                                        )}
                                                        {selectedCutoff === c.range && <Check size={14} className="text-indigo-600" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative">
                                <select
                                    value={activeSourceTab}
                                    onChange={(e) => setActiveSourceTab(e.target.value as any)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-indigo-50 border-none rounded-xl text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer shadow-sm hover:bg-indigo-100/50"
                                >
                                    <option value="Time Collection Device">Time Collection Device</option>
                                    <option value="Online Daily Time Record">Online Daily Time Record</option>
                                    <option value="Attendance Adjustment Record">Attendance Adjustment Record</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full xl:w-auto">
                        <button
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                            <History size={14} /> Submission Log
                        </button>
                        <button
                            onClick={() => setIsBatchVerifyModalOpen(true)}
                            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                            <ShieldCheck size={14} /> Batch Verify
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="bg-slate-50/50 text-left">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Employee ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Last Modified</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Modified By</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right border-b border-slate-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record: ODTRRecord) => (
                                    <React.Fragment key={record.id}>
                                        <tr
                                            className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${expandedId === record.id ? 'bg-slate-50/50' : ''}`}
                                            onClick={() => toggleExpand(record.id)}
                                        >
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={record.employee.avatar}
                                                        initials={record.employee.name.split(' ').map(n => n[0]).join('')}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{record.employee.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{record.employee.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{record.employee.id}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <StatusBadge status={record.status} />
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-xs font-bold text-slate-500 italic">
                                                {record.lastModified}
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                        {record.lastModifiedBy.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{record.lastModifiedBy}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-right">
                                                <button className={`p-2 transition-all rounded-lg ${expandedId === record.id ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                    <ChevronDown size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {expandedId === record.id && (
                                                <tr>
                                                    <td colSpan={6} className="p-0 border-b border-slate-100 shadow-inner bg-slate-50/30">
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-8 py-6">
                                                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                                                    <table className="min-w-full divide-y divide-slate-50">
                                                                        <thead className="bg-slate-50/50">
                                                                            <tr>
                                                                                <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                                                                <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Weekday</th>
                                                                                <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                                                                                <th className="px-6 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">In</th>
                                                                                <th className="px-6 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Out</th>
                                                                                <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-50">
                                                                            {record.logs.map((log, idx) => (
                                                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                                                    <td className="px-6 py-3 font-bold text-slate-700">{log.date}</td>
                                                                                    <td className="px-6 py-3 text-slate-500 font-medium">{log.weekday}</td>
                                                                                    <td className="px-6 py-3">
                                                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                                                            <Cpu size={12} className="text-slate-300" />
                                                                                            {log.shift}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-6 py-3 text-center">
                                                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md font-mono font-bold">
                                                                                            <Clock size={10} /> {log.in}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-6 py-3 text-center">
                                                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded-md font-mono font-bold">
                                                                                            <Clock size={10} /> {log.out}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="px-6 py-3">
                                                                                        <div className="flex items-center gap-2 text-slate-500">
                                                                                            <FileText size={12} className="text-slate-300" />
                                                                                            {log.remarks}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className={`p-6 rounded-full ${currentStatus === 'Future' ? 'bg-slate-50 text-slate-200' : 'bg-amber-50 text-amber-200'}`}>
                                                {currentStatus === 'Future' ? <Clock size={48} /> : <AlertCircle size={48} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-slate-900 font-bold text-base">
                                                    {currentStatus === 'Future' ? "Future Cutoff Period" : "No Online Time Records"}
                                                </h4>
                                                <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                                                    {currentStatus === 'Future'
                                                        ? "The selected timeframe is scheduled for a future cutoff cycle. Detailed biometric logs will become available once the period synchronization commences."
                                                        : "There are currently no online daily time records submitted for this cutoff period."}
                                                </p>
                                            </div>
                                            {currentStatus === 'Future' && (
                                                <div className="mt-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Awaiting Sync Date: Aug 21, 2025</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredRecords.length} Online Time Records</span>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                        </div>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Submission Log Modal */}
            <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} className="max-w-2xl w-[90vw]">
                <div className="flex flex-col h-[70vh]">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                <History size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Submission & Activity Log</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Historical Audit Trail</p>
                            </div>
                        </div>
                        <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {[
                            { user: 'Sarah Connor', action: 'Approved', target: 'Jane Smith', time: 'Today, 09:15 AM', type: 'approval' },
                            { user: 'John Doe', action: 'Submitted', target: 'Self', time: 'Yesterday, 04:30 PM', type: 'submission' },
                            { user: 'HR Verifier', action: 'Verified', target: 'Robert Wilson', time: 'Yesterday, 11:45 AM', type: 'verification' },
                            { user: 'System Bot', action: 'Syncing', target: 'All Records', time: 'Aug 21, 2025 12:00 AM', type: 'system' }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 relative">
                                {i !== 3 && <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-100"></div>}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${log.type === 'approval' ? 'bg-indigo-100 text-indigo-600' :
                                    log.type === 'submission' ? 'bg-blue-100 text-blue-600' :
                                        log.type === 'verification' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {log.type === 'approval' ? <UserCheck size={14} /> :
                                        log.type === 'submission' ? <ArrowUpRight size={14} /> :
                                            log.type === 'verification' ? <ShieldCheck size={14} /> : <Clock size={14} />}
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="text-sm font-bold text-slate-900">
                                        {log.user} <span className="font-medium text-slate-400 mx-1">{log.action === 'Syncing' ? 'started' : 'processed'}</span> {log.action} <span className="text-slate-500">for {log.target}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Batch Verify Modal */}
            <Modal isOpen={isBatchVerifyModalOpen} onClose={() => setIsBatchVerifyModalOpen(false)} className="max-w-4xl w-[90vw]">
                <div className="flex flex-col h-[75vh]">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Batch Record Verification</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{pendingVerification.length} Approved Records Pending Verification</p>
                            </div>
                        </div>
                        <button onClick={() => setIsBatchVerifyModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="bg-slate-50 sticky top-0 z-20">
                                <tr>
                                    <th className="px-6 py-3 border-b border-slate-100 text-left">
                                        <button
                                            onClick={() => {
                                                if (selectedRecords.length === pendingVerification.length) setSelectedRecords([]);
                                                else setSelectedRecords(pendingVerification.map(r => r.id));
                                            }}
                                            className="text-indigo-600"
                                        >
                                            {selectedRecords.length === pendingVerification.length ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-300" />}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Employee</th>
                                    <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Current Status</th>
                                    <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Sub-Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingVerification.length > 0 ? (
                                    pendingVerification.map(record => (
                                        <tr
                                            key={record.id}
                                            className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedRecords.includes(record.id) ? 'bg-indigo-50/30' : ''}`}
                                            onClick={() => {
                                                if (selectedRecords.includes(record.id)) setSelectedRecords(selectedRecords.filter(id => id !== record.id));
                                                else setSelectedRecords([...selectedRecords, record.id]);
                                            }}
                                        >
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                {selectedRecords.includes(record.id) ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} className="text-slate-300" />}
                                            </td>
                                            <td className="px-4 py-4 border-b border-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={record.employee.avatar} initials={record.employee.name[0]} />
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-900">{record.employee.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-medium">{record.employee.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border-b border-slate-50">
                                                <StatusBadge status={record.status} />
                                            </td>
                                            <td className="px-4 py-4 border-b border-slate-50">
                                                <div className="text-[10px] text-slate-500 font-medium">{record.logs.length} Days Submitted • {record.lastModifiedBy}</div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 text-slate-200 rounded-full">
                                                    <ShieldCheck size={32} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">No Approved Records Found</p>
                                                    <p className="text-xs text-slate-400 font-medium">Only records with "Approved" status can be verified.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500 font-bold">
                            {selectedRecords.length} / {pendingVerification.length} RECORDS SELECTED
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsBatchVerifyModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">Cancel</button>
                            <button
                                disabled={selectedRecords.length === 0}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
                            >
                                Verify & Proceed to Process
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// --- Helper Components ---
const Modal: React.FC<{ isOpen: boolean, onClose: () => void, children: React.ReactNode, className?: string }> = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 ${className}`}>
                {children}
            </motion.div>
        </div>
    );
};
