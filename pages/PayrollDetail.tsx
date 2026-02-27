
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  Building2,
  Wallet,
  History,
  FileText
} from 'lucide-react';
import ImplementedPayStructureTab from './payroll-detail/ImplementedPayStructureTab';

const MOCK_PAYSLIP = {
  id: 'pay-001',
  employee: {
    id: 'emp-2',
    name: 'Louis Panganiban',
    role: 'Senior Developer',
    department: 'IT Department',
    avatar: 'LP',
    status: 'Active'
  },
  period: {
    cutoff: 'July 6 - Aug 20, 2025',
    payDate: 'October 15, 2025',
    payrollPeriod: '1st Period',
    shift: '8:00 AM - 6:00 PM',
    shiftName: 'Shift 8'
  },
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

const PayrollDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'details' | 'structure'>('details');
  
  // Mock data usage
  const data = MOCK_PAYSLIP;

  return (
    <div className="space-y-6 pb-24">
      {/* Top Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/manage/payroll')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft size={16} />
          Back to Payroll Management
        </button>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
            <ChevronLeft size={14} /> Previous Employee
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
            Next Employee <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Hero Employee Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 border-4 border-slate-50 shadow-sm">
            {data.employee.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{data.employee.name}</h1>
            <p className="text-slate-500 font-bold text-sm mb-2">{data.employee.role}</p>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-wide">
              {data.employee.status}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Current Shift</span>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Clock size={20} className="text-indigo-600" />
                {data.period.shift}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 pl-7">Assigned as {data.period.shiftName}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Current Cutoff</span>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <CalendarDays size={20} className="text-indigo-600" />
                {data.period.cutoff.split(' - ')[0]} <span className="text-slate-400">-</span> {data.period.cutoff.split(' - ')[1]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-8 py-4 text-sm font-bold transition-all relative ${
            activeTab === 'details' 
              ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Payslip Details
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-8 py-4 text-sm font-bold transition-all relative ${
            activeTab === 'structure' 
              ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          Implemented Pay Structure
        </button>
      </div>

      {activeTab === 'details' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main Payroll Info */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            
            {/* Payroll Header */}
            <div className="border-b border-slate-100 p-8 bg-slate-50/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="space-y-4">
                <div className="flex gap-12">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Payroll Period</span>
                    <span className="text-sm font-bold text-slate-700">{data.period.payrollPeriod}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Cutoff Period</span>
                    <span className="text-sm font-bold text-slate-700">{data.period.cutoff}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Pay Date</span>
                    <span className="text-sm font-bold text-slate-700">{data.period.payDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Net Earnings</span>
                  <div className="text-4xl font-extrabold text-indigo-600 tracking-tight">₱ {data.summary.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">To be disbursed on {data.period.payDate}</p>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="p-8 space-y-10">
              
              {/* Gross Earnings Section */}
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Wallet size={20} className="text-emerald-500" /> Gross Earnings
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
                      {data.earnings.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700">{item.title}</td>
                          <td className="px-6 py-4"><AttendanceBlock pattern={item.attendance} /></td>
                          <td className="px-6 py-4 font-mono text-slate-600 text-xs">{item.computation}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-800">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold text-slate-800">
                        <td className="px-6 py-4" colSpan={3}>Total Gross Earnings</td>
                        <td className="px-6 py-4 text-right text-emerald-600">₱ {data.summary.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
                    {data.benefits.map((item, i) => (
                      <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-emerald-100/50 last:border-0 hover:bg-emerald-50/50 transition-colors">
                        <span className="text-sm font-bold text-slate-700">{item.title}</span>
                        <span className="text-sm font-mono font-bold text-emerald-700">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center px-5 py-4 bg-emerald-100/30 border-t border-emerald-200">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Benefits</span>
                      <span className="text-sm font-mono font-bold text-emerald-800">₱ {data.summary.totalBenefits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Deductions</h3>
                  <div className="bg-rose-50/30 border border-rose-100 rounded-2xl overflow-hidden">
                    {data.deductions.map((item, i) => (
                      <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-rose-100/50 last:border-0 hover:bg-rose-50/50 transition-colors">
                        <span className="text-sm font-bold text-slate-700">{item.title}</span>
                        <span className="text-sm font-mono font-bold text-rose-700">₱ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center px-5 py-4 bg-rose-100/30 border-t border-rose-200">
                      <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Total Deductions</span>
                      <span className="text-sm font-mono font-bold text-rose-800">₱ {data.summary.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Final Breakdown Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Final Breakdown</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-600">Gross Earnings</span>
                      <span className="font-mono font-bold text-slate-900">₱ {data.summary.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-emerald-600">Total Benefits</span>
                      <span className="font-mono font-bold text-emerald-600">+ ₱ {data.summary.totalBenefits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-rose-600">Total Deductions</span>
                      <span className="font-mono font-bold text-rose-600">- ₱ {data.summary.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-full h-px bg-slate-200 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-base font-extrabold text-slate-900 uppercase tracking-tight">Net Earnings</span>
                      <span className="text-xl font-mono font-extrabold text-indigo-600">₱ {data.summary.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Historical Table */}
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
                        {MOCK_HISTORY.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-700">{item.period}</td>
                                <td className="px-6 py-4 text-slate-600">{item.cutoff}</td>
                                <td className="px-6 py-4 text-slate-600">{item.payDate}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-500">₱ {item.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">₱ {item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100">
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
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'structure' && <ImplementedPayStructureTab />}

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:pl-72 z-20 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors rounded-xl hover:bg-slate-100">
                <Printer size={18} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors rounded-xl hover:bg-slate-100">
                <Download size={18} /> Download PDF
            </button>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all hover:border-slate-300">
                Cancel
            </button>
            <button className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                <CreditCard size={18} /> Disburse
            </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;
