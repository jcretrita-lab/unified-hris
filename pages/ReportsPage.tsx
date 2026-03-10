
import React, { useState } from 'react';
import {
  FileBarChart,
  Search,
  FileSpreadsheet,
  FileText,
  Clock,
  Users,
  Wallet,
  ShieldCheck,
  Calendar,
  Table,
  Plus,
  Trash2,
  Lock,
  Database,
  ChevronRight,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { MASTER_SCHEMAS } from './ReportDetail';

// --- Types ---
type ReportCategory = 'Employee Masterlist' | 'Time & Attendance' | 'Payroll';
type ReportType = 'Standard' | 'Custom';

interface ReportDef {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  type: ReportType;
  lastGenerated: string;
  icon: React.ReactNode;
  tags: string[];
}

// Helper Icon
const UserPlusIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

// --- Mock Data ---
const INITIAL_REPORTS: ReportDef[] = [
  // ── EMPLOYEE MASTERLIST REPORTS (Standard / Immutable) ────────────────────
  {
    id: 'rep-em-01',
    title: 'Masterlist of Level 5 And Up',
    description: 'Lists employees from managerial levels and above; used for management reporting or executive reviews.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Today, 9:00 AM',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Management', 'Executives']
  },
  {
    id: 'rep-hr-1',
    title: 'Masterlist ALL',
    description: 'Comprehensive list of all active employees with complete details.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Today, 8:30 AM',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Masterfile', 'Directory', 'Compliance']
  },
  {
    id: 'rep-em-03',
    title: 'Masterlist ALL w/out Salary',
    description: 'Same as Masterlist ALL but excludes salary data; useful for non-confidential use.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Masterfile', 'Non-Confidential']
  },
  {
    id: 'rep-em-04',
    title: 'Masterlist of Indirect Labor',
    description: 'Lists employees categorized under indirect labor.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Indirect Labor', 'Masterfile']
  },
  {
    id: 'rep-em-05',
    title: 'Masterlist w/ SSS/TIN of Direct Labor',
    description: 'Includes SSS and TIN details for Direct Labor; used for submissions to SSS, BIR, etc.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <ShieldCheck size={24} className="text-blue-600" />,
    tags: ['Direct Labor', 'SSS', 'BIR']
  },
  {
    id: 'rep-em-06',
    title: 'Masterlist w/ SSS/TIN of Indirect Labor',
    description: 'Includes SSS and TIN details for Indirect Labor; used for submissions to SSS, BIR, etc.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <ShieldCheck size={24} className="text-blue-600" />,
    tags: ['Indirect Labor', 'SSS', 'BIR']
  },
  {
    id: 'rep-em-07',
    title: 'Masterlist of Resigned Employees',
    description: 'List of former employees; used for clearance validation, alumni records, and re-hiring checks.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Resigned', 'Alumni', 'Separation']
  },
  {
    id: 'rep-em-08',
    title: 'Masterlist to Excel',
    description: 'Generates a downloadable Excel file of employee data for reporting, audit, or analysis.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Today, 10:00 AM',
    icon: <FileSpreadsheet size={24} className="text-blue-600" />,
    tags: ['Export', 'Excel', 'Audit']
  },
  {
    id: 'rep-em-09',
    title: 'Employee General List',
    description: 'Summary list of all employees with general info; used for quick reference.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Directory', 'Quick Reference']
  },
  {
    id: 'rep-em-10',
    title: 'Manpower Report',
    description: 'Summarizes total headcount per department/division; used in strategic planning and reporting.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Headcount', 'Planning', 'Workforce']
  },
  {
    id: 'rep-em-11',
    title: 'Positions Listing',
    description: 'Displays all active positions in the organization with corresponding counts; aids in vacancy tracking.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <Table size={24} className="text-blue-600" />,
    tags: ['Positions', 'Vacancy', 'Org Chart']
  },
  {
    id: 'rep-em-12',
    title: 'Demographics',
    description: 'Presents employee demographics such as age, gender, civil status, education, etc.; used for HR planning and compliance.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <Database size={24} className="text-blue-600" />,
    tags: ['Demographics', 'Compliance', 'Planning']
  },
  {
    id: 'rep-em-13',
    title: 'DOLE Report',
    description: 'Prepared for Department of Labor and Employment; includes employment status and demographics.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Jan 31, 2026',
    icon: <FileText size={24} className="text-blue-600" />,
    tags: ['DOLE', 'Government', 'Compliance']
  },
  {
    id: 'rep-em-14',
    title: 'Years of Service Report',
    description: 'Lists employees by length of service; used for loyalty awards, retirement, or milestone recognition.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Calendar size={24} className="text-blue-600" />,
    tags: ['Tenure', 'Loyalty', 'Retirement']
  },
  {
    id: 'rep-em-15',
    title: 'Birthdates',
    description: 'List of employee birthdays for greetings, wellness programs, or age-related benefits.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 4, 2026',
    icon: <Calendar size={24} className="text-blue-600" />,
    tags: ['Birthdays', 'Wellness']
  },
  {
    id: 'rep-em-16',
    title: 'Masterlist All Per Division',
    description: 'Masterlist broken down by division; useful for divisional HR heads or reports.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Division', 'Masterfile']
  },
  {
    id: 'rep-em-17',
    title: 'Employee Data By Date Hired',
    description: 'Sorts employees by hire date; useful for onboarding, probation tracking, or reporting.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Calendar size={24} className="text-blue-600" />,
    tags: ['Onboarding', 'Probation', 'Date Hired']
  },
  {
    id: 'rep-em-18',
    title: '201 File',
    description: 'Digital copy of employee 201 files; includes personal, employment, and legal documents.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <FileText size={24} className="text-blue-600" />,
    tags: ['201', 'Records', 'Documents']
  },
  {
    id: 'rep-em-19',
    title: 'Alumni Report',
    description: 'Tracks separated employees; useful for verification, rehires, or alumni outreach.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Users size={24} className="text-blue-600" />,
    tags: ['Alumni', 'Separated', 'Rehire']
  },
  {
    id: 'rep-em-20',
    title: 'PAF',
    description: 'Reflects all changes in employee status, role, salary, or assignment; used for documentation and approval.',
    category: 'Employee Masterlist',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <FileText size={24} className="text-blue-600" />,
    tags: ['PAF', 'Status Change', 'Approval']
  },

  // ── TIME AND ATTENDANCE (TAA) REPORTS (Standard / Immutable) ──────────────
  {
    id: 'rep-ta-late',
    title: 'Late',
    description: 'Lists instances of employee tardiness; used to track habitual latecomers and apply disciplinary action or payroll deductions.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Today, 7:00 AM',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['Tardiness', 'Deductions', 'Discipline']
  },
  {
    id: 'rep-ta-ut',
    title: 'Undertime',
    description: 'Records employees who log out earlier than scheduled; used for deduction computation and performance review.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Yesterday',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['Undertime', 'Deductions']
  },
  {
    id: 'rep-ta-ot',
    title: 'OT Report',
    description: 'Displays overtime hours rendered; used for payroll approval validation and labor cost analysis.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['Overtime', 'Labor Cost', 'DOLE']
  },
  {
    id: 'rep-ta-slvl',
    title: 'SLVL Balance',
    description: 'Shows current Sick Leave (SL) and Vacation Leave (VL) balances per employee; used for leave planning and HR audits.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Calendar size={24} className="text-indigo-600" />,
    tags: ['SL', 'VL', 'Leave Balance']
  },
  {
    id: 'rep-ta-att',
    title: 'Attendance',
    description: 'Shows raw clock-ins/outs or summarized daily attendance per employee; used to verify presence/absence.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Today, 8:00 AM',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['Attendance', 'Clock-in', 'Verification']
  },
  {
    id: 'rep-ta-sumh',
    title: 'Time and Attendance Summary Report History',
    description: 'Consolidated timekeeping summary for past periods (e.g., cutoff, monthly); used for audit trails and reference.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <FileBarChart size={24} className="text-indigo-600" />,
    tags: ['History', 'Audit', 'Summary']
  },
  {
    id: 'rep-ta-1',
    title: 'Time and Attendance Summary Report',
    description: 'Real-time or current payroll period summary of time-ins/outs, total hours, absences, etc.; used for payroll computation.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Today, 7:30 AM',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['DTR', 'Summary', 'Payroll']
  },
  {
    id: 'rep-ta-dtr',
    title: 'DTR',
    description: 'Individual Daily Time Record showing daily time-ins/outs; used for attendance validation and payroll basis.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Today, 8:00 AM',
    icon: <FileText size={24} className="text-indigo-600" />,
    tags: ['DTR', 'Daily', 'Individual']
  },
  {
    id: 'rep-ta-dtrh',
    title: 'DTR History',
    description: 'Historical records of DTRs per employee; useful for backtracking, disputes, or auditing.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <FileText size={24} className="text-indigo-600" />,
    tags: ['DTR', 'History', 'Audit']
  },
  {
    id: 'rep-ta-vlsl',
    title: 'VLSL Application',
    description: 'Records filed Sick/Vacation Leave requests with details like date, type, and status; used for leave approval processing.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Calendar size={24} className="text-indigo-600" />,
    tags: ['Leave', 'Application', 'Approval']
  },
  {
    id: 'rep-ta-vlslh',
    title: 'VLSL Application History',
    description: 'Archived record of past leave applications; used to check usage patterns and ensure policy compliance.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <Calendar size={24} className="text-indigo-600" />,
    tags: ['Leave', 'History', 'Compliance']
  },
  {
    id: 'rep-ta-mh',
    title: 'Manhour Report',
    description: 'Reports total actual hours worked per employee or group; used for productivity analysis, costing, or DOLE/PEZA reports.',
    category: 'Time & Attendance',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Clock size={24} className="text-indigo-600" />,
    tags: ['Manhours', 'Productivity', 'DOLE']
  },

  // ── PAYROLL SYSTEM (PAYSYS) REPORTS (Standard / Immutable) ────────────────
  {
    id: 'rep-pay-1',
    title: 'Payslip',
    description: 'Individual breakdown of earnings and deductions for a payroll period; given to employees.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <FileSpreadsheet size={24} className="text-emerald-600" />,
    tags: ['Payslip', 'Earnings', 'Net Pay']
  },
  {
    id: 'rep-pay-itr-2316',
    title: 'BIR Form 2316 (ITR)',
    description: 'Certificate of Compensation Payment/Tax Withheld. Generates the official annual tax return document per employee.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 9, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['BIR Form 2316', 'ITR', 'Compliance', 'Tax']
  },
  {
    id: 'rep-ps-hist',
    title: 'Payslip History',
    description: 'Archive of previously generated payslips; used for reference and dispute resolution.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <FileSpreadsheet size={24} className="text-emerald-600" />,
    tags: ['Payslip', 'History', 'Archive']
  },
  {
    id: 'rep-ps-loans',
    title: 'Employee Loans',
    description: 'Lists loan balances and deductions per employee; includes company and government loans.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Loans', 'Deductions', 'Balances']
  },
  {
    id: 'rep-ps-journal',
    title: 'Payroll Journal',
    description: 'Summary of total payroll entries (gross pay, deductions, net pay); used in accounting and posting.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Journal', 'Accounting', 'Posting']
  },
  {
    id: 'rep-ps-jd',
    title: 'Payroll Journal Dailies',
    description: 'Payroll journal for daily-paid employees; includes daily rates and applicable deductions.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Journal', 'Daily', 'Accounting']
  },
  {
    id: 'rep-ps-period',
    title: 'Payroll Period',
    description: 'List of defined payroll periods, cutoffs, and applicable dates for reference or filtering.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Calendar size={24} className="text-emerald-600" />,
    tags: ['Period', 'Cutoff', 'Reference']
  },
  {
    id: 'rep-ps-13th-dept',
    title: '13th MO Entries Dept',
    description: 'Shows 13th month pay data per department; used for annual bonus computations.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Dec 1, 2025',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['13th Month', 'Department', 'Annual']
  },
  {
    id: 'rep-ps-fdtr',
    title: 'Payslip Final DTR',
    description: 'Reflects the DTR (attendance) data tied to payroll for transparency.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <FileText size={24} className="text-emerald-600" />,
    tags: ['Payslip', 'DTR', 'Transparency']
  },
  {
    id: 'rep-ps-fdtrh',
    title: 'Payslip Final DTR History',
    description: 'Historical version of DTRs used in previous payroll runs.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Jan 31, 2026',
    icon: <FileText size={24} className="text-emerald-600" />,
    tags: ['Payslip', 'DTR', 'History']
  },
  {
    id: 'rep-ps-13th-slip',
    title: '13th Payslip',
    description: 'Payslip format focused on annual 13th month pay; required for legal compliance.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Dec 5, 2025',
    icon: <FileSpreadsheet size={24} className="text-emerald-600" />,
    tags: ['13th Month', 'Payslip', 'Compliance']
  },
  {
    id: 'rep-ps-13th-all',
    title: '13th Summary ALL',
    description: 'Summary report of 13th month pay across all employees; used for reporting and reconciliation.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Dec 1, 2025',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['13th Month', 'Summary', 'Reconciliation']
  },
  {
    id: 'rep-ps-entries',
    title: 'Payroll Entries',
    description: 'Shows specific payroll items entered per employee (earnings, deductions, adjustments).',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Table size={24} className="text-emerald-600" />,
    tags: ['Entries', 'Earnings', 'Adjustments']
  },
  {
    id: 'rep-ps-slvl',
    title: 'SLVL Summary',
    description: 'Overview of SL/VL credits, usage, and balance per employee.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 3, 2026',
    icon: <Calendar size={24} className="text-emerald-600" />,
    tags: ['SL', 'VL', 'Summary']
  },
  {
    id: 'rep-ps-coop',
    title: 'Coop Contribution',
    description: 'Monthly contributions of employees to cooperative savings/funds.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Cooperative', 'Contributions']
  },
  {
    id: 'rep-ps-hdmf',
    title: 'HDMF Contribution',
    description: 'Current contributions for HDMF (Pag-IBIG) Regular Fund.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['HDMF', 'Pag-IBIG', 'Contribution']
  },
  {
    id: 'rep-ps-hdmfh',
    title: 'HDMF Contribution History',
    description: 'Historical HDMF contributions for reconciliation and audit.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['HDMF', 'Pag-IBIG', 'History']
  },
  {
    id: 'rep-ps-mp2',
    title: 'HDMF Contribution MP2',
    description: 'Contributions for Modified Pag-IBIG 2 savings program.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['HDMF', 'MP2', 'Savings']
  },
  {
    id: 'rep-ps-mp2m',
    title: 'HDMF Contribution History MP2 Month',
    description: 'Monthly view of MP2 contributions for easier submission/reporting.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['HDMF', 'MP2', 'Monthly']
  },
  {
    id: 'rep-ps-hdmf-loan',
    title: 'HDMF Loan Report',
    description: 'Shows monthly loan deductions related to Pag-IBIG loans.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['HDMF', 'Loans', 'Deductions']
  },
  {
    id: 'rep-ps-loan-hist',
    title: 'Loan Report History',
    description: 'Consolidated loan reports across all types (company, government, cooperative).',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Loans', 'History', 'All Types']
  },
  {
    id: 'rep-ps-monthly-loans',
    title: 'Monthly Loans Report',
    description: 'Active loan deductions for the current month; used for remittance and validation.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Loans', 'Monthly', 'Remittance']
  },

  // ── ADDITIONAL PAYROLL REPORTS (Standard / Immutable) ─────────────────────
  {
    id: 'rep-ap-monthly',
    title: 'Monthly Report',
    description: 'Monthly summary of payroll activity (headcount, totals, etc.).',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Monthly', 'Summary', 'Payroll']
  },
  {
    id: 'rep-ap-sss',
    title: 'Monthly SSS Loans Report',
    description: 'Monthly report of Social Security System loan payments.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <ShieldCheck size={24} className="text-emerald-600" />,
    tags: ['SSS', 'Loans', 'Monthly']
  },
  {
    id: 'rep-ap-last-pay',
    title: 'Last Pay',
    description: 'Computes and records terminal pay of resigned or terminated employees.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Last Pay', 'Terminal', 'Separation']
  },
  {
    id: 'rep-ap-ledger',
    title: 'Payroll Ledger',
    description: 'Ledger per employee showing full payroll history (earnings and deductions).',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 28, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Ledger', 'History', 'Finance']
  },
  {
    id: 'rep-ap-fbat',
    title: 'FBAT',
    description: 'Summary of finalized payroll including bank account details; used for uploading to the bank for salary disbursement.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Feb 15, 2026',
    icon: <FileSpreadsheet size={24} className="text-emerald-600" />,
    tags: ['FBAT', 'Bank', 'Disbursement']
  },
  {
    id: 'rep-ap-income-d',
    title: 'Income Dailies',
    description: 'Shows gross income earned by daily-paid employees.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Income', 'Daily', 'Earnings']
  },
  {
    id: 'rep-ap-ded-d',
    title: 'Deduction Dailies',
    description: 'Breaks down all applicable deductions for daily-paid workers.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Deductions', 'Daily', 'Workers']
  },
  {
    id: 'rep-ap-acct-d',
    title: 'Accounting Details Dailies',
    description: 'Shows detailed journal entries per daily-paid employee.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Accounting', 'Journal', 'Daily']
  },
  {
    id: 'rep-ap-acct-sd',
    title: 'Accounting Summary Dailies',
    description: 'Summarized version for accounting use and posting.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Accounting', 'Summary', 'Daily']
  },
  {
    id: 'rep-ap-income-m',
    title: 'Income Monthly',
    description: 'Total monthly earnings of employees; used for finance reporting.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Income', 'Monthly', 'Finance']
  },
  {
    id: 'rep-ap-ded-m',
    title: 'Deduction Monthly',
    description: 'Total monthly deductions including loans, taxes, and contributions.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <Wallet size={24} className="text-emerald-600" />,
    tags: ['Deductions', 'Monthly', 'Tax']
  },
  {
    id: 'rep-ap-acct-m',
    title: 'Accounting Details Monthly',
    description: 'General ledger-level detail of monthly payroll per account.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Accounting', 'GL', 'Monthly']
  },
  {
    id: 'rep-ap-acct-sm',
    title: 'Accounting Summary Monthly',
    description: 'Summary by cost center or GL account for posting in the accounting system.',
    category: 'Payroll',
    type: 'Standard',
    lastGenerated: 'Mar 1, 2026',
    icon: <FileBarChart size={24} className="text-emerald-600" />,
    tags: ['Accounting', 'Summary', 'GL']
  },

  // ── CUSTOM REPORTS (Mutable) ───────────────────────────────────────────────
  {
    id: 'rep-cust-1',
    title: 'Q1 2026 New Hire Tracker',
    description: 'Custom onboarding tracker for employees hired in Q1 2026. Includes completion status of pre-employment requirements and 201 file checklist.',
    category: 'Employee Masterlist',
    type: 'Custom',
    lastGenerated: 'Mar 1, 2026',
    icon: <UserPlusIcon size={24} className="text-slate-500" />,
    tags: ['Onboarding', 'Q1 2026']
  },
  {
    id: 'rep-cust-2',
    title: 'IT Department Overtime Analysis',
    description: 'Drill-down on OT hours and estimated cost for the IT Department for the period November 2025 – February 2026, segmented by project code and approver.',
    category: 'Time & Attendance',
    type: 'Custom',
    lastGenerated: 'Feb 15, 2026',
    icon: <Clock size={24} className="text-slate-500" />,
    tags: ['IT Dept', 'Cost Analysis', 'OT']
  },
  {
    id: 'rep-cust-3',
    title: 'Salary Grade Distribution',
    description: 'Custom workforce compensation analysis mapping each active employee to their assigned salary grade and step. Includes min/max range utilization per grade.',
    category: 'Employee Masterlist',
    type: 'Custom',
    lastGenerated: 'Jan 15, 2026',
    icon: <Table size={24} className="text-slate-500" />,
    tags: ['Compensation', 'Grading']
  },
  {
    id: 'rep-cust-4',
    title: 'Voluntary Attrition Analysis — FY 2025',
    description: 'Custom turnover analysis for voluntary separations in FY 2025, broken down by department, tenure band, and exit reason. Includes annualized attrition rate.',
    category: 'Employee Masterlist',
    type: 'Custom',
    lastGenerated: 'Feb 1, 2026',
    icon: <FileBarChart size={24} className="text-slate-500" />,
    tags: ['Attrition', 'Retention', 'FY 2025']
  },
  {
    id: 'rep-cust-5',
    title: 'Benefits & Allowance Cost Summary',
    description: 'Custom monthly cost summary of all non-taxable benefits and allowances (rice, transport, meal, medical, clothing) per department for budget reconciliation.',
    category: 'Payroll',
    type: 'Custom',
    lastGenerated: 'Feb 28, 2026',
    icon: <Wallet size={24} className="text-slate-500" />,
    tags: ['Benefits', 'Budgeting', 'Allowances']
  }
];

