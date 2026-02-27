
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Clock, 
  User, 
  FileText, 
  Monitor, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Eye,
  Calendar as CalendarIcon,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';

// --- Types & Mock Data ---

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT' | 'APPROVE' | 'REJECT';
type Status = 'SUCCESS' | 'FAILURE' | 'WARNING';

interface LogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
    avatar: string; // Initials or URL
    id: string;
  };
  action: ActionType;
  module: string;
  resource: string;
  details: string;
  ip: string;
  status: Status;
  metadata: {
    browser: string;
    os: string;
    location: string;
  };
  changes?: {
    field: string;
    old: string;
    new: string;
  }[];
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log_001',
    timestamp: 'Oct 24, 2024 09:42:15',
    actor: { name: 'Sarah Wilson', role: 'HR Manager', avatar: 'SW', id: 'emp-1' },
    action: 'UPDATE',
    module: 'Employee Profile',
    resource: 'John Doe (emp-2)',
    details: 'Updated salary grade and position details.',
    ip: '192.168.1.42',
    status: 'SUCCESS',
    metadata: { browser: 'Chrome 120.0', os: 'Windows 11', location: 'San Francisco, US' },
    changes: [
      { field: 'Position', old: 'Junior Developer', new: 'Senior Developer' },
      { field: 'Salary Grade', old: 'SG-10', new: 'SG-11' },
      { field: 'Base Pay', old: '25,000.00', new: '35,000.00' }
    ]
  },
  {
    id: 'log_002',
    timestamp: 'Oct 24, 2024 09:15:00',
    actor: { name: 'Sarah Wilson', role: 'HR Manager', avatar: 'SW', id: 'emp-1' },
    action: 'LOGIN',
    module: 'System',
    resource: 'Auth',
    details: 'Successful login via SSO.',
    ip: '192.168.1.42',
    status: 'SUCCESS',
    metadata: { browser: 'Chrome 120.0', os: 'Windows 11', location: 'San Francisco, US' }
  },
  {
    id: 'log_003',
    timestamp: 'Oct 23, 2024 16:30:22',
    actor: { name: 'Louis Panganiban', role: 'IT Admin', avatar: 'LP', id: 'emp-5' },
    action: 'DELETE',
    module: 'Role Management',
    resource: 'Temp_Intern_Role',
    details: 'Deleted unused role configuration.',
    ip: '10.0.0.5',
    status: 'WARNING',
    metadata: { browser: 'Firefox 119.0', os: 'MacOS Sonoma', location: 'Remote (VPN)' }
  },
  {
    id: 'log_004',
    timestamp: 'Oct 23, 2024 14:20:10',
    actor: { name: 'System Bot', role: 'Automated', avatar: 'SYS', id: 'sys-0' },
    action: 'UPDATE',
    module: 'Payroll',
    resource: 'Batch #2024-10-A',
    details: 'Automated tax calculation sync.',
    ip: 'Server Internal',
    status: 'SUCCESS',
    metadata: { browser: 'Headless', os: 'Linux', location: 'Data Center' }
  },
  {
    id: 'log_005',
    timestamp: 'Oct 23, 2024 11:05:45',
    actor: { name: 'Alex Thompson', role: 'Director', avatar: 'AT', id: 'emp-3' },
    action: 'APPROVE',
    module: 'Approvals',
    resource: 'Leave Req #LR-992',
    details: 'Approved sick leave for Jane Smith.',
    ip: '172.16.254.1',
    status: 'SUCCESS',
    metadata: { browser: 'Safari Mobile', os: 'iOS 17', location: 'New York, US' }
  },
  {
    id: 'log_006',
    timestamp: 'Oct 22, 2024 19:12:33',
    actor: { name: 'Unknown', role: 'Guest', avatar: '?', id: 'guest' },
    action: 'LOGIN',
    module: 'System',
    resource: 'Auth',
    details: 'Failed login attempt: Invalid Credentials.',
    ip: '45.33.22.11',
    status: 'FAILURE',
    metadata: { browser: 'Unknown', os: 'Unknown', location: 'Moscow, RU' }
  },
];

