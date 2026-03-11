import React, { useState, useRef } from 'react';
import {
    Search,
    Calendar,
    Building2,
    ChevronDown,
    Download,
    Upload,
    Fingerprint,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    X,
    FileSpreadsheet,
    Plus,
    History,
    GitBranch,
    Check,
    AlertCircle,
    Cpu,
    CreditCard,
    Smartphone,
    User,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';

interface BiometricReport {
    id: string;
    employee: {
        name: string;
        role: string;
        avatar: string;
        department: string;
    };
    biometricId: string;
    device: string;
    dateUploaded: string;
    uploadedBy: string;
    // Mock detailed logs for the accordion
    logs: {
        date: string;
        weekday: string;
        in: string;
        out: string;
        remarks: string;
    }[];
}

const MOCK_DATA: Record<string, BiometricReport[]> = {
    'Present': [
        {
            id: 'bio-1',
            employee: {
                name: 'James Cordon',
                role: 'IT Developer Intern',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop',
                department: 'IT Department'
            },
            biometricId: 'BIO-001',
            device: 'Main Entrance - Reader A',
            dateUploaded: 'Aug 10, 2025',
            uploadedBy: 'Admin User',
            logs: [
                { date: 'Aug 09, 2025', weekday: 'Saturday', in: '08:01:00 AM', out: '05:00:00 PM', remarks: 'Normal' },
                { date: 'Aug 08, 2025', weekday: 'Friday', in: '07:55:12 AM', out: '06:05:22 PM', remarks: 'Overtime' },
                { date: 'Aug 07, 2025', weekday: 'Thursday', in: '08:05:00 AM', out: '05:02:10 PM', remarks: 'Late' }
            ]
        },
        {
            id: 'bio-2',
            employee: {
                name: 'Louis Panganiban',
                role: 'Senior Developer',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop',
                department: 'IT Department'
            },
            biometricId: 'BIO-002',
            device: 'Production Floor - B1',
            dateUploaded: 'Aug 10, 2025',
            uploadedBy: 'HR Assistant',
            logs: [
                { date: 'Aug 09, 2025', weekday: 'Saturday', in: '07:15:22 AM', out: '04:15:00 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'bio-3',
            employee: {
                name: 'Sarah Wilson',
                role: 'HR Manager',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop',
                department: 'HR Department'
            },
            biometricId: 'BIO-003',
            device: 'Main Entrance - Reader A',
            dateUploaded: 'Aug 12, 2025',
            uploadedBy: 'Admin User',
            logs: [
                { date: 'Aug 09, 2025', weekday: 'Saturday', in: '08:55:10 AM', out: '05:55:00 PM', remarks: 'Normal' }
            ]
        }
    ],
    'Past': [
        {
            id: 'bio-past-1',
            employee: {
                name: 'Alice Johnson',
                role: 'UX Designer',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop',
                department: 'Design Dept'
            },
            biometricId: 'BIO-101',
            device: 'HQ Gate 1',
            dateUploaded: 'Aug 01, 2025',
            uploadedBy: 'System Bot',
            logs: [
                { date: 'Jul 30, 2025', weekday: 'Wednesday', in: '09:00:00 AM', out: '06:00:00 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'bio-past-2',
            employee: {
                name: 'Robert Smith',
                role: 'Security lead',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop',
                department: 'Operations'
            },
            biometricId: 'BIO-202',
            device: 'HQ Gate 1',
            dateUploaded: 'Aug 01, 2025',
            uploadedBy: 'System Bot',
            logs: [
                { date: 'Jul 30, 2025', weekday: 'Wednesday', in: '07:00:00 AM', out: '07:00:00 PM', remarks: '12h Shift' }
            ]
        },
        {
            id: 'bio-past-3',
            employee: {
                name: 'Michael Chen',
                role: 'Procurement Specialist',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop',
                department: 'Logistics'
            },
            biometricId: 'BIO-303',
            device: 'Warehouse B - Dock 4',
            dateUploaded: 'Aug 01, 2025',
            uploadedBy: 'Warehouse Admin',
            logs: [
                { date: 'Jul 31, 2025', weekday: 'Thursday', in: '06:00:00 AM', out: '03:00:00 PM', remarks: 'Morning Shift' }
            ]
        },
        {
            id: 'bio-past-4',
            employee: {
                name: 'Emily Davis',
                role: 'HR Specialist',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&auto=format&fit=crop',
                department: 'HR Department'
            },
            biometricId: 'BIO-404',
            device: 'Main Entrance - Reader B',
            dateUploaded: 'Aug 02, 2025',
            uploadedBy: 'Admin User',
            logs: [
                { date: 'Jul 29, 2025', weekday: 'Tuesday', in: '08:15:00 AM', out: '05:15:00 PM', remarks: 'Normal' }
            ]
        },
        {
            id: 'bio-past-5',
            employee: {
                name: 'David Wilson',
                role: 'Accounting Lead',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&auto=format&fit=crop',
                department: 'Finance'
            },
            biometricId: 'BIO-505',
            device: 'Finance Wing - F1',
            dateUploaded: 'Aug 01, 2025',
            uploadedBy: 'Finance Admin',
            logs: [
                { date: 'Jul 30, 2025', weekday: 'Wednesday', in: '08:30:15 AM', out: '06:00:10 PM', remarks: 'Normal' }
            ]
        }
    ],
    'Future': []
};

const DEVICE_TEMPLATES = [
    {
        id: 'biometric-generic',
        name: 'Biometric Device Log',
        description: 'Standard format for facial, fingerprint, and palm recognition hardware devices.',
        icon: <Fingerprint size={16} />,
        type: 'Biometric',
        columns: ['Department', 'User ID', 'First Name', 'Last Name', 'Date', 'Weekday', 'In', 'Out', 'Remarks'],
        rows: [
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-03', 'Sunday', '-', '-', 'Rest Day'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-04', 'Monday', '07:50:00 AM', '05:00:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-05', 'Tuesday', '07:55:00 AM', '05:05:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-06', 'Wednesday', '08:10:00 AM', '05:00:00 PM', 'Late'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-07', 'Thursday', '08:05:00 AM', '05:02:10 PM', 'Late'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-08', 'Friday', '07:55:12 AM', '06:05:22 PM', 'Overtime'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-09', 'Saturday', '08:01:00 AM', '05:00:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-10', 'Sunday', '-', '-', 'Rest Day'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-11', 'Monday', '07:58:00 AM', '05:00:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-12', 'Tuesday', '07:52:00 AM', '05:10:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-13', 'Wednesday', '07:59:00 AM', '05:00:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-14', 'Thursday', '08:02:00 AM', '05:00:00 PM', 'Normal'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-15', 'Friday', '07:50:00 AM', '06:30:00 PM', 'Overtime'],
            ['IT Department', 'EMP-001', 'James', 'Cordon', '2025-08-16', 'Saturday', '08:15:00 AM', '05:00:00 PM', 'Late'],
        ]
    },
    {
        id: 'proximity-proximity',
        name: 'Standard Proximity Badge Export',
        description: 'CSV export format for RFID and proximity card reader security systems.',
        icon: <CreditCard size={16} />,
        type: 'Badge Reader',
        columns: ['Card Number', 'Site Code', 'Access Time', 'Door Name', 'Access Granted'],
        rows: [
            ['67823412', '112', '2025-08-09 07:15:22', 'MAIN-EXIT', 'TRUE'],
            ['12938445', '112', '2025-08-09 07:18:00', 'SERVER-ROOM-4', 'TRUE'],
        ]
    },
    {
        id: 'pos-log',
        name: 'Point-of-Sale Login Sync',
        description: 'Attendance records extracted from POS terminal login/logout activities.',
        icon: <Cpu size={16} />,
        type: 'POS Terminal',
        columns: ['Terminal ID', 'Staff ID', 'Session Start', 'Session End', 'Total Hours'],
        rows: [
            ['TERM-01', 'STAFF001', '2025-08-09 09:00:00', '2025-08-09 18:00:00', '9.0'],
        ]
    },
    {
        id: 'mobile-gps',
        name: 'Mobile App GPS Punch',
        description: 'Log format for remote/field employees using the unified mobile app with geofencing.',
        icon: <Smartphone size={16} />,
        type: 'Mobile GPS',
        columns: ['User ID', 'Log Type', 'GPS Lat', 'GPS Long', 'Accuracy (m)', 'Timestamp'],
        rows: [
            ['REMOTE-01', 'PUNCH_IN', '14.5995', '120.9842', '5', '2025-08-09 07:45:00'],
        ]
    }
];

const Avatar = ({ src, initials, className = "w-8 h-8", online = false }: any) => (
    <div className={`relative ${className}`}>
        <img src={src} alt={initials} className={`${className} rounded-full object-cover border border-slate-200`} />
        {online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
    </div>
);

const CUTOFFS = [
    { id: 'past-3', range: 'Jun 21 - Jul 05, 2025', status: 'Past' },
    { id: 'past-2', range: 'Jul 06 - Jul 20, 2025', status: 'Past' },
    { id: 'past-1', range: 'Jul 21 - Aug 05, 2025', status: 'Past' },
    { id: 'current', range: 'Aug 06 - Aug 20, 2025', status: 'Present' },
    { id: 'future-1', range: 'Aug 21 - Sep 05, 2025', status: 'Future' },
    { id: 'future-2', range: 'Sep 06 - Sep 20, 2025', status: 'Future' },
];

export const TimeCollectionDeviceRecord: React.FC<{
    activeSourceTab: string;
    setActiveSourceTab: (tab: any) => void;
}> = ({ activeSourceTab, setActiveSourceTab }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selectedCutoff, setSelectedCutoff] = useState(CUTOFFS[1].range);
    const [isCutoffOpen, setIsCutoffOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const cutoffRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cutoffRef.current && !cutoffRef.current.contains(event.target as Node)) {
                setIsCutoffOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Modal Specific State
    const [selectedTemplate, setSelectedTemplate] = useState(DEVICE_TEMPLATES[0]);
    const [templateSearch, setTemplateSearch] = useState('');
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'matching' | 'success' | 'error'>('idle');
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentStatus = CUTOFFS.find(c => c.range === selectedCutoff)?.status || 'Present';
    const currentRecords = MOCK_DATA[currentStatus] || [];

    const filteredBiometrics = currentRecords.filter((r: BiometricReport) =>
        r.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.biometricId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadStatus('matching');
        setTimeout(() => {
            if (file.name.includes('invalid')) {
                setUploadStatus('error');
                setUploadError('CSV headers do not match the selected device template. Please use the official template.');
            } else {
                setUploadStatus('success');
            }
        }, 1500);
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
                                placeholder="Search device records..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                        {CUTOFFS.find(c => c.range === selectedCutoff)?.status === 'Present' && (
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
                            onClick={() => setIsDownloadModalOpen(true)}
                            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                            <Download size={14} /> Download Template
                        </button>
                        <button
                            onClick={() => {
                                setIsUploadModalOpen(true);
                                setUploadStatus('idle');
                            }}
                            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                            <Upload size={14} /> Upload Records
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="bg-slate-50/50 text-left">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Bio ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Device</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Date Uploaded</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">Uploaded By</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right border-b border-slate-50">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredBiometrics.length > 0 ? (
                                filteredBiometrics.map((bio: BiometricReport) => (
                                    <React.Fragment key={bio.id}>
                                        <tr
                                            className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${expandedId === bio.id ? 'bg-slate-50/50' : ''}`}
                                            onClick={() => toggleExpand(bio.id)}
                                        >
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={bio.employee.avatar}
                                                        initials={bio.employee.avatar.length > 2 ? bio.employee.name.split(' ').map((n: string) => n[0]).join('') : bio.employee.avatar}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{bio.employee.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{bio.employee.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{bio.biometricId}</span>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-xs font-bold text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Fingerprint size={14} className="text-slate-400" />
                                                    {bio.device}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-xs font-bold text-slate-500 italic">
                                                {bio.dateUploaded}
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                        {bio.uploadedBy.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{bio.uploadedBy}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-50 text-right">
                                                <button className={`p-2 transition-all rounded-lg ${expandedId === bio.id ? 'bg-indigo-100 text-indigo-600 rotate-180' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                    <ChevronDown size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {expandedId === bio.id && (
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
                                                                                <th className="px-6 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">In</th>
                                                                                <th className="px-6 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Out</th>
                                                                                <th className="px-6 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">Remarks</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-slate-50">
                                                                            {bio.logs.map((log: any, idx: number) => (
                                                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-xs">
                                                                                    <td className="px-6 py-3 font-bold text-slate-700">{log.date}</td>
                                                                                    <td className="px-6 py-3 text-slate-500 font-medium">{log.weekday}</td>
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
                                                {currentStatus === 'Future' ? <Clock size={48} /> : <Calendar size={48} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-slate-900 font-bold text-base">
                                                    {currentStatus === 'Future' ? "Future Cutoff Period" : "No Records Found"}
                                                </h4>
                                                <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                                                    {currentStatus === 'Future'
                                                        ? "The selected timeframe is scheduled for a future cutoff cycle. Detailed biometric logs will become available once the period synchronization commences."
                                                        : "We couldn't find any biometric records for this specific cutoff period."}
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredBiometrics.length} Employee Summaries</span>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                        </div>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Template Download Modal */}
            <Modal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} className="max-w-6xl w-[90vw]">
                <div className="flex flex-col h-[75vh] overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Device Data Templates</h3>
                                <p className="text-xs text-slate-500 font-medium">Standardized import formats for multiple collection methods</p>
                            </div>
                        </div>
                        <button onClick={() => setIsDownloadModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-80 border-r border-slate-100 bg-slate-50 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search devices..."
                                        className="w-full bg-slate-100 border-none rounded-lg py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 ring-indigo-100 transition-all"
                                        value={templateSearch}
                                        onChange={e => setTemplateSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Available Formats</div>
                                {DEVICE_TEMPLATES.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t)}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${selectedTemplate?.id === t.id ? 'bg-white border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${selectedTemplate?.id === t.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                                                {t.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-bold truncate ${selectedTemplate?.id === t.id ? 'text-indigo-900' : 'text-slate-700'}`}>{t.name}</div>
                                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.type}</div>
                                            </div>
                                            {selectedTemplate?.id === t.id && <ChevronRightIcon size={14} className="text-indigo-400" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="flex-1 bg-white flex flex-col overflow-hidden">
                            {selectedTemplate ? (
                                <>
                                    <div className="p-8 border-b border-slate-50 shrink-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-2xl font-extrabold text-slate-900">{selectedTemplate.name}</h4>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                                                {selectedTemplate.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{selectedTemplate.description}</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-8 pt-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Column Structure Preview</div>
                                        <div className="border border-slate-100 rounded-2xl overflow-x-auto shadow-sm bg-slate-50/20">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest border-b border-slate-100">
                                                    <tr>
                                                        {selectedTemplate.columns.map((col, i) => (
                                                            <th key={i} className="px-6 py-4 whitespace-nowrap">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 bg-white">
                                                    {selectedTemplate.rows.map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                            {row.map((val, j) => (
                                                                <td key={j} className="px-6 py-3 font-mono text-slate-700 whitespace-nowrap">{val}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-end">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                            <Download size={16} /> Download CSV Template
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-400 italic">
                                    Select a device type to preview its template
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Upload Modal (Wizard Style) */}
            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
                <div className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-500 ${uploadStatus === 'idle' ? 'bg-indigo-50 text-indigo-600' :
                        uploadStatus === 'matching' ? 'bg-amber-50 text-amber-600' :
                            uploadStatus === 'success' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-rose-50 text-rose-600'
                        }`}>
                        {uploadStatus === 'idle' && <Upload size={32} />}
                        {uploadStatus === 'matching' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><History size={32} /></motion.div>}
                        {uploadStatus === 'success' && <Check size={32} />}
                        {uploadStatus === 'error' && <AlertCircle size={32} />}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {uploadStatus === 'idle' && "Upload Device Logs"}
                        {uploadStatus === 'matching' && "Validating Structure..."}
                        {uploadStatus === 'success' && "Data Ready for Sync"}
                        {uploadStatus === 'error' && "Validation Failed"}
                    </h3>

                    <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
                        {uploadStatus === 'idle' && "Select your device type and upload the log file exported from your hardware."}
                        {uploadStatus === 'matching' && "Comparing CSV headers with the selected device template logic."}
                        {uploadStatus === 'success' && "The file headers match our system perfectly. You can now commit the upload."}
                        {uploadStatus === 'error' && uploadError}
                    </p>

                    <div className="space-y-4 text-left">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Device Source</label>
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 ring-indigo-100 appearance-none cursor-pointer"
                                    value={selectedTemplate.id}
                                    onChange={(e) => setSelectedTemplate(DEVICE_TEMPLATES.find(t => t.id === e.target.value) || DEVICE_TEMPLATES[0])}
                                >
                                    {DEVICE_TEMPLATES.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".csv"
                        />

                        {uploadStatus === 'idle' || uploadStatus === 'error' ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-indigo-300 transition-all group"
                            >
                                <Plus size={24} className="text-slate-300 group-hover:text-indigo-500" />
                                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Click to Browse CSV</span>
                            </button>
                        ) : uploadStatus === 'success' ? (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <FileSpreadsheet size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-emerald-900 truncate">log_export_aug2025.csv</div>
                                    <div className="text-[10px] text-emerald-600 font-medium">1,240 records found</div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">Cancel</button>
                        <button
                            disabled={uploadStatus !== 'success'}
                            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all font-bold"
                        >
                            Commit Sync
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
