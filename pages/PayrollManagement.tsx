
import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Briefcase,
  Sliders,
  Wallet,
  User,
  MinusCircle
} from 'lucide-react';

import PayrollRunTab from './payroll/PayrollRunTab';
import DeductionsTab from './payroll/DeductionsTab';
import AdjustmentsTab from './payroll/AdjustmentsTab';
import PayProfileTab from './payroll/PayProfileTab';

type PayrollTabType = 'deductions' | 'adjustments' | 'pay-profile' | 'payroll-run';

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PayrollTabType>('deductions');

  const tabs: { id: PayrollTabType; label: string; icon: any }[] = [
    { id: 'deductions', label: 'Deductions', icon: MinusCircle },
    { id: 'adjustments', label: 'Adjustments', icon: Sliders },
    { id: 'pay-profile', label: 'Pay Profile', icon: User },
    { id: 'payroll-run', label: 'Payroll Run', icon: Wallet },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Management</h1>
        <p className="text-slate-500 font-medium mt-1">Manage disbursements, generate payslips, and annualization.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === tab.id
                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENT RENDER --- */}
      {activeTab === 'deductions' && <DeductionsTab />}
      {activeTab === 'adjustments' && <AdjustmentsTab />}
      {activeTab === 'pay-profile' && <PayProfileTab />}
      {activeTab === 'payroll-run' && <PayrollRunTab />}
    </div>
  );
};

export default PayrollManagement;