const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filterModule, setFilterModule] = useState('All');
  const [filterAction, setFilterAction] = useState('All');

  // Filter Logic
  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = 
      log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'All' || log.module === filterModule;
    const matchesAction = filterAction === 'All' || log.action === filterAction;

    return matchesSearch && matchesModule && matchesAction;
  });

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'LOGIN': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'APPROVE': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'REJECT': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
        case 'SUCCESS': return <CheckCircle2 size={14} className="text-emerald-500" />;
        case 'FAILURE': return <XCircle size={14} className="text-rose-500" />;
        case 'WARNING': return <AlertCircle size={14} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            System Audit Logs
            <Shield className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track system events, security access, and data modifications.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95">
          <Download size={18} />
          Export Report
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by user, resource, or details..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                    <CalendarIcon size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Oct 1 - Oct 24, 2024</span>
                    <ChevronDown size={14} className="text-slate-300" />
                </div>
                
                <select 
                    className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                >
                    <option value="All">All Modules</option>
                    <option value="Employee Profile">Employee Profile</option>
                    <option value="Payroll">Payroll</option>
                    <option value="System">System</option>
                    <option value="Role Management">Role Management</option>
                </select>

                <select 
                    className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                >
                    <option value="All">All Events</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="DELETE">Delete</option>
                    <option value="LOGIN">Login</option>
                </select>
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50 text-left">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actor</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IP Address</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                        <tr 
                            key={log.id} 
                            onClick={() => setSelectedLog(log)}
                            className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <Clock size={14} className="text-slate-400" />
                                    {log.timestamp}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                        {log.actor.avatar}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900">{log.actor.name}</div>
                                        <div className="text-[10px] text-slate-500 font-medium">{log.actor.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col items-start gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                        {log.module}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{log.resource}</span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-[250px]">{log.details}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{log.ip}</span>
                                    {getStatusIcon(log.status)}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <Eye size={18} />
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                                No logs found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredLogs.length} Events</span>
            <div className="flex gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16}/></button>
                <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">3</button>
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {/* Log Details Modal */}
      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} className="max-w-2xl">
        {selectedLog && (
            <div className="flex flex-col h-[700px] md:h-auto overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">Event Details</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionColor(selectedLog.action)}`}>
                                {selectedLog.action}
                            </span>
                        </div>
                        <p className="text-xs font-mono text-slate-400">ID: {selectedLog.id}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-700">{selectedLog.timestamp}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            {getStatusIcon(selectedLog.status)}
                            <span className={`text-[10px] font-bold uppercase ${selectedLog.status === 'SUCCESS' ? 'text-emerald-600' : selectedLog.status === 'FAILURE' ? 'text-red-600' : 'text-amber-600'}`}>
                                {selectedLog.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Actor & Resource Context */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Initiated By
                            </h4>
                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                    {selectedLog.actor.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900">{selectedLog.actor.name}</div>
                                    <div className="text-xs text-slate-500">{selectedLog.actor.role} • {selectedLog.actor.id}</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={12} /> Affected Resource
                            </h4>
                            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col justify-center">
                                <div className="text-sm font-bold text-slate-900 truncate">{selectedLog.resource}</div>
                                <div className="text-xs text-slate-500">Module: {selectedLog.module}</div>
                            </div>
                        </div>
                    </div>

                    {/* Change Diff Viewer */}
                    {selectedLog.changes && selectedLog.changes.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={12} /> Modifications
                            </h4>
                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-left">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-500 text-xs">Field</th>
                                            <th className="px-4 py-3 font-bold text-slate-500 text-xs">Original Value</th>
                                            <th className="px-4 py-3 font-bold text-slate-500 text-xs">New Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {selectedLog.changes.map((change, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50">
                                                <td className="px-4 py-3 font-medium text-slate-700">{change.field}</td>
                                                <td className="px-4 py-3 text-slate-500 line-through decoration-slate-300 decoration-2">{change.old}</td>
                                                <td className="px-4 py-3 font-bold text-indigo-700 bg-indigo-50/30">
                                                    <div className="flex items-center gap-2">
                                                        <ArrowRight size={12} className="text-indigo-400" />
                                                        {change.new}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-800">Summary:</span> {selectedLog.details}
                    </div>

                    {/* Tech Metadata */}
                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Monitor size={12} /> System Metadata
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">IP Address</div>
                                <div className="text-xs font-mono font-bold text-slate-700 mt-1">{selectedLog.ip}</div>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">Browser</div>
                                <div className="text-xs font-bold text-slate-700 mt-1 truncate" title={selectedLog.metadata.browser}>{selectedLog.metadata.browser}</div>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <div className="text-[10px] text-slate-400 uppercase font-bold">OS</div>
                                <div className="text-xs font-bold text-slate-700 mt-1">{selectedLog.metadata.os}</div>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1"><Globe size={10}/> Location</div>
                                <div className="text-xs font-bold text-slate-700 mt-1 truncate">{selectedLog.metadata.location}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-white">
                    <button 
                        onClick={() => setSelectedLog(null)} 
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                        Close Inspector
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogsPage;
