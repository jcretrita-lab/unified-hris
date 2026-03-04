
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  FileText,
  RefreshCw,
  Search,
  Calendar,
  ChevronDown,
  Printer,
  Settings,
  Layout,
  Save,
  Check,
  Lock,
  Edit3,
  FileSpreadsheet,
  Database,
  X,
} from 'lucide-react';
import Modal from '../components/Modal';
import { useBreadcrumb } from '../context/BreadcrumbContext';

// ─── Master Column Definitions ─────────────────────────────────────────────────
// These are the canonical column schemas for the 3 master source reports.
// All sub-reports and custom reports derive their column sets from these.

export const HR_COLUMNS: string[] = [
  'Employee ID', 'Last Name', 'First Name', 'Department', 'Position',
  'Rank / Job Level', 'Employment Status', 'Employment Type', 'Date Hired',
  'Date Regularized', 'Date of Contract End', 'Immediate Supervisor',
  'Work Schedule', 'Company Email', 'Mobile No.', 'Monthly Basic Pay',
  'Salary Grade', 'Tax Status', 'TIN', 'SSS No.', 'PhilHealth No.',
  'HDMF No.', 'Bank Name', 'Account No.', 'VL Balance', 'SL Balance',
];

export const TA_COLUMNS: string[] = [
  'Date', 'Employee ID', 'Last Name', 'First Name', 'Department',
  'Work Schedule', 'Day Type', 'Time In', 'Time Out', 'Late (mins)',
  'Undertime (mins)', 'Overtime Hours', 'Rest Day OT Hours',
  'Total Hours Worked', 'Leave Type', 'Leave Status', 'Absent', 'Remarks',
];

export const PAY_COLUMNS: string[] = [
  'Pay Period', 'Employee ID', 'Last Name', 'First Name', 'Department',
  'Position', 'Basic Pay', 'Rice Subsidy', 'Meal Allowance',
  'Transportation Allowance', 'Medical / HMO Allowance', 'Mobile Phone Allowance',
  'Gross Earnings', 'SSS Contribution', 'PhilHealth Premium', 'Pag-IBIG (HDMF)',
  'Withholding Tax', 'Total Deductions', 'Net Pay', 'Payment Method',
  'Disbursement Status',
];

// ─── Master Data (12–15 realistic rows each) ──────────────────────────────────

