import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, FileText, Clock, User, Fingerprint,
    MonitorSmartphone, Settings2, Search, Filter, AlertCircle,
    CheckCircle2, Plus, PenSquare, LayoutGrid, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreadcrumb } from '../context/BreadcrumbContext';

// Mock Data Models specific to single-employee details
const CUTOFFS = [
    { id: 'current', range: 'Aug 06 - Aug 20, 2025', status: 'Present' },
    { id: 'past-1', range: 'Jul 21 - Aug 05, 2025', status: 'Past' },
];

const MOCK_TCD = [
    { date: 'Aug 06, 2025', weekday: 'Wednesday', shift: '8:00 AM - 5:00 PM', in: '07:55 AM', out: '05:05 PM', remarks: 'Regular Tap in/out' },
    { date: 'Aug 07, 2025', weekday: 'Thursday', shift: '8:00 AM - 5:00 PM', in: '07:58 AM', out: '05:10 PM', remarks: 'Regular Tap in/out' },
    { date: 'Aug 08, 2025', weekday: 'Friday', shift: '8:00 AM - 5:00 PM', in: '08:05 AM', out: '05:01 PM', remarks: 'Late Arrival' },
    { date: 'Aug 13, 2025', weekday: 'Wednesday', shift: '8:00 AM - 5:00 PM', in: '07:59 AM', out: '--:--', remarks: 'Physical biometric device error' },
    { date: 'Aug 14, 2025', weekday: 'Thursday', shift: '8:00 AM - 5:00 PM', in: '07:50 AM', out: '05:00 PM', remarks: '' },
    { date: 'Aug 15, 2025', weekday: 'Friday', shift: '8:00 AM - 5:00 PM', in: '07:45 AM', out: '05:30 PM', remarks: '' },
];

const MOCK_ODTR = [
    { date: 'Aug 11, 2025', weekday: 'Monday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home' },
    { date: 'Aug 12, 2025', weekday: 'Tuesday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home' },
    { date: 'Aug 18, 2025', weekday: 'Monday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:10 PM', remarks: 'Field work' },
    { date: 'Aug 19, 2025', weekday: 'Tuesday', shift: '8:00 AM - 5:00 PM', in: '07:55 AM', out: '05:05 PM', remarks: 'Work from Home' },
    { date: 'Aug 20, 2025', weekday: 'Wednesday', shift: '8:00 AM - 5:00 PM', in: '07:58 AM', out: '05:02 PM', remarks: 'Client meeting' },
];

const MOCK_ADJ = [
    {
        date: 'Aug 13, 2025',
        weekday: 'Wednesday',
        shift: '8:00 AM - 5:00 PM',
        type: 'Missing Bio Out',
        original: { in: '07:59 AM', out: '--:--' },
        adjusted: { in: '07:59 AM', out: '05:05 PM' },
        remarks: 'Forgot to tap out; adjusted by manager'
    }
];

