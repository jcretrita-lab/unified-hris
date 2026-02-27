
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
  govContributions: {
    sss: number;
    philhealth: number;
    pagibig: number;
  };
  status: 'Balanced' | 'Refund Due' | 'Tax Payable';
}

export interface MonthlyPayrollRecord {
    month: string;
    period: string;
    basicPay: number;
    absences: number;
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
