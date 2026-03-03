
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
  Table,
  Plus,
  Trash2,
  Lock,
  Database,
  ChevronRight,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { MASTER_SCHEMAS } from './ReportDetail';

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
  // ── STANDARD REPORTS (Immutable) ──────────────────────────────────────────
  {
    id: 'rep-hr-1',
    title: 'Employee Master List',
    description: 'Complete demographic and employment data for all active, inactive, and separated personnel including position, department, hire date, and employment status.',
    category: 'Core HR',
    type: 'Standard',
    lastGenerated: 'Today, 9:00 AM',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Directory', 'Masterfile', 'Compliance']
  },
  {
    id: 'rep-hr-2',
    title: 'Headcount Summary by Department',
    description: 'Aggregated employee count grouped by department, rank, employment type, and status. Includes headcount variance vs. prior period.',
    category: 'Core HR',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Workforce', 'Planning']
  },
  {
    id: 'rep-hr-3',
    title: 'New Hire & Separation Report',
    description: 'Period-based movement report listing all employees onboarded or separated within the selected date range, including separation reason codes.',
    category: 'Core HR',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <UserPlusIcon size={24} className="text-blue-600" />,
    tags: ['Attrition', 'Onboarding']
  },
  {
    id: 'rep-pay-1',
    title: 'Payroll Register',
    description: 'Full gross-to-net payroll computation per cut-off period covering basic pay, taxable and non-taxable allowances, statutory deductions, and net disbursement per employee.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Finance', 'Ledger', 'BIR']
  },
  {
    id: 'rep-pay-2',
    title: 'Government Remittance Summary',
    description: 'Consolidated employer and employee share computation for SSS, PhilHealth, and Pag-IBIG (HDMF) per remittance period, formatted for agency submission.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['SSS', 'PhilHealth', 'Pag-IBIG', 'Statutory']
  },
  {
    id: 'rep-pay-3',
    title: '13th Month Pay Computation',
    description: 'Annualized 13th month pay report per employee based on total basic salary earned year-to-date, adjusted for absences and unpaid leaves in accordance with PD 851.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Dec 1, 2025',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['13th Month', 'Annualization', 'PD 851']
  },
  {
    id: 'rep-pay-4',
    title: 'Withholding Tax Report (BIR 2316)',
    description: 'Annual withholding tax summary per employee in BIR Form 2316 format. Includes YTD taxable income, tax withheld, and tax due/refund status for year-end annualization.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Jan 31, 2026',
    icon: <FileSpreadsheet size={24} className="text-emerald-600" />,
    tags: ['BIR', 'Tax', 'Year-End']
  },
  {
    id: 'rep-ta-1',
    title: 'Timekeeping Summary',
    description: 'Consolidated daily time record (DTR) report per employee for a selected period. Includes total days worked, tardiness, undertime, and absences.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Yesterday',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['DTR', 'Tardiness', 'Compliance']
  },
  {
    id: 'rep-ta-2',
    title: 'Overtime Hours Summary',
    description: 'Company-wide breakdown of approved overtime hours by employee, department, and OT type (regular, rest day, holiday) for the selected pay period.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['OT', 'Labor Cost', 'DOLE']
  },
  {
    id: 'rep-ta-3',
    title: 'Leave Balance & Utilization',
    description: 'Employee leave balance report showing accrued, used, and remaining credits per leave type (VL, SL, EL, etc.) as of the selected reference date.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Feb 29, 2026',
    icon: <Calendar size={24} className="text-indigo-600" />,
    tags: ['VL', 'SL', 'Leave Ledger']
  },
  // ── CUSTOM REPORTS (Mutable) ───────────────────────────────────────────────
  {
    id: 'rep-cust-1',
    title: 'Q1 2026 New Hire Tracker',
    description: 'Custom onboarding tracker for employees hired in Q1 2026. Includes completion status of pre-employment requirements and 201 file checklist.',
    category: 'Core HR',
    type: 'Custom',
    lastGenerated: 'Mar 1, 2026',
    icon: <UserPlusIcon size={24} className="text-slate-500" />,
    tags: ['Onboarding', 'Q1 2026']
  },
  {
    id: 'rep-cust-2',
    title: 'IT Department Overtime Analysis',
    description: 'Drill-down on OT hours and estimated cost for the IT Department for the period November 2025 – February 2026, segmented by project code and approver.',
    category: 'Time & Attendance',
    type: 'Custom',
    lastGenerated: 'Feb 15, 2026',
    icon: <Clock size={24} className="text-slate-500" />,
    tags: ['IT Dept', 'Cost Analysis', 'OT']
  },
  {
    id: 'rep-cust-3',
    title: 'Salary Grade Distribution',
    description: 'Custom workforce compensation analysis mapping each active employee to their assigned salary grade and step. Includes min/max range utilization per grade.',
    category: 'Core HR',
    type: 'Custom',
    lastGenerated: 'Jan 15, 2026',
    icon: <Table size={24} className="text-slate-500" />,
    tags: ['Compensation', 'Grading']
  },
  {
    id: 'rep-cust-4',
    title: 'Voluntary Attrition Analysis — FY 2025',
    description: 'Custom turnover analysis for voluntary separations in FY 2025, broken down by department, tenure band, and exit reason. Includes annualized attrition rate.',
    category: 'Core HR',
    type: 'Custom',
    lastGenerated: 'Feb 1, 2026',
    icon: <FileBarChart size={24} className="text-slate-500" />,
    tags: ['Attrition', 'Retention', 'FY 2025']
  },
  {
    id: 'rep-cust-5',
    title: 'Benefits & Allowance Cost Summary',
    description: 'Custom monthly cost summary of all non-taxable benefits and allowances (rice, transport, meal, medical, clothing) per department for budget reconciliation.',
    category: 'Payroll',
    type: 'Custom',
    lastGenerated: 'Feb 28, 2026',
    icon: <Wallet size={24} className="text-slate-500" />,
    tags: ['Benefits', 'Budgeting', 'Allowances']
  }
];

