
import React, { useState } from 'react';
import {
  ArrowRightLeft
} from 'lucide-react';

import PayrollRunTab from './payroll/PayrollRunTab';
import LeaveConversionTab from './payroll/LeaveConversionTab';

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'management' | 'conversion'>('management');

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Management</h1>
        <p className="text-slate-500 font-medium mt-1">Manage disbursements, generate payslips, and annualization.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('management')}
          className={`px-8 py-4 text-sm font-bold transition-all relative ${activeTab === 'management'
              ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
        >
          Payroll Run
        </button>
        <button
          onClick={() => setActiveTab('conversion')}
          className={`px-8 py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'conversion'
              ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
        >
          <ArrowRightLeft size={16} /> Leave Conversion
        </button>
      </div>

      {/* --- TAB CONTENT RENDER --- */}
      {activeTab === 'management' && <PayrollRunTab />}
      {activeTab === 'conversion' && <LeaveConversionTab />}

    </div>
  );
};

export default PayrollManagement;