// Master source options derived from MASTER_SCHEMAS
const MASTER_SOURCE_OPTIONS = [
  {
    id: 'rep-hr-1',
    label: 'Masterlist ALL',
    category: 'Employee Masterlist' as ReportCategory,
    description: 'Employee demographics, position, compensation, and statutory numbers.',
    icon: <Users size={22} className="text-blue-600" />,
    color: 'blue',
  },
  {
    id: 'rep-ta-1',
    label: 'Time and Attendance Summary Report',
    category: 'Time & Attendance' as ReportCategory,
    description: 'Daily time records, tardiness, overtime, and leave data.',
    icon: <Clock size={22} className="text-indigo-600" />,
    color: 'indigo',
  },
  {
    id: 'rep-pay-1',
    label: 'Payslip',
    category: 'Payroll' as ReportCategory,
    description: 'Gross-to-net pay breakdown including allowances and statutory deductions.',
    icon: <Wallet size={22} className="text-emerald-600" />,
    color: 'emerald',
  },
];

const MASTER_IDS = new Set(['rep-hr-1', 'rep-ta-1', 'rep-pay-1']);

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportDef[]>(INITIAL_REPORTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Standard' | 'Custom'>('All');
  const [activeCategory, setActiveCategory] = useState<'All' | ReportCategory>('All');

  // 2-step creation wizard state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardSourceId, setWizardSourceId] = useState<string>('');
  const [wizardSelectedCols, setWizardSelectedCols] = useState<string[]>([]);

  const wizardSourceSchema = wizardSourceId ? MASTER_SCHEMAS[wizardSourceId as keyof typeof MASTER_SCHEMAS] : null;

  const openCreateModal = () => {
    setWizardStep(1);
    setWizardTitle('');
    setWizardSourceId('');
    setWizardSelectedCols([]);
    setIsCreateModalOpen(true);
  };

  const handleWizardNext = () => {
    if (!wizardTitle.trim() || !wizardSourceId) return;
    // Pre-select all columns from the source
    const schema = MASTER_SCHEMAS[wizardSourceId as keyof typeof MASTER_SCHEMAS];
    setWizardSelectedCols([...schema.columns]);
    setWizardStep(2);
  };

  const toggleWizardCol = (col: string) => {
    setWizardSelectedCols(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ? true : r.type === activeTab;
    const matchesCategory = activeCategory === 'All' ? true : r.category === activeCategory;
    return matchesSearch && matchesTab && matchesCategory;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this custom report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleCreateReport = () => {
    if (!wizardTitle.trim() || !wizardSourceId || wizardSelectedCols.length === 0) return;
    const source = MASTER_SOURCE_OPTIONS.find(s => s.id === wizardSourceId)!;
    const newId = `rep-cust-${Date.now()}`;
    const newReport: ReportDef = {
      id: newId,
      title: wizardTitle.trim(),
      description: `Custom report derived from ${source.label}. Showing ${wizardSelectedCols.length} selected columns.`,
      category: source.category,
      type: 'Custom',
      lastGenerated: 'Never',
      icon: <FileBarChart size={24} className="text-slate-500" />,
      tags: ['Custom', source.label.split(' ')[0]],
    };
    setReports(prev => [...prev, newReport]);
    setIsCreateModalOpen(false);
    const colsParam = encodeURIComponent(wizardSelectedCols.join(','));
    const titleParam = encodeURIComponent(wizardTitle.trim());
    navigate(`/monitor/reports/${newId}?source=${wizardSourceId}&cols=${colsParam}&title=${titleParam}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Reports Center
            <FileBarChart className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate standard compliance reports or create custom data views.</p>
        </div>
        <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
            <Plus size={18} /> Create Custom Report
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {(['All', 'Standard', 'Custom'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                activeTab === tab
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {tab} Reports
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {(['All', 'Employee Masterlist', 'Time & Attendance', 'Payroll'] as const).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            activeCategory === cat
                            ? cat === 'Employee Masterlist' ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : cat === 'Time & Attendance' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : cat === 'Payroll' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        {cat === 'All' ? 'All Categories' : cat}
                    </button>
                ))}
                <span className="text-[11px] text-slate-400 ml-1">{filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</span>
            </div>
        </div>

        {/* Report Grid */}
        <div className="p-8 bg-slate-50/30 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReports.map((report, idx) => (
                    <motion.div 
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/monitor/reports/${report.id}`)}
                        className={`bg-white border rounded-2xl p-6 hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden ${report.type === 'Standard' ? 'border-slate-200 hover:border-indigo-200' : 'border-slate-200 hover:border-amber-300'}`}
                    >
                        {/* Top Accent */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${report.type === 'Standard' ? 'bg-indigo-500' : 'bg-amber-400'}`}></div>

                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${
                                    report.category === 'Employee Masterlist' ? 'bg-blue-50' :
                                    report.category === 'Payroll' ? 'bg-emerald-50' :
                                    report.category === 'Time & Attendance' ? 'bg-indigo-50' :
                                    'bg-slate-100'
                                }`}>
                                    {report.icon}
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    {MASTER_IDS.has(report.id) && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded uppercase tracking-wide">
                                            <Database size={10} /> Master Source
                                        </span>
                                    )}
                                    {report.type === 'Standard' ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">
                                            <Lock size={10} /> Standard
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleDelete(e, report.id)}
                                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete Report"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{report.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6">{report.description}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <Clock size={12} />
                                Last Generated: {report.lastGenerated}
                            </div>
                            
                            <div className="flex gap-2 border-t border-slate-100 pt-4">
                                {report.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredReports.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <FileBarChart size={48} className="mb-4 opacity-20" />
                    <p className="font-bold">No reports found.</p>
                    <p className="text-sm">Try adjusting your filters or create a new one.</p>
                </div>
            )}
        </div>
      </div>

      {/* Create Report Wizard Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="max-w-xl">
        <div className="p-8">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${wizardStep === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
              {wizardStep > 1 ? <Check size={12} /> : '1'}
            </div>
            <div className={`h-px flex-1 transition-all ${wizardStep > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all ${wizardStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              2
            </div>
          </div>

          {/* ── Step 1: Name + Source ── */}
          {wizardStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Plus size={20} className="text-indigo-600" /> New Custom Report
                </h3>
                <p className="text-sm text-slate-500 mt-1">Give your report a name and choose a master data source.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Name</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                  placeholder="e.g. IT Department Salary Overview"
                  value={wizardTitle}
                  onChange={e => setWizardTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Master Data Source</label>
                <div className="space-y-3">
                  {MASTER_SOURCE_OPTIONS.map(src => (
                    <button
                      key={src.id}
                      onClick={() => setWizardSourceId(src.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                        wizardSourceId === src.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        src.color === 'blue' ? 'bg-blue-100' :
                        src.color === 'indigo' ? 'bg-indigo-100' :
                        'bg-emerald-100'
                      }`}>
                        {src.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{src.label}</p>
                          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1">
                            <Database size={9} /> Master
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{src.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          {MASTER_SCHEMAS[src.id as keyof typeof MASTER_SCHEMAS].columns.length} available columns
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        wizardSourceId === src.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {wizardSourceId === src.id && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleWizardNext}
                  disabled={!wizardTitle.trim() || !wizardSourceId}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Next: Choose Columns <ChevronRight size={16} />
                </button>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Column selection ── */}
          {wizardStep === 2 && wizardSourceSchema && (
            <div className="space-y-5">
              <div>
                <button onClick={() => setWizardStep(1)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-3 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
                <h3 className="text-xl font-bold text-slate-900">Select Columns</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Source: <span className="font-bold text-slate-700">{wizardSourceSchema.label}</span> &mdash; choose which columns to include.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{wizardSelectedCols.length} / {wizardSourceSchema.columns.length} selected</span>
                <div className="flex gap-2">
                  <button onClick={() => setWizardSelectedCols([...wizardSourceSchema.columns])} className="text-xs font-bold text-indigo-600 hover:underline">Select All</button>
                  <span className="text-slate-300">|</span>
                  <button onClick={() => setWizardSelectedCols([])} className="text-xs font-bold text-slate-400 hover:underline">Clear</button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-50">
                {wizardSourceSchema.columns.map(col => (
                  <button
                    key={col}
                    onClick={() => toggleWizardCol(col)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                      wizardSelectedCols.includes(col) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                    }`}>
                      {wizardSelectedCols.includes(col) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{col}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleCreateReport}
                  disabled={wizardSelectedCols.length === 0}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 text-sm disabled:opacity-40"
                >
                  Create Report
                </button>
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;