const HR_DATA: Record<string, string>[] = [
  { 'Employee ID': 'EMP-001', 'Last Name': 'Reyes', 'First Name': 'Maria', 'Department': 'HR', 'Position': 'HR Director', 'Rank / Job Level': 'Director (L8)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Mar 1, 2018', 'Date Regularized': 'Sep 1, 2018', 'Date of Contract End': '—', 'Immediate Supervisor': '—', 'Work Schedule': '09:00–18:00', 'Company Email': 'maria.r@nexuscorp.com', 'Mobile No.': '0917-001-0001', 'Monthly Basic Pay': '120,000.00', 'Salary Grade': 'SG-20', 'Tax Status': 'Taxable', 'TIN': '100-200-300-000', 'SSS No.': '10-1000001-0', 'PhilHealth No.': '11-100000001-1', 'HDMF No.': '1000-0001-0001', 'Bank Name': 'BPI', 'Account No.': '***-1001', 'VL Balance': '21.00', 'SL Balance': '21.00' },
  { 'Employee ID': 'EMP-002', 'Last Name': 'Santos', 'First Name': 'Ricardo', 'Department': 'IT', 'Position': 'IT Director', 'Rank / Job Level': 'Director (L8)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Jun 1, 2017', 'Date Regularized': 'Dec 1, 2017', 'Date of Contract End': '—', 'Immediate Supervisor': '—', 'Work Schedule': '08:00–17:00', 'Company Email': 'ricardo.s@nexuscorp.com', 'Mobile No.': '0918-002-0002', 'Monthly Basic Pay': '130,000.00', 'Salary Grade': 'SG-21', 'Tax Status': 'Taxable', 'TIN': '200-300-400-000', 'SSS No.': '20-2000002-0', 'PhilHealth No.': '22-200000002-2', 'HDMF No.': '2000-0002-0002', 'Bank Name': 'BDO', 'Account No.': '***-2002', 'VL Balance': '21.00', 'SL Balance': '21.00' },
  { 'Employee ID': 'EMP-003', 'Last Name': 'Cruz', 'First Name': 'Jennifer', 'Department': 'Finance', 'Position': 'Finance Manager', 'Rank / Job Level': 'Manager (L6)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Nov 1, 2019', 'Date Regularized': 'May 1, 2020', 'Date of Contract End': '—', 'Immediate Supervisor': 'R. Santos', 'Work Schedule': '08:00–17:00', 'Company Email': 'jennifer.c@nexuscorp.com', 'Mobile No.': '0919-003-0003', 'Monthly Basic Pay': '75,000.00', 'Salary Grade': 'SG-15', 'Tax Status': 'Taxable', 'TIN': '300-400-500-000', 'SSS No.': '30-3000003-0', 'PhilHealth No.': '33-300000003-3', 'HDMF No.': '3000-0003-0003', 'Bank Name': 'Metrobank', 'Account No.': '***-3003', 'VL Balance': '15.00', 'SL Balance': '15.00' },
  { 'Employee ID': 'EMP-004', 'Last Name': 'Garcia', 'First Name': 'Mark Anthony', 'Department': 'IT', 'Position': 'Senior Developer', 'Rank / Job Level': 'Senior (L4)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'May 10, 2020', 'Date Regularized': 'Nov 10, 2020', 'Date of Contract End': '—', 'Immediate Supervisor': 'R. Santos', 'Work Schedule': '08:00–17:00', 'Company Email': 'mark.g@nexuscorp.com', 'Mobile No.': '0920-004-0004', 'Monthly Basic Pay': '65,000.00', 'Salary Grade': 'SG-14', 'Tax Status': 'Taxable', 'TIN': '400-500-600-000', 'SSS No.': '40-4000004-0', 'PhilHealth No.': '44-400000004-4', 'HDMF No.': '4000-0004-0004', 'Bank Name': 'BPI', 'Account No.': '***-4004', 'VL Balance': '12.00', 'SL Balance': '15.00' },
  { 'Employee ID': 'EMP-005', 'Last Name': 'Panganiban', 'First Name': 'Louis', 'Department': 'IT', 'Position': 'Senior Developer', 'Rank / Job Level': 'Senior (L4)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'May 10, 2023', 'Date Regularized': 'Nov 10, 2023', 'Date of Contract End': '—', 'Immediate Supervisor': 'M. Garcia', 'Work Schedule': '08:00–17:00', 'Company Email': 'louis.p@nexuscorp.com', 'Mobile No.': '0918-987-6543', 'Monthly Basic Pay': '65,000.00', 'Salary Grade': 'SG-14', 'Tax Status': 'Taxable', 'TIN': '234-567-890-000', 'SSS No.': '02-2345678-9', 'PhilHealth No.': '23-234567890-2', 'HDMF No.': '2345-6789-0123', 'Bank Name': 'BPI', 'Account No.': '***-6789', 'VL Balance': '12.00', 'SL Balance': '15.00' },
  { 'Employee ID': 'EMP-006', 'Last Name': 'Wilson', 'First Name': 'Sarah', 'Department': 'HR', 'Position': 'HR Manager', 'Rank / Job Level': 'Manager (L6)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Nov 1, 2022', 'Date Regularized': 'May 1, 2023', 'Date of Contract End': '—', 'Immediate Supervisor': 'M. Reyes', 'Work Schedule': '09:00–18:00', 'Company Email': 'sarah.w@nexuscorp.com', 'Mobile No.': '0919-555-1234', 'Monthly Basic Pay': '55,000.00', 'Salary Grade': 'SG-13', 'Tax Status': 'Taxable', 'TIN': '345-678-901-000', 'SSS No.': '03-3456789-0', 'PhilHealth No.': '34-345678901-3', 'HDMF No.': '3456-7890-1234', 'Bank Name': 'UnionBank', 'Account No.': '***-3344', 'VL Balance': '15.00', 'SL Balance': '15.00' },
  { 'Employee ID': 'EMP-007', 'Last Name': 'Brown', 'First Name': 'Michael', 'Department': 'Finance', 'Position': 'Payroll Specialist', 'Rank / Job Level': 'Associate (L3)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Aug 15, 2021', 'Date Regularized': 'Feb 15, 2022', 'Date of Contract End': '—', 'Immediate Supervisor': 'J. Cruz', 'Work Schedule': '08:00–17:00', 'Company Email': 'michael.b@nexuscorp.com', 'Mobile No.': '0920-444-7890', 'Monthly Basic Pay': '42,000.00', 'Salary Grade': 'SG-11', 'Tax Status': 'Taxable', 'TIN': '456-789-012-000', 'SSS No.': '04-4567890-1', 'PhilHealth No.': '45-456789012-4', 'HDMF No.': '4567-8901-2345', 'Bank Name': 'Metrobank', 'Account No.': '***-5566', 'VL Balance': '18.00', 'SL Balance': '18.00' },
  { 'Employee ID': 'EMP-008', 'Last Name': 'Gottenburg', 'First Name': 'Minato', 'Department': 'IT', 'Position': 'Systems Analyst', 'Rank / Job Level': 'Associate (L3)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Mar 1, 2020', 'Date Regularized': 'Sep 1, 2020', 'Date of Contract End': '—', 'Immediate Supervisor': 'M. Garcia', 'Work Schedule': '08:00–17:00', 'Company Email': 'minato.g@nexuscorp.com', 'Mobile No.': '0921-333-5678', 'Monthly Basic Pay': '35,000.00', 'Salary Grade': 'SG-12', 'Tax Status': 'Taxable', 'TIN': '567-890-123-000', 'SSS No.': '05-5678901-2', 'PhilHealth No.': '56-567890123-5', 'HDMF No.': '5678-9012-3456', 'Bank Name': 'BDO', 'Account No.': '***-7788', 'VL Balance': '20.00', 'SL Balance': '20.00' },
  { 'Employee ID': 'EMP-009', 'Last Name': 'Cordon', 'First Name': 'James', 'Department': 'IT', 'Position': 'Junior Developer', 'Rank / Job Level': 'Junior (L1)', 'Employment Status': 'Active', 'Employment Type': 'Probationary', 'Date Hired': 'Jan 15, 2024', 'Date Regularized': '—', 'Date of Contract End': 'Dec 31, 2024', 'Immediate Supervisor': 'L. Panganiban', 'Work Schedule': '08:00–17:00', 'Company Email': 'james.c@nexuscorp.com', 'Mobile No.': '0917-123-4567', 'Monthly Basic Pay': '28,000.00', 'Salary Grade': 'SG-8', 'Tax Status': 'Tax Exempt', 'TIN': '123-456-789-000', 'SSS No.': '01-1234567-8', 'PhilHealth No.': '12-123456789-1', 'HDMF No.': '1234-5678-9012', 'Bank Name': 'BDO', 'Account No.': '***-3210', 'VL Balance': '5.00', 'SL Balance': '2.50' },
  { 'Employee ID': 'EMP-010', 'Last Name': 'Lim', 'First Name': 'Patricia', 'Department': 'HR', 'Position': 'HR Recruiter', 'Rank / Job Level': 'Junior (L2)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Mar 15, 2022', 'Date Regularized': 'Sep 15, 2022', 'Date of Contract End': '—', 'Immediate Supervisor': 'S. Wilson', 'Work Schedule': '09:00–18:00', 'Company Email': 'patricia.l@nexuscorp.com', 'Mobile No.': '0922-100-2000', 'Monthly Basic Pay': '32,000.00', 'Salary Grade': 'SG-9', 'Tax Status': 'Taxable', 'TIN': '789-012-345-000', 'SSS No.': '07-7890123-4', 'PhilHealth No.': '78-789012345-7', 'HDMF No.': '7890-1234-5678', 'Bank Name': 'BDO', 'Account No.': '***-2200', 'VL Balance': '8.00', 'SL Balance': '10.00' },
  { 'Employee ID': 'EMP-011', 'Last Name': 'Navarro', 'First Name': 'Paolo', 'Department': 'Operations', 'Position': 'Operations Supervisor', 'Rank / Job Level': 'Supervisor (L5)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Jul 1, 2019', 'Date Regularized': 'Jan 1, 2020', 'Date of Contract End': '—', 'Immediate Supervisor': 'R. Santos', 'Work Schedule': '07:00–16:00', 'Company Email': 'paolo.n@nexuscorp.com', 'Mobile No.': '0923-200-3000', 'Monthly Basic Pay': '50,000.00', 'Salary Grade': 'SG-12', 'Tax Status': 'Taxable', 'TIN': '890-123-456-000', 'SSS No.': '08-8901234-5', 'PhilHealth No.': '89-890123456-8', 'HDMF No.': '8901-2345-6789', 'Bank Name': 'BPI', 'Account No.': '***-3001', 'VL Balance': '15.00', 'SL Balance': '15.00' },
  { 'Employee ID': 'EMP-012', 'Last Name': 'Dela Cruz', 'First Name': 'Andrea', 'Department': 'Finance', 'Position': 'Accounting Specialist', 'Rank / Job Level': 'Associate (L3)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Feb 1, 2021', 'Date Regularized': 'Aug 1, 2021', 'Date of Contract End': '—', 'Immediate Supervisor': 'J. Cruz', 'Work Schedule': '08:00–17:00', 'Company Email': 'andrea.dc@nexuscorp.com', 'Mobile No.': '0924-300-4000', 'Monthly Basic Pay': '38,000.00', 'Salary Grade': 'SG-10', 'Tax Status': 'Taxable', 'TIN': '901-234-567-000', 'SSS No.': '09-9012345-6', 'PhilHealth No.': '90-901234567-9', 'HDMF No.': '9012-3456-7890', 'Bank Name': 'UnionBank', 'Account No.': '***-4001', 'VL Balance': '10.00', 'SL Balance': '12.00' },
  { 'Employee ID': 'EMP-013', 'Last Name': 'Bautista', 'First Name': 'Kristine', 'Department': 'Operations', 'Position': 'Logistics Coordinator', 'Rank / Job Level': 'Junior (L2)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Sep 1, 2022', 'Date Regularized': 'Mar 1, 2023', 'Date of Contract End': '—', 'Immediate Supervisor': 'P. Navarro', 'Work Schedule': '07:00–16:00', 'Company Email': 'kristine.b@nexuscorp.com', 'Mobile No.': '0925-400-5000', 'Monthly Basic Pay': '30,000.00', 'Salary Grade': 'SG-9', 'Tax Status': 'Taxable', 'TIN': '111-222-333-000', 'SSS No.': '11-1111111-1', 'PhilHealth No.': '11-111111111-1', 'HDMF No.': '1111-1111-1111', 'Bank Name': 'BDO', 'Account No.': '***-5001', 'VL Balance': '9.00', 'SL Balance': '9.00' },
  { 'Employee ID': 'EMP-014', 'Last Name': 'Mendoza', 'First Name': 'Carlos', 'Department': 'IT', 'Position': 'QA Engineer', 'Rank / Job Level': 'Associate (L3)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Oct 15, 2021', 'Date Regularized': 'Apr 15, 2022', 'Date of Contract End': '—', 'Immediate Supervisor': 'R. Santos', 'Work Schedule': '08:00–17:00', 'Company Email': 'carlos.m@nexuscorp.com', 'Mobile No.': '0926-500-6000', 'Monthly Basic Pay': '40,000.00', 'Salary Grade': 'SG-11', 'Tax Status': 'Taxable', 'TIN': '222-333-444-000', 'SSS No.': '22-2222222-2', 'PhilHealth No.': '22-222222222-2', 'HDMF No.': '2222-2222-2222', 'Bank Name': 'BPI', 'Account No.': '***-6002', 'VL Balance': '14.00', 'SL Balance': '14.00' },
  { 'Employee ID': 'EMP-015', 'Last Name': 'Torres', 'First Name': 'Angela', 'Department': 'HR', 'Position': 'HR Generalist', 'Rank / Job Level': 'Associate (L3)', 'Employment Status': 'Active', 'Employment Type': 'Regular', 'Date Hired': 'Jan 10, 2023', 'Date Regularized': 'Jul 10, 2023', 'Date of Contract End': '—', 'Immediate Supervisor': 'S. Wilson', 'Work Schedule': '09:00–18:00', 'Company Email': 'angela.t@nexuscorp.com', 'Mobile No.': '0927-600-7000', 'Monthly Basic Pay': '36,000.00', 'Salary Grade': 'SG-10', 'Tax Status': 'Taxable', 'TIN': '333-444-555-000', 'SSS No.': '33-3333333-3', 'PhilHealth No.': '33-333333333-3', 'HDMF No.': '3333-3333-3333', 'Bank Name': 'UnionBank', 'Account No.': '***-7003', 'VL Balance': '7.00', 'SL Balance': '7.00' },
];

const TA_DATA: Record<string, string>[] = [
  // Feb 17, 2026 — Monday
  { 'Date': 'Feb 17, 2026', 'Employee ID': 'EMP-004', 'Last Name': 'Garcia', 'First Name': 'Mark Anthony', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:02 AM', 'Time Out': '05:05 PM', 'Late (mins)': '2', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 17, 2026', 'Employee ID': 'EMP-005', 'Last Name': 'Panganiban', 'First Name': 'Louis', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '07:55 AM', 'Time Out': '07:30 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '2.50', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '10.50', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Approved OT — Sprint delivery' },
  { 'Date': 'Feb 17, 2026', 'Employee ID': 'EMP-006', 'Last Name': 'Wilson', 'First Name': 'Sarah', 'Department': 'HR', 'Work Schedule': '09:00–18:00', 'Day Type': 'Regular', 'Time In': '09:10 AM', 'Time Out': '06:00 PM', 'Late (mins)': '10', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '7.83', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Tardiness noted' },
  { 'Date': 'Feb 17, 2026', 'Employee ID': 'EMP-009', 'Last Name': 'Cordon', 'First Name': 'James', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:31 AM', 'Time Out': '05:00 PM', 'Late (mins)': '31', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '7.48', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  // Feb 18, 2026 — Tuesday
  { 'Date': 'Feb 18, 2026', 'Employee ID': 'EMP-007', 'Last Name': 'Brown', 'First Name': 'Michael', 'Department': 'Finance', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '05:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 18, 2026', 'Employee ID': 'EMP-008', 'Last Name': 'Gottenburg', 'First Name': 'Minato', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '06:30 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '1.50', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '9.50', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Approved OT' },
  { 'Date': 'Feb 18, 2026', 'Employee ID': 'EMP-010', 'Last Name': 'Lim', 'First Name': 'Patricia', 'Department': 'HR', 'Work Schedule': '09:00–18:00', 'Day Type': 'Regular', 'Time In': '—', 'Time Out': '—', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '0.00', 'Leave Type': 'VL', 'Leave Status': 'Approved', 'Absent': 'Yes', 'Remarks': 'On approved vacation leave' },
  { 'Date': 'Feb 18, 2026', 'Employee ID': 'EMP-011', 'Last Name': 'Navarro', 'First Name': 'Paolo', 'Department': 'Operations', 'Work Schedule': '07:00–16:00', 'Day Type': 'Regular', 'Time In': '07:00 AM', 'Time Out': '03:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '60', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '7.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Undertime — medical errand' },
  // Feb 19, 2026 — Wednesday
  { 'Date': 'Feb 19, 2026', 'Employee ID': 'EMP-004', 'Last Name': 'Garcia', 'First Name': 'Mark Anthony', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '05:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 19, 2026', 'Employee ID': 'EMP-005', 'Last Name': 'Panganiban', 'First Name': 'Louis', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '07:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '2.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '10.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Approved OT — deployment' },
  { 'Date': 'Feb 19, 2026', 'Employee ID': 'EMP-013', 'Last Name': 'Bautista', 'First Name': 'Kristine', 'Department': 'Operations', 'Work Schedule': '07:00–16:00', 'Day Type': 'Regular', 'Time In': '07:05 AM', 'Time Out': '04:00 PM', 'Late (mins)': '5', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '7.92', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  // Feb 20, 2026 — Thursday
  { 'Date': 'Feb 20, 2026', 'Employee ID': 'EMP-007', 'Last Name': 'Brown', 'First Name': 'Michael', 'Department': 'Finance', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '05:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 20, 2026', 'Employee ID': 'EMP-008', 'Last Name': 'Gottenburg', 'First Name': 'Minato', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:15 AM', 'Time Out': '05:00 PM', 'Late (mins)': '15', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '7.75', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 20, 2026', 'Employee ID': 'EMP-014', 'Last Name': 'Mendoza', 'First Name': 'Carlos', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '08:00 AM', 'Time Out': '05:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  // Feb 21, 2026 — Friday (Special Holiday)
  { 'Date': 'Feb 21, 2026', 'Employee ID': 'EMP-009', 'Last Name': 'Cordon', 'First Name': 'James', 'Department': 'IT', 'Work Schedule': '08:00–17:00', 'Day Type': 'Regular', 'Time In': '07:50 AM', 'Time Out': '05:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
  { 'Date': 'Feb 21, 2026', 'Employee ID': 'EMP-011', 'Last Name': 'Navarro', 'First Name': 'Paolo', 'Department': 'Operations', 'Work Schedule': '07:00–16:00', 'Day Type': 'Special Holiday', 'Time In': '07:00 AM', 'Time Out': '04:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': 'Worked on special holiday — 130% rate applies' },
  { 'Date': 'Feb 21, 2026', 'Employee ID': 'EMP-015', 'Last Name': 'Torres', 'First Name': 'Angela', 'Department': 'HR', 'Work Schedule': '09:00–18:00', 'Day Type': 'Regular', 'Time In': '09:00 AM', 'Time Out': '06:00 PM', 'Late (mins)': '0', 'Undertime (mins)': '0', 'Overtime Hours': '0.00', 'Rest Day OT Hours': '0.00', 'Total Hours Worked': '8.00', 'Leave Type': '—', 'Leave Status': '—', 'Absent': 'No', 'Remarks': '—' },
];

const PAY_DATA: Record<string, string>[] = [
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-001', 'Last Name': 'Reyes', 'First Name': 'Maria', 'Department': 'HR', 'Position': 'HR Director', 'Basic Pay': '60,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '65,350.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '16,200.00', 'Total Deductions': '18,650.00', 'Net Pay': '46,700.00', 'Payment Method': 'Bank Transfer', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-002', 'Last Name': 'Santos', 'First Name': 'Ricardo', 'Department': 'IT', 'Position': 'IT Director', 'Basic Pay': '65,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '70,350.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '17,900.00', 'Total Deductions': '20,350.00', 'Net Pay': '50,000.00', 'Payment Method': 'Bank Transfer', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-003', 'Last Name': 'Cruz', 'First Name': 'Jennifer', 'Department': 'Finance', 'Position': 'Finance Manager', 'Basic Pay': '37,500.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '42,850.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '7,500.00', 'Total Deductions': '9,950.00', 'Net Pay': '32,900.00', 'Payment Method': 'Bank Transfer', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-004', 'Last Name': 'Garcia', 'First Name': 'Mark Anthony', 'Department': 'IT', 'Position': 'Senior Developer', 'Basic Pay': '32,500.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '37,850.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '5,600.00', 'Total Deductions': '8,050.00', 'Net Pay': '29,800.00', 'Payment Method': 'BPI Direct', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-005', 'Last Name': 'Panganiban', 'First Name': 'Louis', 'Department': 'IT', 'Position': 'Senior Developer', 'Basic Pay': '32,500.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '37,850.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '5,600.00', 'Total Deductions': '8,050.00', 'Net Pay': '29,800.00', 'Payment Method': 'BPI Direct', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-006', 'Last Name': 'Wilson', 'First Name': 'Sarah', 'Department': 'HR', 'Position': 'HR Manager', 'Basic Pay': '27,500.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '32,850.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '3,900.00', 'Total Deductions': '6,350.00', 'Net Pay': '26,500.00', 'Payment Method': 'Bank Transfer', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-007', 'Last Name': 'Brown', 'First Name': 'Michael', 'Department': 'Finance', 'Position': 'Payroll Specialist', 'Basic Pay': '21,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '25,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '1,800.00', 'Total Deductions': '4,250.00', 'Net Pay': '21,500.00', 'Payment Method': 'Bank Transfer', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-008', 'Last Name': 'Gottenburg', 'First Name': 'Minato', 'Department': 'IT', 'Position': 'Systems Analyst', 'Basic Pay': '17,500.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '22,850.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '840.00', 'Total Deductions': '3,290.00', 'Net Pay': '19,560.00', 'Payment Method': 'BDO', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-009', 'Last Name': 'Cordon', 'First Name': 'James', 'Department': 'IT', 'Position': 'Junior Developer', 'Basic Pay': '14,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '0.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '18,000.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '0.00', 'Total Deductions': '2,450.00', 'Net Pay': '15,550.00', 'Payment Method': 'BDO', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-010', 'Last Name': 'Lim', 'First Name': 'Patricia', 'Department': 'HR', 'Position': 'HR Recruiter', 'Basic Pay': '16,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '20,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '420.00', 'Total Deductions': '2,870.00', 'Net Pay': '17,880.00', 'Payment Method': 'BDO', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-011', 'Last Name': 'Navarro', 'First Name': 'Paolo', 'Department': 'Operations', 'Position': 'Operations Supervisor', 'Basic Pay': '25,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '29,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '2,800.00', 'Total Deductions': '5,250.00', 'Net Pay': '24,500.00', 'Payment Method': 'BPI', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-012', 'Last Name': 'Dela Cruz', 'First Name': 'Andrea', 'Department': 'Finance', 'Position': 'Accounting Specialist', 'Basic Pay': '19,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '23,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '1,120.00', 'Total Deductions': '3,570.00', 'Net Pay': '20,180.00', 'Payment Method': 'UnionBank', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-013', 'Last Name': 'Bautista', 'First Name': 'Kristine', 'Department': 'Operations', 'Position': 'Logistics Coordinator', 'Basic Pay': '15,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '19,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '0.00', 'Total Deductions': '2,450.00', 'Net Pay': '17,300.00', 'Payment Method': 'BDO', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-014', 'Last Name': 'Mendoza', 'First Name': 'Carlos', 'Department': 'IT', 'Position': 'QA Engineer', 'Basic Pay': '20,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '600.00', 'Gross Earnings': '25,350.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '1,400.00', 'Total Deductions': '3,850.00', 'Net Pay': '21,500.00', 'Payment Method': 'BPI', 'Disbursement Status': 'Released' },
  { 'Pay Period': 'Feb 1–15, 2026', 'Employee ID': 'EMP-015', 'Last Name': 'Torres', 'First Name': 'Angela', 'Department': 'HR', 'Position': 'HR Generalist', 'Basic Pay': '18,000.00', 'Rice Subsidy': '1,000.00', 'Meal Allowance': '1,500.00', 'Transportation Allowance': '1,500.00', 'Medical / HMO Allowance': '750.00', 'Mobile Phone Allowance': '0.00', 'Gross Earnings': '22,750.00', 'SSS Contribution': '1,350.00', 'PhilHealth Premium': '900.00', 'Pag-IBIG (HDMF)': '200.00', 'Withholding Tax': '600.00', 'Total Deductions': '3,050.00', 'Net Pay': '19,700.00', 'Payment Method': 'UnionBank', 'Disbursement Status': 'Released' },
];

// ─── Master Schemas (exported for use in ReportsPage column picker) ────────────
export const MASTER_SCHEMAS = {
  'rep-hr-1':  { label: 'Employee Master List',  columns: HR_COLUMNS,  data: HR_DATA  },
  'rep-ta-1':  { label: 'Timekeeping Summary',   columns: TA_COLUMNS,  data: TA_DATA  },
  'rep-pay-1': { label: 'Payroll Register',       columns: PAY_COLUMNS, data: PAY_DATA },
} as const;

type MasterSourceId = keyof typeof MASTER_SCHEMAS;

// ─── Report Definitions ────────────────────────────────────────────────────────
interface ReportDefinition {
  id: string;
  title: string;
  category: string;
  type: 'Standard' | 'Custom';
  sourceId: MasterSourceId;
  visibleColumns: string[];
}

const REPORT_DEFINITIONS: Record<string, ReportDefinition> = {
  // ── 3 Master Reports ─────────────────────────────────────────────────────────
  'rep-hr-1':  { id: 'rep-hr-1',  title: 'Employee Master List',            category: 'Core HR',            type: 'Standard', sourceId: 'rep-hr-1',  visibleColumns: HR_COLUMNS },
  'rep-ta-1':  { id: 'rep-ta-1',  title: 'Timekeeping Summary',             category: 'Time & Attendance',  type: 'Standard', sourceId: 'rep-ta-1',  visibleColumns: TA_COLUMNS },
  'rep-pay-1': { id: 'rep-pay-1', title: 'Payroll Register',                category: 'Payroll',            type: 'Standard', sourceId: 'rep-pay-1', visibleColumns: PAY_COLUMNS },
  // ── Standard Sub-Reports (column subsets of a master) ────────────────────────
  'rep-hr-2':  { id: 'rep-hr-2',  title: 'Headcount Summary by Department', category: 'Core HR',            type: 'Standard', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Rank / Job Level', 'Employment Status', 'Employment Type', 'Date Hired'] },
  'rep-hr-3':  { id: 'rep-hr-3',  title: 'New Hire & Separation Report',    category: 'Core HR',            type: 'Standard', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Employment Status', 'Employment Type', 'Date Hired', 'Date Regularized', 'Date of Contract End'] },
  'rep-pay-2': { id: 'rep-pay-2', title: 'Government Remittance Summary',   category: 'Payroll',            type: 'Standard', sourceId: 'rep-pay-1', visibleColumns: ['Pay Period', 'Employee ID', 'Last Name', 'First Name', 'Department', 'SSS Contribution', 'PhilHealth Premium', 'Pag-IBIG (HDMF)'] },
  'rep-pay-3': { id: 'rep-pay-3', title: '13th Month Pay Computation',      category: 'Payroll',            type: 'Standard', sourceId: 'rep-pay-1', visibleColumns: ['Pay Period', 'Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Basic Pay', 'Gross Earnings'] },
  'rep-pay-4': { id: 'rep-pay-4', title: 'Withholding Tax Report (BIR 2316)', category: 'Payroll',          type: 'Standard', sourceId: 'rep-pay-1', visibleColumns: ['Pay Period', 'Employee ID', 'Last Name', 'First Name', 'Department', 'Basic Pay', 'Gross Earnings', 'Withholding Tax', 'Total Deductions', 'Net Pay', 'Disbursement Status'] },
  'rep-ta-2':  { id: 'rep-ta-2',  title: 'Overtime Hours Summary',          category: 'Time & Attendance',  type: 'Standard', sourceId: 'rep-ta-1',  visibleColumns: ['Date', 'Employee ID', 'Last Name', 'First Name', 'Department', 'Day Type', 'Overtime Hours', 'Rest Day OT Hours', 'Total Hours Worked', 'Remarks'] },
  'rep-ta-3':  { id: 'rep-ta-3',  title: 'Leave Balance & Utilization',     category: 'Core HR',            type: 'Standard', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Work Schedule', 'VL Balance', 'SL Balance'] },
  // ── Pre-defined Custom Reports ───────────────────────────────────────────────
  'rep-cust-1': { id: 'rep-cust-1', title: 'Q1 2026 New Hire Tracker',                category: 'Core HR',           type: 'Custom', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Employment Type', 'Date Hired'] },
  'rep-cust-2': { id: 'rep-cust-2', title: 'IT Department Overtime Analysis',         category: 'Time & Attendance', type: 'Custom', sourceId: 'rep-ta-1',  visibleColumns: ['Date', 'Employee ID', 'Last Name', 'First Name', 'Department', 'Day Type', 'Overtime Hours', 'Rest Day OT Hours', 'Remarks'] },
  'rep-cust-3': { id: 'rep-cust-3', title: 'Salary Grade Distribution',               category: 'Core HR',           type: 'Custom', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Rank / Job Level', 'Monthly Basic Pay', 'Salary Grade'] },
  'rep-cust-4': { id: 'rep-cust-4', title: 'Voluntary Attrition Analysis — FY 2025', category: 'Core HR',           type: 'Custom', sourceId: 'rep-hr-1',  visibleColumns: ['Employee ID', 'Last Name', 'First Name', 'Department', 'Position', 'Employment Status', 'Employment Type', 'Date Hired', 'Date Regularized'] },
  'rep-cust-5': { id: 'rep-cust-5', title: 'Benefits & Allowance Cost Summary',      category: 'Payroll',           type: 'Custom', sourceId: 'rep-pay-1', visibleColumns: ['Pay Period', 'Employee ID', 'Last Name', 'First Name', 'Department', 'Rice Subsidy', 'Meal Allowance', 'Transportation Allowance', 'Medical / HMO Allowance', 'Mobile Phone Allowance', 'Gross Earnings'] },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ReportDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setPageTitle } = useBreadcrumb();
  const [isLoading, setIsLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Source-specific filter state
  const [filterStatus, setFilterStatus]       = useState('All'); // HR: Employment Status  |  Pay: Disbursement Status
  const [filterEmpType, setFilterEmpType]     = useState('All'); // HR: Employment Type
  const [filterDayType, setFilterDayType]     = useState('All'); // TA: Day Type
  const [filterAbsent, setFilterAbsent]       = useState('All'); // TA: Absent
  const [filterLeaveType, setFilterLeaveType] = useState('All'); // TA: Leave Type
  const [filterPayPeriod, setFilterPayPeriod] = useState('All'); // Pay: Pay Period
  const [filterPayMethod, setFilterPayMethod] = useState('All'); // Pay: Payment Method

  const [reportConfig, setReportConfig] = useState<{
    id: string;
    title: string;
    type: 'Standard' | 'Custom';
    category: string;
    sourceId: string;
    allSourceColumns: string[];
    visibleColumns: string[];
    data: Record<string, string>[];
  } | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [tempVisibleCols, setTempVisibleCols] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const def = id ? REPORT_DEFINITIONS[id] : null;

    setTimeout(() => {
      if (def) {
        const schema = MASTER_SCHEMAS[def.sourceId as MasterSourceId];
        setReportConfig({
          id: def.id,
          title: def.title,
          type: def.type,
          category: def.category,
          sourceId: def.sourceId,
          allSourceColumns: schema.columns as string[],
          visibleColumns: def.visibleColumns,
          data: schema.data as Record<string, string>[],
        });
      } else {
        // Bootstrap from URL params for brand-new custom reports
        const sourceId = (searchParams.get('source') || 'rep-hr-1') as MasterSourceId;
        const colsParam = searchParams.get('cols');
        const title = searchParams.get('title') || 'New Custom Report';
        const schema = MASTER_SCHEMAS[sourceId];

        if (schema && colsParam) {
          const cols = colsParam.split(',').filter(c => (schema.columns as readonly string[]).includes(c));
          setReportConfig({
            id: id || 'new',
            title,
            type: 'Custom',
            category: schema.label,
            sourceId,
            allSourceColumns: schema.columns as string[],
            visibleColumns: cols.length > 0 ? cols : (schema.columns as string[]).slice(0, 5),
            data: schema.data as Record<string, string>[],
          });
        }
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (reportConfig?.title) setPageTitle(reportConfig.title);
  }, [reportConfig?.title, setPageTitle]);

  // ── Dynamic option derivers ────────────────────────────────────────────────
  const filterOptions = useMemo(() => {
    if (!reportConfig) return {} as Record<string, string[]>;
    const cols = [
      'Department', 'Employment Status', 'Employment Type',
      'Day Type', 'Leave Type', 'Pay Period', 'Payment Method', 'Disbursement Status',
    ];
    return Object.fromEntries(
      cols.map(col => [
        col,
        reportConfig.allSourceColumns.includes(col)
          ? Array.from(new Set(reportConfig.data.map(r => r[col]).filter(Boolean))).sort()
          : [],
      ])
    );
  }, [reportConfig]);

  const isMasterHR  = reportConfig?.sourceId === 'rep-hr-1';
  const isMasterTA  = reportConfig?.sourceId === 'rep-ta-1';
  const isMasterPay = reportConfig?.sourceId === 'rep-pay-1';
  const isMaster    = isMasterHR || isMasterTA || isMasterPay;

  // ── Apply all active filters ───────────────────────────────────────────────
  const displayedData = useMemo(() => {
    if (!reportConfig) return [];
    let rows = reportConfig.data;

    const f = (col: string, val: string) => {
      if (val !== 'All' && reportConfig.allSourceColumns.includes(col))
        rows = rows.filter(r => r[col] === val);
    };

    f('Department',          filterDept);
    f('Employment Status',   filterStatus);
    f('Employment Type',     filterEmpType);
    f('Day Type',            filterDayType);
    f('Absent',              filterAbsent);
    f('Leave Type',          filterLeaveType);
    f('Pay Period',          filterPayPeriod);
    f('Payment Method',      filterPayMethod);
    f('Disbursement Status', filterStatus); // filterStatus doubles as Disbursement Status for Pay source

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(row =>
        reportConfig.visibleColumns.some(col => (row[col] || '').toLowerCase().includes(q))
      );
    }
    return rows;
  }, [reportConfig, filterDept, filterStatus, filterEmpType, filterDayType,
      filterAbsent, filterLeaveType, filterPayPeriod, filterPayMethod, searchQuery]);

  const handleOpenConfig = () => {
    if (!reportConfig || reportConfig.type === 'Standard') return;
    setTempTitle(reportConfig.title);
    setTempVisibleCols([...reportConfig.visibleColumns]);
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    if (!reportConfig) return;
    setReportConfig({ ...reportConfig, title: tempTitle, visibleColumns: tempVisibleCols });
    setIsConfigModalOpen(false);
  };

  const toggleColumnInEditor = (colName: string) => {
    setTempVisibleCols(prev => {
      if (prev.includes(colName)) {
        return prev.filter(c => c !== colName);
      }
      const newCols = [...prev, colName];
      newCols.sort((a, b) => {
        const idxA = reportConfig?.allSourceColumns.indexOf(a) ?? 0;
        const idxB = reportConfig?.allSourceColumns.indexOf(b) ?? 0;
        return idxA - idxB;
      });
      return newCols;
    });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${reportConfig?.title} as ${format.toUpperCase()}`);
    setIsDownloadMenuOpen(false);
  };

  if (!reportConfig && !isLoading) return (
    <div className="p-8 text-center text-slate-400">
      <p className="font-bold text-lg">Report not found.</p>
      <button onClick={() => navigate('/monitor/reports')} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">← Back to Reports</button>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/monitor/reports')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Reports
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[700px]">

        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 flex-wrap">
                {reportConfig?.title}
                {reportConfig?.type === 'Standard' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200 uppercase tracking-wide">
                    <Lock size={10} /> Standard
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide">
                    Custom
                  </span>
                )}
                {reportConfig && ['rep-hr-1', 'rep-ta-1', 'rep-pay-1'].includes(reportConfig.id) && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded border border-emerald-200 uppercase tracking-wide">
                    <Database size={10} /> Master Source
                  </span>
                )}
              </h1>
              <p className="text-slate-500 font-medium mt-2">
                Source: <span className="font-bold text-slate-700">{reportConfig && MASTER_SCHEMAS[reportConfig.sourceId as MasterSourceId]?.label}</span>
                {' · '}Showing <span className="font-bold text-slate-700">{reportConfig?.visibleColumns.length}</span> of <span className="font-bold text-slate-700">{reportConfig?.allSourceColumns.length}</span> columns
                {' · '}Data as of <span className="font-bold text-slate-700">{new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <Printer size={16} /> Print
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  <Download size={16} /> Download <ChevronDown size={14} className={`transition-transform ${isDownloadMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDownloadMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden">
                    <button onClick={() => handleExport('csv')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors text-left">
                      <FileSpreadsheet size={16} /> Export as CSV
                    </button>
                    <button onClick={() => handleExport('pdf')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors text-left border-t border-slate-50">
                      <FileText size={16} /> Export as PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 py-5 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white">
          <div className="col-span-1 md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Column Configuration</label>
            <button
              onClick={handleOpenConfig}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-bold transition-all shadow-sm ${
                reportConfig?.type === 'Standard'
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
              disabled={reportConfig?.type === 'Standard'}
              title={reportConfig?.type === 'Standard' ? 'Standard reports have locked columns.' : 'Configure visible columns'}
            >
              <span className="flex items-center gap-2">
                {reportConfig?.type === 'Standard' ? <Lock size={14} /> : <Settings size={14} />}
                {reportConfig?.type === 'Standard' ? 'Locked' : 'Configure Columns'}
              </span>
              {reportConfig?.type === 'Custom' && <Edit3 size={13} />}
            </button>
          </div>

          {(filterOptions['Department']?.length ?? 0) > 0 && (
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Department Filter</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
              >
                <option value="All">All Departments</option>
                {filterOptions['Department'].map((d: string) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}

          <div className={`col-span-1 ${(filterOptions['Department']?.length ?? 0) > 0 ? 'md:col-span-4' : 'md:col-span-7'} relative`}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Search Records</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search across visible columns..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              onClick={() => {
                setFilterDept('All'); setSearchQuery('');
                setFilterStatus('All'); setFilterEmpType('All');
                setFilterDayType('All'); setFilterAbsent('All'); setFilterLeaveType('All');
                setFilterPayPeriod('All'); setFilterPayMethod('All');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Master-specific filter row */}
        {isMaster && (
          <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-end">

            {/* ── HR filters ── */}
            {isMasterHR && filterOptions['Employment Status']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employment Status</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Employment Status']].map(v => (
                    <button key={v} onClick={() => setFilterStatus(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatus === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
                      {v === 'All' ? 'All Statuses' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMasterHR && filterOptions['Employment Type']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employment Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Employment Type']].map(v => (
                    <button key={v} onClick={() => setFilterEmpType(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterEmpType === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
                      {v === 'All' ? 'All Types' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── T&A filters ── */}
            {isMasterTA && filterOptions['Day Type']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Day Type']].map(v => (
                    <button key={v} onClick={() => setFilterDayType(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterDayType === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {v === 'All' ? 'All Day Types' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMasterTA && filterOptions['Leave Type']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Type</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Leave Type']].map(v => (
                    <button key={v} onClick={() => setFilterLeaveType(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterLeaveType === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {v === 'All' ? 'All Leave Types' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMasterTA && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Absent</label>
                <div className="flex gap-1.5">
                  {['All', 'Yes', 'No'].map(v => (
                    <button key={v} onClick={() => setFilterAbsent(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterAbsent === v ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-600'}`}>
                      {v === 'All' ? 'All' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Payroll filters ── */}
            {isMasterPay && filterOptions['Pay Period']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pay Period</label>
                <select
                  value={filterPayPeriod}
                  onChange={e => setFilterPayPeriod(e.target.value)}
                  className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer"
                >
                  <option value="All">All Pay Periods</option>
                  {filterOptions['Pay Period'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}
            {isMasterPay && filterOptions['Payment Method']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Payment Method']].map(v => (
                    <button key={v} onClick={() => setFilterPayMethod(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterPayMethod === v ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}>
                      {v === 'All' ? 'All Methods' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMasterPay && filterOptions['Disbursement Status']?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disbursement Status</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['All', ...filterOptions['Disbursement Status']].map(v => (
                    <button key={v} onClick={() => setFilterStatus(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterStatus === v ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}>
                      {v === 'All' ? 'All Statuses' : v}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 bg-slate-50/30 p-6 overflow-auto">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw size={32} className="animate-spin mb-4 text-indigo-500" />
              <p className="font-bold text-slate-500">Loading report data...</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="overflow-auto max-h-[calc(100vh-420px)]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      {reportConfig?.allSourceColumns
                        .filter(col => reportConfig.visibleColumns.includes(col))
                        .map(col => (
                          <th key={col} className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{col}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayedData.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                        {reportConfig?.allSourceColumns
                          .filter(col => reportConfig.visibleColumns.includes(col))
                          .map(col => (
                            <td key={col} className="px-5 py-3.5 font-medium text-slate-700 whitespace-nowrap text-sm">
                              {row[col] || '—'}
                            </td>
                          ))}
                      </tr>
                    ))}
                    {displayedData.length === 0 && (
                      <tr>
                        <td colSpan={reportConfig?.visibleColumns.length || 1} className="px-5 py-12 text-center text-slate-400 italic text-sm">
                          No records match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{displayedData.length} record{displayedData.length !== 1 ? 's' : ''} shown</span>
                <span className="text-xs text-slate-400 font-medium italic">End of report</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Column Configuration Modal (Custom reports only) */}
      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} className="max-w-4xl">
        <div className="flex flex-col h-[600px] bg-white">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                <Layout size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Configure Report</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Edit the report name and select which columns to include.
                  Source: <span className="font-bold text-slate-700">{reportConfig && MASTER_SCHEMAS[reportConfig.sourceId as MasterSourceId]?.label}</span>
                </p>
              </div>
            </div>
            <button onClick={() => setIsConfigModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left panel */}
            <div className="w-72 border-r border-slate-100 bg-slate-50/30 flex flex-col p-6 space-y-5 shrink-0">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Report Name</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 shadow-sm"
                  value={tempTitle}
                  onChange={e => setTempTitle(e.target.value)}
                />
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-800 mb-1 flex items-center gap-1.5">
                  <Database size={13} /> Column Selection
                </h4>
                <p className="text-[11px] text-indigo-600 leading-relaxed">
                  Toggle columns from the master source. Only checked columns will appear in the report table and export.
                </p>
                <div className="mt-3 text-xs font-bold text-indigo-800">
                  {tempVisibleCols.length} / {reportConfig?.allSourceColumns.length} columns active
                </div>
              </div>
              <button
                onClick={() => setTempVisibleCols([...(reportConfig?.allSourceColumns || [])])}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors text-left"
              >
                Select All
              </button>
              <button
                onClick={() => setTempVisibleCols([])}
                className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors text-left"
              >
                Clear All
              </button>
            </div>

            {/* Right panel — column toggles */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="p-5 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2.5">
                  {reportConfig?.allSourceColumns.map(col => {
                    const isVisible = tempVisibleCols.includes(col);
                    return (
                      <div
                        key={col}
                        onClick={() => toggleColumnInEditor(col)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isVisible ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isVisible ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                          {isVisible && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-bold leading-tight ${isVisible ? 'text-indigo-900' : 'text-slate-500'}`}>{col}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
                <button onClick={() => setIsConfigModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  disabled={!tempTitle.trim() || tempVisibleCols.length === 0}
                  className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save size={15} /> Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportDetail;
