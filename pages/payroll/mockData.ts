
import { PayrollItem, YearEndSummary, LeaveConversionItem, MonthlyPayrollRecord } from './types';

export const MOCK_PAYROLL_DATA: PayrollItem[] = [
  {
    id: 'emp-1',
    name: 'James Cordon',
    role: 'IT Developer Intern',
    department: 'IT Department',
    avatar: 'JC',
    status: 'Generated',
    attendance: 'Complete',
    disbursementMode: 'E-Wallet',
    roleBadgeColor: 'bg-slate-100 text-slate-600',
    netPay: 12500.00,
    bankName: 'GCash',
    accountNumber: '0917-123-4567'
  },
  {
    id: 'emp-2',
    name: 'Louis Panganiban',
    role: 'Senior Developer',
    department: 'IT Department',
    avatar: 'LP',
    status: 'Review Needed',
    attendance: 'Incomplete',
    disbursementMode: 'Bank',
    roleBadgeColor: 'bg-slate-100 text-slate-600',
    netPay: 58000.00,
    bankName: 'BPI',
    accountNumber: '1029-3847-56'
  },
  {
    id: 'emp-3',
    name: 'Minato Gottenburg',
    role: 'Junior Developer',
    department: 'IT Department',
    avatar: 'MG',
    status: 'Review Needed',
    attendance: 'Incomplete',
    disbursementMode: 'Bank',
    roleBadgeColor: 'bg-slate-100 text-slate-600',
    netPay: 32000.00,
    bankName: 'UnionBank',
    accountNumber: '1093-2211-4455'
  },
  {
    id: 'emp-4',
    name: 'Sarah Wilson',
    role: 'HR Manager',
    department: 'HR Department',
    avatar: 'SW',
    status: 'Generated',
    attendance: 'Complete',
    disbursementMode: 'Bank',
    roleBadgeColor: 'bg-purple-50 text-purple-600 border-purple-100',
    netPay: 49500.00,
    bankName: 'BDO',
    accountNumber: '0012-3456-7890'
  },
  {
    id: 'emp-5',
    name: 'Mike Brown',
    role: 'Payroll Specialist',
    department: 'Finance',
    avatar: 'MB',
    status: 'Ready',
    attendance: 'Complete',
    disbursementMode: 'Check',
    roleBadgeColor: 'bg-amber-50 text-amber-600 border-amber-100',
    netPay: 40000.00,
    bankName: 'Check Payment',
    accountNumber: 'N/A'
  }
];

export const MOCK_YEAR_END_DATA: YearEndSummary[] = [
  {
    id: 'emp-1',
    name: 'James Cordon',
    role: 'IT Developer Intern',
    department: 'IT',
    avatar: 'JC',
    ytdGross: 250000,
    ytdTaxable: 220000,
    taxWithheld: 15000,
    taxDue: 15000,
    thirteenthMonth: 20833.33,
    assumedThirteenthMonth: 20500.00,
    actualThirteenthMonth: 20833.33,
    assumedStatus: 'Finalized',
    actualStatus: 'Draft',
    govContributions: { sss: 12000, philhealth: 4500, pagibig: 2400 },
    status: 'Balanced'
  },
  {
    id: 'emp-2',
    name: 'Louis Panganiban',
    role: 'Senior Developer',
    department: 'IT',
    avatar: 'LP',
    ytdGross: 780000,
    ytdTaxable: 740000,
    taxWithheld: 85000,
    taxDue: 82000,
    thirteenthMonth: 65000.00,
    assumedThirteenthMonth: 64000.00,
    actualThirteenthMonth: 65000.00,
    assumedStatus: 'Finalized',
    actualStatus: 'Draft',
    govContributions: { sss: 24000, philhealth: 12500, pagibig: 2400 },
    status: 'Refund Due'
  },
  {
    id: 'emp-4',
    name: 'Sarah Wilson',
    role: 'HR Manager',
    department: 'HR',
    avatar: 'SW',
    ytdGross: 660000,
    ytdTaxable: 620000,
    taxWithheld: 60000,
    taxDue: 65000,
    thirteenthMonth: 55000.00,
    assumedThirteenthMonth: 54500.00,
    actualThirteenthMonth: 55000.00,
    assumedStatus: 'Finalized',
    actualStatus: 'Draft',
    govContributions: { sss: 24000, philhealth: 11000, pagibig: 2400 },
    status: 'Tax Payable'
  }
];

export const MOCK_CONVERSION_DB: Omit<LeaveConversionItem, 'vlToConvert' | 'slToConvert' | 'totalCashValue' | 'status'>[] = [
  { id: 'emp-2', name: 'Louis Panganiban', role: 'Senior Developer', department: 'IT', avatar: 'LP', dailyRate: 2840.90, vlBalance: 12.0, slBalance: 15.0 },
  { id: 'emp-4', name: 'Sarah Wilson', role: 'HR Manager', department: 'HR', avatar: 'SW', dailyRate: 2386.36, vlBalance: 8.5, slBalance: 10.0 },
  { id: 'emp-5', name: 'Mike Brown', role: 'Payroll Specialist', department: 'Finance', avatar: 'MB', dailyRate: 1931.81, vlBalance: 15.0, slBalance: 15.0 },
  { id: 'emp-1', name: 'James Cordon', role: 'IT Intern', department: 'IT', avatar: 'JC', dailyRate: 850.00, vlBalance: 5.0, slBalance: 2.0 },
];

export const generate13thMonthHistory = (totalBasic: number): MonthlyPayrollRecord[] => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const baseMonthly = totalBasic / 12;

  return months.map((m, idx) => {
    // Basic bi-monthly split
    const p1_basic = baseMonthly / 2;
    const p2_basic = baseMonthly / 2;

    // Simulate period-specific variances
    const p1_absences = (idx === 3) ? p1_basic * 0.1 : 0;
    const p2_absences = (idx === 7) ? p2_basic * 0.05 : 0;

    const p1_late = (idx % 2 === 0) ? 225.10 : 0;
    const p2_late = (idx % 3 === 0) ? 150.50 : 0;

    const p1_ot = (idx % 4 === 0) ? 1200 : 0;
    const p2_ot = (idx % 2 === 0) ? 800 : 0;

    const p1_sss = 1125;
    const p1_pagibig = 100;
    const p2_ph = 450;
    const p2_tax = 1800;

    const p1_nd2 = idx % 2 === 0 ? 350 : 0;
    const p2_rdot = idx % 4 === 0 ? 1500 : 0;
    const p1_bonus = idx === 11 ? 5000 : 0; // Christmas bonus

    return {
      month: m,
      p1: {
        basicPay: p1_basic,
        absences: p1_absences,
        lateUndertime: p1_late,
        leaves: 0,
        otherEarnings: p1_ot,
        sss: p1_sss,
        pagibig: p1_pagibig,
        nd2: p1_nd2,
        bonus: p1_bonus,
        earnedBasic: p1_basic - p1_absences - p1_late + p1_ot + p1_nd2 + p1_bonus
      },
      p2: {
        basicPay: p2_basic,
        absences: p2_absences,
        lateUndertime: p2_late,
        leaves: 0,
        otherEarnings: p2_ot,
        philhealth: p2_ph,
        tax: p2_tax,
        restDayOt: p2_rdot,
        earnedBasic: p2_basic - p2_absences - p2_late + p2_ot + p2_rdot
      },
      earnedBasic: (p1_basic - p1_absences - p1_late + p1_ot + p1_nd2 + p1_bonus) + (p2_basic - p2_absences - p2_late + p2_ot + p2_rdot),
      status: idx > 9 ? 'Projected' : 'Paid'
    };
  });
};