const MOCK_CONSOLIDATED = [
    { id: 'c1', date: 'Aug 06, 2025', weekday: 'Wednesday', shift: '8:00 AM - 5:00 PM', in: '07:55 AM', out: '05:05 PM', remarks: 'Regular Tap in/out', source: 'Time Collection Device' },
    { id: 'c2', date: 'Aug 07, 2025', weekday: 'Thursday', shift: '8:00 AM - 5:00 PM', in: '07:58 AM', out: '05:10 PM', remarks: 'Regular Tap in/out', source: 'Time Collection Device' },
    { id: 'c3', date: 'Aug 08, 2025', weekday: 'Friday', shift: '8:00 AM - 5:00 PM', in: '08:05 AM', out: '05:01 PM', remarks: 'Late Arrival', source: 'Time Collection Device' },
    { id: 'c-rest-1', date: 'Aug 09, 2025', weekday: 'Saturday', shift: 'Rest Day', in: '--:--', out: '--:--', remarks: '', source: '' },
    { id: 'c-rest-2', date: 'Aug 10, 2025', weekday: 'Sunday', shift: 'Rest Day', in: '--:--', out: '--:--', remarks: '', source: '' },
    { id: 'c4', date: 'Aug 11, 2025', weekday: 'Monday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home ODTR', source: 'Online Daily Time Record' },
    { id: 'c5', date: 'Aug 12, 2025', weekday: 'Tuesday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home ODTR', source: 'Online Daily Time Record' },
    {
        id: 'c6',
        date: 'Aug 13, 2025',
        weekday: 'Wednesday',
        shift: '8:00 AM - 5:00 PM',
        in: '07:59 AM',
        out: '--:--',
        remarks: 'No tap out recorded',
        source: 'Time Collection Device',
        adjustment: {
            id: 'c6-adj',
            in: '07:59 AM',
            out: '05:05 PM',
            remarks: 'Forgot to tap out; adjusted by manager',
            source: 'Attendance Adjustment Record'
        }
    },
    { id: 'c7', date: 'Aug 14, 2025', weekday: 'Thursday', shift: '8:00 AM - 5:00 PM', in: '07:50 AM', out: '05:00 PM', remarks: '', source: 'Time Collection Device' },
    { id: 'c8', date: 'Aug 15, 2025', weekday: 'Friday', shift: '8:00 AM - 5:00 PM', in: '07:45 AM', out: '05:30 PM', remarks: '', source: 'Time Collection Device' },
    { id: 'c-rest-3', date: 'Aug 16, 2025', weekday: 'Saturday', shift: 'Rest Day', in: '--:--', out: '--:--', remarks: '', source: '' },
    { id: 'c-rest-4', date: 'Aug 17, 2025', weekday: 'Sunday', shift: 'Rest Day', in: '--:--', out: '--:--', remarks: '', source: '' },
    { id: 'c9', date: 'Aug 18, 2025', weekday: 'Monday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: '', source: 'Online Daily Time Record' },
    { id: 'c10', date: 'Aug 19, 2025', weekday: 'Tuesday', shift: '8:00 AM - 5:00 PM', in: '07:55 AM', out: '05:05 PM', remarks: '', source: 'Online Daily Time Record' },
    { id: 'c11', date: 'Aug 20, 2025', weekday: 'Wednesday', shift: '8:00 AM - 5:00 PM', in: '07:58 AM', out: '05:02 PM', remarks: '', source: 'Online Daily Time Record' },
];

const SourceBadge = ({ source }: { source: string }) => {
    switch (source) {
        case 'Time Collection Device': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-tight"><Fingerprint size={10} /> Biometrics</span>;
        case 'Online Daily Time Record': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-tight"><MonitorSmartphone size={10} /> ODTR</span>;
        case 'Attendance Adjustment Record': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-tight"><Settings2 size={10} /> Adjustment</span>;
        default: return null;
    }
};



const SimpleStepper = ({ steps }: { steps: { title: string; subtitle: string; status: 'completed' | 'current' | 'pending'; date?: string }[] }) => {
    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-10 mt-2 px-4">
            {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                    <div className="flex flex-col items-center relative min-w-[100px]">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                            step.status === 'completed' ? 'bg-emerald-500 text-white shadow-sm' :
                            step.status === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50' :
                            'bg-white text-slate-300 border border-slate-200'
                        }`}>
                            {step.status === 'completed' ? <Check size={14} strokeWidth={3} /> : <span className="text-[9px] font-bold">{idx + 1}</span>}
                        </motion.div>
                        <div className="mt-2.5 flex flex-col items-center text-center">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.title}</span>
                            <span className="text-[9px] text-slate-500 font-bold mt-0.5">{step.subtitle}</span>
                            {step.date && <span className="text-[8px] text-slate-400 font-mono mt-0.5">{step.date}</span>}
                        </div>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className="flex-1 h-[2px] bg-slate-100 mx-[-1px] relative -mt-11 z-0 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: step.status === 'completed' ? '100%' : '0%' }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const AttendanceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setPageTitle } = useBreadcrumb();

    const [activeTab, setActiveTab] = useState<'Attendance Sources' | 'Consolidated View'>('Attendance Sources');
    const [expandedSource, setExpandedSource] = useState<string | null>('tcd');
    const [selectedDocument, setSelectedDocument] = useState<{title: string, date: string, source: string} | null>(null);

    React.useEffect(() => {
        setPageTitle('Employee Log Details');
    }, [setPageTitle]);

    const toggleSource = (source: string) => {
        if (expandedSource === source) setExpandedSource(null);
        else setExpandedSource(source);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mb-20 max-w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/monitor/attendance')} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Time Record</h1>
                        <p className="text-sm font-medium text-slate-500">Attendance logs and documents for {id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 border border-slate-200 rounded-xl bg-white flex items-center gap-2 text-sm font-bold text-slate-700 shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        Aug 06 - Aug 20, 2025
                    </div>
                </div>
            </div>

            {/* Employee Profile Widget */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center relative shadow-inner overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&auto=format&fit=crop" alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-slate-900">{id}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200"><User size={12} /> Frontend Developer</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200"><LayoutGrid size={12} /> Development Dept</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm"><CheckCircle2 size={12} /> Active</span>
                    </div>
                </div>
                <div className="flex gap-4 shrink-0 mt-4 md:mt-0 pb-4 md:pb-0 mx-4 md:mx-0 border-b md:border-b-0 border-slate-100">
                    <div className="text-center px-4 md:border-r border-slate-100">
                        <div className="text-2xl font-black text-indigo-600 font-mono">11</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Days</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-2xl font-black text-rose-500 font-mono">1</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exceptions</div>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
                <div className="border-b border-slate-100 px-6 pt-6 flex gap-6 bg-slate-50/50">
                    {['Attendance Sources', 'Consolidated View'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab
                                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'
                                : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-0">
                    {activeTab === 'Consolidated View' && (
                        <div className="animate-in fade-in pt-4">
                            <div className="px-6 pb-4 flex items-center justify-between border-b border-slate-50">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Consolidated Daily Time Record</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Unified view of all approved attendance logs</p>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/80">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32 border-b border-slate-200 text-left">Date</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32 border-b border-slate-200 text-center">Weekday</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-40 border-b border-slate-200 text-center">Shift</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 border-b border-slate-200 text-center">In</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 border-b border-slate-200 text-center">Out</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[200px] border-b border-slate-200 text-left">Remarks</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-48 border-b border-slate-200 text-center">Data Source</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16 border-b border-slate-200 text-center">Form</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {MOCK_CONSOLIDATED.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <tr className={`hover:bg-slate-50/30 transition-colors ${row.adjustment ? 'bg-slate-50/50' : ''} ${row.shift === 'Rest Day' ? 'opacity-50' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 text-left">{row.date}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium text-center">{row.weekday}</td>
                                                    <td className={`px-4 py-4 whitespace-nowrap text-[11px] font-medium text-center ${row.shift === 'Rest Day' ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>{row.shift}</td>
                                                    <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${row.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : 'text-slate-700'}`}>{row.in}</td>
                                                    <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${row.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : 'text-slate-700'}`}>{row.out}</td>
                                                    <td className="px-4 py-4 text-left"><div className={`text-xs ${row.adjustment ? 'text-slate-400 italic' : 'text-slate-600'}`}>{row.remarks || '-'}</div></td>
                                                    <td className="px-6 py-4 text-center items-center justify-center flex"><SourceBadge source={row.source} /></td>
                                                    <td className="px-4 py-4 text-center">
                                                        {row.source && row.shift !== 'Rest Day' && (
                                                            <button 
                                                                onClick={() => setSelectedDocument({ title: row.source === 'Time Collection Device' ? 'Biometrics Log' : row.source === 'Online Daily Time Record' ? 'ODTR Form' : 'Adjustment Form', date: row.date, source: row.source })}
                                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                                                                title={`View ${row.source} Document`}
                                                            >
                                                                <FileText size={16} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                {row.adjustment && (
                                                    <tr className="bg-indigo-50/30 border-t-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] hover:bg-indigo-50/50 transition-colors relative">
                                                        {/* Visual connection line */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 relative">
                                                            <div className="absolute top-0 left-8 w-px h-full bg-indigo-200/50 -translate-y-full"></div>
                                                            <div className="flex items-center gap-2 pl-4"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div><span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Adjusted</span></div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-xs text-indigo-400 font-medium"></td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-[11px] text-indigo-400 font-medium"></td>
                                                        <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-indigo-700 text-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-lg scale-95 border border-indigo-50">{row.adjustment.in}</td>
                                                        <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-indigo-700 text-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.02)] rounded-lg scale-95 border border-indigo-50">{row.adjustment.out}</td>
                                                        <td className="px-4 py-4"><div className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 "><AlertCircle size={14} className="text-indigo-400" /> {row.adjustment.remarks}</div></td>
                                                        <td className="px-6 py-4"><SourceBadge source={row.adjustment.source} /></td>
                                                        <td className="px-4 py-4 text-center">
                                                            <button 
                                                                onClick={() => setSelectedDocument({ title: 'Attendance Adjustment Form', date: row.date, source: row.adjustment.source })}
                                                                className="p-1.5 text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100/50 rounded-lg transition-colors inline-flex"
                                                                title="View Adjustment Document"
                                                            >
                                                                <FileText size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Attendance Sources' && (
                        <div className="animate-in fade-in">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/80 text-left">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-48">Name</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Type</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cutoff Date</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Approver Step</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Approved By</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Approved</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified By</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Verified</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {/* TCD Source */}
                                        <React.Fragment>
                                            <tr 
                                                onClick={() => toggleSource('tcd')} 
                                                className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedSource === 'tcd' ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">Daily Time Record # 1</td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-tight"><Fingerprint size={10} /> Time Collection Device</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">Verified</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium tracking-tight">Aug 06 - Aug 20, 2025</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-100 shadow-sm">1 / 1</span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">System</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium tracking-tight">Aug 20, 2025</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">HR Specialist</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium tracking-tight">Aug 20, 2025</td>
                                            </tr>
                                            {expandedSource === 'tcd' && (
                                                <tr>
                                                    <td colSpan={10} className="p-0 bg-slate-50/30">
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden border-t border-slate-100">
                                                            <div className="p-8">
                                                                <SimpleStepper steps={[
                                                                    { title: 'Submitted', subtitle: 'Auto-Record', status: 'completed', date: 'Aug 20, 2025' },
                                                                    { title: 'System Approval', subtitle: 'Step 1/1', status: 'completed', date: 'Aug 20, 2025' },
                                                                    { title: 'HR Verified', subtitle: 'HR Specialist', status: 'completed', date: 'Aug 20, 2025' }
                                                                ]} />
                                                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                                    <table className="min-w-full divide-y divide-slate-100">
                                                                        <thead className="bg-slate-50/50">
                                                                            <tr>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-24">Date</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Shift</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-50">
                                                                            {MOCK_TCD.map((row, i) => (
                                                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                                                    <td className="px-6 py-3 text-slate-700 font-bold pl-24">{row.date}</td>
                                                                                    <td className="px-4 py-3 text-slate-500 font-medium">{row.shift}</td>
                                                                                    <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.in}</td>
                                                                                    <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.out}</td>
                                                                                    <td className="px-6 py-3 text-slate-600">{row.remarks || '-'}</td>
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
                                        </React.Fragment>

                                        {/* ODTR Source */}
                                        <React.Fragment>
                                            <tr 
                                                onClick={() => toggleSource('odtr')} 
                                                className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedSource === 'odtr' ? 'bg-purple-50/30' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">Daily Time Record # 2</td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-50 text-purple-600 font-bold text-[10px] uppercase tracking-tight"><MonitorSmartphone size={10} /> ODTR</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 font-bold text-[10px]">Pending Approval</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium tracking-tight">Aug 06 - Aug 20, 2025</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono font-bold border border-amber-100 shadow-sm">1 / 2</span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">Juan Dela Cruz</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium tracking-tight">Aug 20, 2025</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                            </tr>
                                            {expandedSource === 'odtr' && (
                                                <tr>
                                                    <td colSpan={10} className="p-0 bg-slate-50/30">
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden border-t border-slate-100">
                                                            <div className="p-8">
                                                                <SimpleStepper steps={[
                                                                    { title: 'Submitted', subtitle: 'Employee Log', status: 'completed', date: 'Aug 20, 2025' },
                                                                    { title: 'Supervisor', subtitle: 'Step 1/2', status: 'completed', date: 'Aug 20, 2025' },
                                                                    { title: 'Dept Head', subtitle: 'Step 2/2', status: 'current' },
                                                                    { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                                                ]} />
                                                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                                    <table className="min-w-full divide-y divide-slate-100">
                                                                        <thead className="bg-slate-50/50">
                                                                            <tr>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-24">Date</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Shift</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-50">
                                                                            {MOCK_ODTR.map((row, i) => (
                                                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                                                    <td className="px-6 py-3 text-slate-700 font-bold pl-24">{row.date}</td>
                                                                                    <td className="px-4 py-3 text-slate-500 font-medium">{row.shift}</td>
                                                                                    <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.in}</td>
                                                                                    <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.out}</td>
                                                                                    <td className="px-6 py-3 text-slate-600">{row.remarks || '-'}</td>
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
                                        </React.Fragment>

                                        {/* Adjustment Source */}
                                        <React.Fragment>
                                            <tr 
                                                onClick={() => toggleSource('adj')} 
                                                className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedSource === 'adj' ? 'bg-indigo-50/30' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">Daily Time Record # 3</td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 font-bold text-[10px] uppercase tracking-tight"><Settings2 size={10} /> Adjustment Record</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">Submitted</span></td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 font-medium tracking-tight">Aug 06 - Aug 20, 2025</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-center">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-400 font-mono font-bold border border-slate-200">0 / 2</span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-medium tracking-tight">--</td>
                                            </tr>
                                            {expandedSource === 'adj' && (
                                                <tr>
                                                    <td colSpan={10} className="p-0 bg-slate-50/30">
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden border-t border-slate-100">
                                                            <div className="p-8">
                                                                <SimpleStepper steps={[
                                                                    { title: 'Submitted', subtitle: 'Adjustment Form', status: 'completed', date: 'Aug 20, 2025' },
                                                                    { title: 'Superior', subtitle: 'Step 1/2', status: 'current' },
                                                                    { title: 'Dept Head', subtitle: 'Step 2/2', status: 'pending' },
                                                                    { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                                                ]} />
                                                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                                                    <table className="min-w-full divide-y divide-slate-100">
                                                                        <thead className="bg-slate-50/50">
                                                                            <tr>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-24">Date & Type</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Original Log</th>
                                                                                <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Adjustment</th>
                                                                                <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-50">
                                                                            {MOCK_ADJ.map((row, i) => (
                                                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                                                    <td className="px-6 py-4 pl-24">
                                                                                        <div className="text-slate-700 font-bold mb-1">{row.date}</div>
                                                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-tight"><AlertCircle size={10} /> {row.type}</span>
                                                                                    </td>
                                                                                    <td className="px-4 py-4 text-center">
                                                                                        <div className="flex gap-2 justify-center">
                                                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">IN: {row.original.in}</span>
                                                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">OUT: {row.original.out}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-4 py-4 text-center">
                                                                                        <div className="flex gap-2 justify-center">
                                                                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-16">{row.adjusted.in}</span>
                                                                                            <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-16">{row.adjusted.out}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="px-6 py-4 text-slate-600 max-w-[200px] italic">{row.remarks}</td>
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
                                        </React.Fragment>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Modal */}
            <AnimatePresence>
                {selectedDocument && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{selectedDocument.title}</h3>
                                            <p className="text-xs font-medium text-slate-500">{selectedDocument.date} • Reference Document</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDocument(null)}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto bg-white p-8">
                                    {/* Stepper Section */}
                                    <div className="mb-10">
                                        {selectedDocument.source === 'Time Collection Device' && (
                                            <SimpleStepper steps={[
                                                { title: 'Submitted', subtitle: 'Auto-Record', status: 'completed', date: selectedDocument.date },
                                                { title: 'System Approval', subtitle: 'Step 1/1', status: 'completed', date: selectedDocument.date },
                                                { title: 'HR Verified', subtitle: 'HR Specialist', status: 'completed', date: selectedDocument.date }
                                            ]} />
                                        )}
                                        {selectedDocument.source === 'Online Daily Time Record' && (
                                            <SimpleStepper steps={[
                                                { title: 'Submitted', subtitle: 'Employee Log', status: 'completed', date: selectedDocument.date },
                                                { title: 'Supervisor', subtitle: 'Step 1/2', status: 'completed', date: selectedDocument.date },
                                                { title: 'Dept Head', subtitle: 'Step 2/2', status: 'current' },
                                                { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                            ]} />
                                        )}
                                        {selectedDocument.source === 'Attendance Adjustment Record' && (
                                            <SimpleStepper steps={[
                                                { title: 'Submitted', subtitle: 'Adjustment Form', status: 'completed', date: selectedDocument.date },
                                                { title: 'Superior', subtitle: 'Step 1/2', status: 'current' },
                                                { title: 'Dept Head', subtitle: 'Step 2/2', status: 'pending' },
                                                { title: 'HR Verified', subtitle: 'Pending', status: 'pending' }
                                            ]} />
                                        )}
                                    </div>

                                    {/* Data Table Section */}
                                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                        {selectedDocument.source === 'Attendance Adjustment Record' ? (
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50/50 text-left">
                                                    <tr>
                                                        <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-10">Date & Type</th>
                                                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Original Log</th>
                                                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Adjustment</th>
                                                        <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {MOCK_ADJ.map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                            <td className="px-6 py-4 pl-10">
                                                                <div className="text-slate-700 font-bold mb-1">{row.date}</div>
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-tight"><AlertCircle size={10} /> {row.type}</span>
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <div className="flex gap-2 justify-center">
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">IN: {row.original.in}</span>
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md font-mono text-[10px] decoration-slate-300 line-through">OUT: {row.original.out}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-center">
                                                                <div className="flex gap-2 justify-center">
                                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-16">{row.adjusted.in}</span>
                                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm rounded-md font-mono text-[10px] font-bold text-center w-16">{row.adjusted.out}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 max-w-[200px] italic">{row.remarks}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <table className="min-w-full divide-y divide-slate-100">
                                                <thead className="bg-slate-50/50 text-left">
                                                    <tr>
                                                        <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left pl-10">Date</th>
                                                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Shift</th>
                                                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                        <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                        <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {(selectedDocument.source === 'Time Collection Device' ? MOCK_TCD : MOCK_ODTR).map((row: any, i: number) => (
                                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors text-xs text-left">
                                                            <td className="px-6 py-3 text-slate-700 font-bold pl-10">{row.date}</td>
                                                            <td className="px-4 py-3 text-slate-500 font-medium">{row.shift}</td>
                                                            <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.in}</td>
                                                            <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.out}</td>
                                                            <td className="px-6 py-3 text-slate-600 italic font-medium">{row.remarks || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
                                    <button
                                        onClick={() => setSelectedDocument(null)}
                                        className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                                    >
                                        Close Viewer
                                    </button>
                                </div>
                            </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AttendanceDetail;
