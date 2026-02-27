
import React, { useState } from 'react';
import { 
  Wallet, 
  CalendarDays,
  Clock,
  History,
  FileText,
  Lock,
  ShieldCheck,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// Extended Mock Data with Status
const MOCK_PAYSLIP = {
  id: 'pay-001',
  period: {
    cutoff: 'July 6 - Aug 20, 2025',
    payDate: 'October 15, 2025',
    payrollPeriod: '1st Period',
    shift: '8:00 AM - 6:00 PM',
    shiftName: 'Shift 8'
  },
  // Added Status for Logic Check
  status: 'Pending', 
  earnings: [
    { title: 'Basic Salary', attendance: [1,1,1,1,1,0,0], computation: '69.30h x 100 ₱ / hr', amount: 6930.00 },
    { title: 'Overtime hours', attendance: [0,0,0,1,1,0,0], computation: '2.02h x 100 ₱ / hr', amount: 200.00 },
    { title: 'Premium Pay', attendance: [0,0,0,0,0,1,1], computation: '10h x 200 ₱ / hr', amount: 2000.00 },
  ],
  benefits: [
    { title: 'Transport Allowance', amount: 3000.00 },
    { title: 'Healthcare Insurance', amount: 6000.00 },
  ],
  deductions: [
    { title: 'Taxable Income', amount: 1500.00 },
    { title: 'Car Loan', amount: 200.00 },
  ],
  summary: {
    gross: 9130.00,
    totalBenefits: 9000.00,
    totalDeductions: 1700.00,
    netPay: 16430.00
  }
};

const MOCK_HISTORY = [
  { id: 'pay-000', period: '2nd Period', cutoff: 'Jun 21 - Jul 05, 2025', payDate: 'Jul 15, 2025', gross: 9130.00, net: 16430.00, status: 'Disbursed' },
  { id: 'pay-999', period: '1st Period', cutoff: 'Jun 06 - Jun 20, 2025', payDate: 'Jun 30, 2025', gross: 9000.00, net: 16200.00, status: 'Disbursed' },
  { id: 'pay-998', period: '2nd Period', cutoff: 'May 21 - Jun 05, 2025', payDate: 'Jun 15, 2025', gross: 9130.00, net: 16430.00, status: 'Disbursed' },
  { id: 'pay-997', period: '1st Period', cutoff: 'May 06 - May 20, 2025', payDate: 'May 31, 2025', gross: 9130.00, net: 16430.00, status: 'Pending' }, // Mock pending history
];

const AttendanceBlock = ({ pattern }: { pattern: number[] }) => (
  <div className="flex gap-1">
    {pattern.map((status, i) => (
      <div 
        key={i} 
        className={`w-3 h-3 rounded-sm ${status === 1 ? 'bg-emerald-500' : status === 2 ? 'bg-indigo-500' : 'bg-slate-200'}`}
        title={status === 1 ? 'Present' : status === 2 ? 'Overtime' : 'Rest/Absent'}
      />
    ))}
  </div>
);

const PayrollTab: React.FC = () => {
  const { user } = useAuth();
  
  // Security State
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [error, setError] = useState('');
  const [revealValues, setRevealValues] = useState(false);
  
  // Simulated Code
  const SIMULATED_CODE = "882910";

  // --- ACCESS CONTROL LOGIC ---
  const PRIVILEGED_ROLES = ['Superadmin', 'HR Admin', 'HR Payroll Personnel'];
  const isPrivileged = PRIVILEGED_ROLES.includes(user?.role || '');

  // 1. Check for Latest Payslip Visibility
  const currentData = MOCK_PAYSLIP;
  const isCurrentDisbursed = currentData.status === 'Disbursed';
  const isCurrentPayDateReached = new Date(currentData.period.payDate) <= new Date(); // Mock check
  
  // Rule: Privileged users see all. Employees see ONLY if Disbursed AND Date reached.
  const canViewCurrent = isPrivileged || (isCurrentDisbursed && isCurrentPayDateReached);

  // 2. Filter History
  const visibleHistory = MOCK_HISTORY.filter(item => {
      if (isPrivileged) return true; // Admins see all statuses
      return item.status === 'Disbursed'; // Employees only see Disbursed
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityCode === SIMULATED_CODE) {
      setIsAccessGranted(true);
      setError('');
    } else {
      setError('Invalid code. Please check the simulation code above.');
      setSecurityCode('');
    }
  };

  if (!isAccessGranted) {
    return (
        <div className="min-h-[500px] flex items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center"
            >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} className="text-slate-400" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">Security Verification</h3>
                <p className="text-sm text-slate-500 mb-8">
                    To access sensitive payroll information, please enter the One-Time Password (OTP) sent to your registered company email.
                </p>

                {/* Simulation Banner */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-6 flex items-start gap-3 text-left">
                    <Mail className="text-indigo-600 mt-0.5 shrink-0" size={16} />
                    <div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Simulation Mode</p>
                        <p className="text-xs text-indigo-800 font-medium">
                            Email sent to <span className="font-bold">james.c@company.com</span>. <br/>
                            Your code is: <span className="font-mono text-lg font-bold bg-white px-2 rounded ml-1 border border-indigo-200">{SIMULATED_CODE}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            className="w-full text-center text-2xl font-mono font-bold tracking-widest p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 uppercase"
                            value={securityCode}
                            onChange={(e) => setSecurityCode(e.target.value)}
                            autoFocus
                        />
                        {error && (
                            <p className="text-xs text-rose-500 font-bold mt-2 flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> {error}
                            </p>
                        )}
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={18} /> Verify Identity
                    </button>
                </form>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Latest Payslip Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Conditional Header Render */}
        {canViewCurrent ? (
            <>
                {/* Header */}
                <div className="border-b border-slate-100 p-8 bg-slate-50/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Wallet className="text-indigo-600" size={20} /> Latest Payslip
                        </h3>
                        {/* Admin Visibility Badge */}
                        {isPrivileged && currentData.status === 'Pending' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">
                                Admin View (Pending)
                            </span>
                        )}
                    </div>
                    <div className="flex gap-12">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Payroll Period</span>
                        <span className="text-sm font-bold text-slate-700">{currentData.period.payrollPeriod}</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Cutoff Period</span>
                        <span className="text-sm font-bold text-slate-700">{currentData.period.cutoff}</span>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Pay Date</span>
                        <span className="text-sm font-bold text-slate-700">{currentData.period.payDate}</span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Net Earnings</span>
                    <div className="flex items-center gap-3 justify-end">
                        <div className={`text-4xl font-extrabold text-indigo-600 tracking-tight ${!revealValues && !isPrivileged ? 'blur-md select-none' : ''}`}>
                             ₱ {currentData.summary.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <button onClick={() => setRevealValues(!revealValues)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                            {revealValues ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">To be disbursed on {currentData.period.payDate}</p>
                    </div>
                </div>
                </div>

                {/* Detailed Breakdown */}
                <div className={`p-8 space-y-10 transition-all duration-300 ${!revealValues && !isPrivileged ? 'opacity-30 blur-[2px] select-none pointer-events-none' : 'opacity-100'}`}>
                
                {/* Gross Earnings Section */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    Gross Earnings
                    </h3>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Attendance</th>
                            <th className="px-6 py-4">Computation</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {currentData.earnings.map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-700">{item.title}</td>
                            <td className="px-6 py-4"><AttendanceBlock pattern={item.attendance} /></td>
                            <td className="px-6 py-4 font-mono text-slate-600 text-xs">{item.computation}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-800">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                        <tr className="bg-slate-50 font-bold text-slate-800">
                            <td className="px-6 py-4" colSpan={3}>Total Gross Earnings</td>
                            <td className="px-6 py-4 text-right text-emerald-600">₱ {currentData.summary.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Benefits */}
                    <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Benefits</h3>
                    <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl overflow-hidden">
                        {currentData.benefits.map((item, i) => (
                        <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-emerald-100/50 last:border-0 hover:bg-emerald-50/50 transition-colors">
                            <span className="text-sm font-bold text-slate-700">{item.title}</span>
                            <span className="text-sm font-mono font-bold text-emerald-700">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        ))}
                        <div className="flex justify-between items-center px-5 py-4 bg-emerald-100/30 border-t border-emerald-200">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Benefits</span>
                        <span className="text-sm font-mono font-bold text-emerald-800">₱ {currentData.summary.totalBenefits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Deductions</h3>
                    <div className="bg-rose-50/30 border border-rose-100 rounded-2xl overflow-hidden">
                        {currentData.deductions.map((item, i) => (
                        <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-rose-100/50 last:border-0 hover:bg-rose-50/50 transition-colors">
                            <span className="text-sm font-bold text-slate-700">{item.title}</span>
                            <span className="text-sm font-mono font-bold text-rose-700">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        ))}
                        <div className="flex justify-between items-center px-5 py-4 bg-rose-100/30 border-t border-rose-200">
                        <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Deductions</span>
                        <span className="text-sm font-mono font-bold text-rose-800">₱ {currentData.summary.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    </div>

                    {/* Final Breakdown Summary */}
                    <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Final Breakdown</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-slate-600">Gross Earnings</span>
                        <span className="font-mono font-bold text-slate-900">₱ {currentData.summary.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-emerald-600">Total Benefits</span>
                        <span className="font-mono font-bold text-emerald-600">+ ₱ {currentData.summary.totalBenefits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-rose-600">Total Deductions</span>
                        <span className="font-mono font-bold text-rose-600">- ₱ {currentData.summary.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="w-full h-px bg-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                        <span className="text-base font-extrabold text-slate-900 uppercase tracking-tight">Net Earnings</span>
                        <span className="text-xl font-mono font-extrabold text-indigo-600">₱ {currentData.summary.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    </div>

                </div>
                </div>
            </>
        ) : (
            // Placeholder for Employees when Payroll is not ready/visible
            <div className="flex flex-col items-center justify-center p-20 text-center bg-slate-50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                    <Clock size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Payroll in Progress</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                    The payslip for the current period <strong>({currentData.period.cutoff})</strong> is currently being processed. It will be available for viewing on <strong>{currentData.period.payDate}</strong>.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                    <AlertCircle size={14} className="text-amber-500" />
                    Status: {currentData.status}
                </div>
            </div>
        )}
      </div>

      {/* Historical Payrolls */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History size={20} className="text-indigo-600" />
            Payroll History
        </h3>
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Payroll Period</th>
                        <th className="px-6 py-4">Cutoff Dates</th>
                        <th className="px-6 py-4">Pay Date</th>
                        <th className="px-6 py-4 text-right">Gross Pay</th>
                        <th className="px-6 py-4 text-right">Net Pay</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {visibleHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4 font-bold text-slate-700">{item.period}</td>
                            <td className="px-6 py-4 text-slate-600">{item.cutoff}</td>
                            <td className="px-6 py-4 text-slate-600">{item.payDate}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-500">₱ {item.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">₱ {item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <FileText size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {visibleHistory.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-slate-400 italic">
                                No historical payslips available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollTab;
