
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  RefreshCw, 
  Search, 
  Calendar,
  ChevronDown,
  Printer,
  MoreHorizontal,
  Settings,
  Layout,
  Plus,
  Trash2,
  Save,
  CheckSquare,
  Square,
  Check,
  Lock,
  Edit3,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

// --- Mock Report Definitions ---
// In a real app, this would be fetched from an API.
// We are simulating "Standard" vs "Custom" via a type property.
const REPORT_DEFINITIONS: Record<string, any> = {
  'rep-hr-1': {
    id: 'rep-hr-1',
    title: 'Employee Master List',
    category: 'Core HR',
    type: 'Standard',
    columns: [
        'Employee ID', 'Name', 'Department', 'Position', 'Status', 'Date Hired', 'Employment Type', 'Company Email', 'Mobile No.',
        'Shift Schedule', 'Work Days', 'VL Balance', 'SL Balance',
        'Monthly Basic Pay', 'Salary Grade', 'Tax Status', 
        'Bank Name', 'Account Number', 'TIN', 'SSS No.', 'PhilHealth No.', 'HDMF No.'
    ],
    data: [
      { 
          col1: 'EMP-001', col2: 'James Cordon', col3: 'IT Department', col4: 'Developer Intern', col5: 'Active', col6: '2024-01-15', col7: 'Intern', col8: 'james.c@company.com', col9: '0917-123-4567',
          col10: '08:00 - 17:00', col11: 'Mon-Fri', col12: '5.0', col13: '2.0',
          col14: '12,500.00', col15: 'SG-10', col16: 'Tax Exempt',
          col17: 'BDO', col18: '1098-7654-3210', col19: '123-456-789-000', col20: '01-1234567-8', col21: '12-123456789-1', col22: '1234-5678-9012'
      },
      { 
          col1: 'EMP-002', col2: 'Louis Panganiban', col3: 'IT Department', col4: 'Senior Developer', col5: 'Active', col6: '2023-05-10', col7: 'Regular', col8: 'louis.p@company.com', col9: '0918-987-6543',
          col10: '08:00 - 17:00', col11: 'Mon-Fri', col12: '12.0', col13: '15.0',
          col14: '65,000.00', col15: 'SG-14', col16: 'Taxable',
          col17: 'BPI', col18: '2345-6789-01', col19: '234-567-890-000', col20: '02-2345678-9', col21: '23-234567890-2', col22: '2345-6789-0123'
      },
      { 
          col1: 'EMP-003', col2: 'Sarah Wilson', col3: 'HR Department', col4: 'HR Manager', col5: 'Active', col6: '2022-11-01', col7: 'Regular', col8: 'sarah.w@company.com', col9: '0919-555-1234',
          col10: '09:00 - 18:00', col11: 'Mon-Fri', col12: '15.0', col13: '15.0',
          col14: '55,000.00', col15: 'SG-13', col16: 'Taxable',
          col17: 'UnionBank', col18: '1002-3344-5566', col19: '345-678-901-000', col20: '03-3456789-0', col21: '34-345678901-3', col22: '3456-7890-1234'
      },
    ]
  },
  'rep-ta-1': {
    id: 'rep-ta-1',
    title: 'Timekeeping Summary',
    category: 'Time & Attendance',
    type: 'Standard',
    columns: ['Date', 'Employee', 'Shift', 'Time In', 'Time Out', 'Late (Mins)', 'Undertime (Mins)', 'Total Hours'],
    data: [
      { col1: 'Aug 01, 2025', col2: 'James Cordon', col3: '08:00 - 17:00', col4: '07:55 AM', col5: '05:01 PM', col6: '0', col7: '0', col8: '8.00' },
      { col1: 'Aug 01, 2025', col2: 'Louis Panganiban', col3: '08:00 - 17:00', col4: '08:15 AM', col5: '05:00 PM', col6: '15', col7: '0', col8: '7.75' },
    ]
  },
  'rep-pay-1': {
    id: 'rep-pay-1',
    title: 'Payroll Register',
    category: 'Payroll',
    type: 'Standard',
    columns: ['Pay Period', 'Employee', 'Basic Pay', 'Gross Earnings', 'Total Deductions', 'Net Pay', 'Disbursement Status'],
    data: [
      { col1: 'Aug 1-15, 2025', col2: 'James Cordon', col3: '12,500.00', col4: '14,000.00', col5: '1,500.00', col6: '12,500.00', col7: 'Pending' },
      { col1: 'Aug 1-15, 2025', col2: 'Louis Panganiban', col3: '22,500.00', col4: '25,000.00', col5: '3,200.00', col6: '21,800.00', col7: 'Processed' },
    ]
  },
  'rep-hr-2': {
      id: 'rep-hr-2',
      title: 'Q3 New Hires',
      category: 'Core HR',
      type: 'Custom',
      columns: ['Employee ID', 'Name', 'Date Hired', 'Position', 'Department'],
      data: [
          { col1: 'EMP-001', col2: 'James Cordon', col3: '2024-01-15', col4: 'Developer Intern', col5: 'IT Department' }
      ]
  }
};

const ReportDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('All');
  
  // Report Config State
  const [reportConfig, setReportConfig] = useState<{
      id: string;
      title: string;
      type: 'Standard' | 'Custom';
      columns: string[];
      visibleColumns: string[];
      data: any[];
      category: string;
  } | null>(null);

  // Modal & Menu State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempVisibleCols, setTempVisibleCols] = useState<string[]>([]);

  useEffect(() => {
    // Simulate Fetching
    setIsLoading(true);
    const def = id && REPORT_DEFINITIONS[id] ? REPORT_DEFINITIONS[id] : null;
    
    setTimeout(() => {
      if (def) {
          setReportConfig({
              ...def,
              visibleColumns: def.columns // Default all visible
          });
      } else {
          // Fallback for new custom report creation simulation
          if (id?.startsWith('rep-cust')) {
             setReportConfig({
                 id: id,
                 title: 'New Custom Report',
                 type: 'Custom',
                 category: 'Core HR',
                 columns: ['Employee ID', 'Name', 'Department', 'Position', 'Date Hired', 'Email'], // Mock available columns
                 visibleColumns: ['Employee ID', 'Name', 'Department'],
                 data: []
             });
             // Open config modal automatically for new reports
             setTempTitle('New Custom Report');
             setTempVisibleCols(['Employee ID', 'Name', 'Department']);
             setIsConfigModalOpen(true);
          }
      }
      setIsLoading(false);
    }, 600);
  }, [id]);

  const handleOpenConfig = () => {
      if (!reportConfig) return;
      setTempTitle(reportConfig.title);
      setTempVisibleCols([...reportConfig.visibleColumns]);
      setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
      if (!reportConfig) return;
      setReportConfig({
          ...reportConfig,
          title: tempTitle,
          visibleColumns: tempVisibleCols
      });
      setIsConfigModalOpen(false);
  };

  const toggleColumnInEditor = (colName: string) => {
    if (tempVisibleCols.includes(colName)) {
      setTempVisibleCols(tempVisibleCols.filter(c => c !== colName));
    } else {
      // Maintain order based on original definition if possible, or just append
      // For simplicity, we just append or re-sort based on original list
      const originalIndex = reportConfig?.columns.indexOf(colName) ?? -1;
      // Simple append for now
      const newCols = [...tempVisibleCols, colName];
      // Optional: Sort by original definition index
      newCols.sort((a, b) => {
          const idxA = reportConfig?.columns.indexOf(a) ?? 0;
          const idxB = reportConfig?.columns.indexOf(b) ?? 0;
          return idxA - idxB;
      });
      setTempVisibleCols(newCols);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
      console.log(`Exporting report ${reportConfig?.title} as ${format.toUpperCase()}`);
      setIsDownloadMenuOpen(false);
      // Logic for actual export would go here
  };

  if (!reportConfig && !isLoading) return <div>Report not found</div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
            onClick={() => navigate('/monitor/reports')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Reports
        </button>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Reports Center</span>
            <span>/</span>
            <span>{reportConfig?.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{reportConfig?.title}</span>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[700px]">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        {reportConfig?.title}
                        {reportConfig?.type === 'Standard' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200 uppercase tracking-wide">
                                <Lock size={10} /> Standard
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide">
                                Custom
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Generated report for {reportConfig?.category}. Data is current as of <span className="font-bold text-slate-700">{new Date().toLocaleString()}</span>.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                        <Printer size={16} /> Print
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            <Download size={16} /> Download <ChevronDown size={14} className={`transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDownloadMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button 
                                    onClick={() => handleExport('csv')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors text-left"
                                >
                                    <FileSpreadsheet size={16} /> Export as CSV
                                </button>
                                <button 
                                    onClick={() => handleExport('pdf')}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors text-left border-t border-slate-50"
                                >
                                    <FileText size={16} /> Export as PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Configuration / Filters */}
        <div className="px-8 py-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white">
            <div className="col-span-1 md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Settings</label>
                <button 
                    onClick={handleOpenConfig}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm ${reportConfig?.type === 'Standard' ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-200 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50'}`}
                    disabled={reportConfig?.type === 'Standard'}
                    title={reportConfig?.type === 'Standard' ? 'Standard reports cannot be modified.' : 'Configure Report'}
                >
                    <span className="flex items-center gap-2">
                        {reportConfig?.type === 'Standard' ? <Lock size={16} /> : <Settings size={16} />}
                        {reportConfig?.type === 'Standard' ? 'Locked Configuration' : 'Configure Report'}
                    </span>
                    {reportConfig?.type === 'Custom' && <Edit3 size={14} />}
                </button>
            </div>
            
            <div className="col-span-1 md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Department Filter</label>
                <select 
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                >
                    <option value="All">All Departments</option>
                    <option value="IT">IT Department</option>
                    <option value="HR">HR Department</option>
                    <option value="Finance">Finance</option>
                </select>
            </div>
            
            <div className="col-span-1 md:col-span-4 relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Search Records</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Keyword..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>

            <div className="col-span-1 md:col-span-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all">
                    <RefreshCw size={16} /> Refresh Data
                </button>
            </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 bg-slate-50/30 p-8 overflow-auto">
            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <RefreshCw size={32} className="animate-spin mb-4 text-indigo-500" />
                    <p className="font-bold text-slate-500">Loading report data...</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                                <tr>
                                    {reportConfig?.columns.map((col: string, idx: number) => {
                                        if (!reportConfig.visibleColumns.includes(col)) return null;
                                        return <th key={idx} className="px-6 py-4 whitespace-nowrap">{col}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportConfig?.data.map((row: any, rIdx: number) => (
                                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                        {reportConfig.columns.map((colName: string, cIdx: number) => {
                                            if (!reportConfig.visibleColumns.includes(colName)) return null;
                                            const val = row[`col${cIdx + 1}`];
                                            return (
                                                <td key={cIdx} className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                                                    {val}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                        <p className="text-xs text-slate-400 font-medium italic">End of report.</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Report Configuration Modal */}
      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} className="max-w-4xl">
        <div className="flex flex-col h-[600px] bg-white">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Configure Report</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Edit report name and visible columns.</p>
                    </div>
                </div>
                <button onClick={() => setIsConfigModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: General Settings */}
                <div className="w-80 border-r border-slate-100 bg-slate-50/30 flex flex-col p-6 space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Name</label>
                        <input 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 shadow-sm"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <h4 className="text-xs font-bold text-indigo-800 mb-2 flex items-center gap-2">
                             <CheckSquare size={14} /> Column Visibility
                        </h4>
                        <p className="text-[10px] text-indigo-600 leading-relaxed">
                            Select which data points to include in this report. Unchecked columns will be hidden from the view and export.
                        </p>
                        <div className="mt-4 text-xs font-bold text-indigo-800">
                            {tempVisibleCols.length} of {reportConfig?.columns.length} Columns Active
                        </div>
                    </div>
                </div>

                {/* Right: Columns Toggle */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="p-6 flex-1 overflow-y-auto">
                         <div className="grid grid-cols-2 gap-3">
                             {reportConfig?.columns.map((col) => {
                                 const isVisible = tempVisibleCols.includes(col);
                                 return (
                                    <div 
                                        key={col}
                                        onClick={() => toggleColumnInEditor(col)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isVisible ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isVisible ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                            {isVisible && <Check size={12} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className={`text-sm font-bold ${isVisible ? 'text-indigo-900' : 'text-slate-500'}`}>{col}</span>
                                    </div>
                                 );
                             })}
                         </div>
                    </div>
                    
                    <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                        <button onClick={() => setIsConfigModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveConfig}
                            disabled={!tempTitle.trim() || tempVisibleCols.length === 0}
                            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save size={16} /> Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportDetail;