// Master source options derived from MASTER_SCHEMAS
const MASTER_SOURCE_OPTIONS = [
  {
    id: 'rep-hr-1',
    label: 'Employee Master List',
    category: 'Core HR' as ReportCategory,
    description: 'Employee demographics, position, compensation, and statutory numbers.',
    icon: <Users size={22} className="text-blue-600" />,
    color: 'blue',
  },
  {
    id: 'rep-ta-1',
    label: 'Timekeeping Summary',
    category: 'Time & Attendance' as ReportCategory,
    description: 'Daily time records, tardiness, overtime, and leave data.',
    icon: <Clock size={22} className="text-indigo-600" />,
    color: 'indigo',
  },
  {
    id: 'rep-pay-1',
    label: 'Payroll Register',
    category: 'Payroll' as ReportCategory,
    description: 'Gross-to-net pay breakdown including allowances and statutory deductions.',
    icon: <Wallet size={22} className="text-emerald-600" />,
    color: 'emerald',
  },
];

const MASTER_IDS = new Set(['rep-hr-1', 'rep-ta-1', 'rep-pay-1']);

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDef[]>(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Standard' | 'Custom'>('All');

  // 2-step creation wizard state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardSourceId, setWizardSourceId] = useState<string>('');
  const [wizardSelectedCols, setWizardSelectedCols] = useState<string[]>([]);

  const wizardSourceSchema = wizardSourceId ? MASTER_SCHEMAS[wizardSourceId as keyof typeof MASTER_SCHEMAS] : null;

  const openCreateModal = () => {
    setWizardStep(1);
    setWizardTitle('');
    setWizardSourceId('');
    setWizardSelectedCols([]);
    setIsCreateModalOpen(true);
  };

  const handleWizardNext = () => {
    if (!wizardTitle.trim() || !wizardSourceId) return;
    // Pre-select all columns from the source
    const schema = MASTER_SCHEMAS[wizardSourceId as keyof typeof MASTER_SCHEMAS];
    setWizardSelectedCols([...schema.columns]);
    setWizardStep(2);
  };

  const toggleWizardCol = (col: string) => {
    setWizardSelectedCols(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleCreateReport = () => {
    if (!wizardTitle.trim() || !wizardSourceId || wizardSelectedCols.length === 0) return;
    const source = MASTER_SOURCE_OPTIONS.find(s => s.id === wizardSourceId)!;
    const newId = `rep-cust-${Date.now()}`;
    const newReport: ReportDef = {
      id: newId,
      title: wizardTitle.trim(),
      description: `Custom report derived from ${source.label}. Showing ${wizardSelectedCols.length} selected columns.`,
      category: source.category,
      type: 'Custom',
      lastGenerated: 'Never',
      icon: <FileBarChart size={24} className="text-slate-500" />,
      tags: ['Custom', source.label.split(' ')[0]],
    };
    setReports(prev => [...prev, newReport]);
    setIsCreateModalOpen(false);
    const colsParam = encodeURIComponent(wizardSelectedCols.join(','));
    const titleParam = encodeURIComponent(wizardTitle.trim());
    navigate(`/monitor/reports/${newId}?source=${wizardSourceId}&cols=${colsParam}&title=${titleParam}`);
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
            onClick={openCreateModal}
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
                                <div className="flex flex-col items-end gap-1.5">
                                    {MASTER_IDS.has(report.id) && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded uppercase tracking-wide">
                                            <Database size={10} /> Master Source
                                        </span>
                                    )}
                                    {report.type === 'Standard' ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                                            <Lock size={10} /> Standard
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleDelete(e, report.id)}
                                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete Report"
                                        >
                                            <Trash2 size={14} />
                                        </button>
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

      {/* Create Report Wizard Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-xl">
        <div className="p-8">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${wizardStep === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
              {wizardStep > 1 ? <Check size={12} /> : '1'}
            </div>
            <div className={`h-px flex-1 transition-all ${wizardStep > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${wizardStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              2
            </div>
          </div>

          {/* ── Step 1: Name + Source ── */}
          {wizardStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus size={20} className="text-indigo-600" /> New Custom Report
                </h3>
                <p className="text-sm text-slate-500 mt-1">Give your report a name and choose a master data source.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Name</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                  placeholder="e.g. IT Department Salary Overview"
                  value={wizardTitle}
                  onChange={e => setWizardTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Master Data Source</label>
                <div className="space-y-3">
                  {MASTER_SOURCE_OPTIONS.map(src => (
                    <button
                      key={src.id}
                      onClick={() => setWizardSourceId(src.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        wizardSourceId === src.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        src.color === 'blue' ? 'bg-blue-100' :
                        src.color === 'indigo' ? 'bg-indigo-100' :
                        'bg-emerald-100'
                      }`}>
                        {src.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{src.label}</p>
                          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                            <Database size={9} /> Master
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{src.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          {MASTER_SCHEMAS[src.id as keyof typeof MASTER_SCHEMAS].columns.length} available columns
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        wizardSourceId === src.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {wizardSourceId === src.id && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleWizardNext}
                  disabled={!wizardTitle.trim() || !wizardSourceId}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Next: Choose Columns <ChevronRight size={16} />
                </button>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Column selection ── */}
          {wizardStep === 2 && wizardSourceSchema && (
            <div className="space-y-5">
              <div>
                <button onClick={() => setWizardStep(1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-3 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
                <h3 className="text-xl font-bold text-slate-900">Select Columns</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Source: <span className="font-bold text-slate-700">{wizardSourceSchema.label}</span> &mdash; choose which columns to include.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{wizardSelectedCols.length} / {wizardSourceSchema.columns.length} selected</span>
                <div className="flex gap-2">
                  <button onClick={() => setWizardSelectedCols([...wizardSourceSchema.columns])} className="text-xs font-bold text-indigo-600 hover:underline">Select All</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => setWizardSelectedCols([])} className="text-xs font-bold text-slate-400 hover:underline">Clear</button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-50">
                {wizardSourceSchema.columns.map(col => (
                  <button
                    key={col}
                    onClick={() => toggleWizardCol(col)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                      wizardSelectedCols.includes(col) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                    }`}>
                      {wizardSelectedCols.includes(col) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{col}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleCreateReport}
                  disabled={wizardSelectedCols.length === 0}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-40"
                >
                  Create Report
                </button>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;
