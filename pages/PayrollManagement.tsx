
import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Briefcase
} from 'lucide-react';

import PayrollRunTab from './payroll/PayrollRunTab';

const PayrollManagement: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Management</h1>
        <p className="text-slate-500 font-medium mt-1">Manage disbursements, generate payslips, and annualization.</p>
      </div>

      {/* --- CONTENT RENDER --- */}
      <PayrollRunTab />
    </div>
  );
};

export default PayrollManagement;
