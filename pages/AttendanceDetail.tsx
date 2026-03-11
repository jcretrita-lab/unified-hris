import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, FileText, Clock, User, Fingerprint,
    MonitorSmartphone, Settings2, Search, Filter, AlertCircle,
    CheckCircle2, Plus, PenSquare, LayoutGrid
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
];

const MOCK_ODTR = [
    { date: 'Aug 11, 2025', weekday: 'Monday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home ODTR' },
    { date: 'Aug 12, 2025', weekday: 'Tuesday', shift: '8:00 AM - 5:00 PM', in: '08:00 AM', out: '05:00 PM', remarks: 'Work from Home ODTR' },
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
];

const SourceBadge = ({ source }: { source: string }) => {
    switch (source) {
        case 'Time Collection Device': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-tight"><Fingerprint size={10} /> Biometrics</span>;
        case 'Online Daily Time Record': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[9px] font-bold uppercase tracking-tight"><MonitorSmartphone size={10} /> ODTR</span>;
        case 'Attendance Adjustment Record': return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-tight"><Settings2 size={10} /> Adjustment</span>;
        default: return null;
    }
};

const AttendanceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { setPageTitle } = useBreadcrumb();

    const [activeTab, setActiveTab] = useState<'Attendance Sources' | 'Consolidated View'>('Consolidated View');
    const [expandedSource, setExpandedSource] = useState<string | null>('tcd');

    React.useEffect(() => {
        setPageTitle('Employee Log Details');
    }, [setPageTitle]);

    const toggleSource = (source: string) => {
        if (expandedSource === source) setExpandedSource(null);
        else setExpandedSource(source);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mb-20 max-w-7xl">
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
                    {['Consolidated View', 'Attendance Sources'].map((tab) => (
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
                                    <thead className="bg-slate-50/80 text-left">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32 border-b border-slate-200">Date</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-32 border-b border-slate-200">Weekday</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-40 border-b border-slate-200">Shift</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 border-b border-slate-200 text-center">In</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24 border-b border-slate-200 text-center">Out</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[200px] border-b border-slate-200">Remarks</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-48 border-b border-slate-200">Data Source</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {MOCK_CONSOLIDATED.map((row) => (
                                            <React.Fragment key={row.id}>
                                                <tr className={`hover:bg-slate-50/30 transition-colors ${row.adjustment ? 'bg-slate-50/50' : ''}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{row.date}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">{row.weekday}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-[11px] text-slate-600 font-medium">{row.shift}</td>
                                                    <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${row.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : 'text-slate-700'}`}>{row.in}</td>
                                                    <td className={`px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-center ${row.adjustment ? 'text-slate-400 line-through decoration-rose-500/50 decoration-2' : 'text-slate-700'}`}>{row.out}</td>
                                                    <td className="px-4 py-4"><div className={`text-xs ${row.adjustment ? 'text-slate-400 italic' : 'text-slate-600'}`}>{row.remarks}</div></td>
                                                    <td className="px-6 py-4"><SourceBadge source={row.source} /></td>
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
                        <div className="p-6 space-y-4 animate-in fade-in">
                            {/* Time Collection Device Accordion */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                                <button
                                    className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${expandedSource === 'tcd' ? 'bg-blue-50/30 border-b border-blue-100' : 'hover:bg-slate-50'}`}
                                    onClick={() => toggleSource('tcd')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${expandedSource === 'tcd' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Fingerprint size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-base font-bold ${expandedSource === 'tcd' ? 'text-blue-900' : 'text-slate-900'}`}>Time Collection Device Logs</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Physical biometric authentication records</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-600">3 Records</div>
                                        <Plus size={20} className={`text-slate-400 transition-transform ${expandedSource === 'tcd' ? 'rotate-45 text-blue-500' : ''}`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {expandedSource === 'tcd' && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-0 border-t border-slate-100">
                                                <table className="min-w-full divide-y divide-slate-50">
                                                    <thead className="bg-slate-50/50 text-left">
                                                        <tr>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-24">Date</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 bg-white">
                                                        {MOCK_TCD.map((row, i) => (
                                                            <tr key={i} className="hover:bg-slate-50 text-xs transition-colors">
                                                                <td className="px-6 py-3 pl-24 text-slate-700 font-bold">{row.date}</td>
                                                                <td className="px-4 py-3 text-slate-500 font-medium">{row.shift}</td>
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.in}</td>
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.out}</td>
                                                                <td className="px-6 py-3 text-slate-600">{row.remarks}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Online Daily Time Record Accordion */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                                <button
                                    className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${expandedSource === 'odtr' ? 'bg-purple-50/30 border-b border-purple-100' : 'hover:bg-slate-50'}`}
                                    onClick={() => toggleSource('odtr')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${expandedSource === 'odtr' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <MonitorSmartphone size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-base font-bold ${expandedSource === 'odtr' ? 'text-purple-900' : 'text-slate-900'}`}>Online Daily Time Records</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Web-based attendance submissions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-600">2 Records</div>
                                        <Plus size={20} className={`text-slate-400 transition-transform ${expandedSource === 'odtr' ? 'rotate-45 text-purple-500' : ''}`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {expandedSource === 'odtr' && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-0 border-t border-slate-100">
                                                <table className="min-w-full divide-y divide-slate-50">
                                                    <thead className="bg-slate-50/50 text-left">
                                                        <tr>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-24">Date</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">In</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Out</th>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 bg-white">
                                                        {MOCK_ODTR.map((row, i) => (
                                                            <tr key={i} className="hover:bg-slate-50 text-xs transition-colors">
                                                                <td className="px-6 py-3 pl-24 text-slate-700 font-bold">{row.date}</td>
                                                                <td className="px-4 py-3 text-slate-500 font-medium">{row.shift}</td>
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.in}</td>
                                                                <td className="px-4 py-3 font-mono font-bold text-slate-700 text-center">{row.out}</td>
                                                                <td className="px-6 py-3 text-slate-600">{row.remarks}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Adjustment Record Accordion */}
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                                <button
                                    className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${expandedSource === 'adj' ? 'bg-indigo-50/30 border-b border-indigo-100' : 'hover:bg-slate-50'}`}
                                    onClick={() => toggleSource('adj')}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${expandedSource === 'adj' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Settings2 size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`text-base font-bold ${expandedSource === 'adj' ? 'text-indigo-900' : 'text-slate-900'}`}>Attendance Adjustment Records</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Approved manual overrides and corrections</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-bold text-slate-600">1 Record</div>
                                        <Plus size={20} className={`text-slate-400 transition-transform ${expandedSource === 'adj' ? 'rotate-45 text-indigo-500' : ''}`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {expandedSource === 'adj' && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-0 border-t border-slate-100">
                                                <table className="min-w-full divide-y divide-slate-50">
                                                    <thead className="bg-slate-50/50 text-left">
                                                        <tr>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-24">Date & Type</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Original Log</th>
                                                            <th className="px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Adjustment</th>
                                                            <th className="px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50 bg-white">
                                                        {MOCK_ADJ.map((row, i) => (
                                                            <tr key={i} className="hover:bg-slate-50 text-xs transition-colors">
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
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceDetail;
