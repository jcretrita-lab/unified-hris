
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, AlertCircle } from 'lucide-react';

interface HistoryItem {
  id: string; // Added ID for navigation
  date: string;
  leaveType: string;
  currentBalance: number;
  leaveAmount: number;
  remainingBalance: number;
  reason: string;
  action: 'Credit' | 'Debit';
}

// Mock Data
const MOCK_DETAIL = {
  id: 'emp-1',
  name: 'James Cordon',
  role: 'IT Developer Intern',
  avatar: 'JC',
  vlBalance: -1.0, // Negative for simulation
  vlTotal: 15.0,
  slBalance: 15.0,
  slTotal: 15.0,
  lastReset: 'January 1, 2025',
  history: [
    {
      group: 'Jan 2026 (Projected)',
      items: [
        { id: 'lr-future-1', date: 'January 1, 2026', leaveType: 'Vacation Leave', currentBalance: -1.0, leaveAmount: 15.0, remainingBalance: 14.0, reason: 'Annual Reset (Debt Deducted)', action: 'Credit' },
        { id: 'lr-future-2', date: 'January 1, 2026', leaveType: 'Sick Leave', currentBalance: 15.0, leaveAmount: 15.0, remainingBalance: 15.0, reason: 'Annual Reset', action: 'Credit' }
      ] as HistoryItem[]
    },
    {
      group: 'Nov 2025',
      items: [
        { id: 'lr-overdraft', date: 'November 15, 2025', leaveType: 'Vacation Leave', currentBalance: 0.0, leaveAmount: 1.0, remainingBalance: -1.0, reason: 'Approved Overdraft', action: 'Debit' }
      ] as HistoryItem[]
    },
    {
      group: 'Aug 2025',
      items: [
        { id: 'lr-55', date: 'August 24, 2025', leaveType: 'Vacation Leave', currentBalance: 5.0, leaveAmount: 5.0, remainingBalance: 0.0, reason: 'Family Vacation', action: 'Debit' }
      ] as HistoryItem[]
    },
    {
      group: 'Jan 2025',
      items: [
         { id: 'lr-start', date: 'January 1, 2025', leaveType: 'Vacation Leave', currentBalance: 0.0, leaveAmount: 15.0, remainingBalance: 15.0, reason: 'Annual Reset', action: 'Credit' }
      ]
    }
  ]
};

const EmployeeLeaveBalanceDetail: React.FC = () => {
  const navigate = useNavigate();
  // In a real app, use id to fetch data
  const { id } = useParams();
  const data = MOCK_DETAIL;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <button 
            onClick={() => navigate('/manage/leave-balances')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4 bg-slate-200 px-4 py-2 rounded-lg w-fit hover:bg-slate-300"
        >
            <ArrowLeft size={16} />
            Back to Leave Balances
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-2xl font-bold text-slate-600 border-4 border-slate-100">
                {data.avatar}
            </div>
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{data.name}</h1>
                <p className="text-slate-500 font-bold">{data.role}</p>
                <div className="w-12 h-1 bg-indigo-500 mt-3 rounded-full"></div>
            </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-bold text-slate-500 mb-1">Vacation Leave</h3>
                    <div className={`text-4xl font-extrabold ${data.vlBalance < 0 ? 'text-rose-600' : 'text-indigo-600'} flex items-center gap-2`}>
                        {data.vlBalance.toFixed(1)} <span className="text-lg text-slate-300">/ {data.vlTotal}</span>
                        {data.vlBalance < 0 && <AlertCircle size={24} className="text-rose-500" />}
                    </div>
                    {data.vlBalance < 0 && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wide">Negative Balance</p>}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-500 mb-1">Sick Leave</h3>
                    <div className="text-4xl font-extrabold text-emerald-600">
                        {data.slBalance.toFixed(1)} <span className="text-lg text-slate-300">/ {data.slTotal}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 text-xs font-medium text-slate-400">
                Last Reset: <span className="font-bold text-slate-600">{data.lastReset}</span>
            </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Leave Balance History</h3>
        
        <div className="space-y-8">
            {data.history.map((group, idx) => (
                <div key={idx}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-2">{group.group}</h4>
                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                        <table className="w-full text-sm text-left table-fixed">
                            <thead className="bg-slate-500 text-white font-bold text-[10px] uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 w-[18%]">Date</th>
                                    <th className="px-6 py-4 w-[18%]">Leave Type</th>
                                    <th className="px-6 py-4 w-[12%] text-right">Current Bal</th>
                                    <th className="px-6 py-4 w-[12%] text-right">Adjustment</th>
                                    <th className="px-6 py-4 w-[12%] text-right">Remaining</th>
                                    <th className="px-6 py-4 w-[20%]">Reason</th>
                                    <th className="px-6 py-4 w-[8%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/50">
                                {group.items.map((item, i) => (
                                    <tr 
                                        key={i} 
                                        className="hover:bg-slate-100 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/manage/leave-request/${item.id}`)}
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-700 truncate">{item.date}</td>
                                        <td className="px-6 py-4 font-medium text-slate-600 truncate">{item.leaveType}</td>
                                        <td className={`px-6 py-4 text-right font-mono ${item.currentBalance < 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                                            {item.currentBalance.toFixed(1)}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${item.action === 'Credit' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {item.action === 'Credit' ? '+' : '-'}{item.leaveAmount.toFixed(1)}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono font-bold ${item.remainingBalance < 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                                            {item.remainingBalance.toFixed(1)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 truncate" title={item.reason}>{item.reason}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaveBalanceDetail;
