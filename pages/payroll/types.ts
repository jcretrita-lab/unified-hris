
export interface PayrollItem {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'Generated' | 'Review Needed' | 'Ready';
  attendance: 'Complete' | 'Incomplete';
  disbursementMode: 'E-Wallet' | 'Bank' | 'Check';
  roleBadgeColor: string;
  // New Fields
  netPay: number;
  bankName: string;
  accountNumber: string;
}

// typespayroll.ts (Verify this exists and is correct)
// typespayroll.ts (Verify this exists and is correct)
export interface YearEndSummary {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  ytdGross: number;
  ytdTaxable: number;
  taxWithheld: number;
  taxDue: number;
  thirteenthMonth: number;
  assumedThirteenthMonth: number;
  actualThirteenthMonth: number;
  assumedStatus: 'Draft' | 'Finalized';
  actualStatus: 'Draft' | 'Finalized';
  // Tax Annualization Fields
  assumedTax: number;
  actualTax: number;
  assumedTaxStatus: 'Draft' | 'Finalized';
  actualTaxStatus: 'Draft' | 'Finalized';
  govContributions: {
    sss: number;
    philhealth: number;
    pagibig: number;
  };
  status: 'Balanced' | 'Refund Due' | 'Tax Payable'; // <-- This is correct
  tin: string;
  employerName: string;
  employerTIN: string;
  employerAddress: string;
  exemptIncome: number;
}

export interface PeriodData {
  basicPay: number;
  absences: number;
  lateUndertime: number;
  leaves: number;
  otherEarnings: number;
  salaryDifferential?: number;
  otherTaxable?: number;
  earnedBasic: number;
  sss?: number;
  philhealth?: number;
  pagibig?: number;
}

export interface MonthlyPayrollRecord {
  month: string;
  p1: PeriodData;
  p2: PeriodData;
  earnedBasic: number;
  status: 'Paid' | 'Projected';
}

export interface LeaveConversionItem {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  dailyRate: number;
  vlBalance: number;
  slBalance: number;
  // Transactional state
  vlToConvert?: number;
  slToConvert?: number;
  totalCashValue?: number;
  status?: string;
}
