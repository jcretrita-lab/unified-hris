
import React, { useState } from 'react';
import { 
  FileBarChart, 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Calendar, 
  Loader2, 
  Table, 
  Plus,
  MoreHorizontal,
  Trash2,
  Lock,
  Edit2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

// --- Types ---
type ReportCategory = 'Core HR' | 'Time & Attendance' | 'Payroll' | 'System';
type ReportType = 'Standard' | 'Custom';

interface ReportDef {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  type: ReportType;
  lastGenerated: string;
  icon: React.ReactNode;
  tags: string[];
}

// Helper Icon
const UserPlusIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

// --- Mock Data ---
const INITIAL_REPORTS: ReportDef[] = [
  // STANDARD REPORTS (Immutable)
  {
    id: 'rep-hr-1',
    title: 'Employee Master List',
    description: 'Standard detailed list of all employees and demographics.',
    category: 'Core HR',
    type: 'Standard',
    lastGenerated: 'Today, 9:00 AM',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Directory', 'Masterfile']
  },
  {
    id: 'rep-pay-1',
    title: 'Payroll Register',
    description: 'Standard gross-to-net calculation for pay periods.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Aug 15, 2025',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Finance', 'Ledger']
  },
  {
    id: 'rep-ta-1',
    title: 'Timekeeping Summary',
    description: 'Standard consolidated attendance logs and tardiness.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Yesterday',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['DTR', 'Logs']
  },
  // CUSTOM REPORTS (Mutable)
  {
    id: 'rep-hr-2',
    title: 'Q3 New Hires',
    description: 'Custom list of employees onboarded in Q3.',
    category: 'Core HR',
    type: 'Custom',
    lastGenerated: 'Aug 1, 2025',
    icon: <UserPlusIcon size={24} className="text-slate-500" />,
    tags: ['Onboarding']
  },
  {
    id: 'rep-ta-2',
    title: 'Overtime Analysis (IT Dept)',
    description: 'Breakdown of OT hours for the IT department only.',
    category: 'Time & Attendance',
    type: 'Custom',
    lastGenerated: 'Aug 15, 2025',
    icon: <Clock size={24} className="text-slate-500" />,
    tags: ['Cost Analysis']
  }
];

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDef[]>(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Standard' | 'Custom'>('All');
  
  // Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newReportForm, setNewReportForm] = useState({ title: '', category: 'Core HR', description: '' });

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm('Are you sure you want to delete this custom report?')) {
        setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleCreateReport = () => {
      if(!newReportForm.title) return;
      const newReport: ReportDef = {
          id: `rep-cust-${Date.now()}`,
          title: newReportForm.title,
          description: newReportForm.description || 'Custom generated report.',
          category: newReportForm.category as ReportCategory,
          type: 'Custom',
          lastGenerated: 'Never',
          icon: <FileBarChart size={24} className="text-slate-500" />,
          tags: ['Custom']
      };
      setReports([...reports, newReport]);
      setIsCreateModalOpen(false);
      setNewReportForm({ title: '', category: 'Core HR', description: '' });
      // Navigate to detail to configure columns immediately
      navigate(`/monitor/reports/${newReport.id}?isNew=true`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Reports Center
            <FileBarChart className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate standard compliance reports or create custom data views.</p>
        </div>
        <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
            <Plus size={18} /> Create Custom Report
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {['All', 'Standard', 'Custom'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === tab 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        {tab} Reports
                    </button>
                ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Report Grid */}
        <div className="p-8 bg-slate-50/30 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReports.map((report, idx) => (
                    <motion.div 
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/monitor/reports/${report.id}`)}
                        className={`bg-white border rounded-2xl p-6 hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${report.type === 'Standard' ? 'border-slate-200 hover:border-indigo-200' : 'border-slate-200 hover:border-amber-300'}`}
                    >
                        {/* Top Accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${report.type === 'Standard' ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${
                                    report.category === 'Core HR' ? 'bg-blue-50' : 
                                    report.category === 'Payroll' ? 'bg-emerald-50' : 
                                    report.category === 'Time & Attendance' ? 'bg-indigo-50' : 
                                    'bg-slate-100'
                                }`}>
                                    {report.icon}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {report.type === 'Standard' ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                                            <Lock size={10} /> Standard
                                        </span>
                                    ) : (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={(e) => handleDelete(e, report.id)}
                                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{report.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">{report.description}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <Clock size={12} />
                                Last Generated: {report.lastGenerated}
                            </div>
                            
                            <div className="flex gap-2 border-t border-slate-100 pt-4">
                                {report.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredReports.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <FileBarChart size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No reports found.</p>
                    <p className="text-sm">Try adjusting your filters or create a new one.</p>
                </div>
            )}
        </div>
      </div>

      {/* Create Report Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-lg">
          <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-indigo-600"/> Create Custom Report
              </h3>
              <div className="space-y-5">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Name</label>
                      <input 
                          className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                          placeholder="e.g. Sales Dept Overtime Summary"
                          value={newReportForm.title}
                          onChange={(e) => setNewReportForm({...newReportForm, title: e.target.value})}
                          autoFocus
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Data Source Category</label>
                      <select 
                          className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-700 cursor-pointer"
                          value={newReportForm.category}
                          onChange={(e) => setNewReportForm({...newReportForm, category: e.target.value})}
                      >
                          <option value="Core HR">Core HR (Employee Data)</option>
                          <option value="Time & Attendance">Time & Attendance (Logs, OT, Leaves)</option>
                          <option value="Payroll">Payroll (Earnings, Deductions, Net Pay)</option>
                          <option value="System">System (Audit Logs, Users)</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description (Optional)</label>
                      <textarea 
                          className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all resize-none h-24"
                          placeholder="Briefly describe the purpose of this report..."
                          value={newReportForm.description}
                          onChange={(e) => setNewReportForm({...newReportForm, description: e.target.value})}
                      />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                      <button onClick={handleCreateReport} disabled={!newReportForm.title} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-50">
                          Create & Configure
                      </button>
                      <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;
