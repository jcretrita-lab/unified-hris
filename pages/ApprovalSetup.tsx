
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  FileCheck,
  Users,
  Briefcase,
  User,
  GripVertical,
  Trash2,
  X,
  Filter,
  UserPlus,
  Check,
  UserCog,
  ArrowRight as ArrowRightIcon,
  Calendar,
  Clock,
  Building2,
  CalendarDays,
  Layers,
  AlertCircle,
  Network,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

// --- MOCK DATA ---
export interface Approver {
  id: string;
  orderLabel: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
  lastModifiedBy: string;
  lastModified: string;
  // Delegation Fields
  delegateId?: string;
  delegateName?: string;
  delegateAvatar?: string;
  delegateStartDate?: string;
  delegateEndDate?: string;
  // Co-Approver Fields (Dual Approval)
  secondaryId?: string;
  secondaryName?: string;
  secondaryAvatar?: string;
  secondaryRole?: string;
}

export interface ApprovalSetup {
  id: string;
  name: string;
  connectedEmployees: number;
  dateAdded: string;
  lastModifiedBy: string;
  lastModified: string;
  feature: string;
  autoRejectDays: number;
  // New Fields
  department?: string; // Display name (backward-compatible)
  unitType?: string;   // Serves as Unit Type
  orgUnitId?: string;  // Structural id linking to APPROVAL_ORG_UNITS
  startDate?: string;
  endDate?: string;
  approvers: Approver[];
}

// --- Local Hierarchy Types ---
interface ApprovalOrgUnit {
  id: string;
  name: string;
  type: string;
  parentId?: string;
  headPositionId?: string;
}

interface ApprovalPosition {
  id: string;
  title: string;
  orgUnitId: string;
  supervisorId?: string;
}

interface ApprovalEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  email: string;
  positionId?: string;
}


export const MOCK_SETUPS: ApprovalSetup[] = [
  {
    id: '1',
    name: 'Backend Team Leave Request',
    connectedEmployees: 8,
    dateAdded: 'Sept 23, 2024',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Jan 15, 2026 09:30',
    feature: 'Leave Management',
    autoRejectDays: 7,
    department: 'Backend Team',
    unitType: 'Team',
    orgUnitId: 'team-1',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-be-1', orderLabel: 'Approver 1', name: 'John Doe', role: 'Backend Lead', avatar: 'JD', department: 'Engineering', lastModifiedBy: 'Sarah Wilson', lastModified: 'Jan 15, 2026' },
      { id: 'a-be-2', orderLabel: 'Approver 2', name: 'James Cruz', role: 'Platform Engineering Manager', avatar: 'JC', department: 'Engineering', lastModifiedBy: 'Sarah Wilson', lastModified: 'Jan 15, 2026' },
      { id: 'a-be-3', orderLabel: 'Verifier 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Jan 15, 2026', delegateId: 'emp-er-mgr', delegateName: 'Angela Tan', delegateAvatar: 'AT', delegateStartDate: '2026-03-10', delegateEndDate: '2026-03-25' },
    ],
  },
  {
    id: '2',
    name: 'Engineering Division Leave',
    connectedEmployees: 52,
    dateAdded: 'Jan 5, 2026',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Feb 20, 2026 11:00',
    feature: 'Leave Management',
    autoRejectDays: 5,
    department: 'Engineering',
    unitType: 'Division',
    orgUnitId: 'div-1',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-eng-1', orderLabel: 'Approver 1', name: 'Elena Torres', role: 'CTO', avatar: 'ET', department: 'Engineering', lastModifiedBy: 'Sarah Wilson', lastModified: 'Feb 20, 2026' },
      { id: 'a-eng-2', orderLabel: 'Verifier 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Feb 20, 2026' },
    ],
  },
  {
    id: '3',
    name: 'HR Division Leave',
    connectedEmployees: 18,
    dateAdded: 'Jan 5, 2026',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Feb 18, 2026 14:45',
    feature: 'Leave Management',
    autoRejectDays: 5,
    department: 'Human Resources',
    unitType: 'Division',
    orgUnitId: 'div-2',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-hr-1', orderLabel: 'Approver 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Feb 18, 2026' },
      { id: 'a-hr-2', orderLabel: 'Approver 2', name: 'Marcus Reyes', role: 'CEO', avatar: 'MR', department: 'Nexus Corp', lastModifiedBy: 'Sarah Wilson', lastModified: 'Feb 18, 2026' },
    ],
  },
  {
    id: '4',
    name: 'Official Business Request',
    connectedEmployees: 120,
    dateAdded: 'Sept 2, 2024',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Feb 25, 2026 08:00',
    feature: 'Time & Attendance',
    autoRejectDays: 0,
    startDate: '2025-01-01',
    approvers: [
      { id: 'a-ob-1', orderLabel: 'Approver 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Feb 25, 2026' },
    ],
  },
  {
    id: '5',
    name: 'Platform Engineering Overtime',
    connectedEmployees: 35,
    dateAdded: 'Sept 1, 2023',
    lastModifiedBy: 'Elena Torres',
    lastModified: 'Feb 28, 2026 09:15',
    feature: 'Time & Attendance',
    autoRejectDays: 3,
    department: 'Platform Engineering',
    unitType: 'Department',
    orgUnitId: 'dept-1',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-ot-1', orderLabel: 'Approver 1', name: 'James Cruz', role: 'Platform Engineering Manager', avatar: 'JC', department: 'Engineering', lastModifiedBy: 'Elena Torres', lastModified: 'Feb 28, 2026' },
      { id: 'a-ot-2', orderLabel: 'Approver 2', name: 'Elena Torres', role: 'CTO', avatar: 'ET', department: 'Engineering', lastModifiedBy: 'Elena Torres', lastModified: 'Feb 28, 2026' },
    ],
  },
  {
    id: '6',
    name: 'Finance Expense Approval',
    connectedEmployees: 22,
    dateAdded: 'Feb 1, 2026',
    lastModifiedBy: 'Michael Santos',
    lastModified: 'Feb 10, 2026 16:30',
    feature: 'Payroll Adjustment',
    autoRejectDays: 7,
    department: 'Finance & Accounting',
    unitType: 'Division',
    orgUnitId: 'div-3',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-fin-1', orderLabel: 'Approver 1', name: 'Mike Brown', role: 'Accounting Manager', avatar: 'MB', department: 'Finance & Accounting', lastModifiedBy: 'Michael Santos', lastModified: 'Feb 10, 2026' },
      { id: 'a-fin-2', orderLabel: 'Approver 2', name: 'Michael Santos', role: 'CFO', avatar: 'MS', department: 'Finance & Accounting', lastModifiedBy: 'Michael Santos', lastModified: 'Feb 10, 2026' },
      { id: 'a-fin-3', orderLabel: 'Verifier 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Michael Santos', lastModified: 'Feb 10, 2026' },
    ],
  },
  {
    id: '7',
    name: 'Recruitment Headcount Request',
    connectedEmployees: 6,
    dateAdded: 'Mar 1, 2026',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Mar 1, 2026 10:30',
    feature: 'PAF Request',
    autoRejectDays: 5,
    department: 'Talent Acquisition',
    unitType: 'Department',
    orgUnitId: 'dept-5',
    startDate: '2026-03-01',
    approvers: [
      { id: 'a-rec-1', orderLabel: 'Approver 1', name: 'Patricia Cruz', role: 'Talent Acquisition Manager', avatar: 'PC', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Mar 1, 2026' },
      { id: 'a-rec-2', orderLabel: 'Approver 2', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Sarah Wilson', lastModified: 'Mar 1, 2026', secondaryId: 'emp-ceo', secondaryName: 'Marcus Reyes', secondaryAvatar: 'MR', secondaryRole: 'CEO' },
    ],
  },
  {
    id: '8',
    name: 'Sales Travel Request',
    connectedEmployees: 28,
    dateAdded: 'Jan 15, 2026',
    lastModifiedBy: 'Alice Guo',
    lastModified: 'Mar 2, 2026 08:45',
    feature: 'Time & Attendance',
    autoRejectDays: 2,
    department: 'Sales & Marketing',
    unitType: 'Division',
    orgUnitId: 'div-4',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-st-1', orderLabel: 'Approver 1', name: 'Victor Gomez', role: 'Sales Manager', avatar: 'VG', department: 'Sales & Marketing', lastModifiedBy: 'Alice Guo', lastModified: 'Mar 2, 2026' },
      { id: 'a-st-2', orderLabel: 'Approver 2', name: 'Alice Guo', role: 'Chief Sales & Marketing Officer', avatar: 'AG', department: 'Sales & Marketing', lastModifiedBy: 'Alice Guo', lastModified: 'Mar 2, 2026' },
    ],
  },
  {
    id: '9',
    name: 'Payroll Adjustment Approval',
    connectedEmployees: 9,
    dateAdded: 'Mar 2, 2026',
    lastModifiedBy: 'Michael Santos',
    lastModified: 'Mar 2, 2026 09:00',
    feature: 'Payroll Adjustment',
    autoRejectDays: 5,
    department: 'Payroll',
    unitType: 'Department',
    orgUnitId: 'dept-9',
    startDate: '2026-01-01',
    approvers: [
      { id: 'a-pa-1', orderLabel: 'Approver 1', name: 'Raymond Garcia', role: 'Payroll Manager', avatar: 'RG', department: 'Finance & Accounting', lastModifiedBy: 'Michael Santos', lastModified: 'Mar 2, 2026' },
      { id: 'a-pa-2', orderLabel: 'Approver 2', name: 'Michael Santos', role: 'CFO', avatar: 'MS', department: 'Finance & Accounting', lastModifiedBy: 'Michael Santos', lastModified: 'Mar 2, 2026' },
      { id: 'a-pa-3', orderLabel: 'Verifier 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Michael Santos', lastModified: 'Mar 2, 2026' },
    ],
  },
  {
    id: '10',
    name: 'Shift Change Request',
    connectedEmployees: 52,
    dateAdded: 'Mar 4, 2026',
    lastModifiedBy: 'Elena Torres',
    lastModified: 'Mar 4, 2026 10:00',
    feature: 'Shift Change Request',
    autoRejectDays: 3,
    department: 'Engineering',
    unitType: 'Division',
    orgUnitId: 'div-1',
    startDate: '2026-03-01',
    approvers: [
      { id: 'a-sc-1', orderLabel: 'Approver 1', name: 'Elena Torres', role: 'CTO', avatar: 'ET', department: 'Engineering', lastModifiedBy: 'Elena Torres', lastModified: 'Mar 4, 2026' },
      { id: 'a-sc-2', orderLabel: 'Verifier 1', name: 'Sarah Wilson', role: 'CHRO', avatar: 'SW', department: 'Human Resources', lastModifiedBy: 'Elena Torres', lastModified: 'Mar 4, 2026' },
    ],
  },
  {
    id: '11',
    name: 'Operations Maintenance Request',
    connectedEmployees: 14,
    dateAdded: 'Feb 20, 2026',
    lastModifiedBy: 'Robert Chen',
    lastModified: 'Feb 25, 2026 13:00',
    feature: 'PAF Request',
    autoRejectDays: 4,
    department: 'Operations',
    unitType: 'Division',
    orgUnitId: 'div-5',
    startDate: '2026-02-01',
    approvers: [
      { id: 'a-ops-1', orderLabel: 'Approver 1', name: 'Richard Lee', role: 'IT Support Manager', avatar: 'RL', department: 'Operations', lastModifiedBy: 'Robert Chen', lastModified: 'Feb 25, 2026' },
      { id: 'a-ops-2', orderLabel: 'Approver 2', name: 'Robert Chen', role: 'COO', avatar: 'RC', department: 'Operations', lastModifiedBy: 'Robert Chen', lastModified: 'Feb 25, 2026' },
    ],
  },
  {
    id: '12',
    name: 'Legal Document Review',
    connectedEmployees: 4,
    dateAdded: 'Mar 3, 2026',
    lastModifiedBy: 'Jennifer Lim',
    lastModified: 'Mar 3, 2026 15:00',
    feature: 'PAF Request',
    autoRejectDays: 10,
    department: 'Legal & Compliance',
    unitType: 'Division',
    orgUnitId: 'div-6',
    startDate: '2026-03-01',
    approvers: [
      { id: 'a-leg-1', orderLabel: 'Approver 1', name: 'Grace Velasco', role: 'Senior Legal Counsel', avatar: 'GV', department: 'Legal & Compliance', lastModifiedBy: 'Jennifer Lim', lastModified: 'Mar 3, 2026' },
      { id: 'a-leg-2', orderLabel: 'Approver 2', name: 'Jennifer Lim', role: 'General Counsel', avatar: 'JL', department: 'Legal & Compliance', lastModifiedBy: 'Jennifer Lim', lastModified: 'Mar 3, 2026' },
      { id: 'a-leg-3', orderLabel: 'Verifier 1', name: 'Marcus Reyes', role: 'CEO', avatar: 'MR', department: 'Nexus Corp', lastModifiedBy: 'Jennifer Lim', lastModified: 'Mar 3, 2026' },
    ],
  },
  {
    id: '13',
    name: 'DevOps Overtime Request',
    connectedEmployees: 7,
    dateAdded: 'Mar 5, 2026',
    lastModifiedBy: 'Elena Torres',
    lastModified: 'Mar 5, 2026 11:30',
    feature: 'Time & Attendance',
    autoRejectDays: 3,
    department: 'DevOps & Infrastructure',
    unitType: 'Department',
    orgUnitId: 'dept-3',
    startDate: '2026-03-01',
    approvers: [
      { id: 'a-do-1', orderLabel: 'Approver 1', name: 'David Kim', role: 'DevOps Lead', avatar: 'DK', department: 'Engineering', lastModifiedBy: 'Elena Torres', lastModified: 'Mar 5, 2026' },
      { id: 'a-do-2', orderLabel: 'Approver 2', name: 'Elena Torres', role: 'CTO', avatar: 'ET', department: 'Engineering', lastModifiedBy: 'Elena Torres', lastModified: 'Mar 5, 2026' },
    ],
  },
  {
    id: '14',
    name: 'Marketing Campaign Budget',
    connectedEmployees: 11,
    dateAdded: 'Mar 6, 2026',
    lastModifiedBy: 'Alice Guo',
    lastModified: 'Mar 6, 2026 14:00',
    feature: 'Payroll Adjustment',
    autoRejectDays: 7,
    department: 'Marketing',
    unitType: 'Department',
    orgUnitId: 'dept-12',
    startDate: '2026-03-01',
    approvers: [
      { id: 'a-mc-1', orderLabel: 'Approver 1', name: 'Benjamin Tan', role: 'Marketing Manager', avatar: 'BT', department: 'Sales & Marketing', lastModifiedBy: 'Alice Guo', lastModified: 'Mar 6, 2026' },
      { id: 'a-mc-2', orderLabel: 'Approver 2', name: 'Alice Guo', role: 'Chief Sales & Marketing Officer', avatar: 'AG', department: 'Sales & Marketing', lastModifiedBy: 'Alice Guo', lastModified: 'Mar 6, 2026' },
      { id: 'a-mc-3', orderLabel: 'Verifier 1', name: 'Michael Santos', role: 'CFO', avatar: 'MS', department: 'Finance & Accounting', lastModifiedBy: 'Alice Guo', lastModified: 'Mar 6, 2026' },
    ],
  },
];

const INITIAL_ASSIGNED_EMPLOYEES = [
  { id: 'emp-jr-be',   name: 'Minato Gottenburg', role: 'Junior Backend Engineer',  department: 'Engineering',         avatar: 'MG', email: 'minato@nexuscorp.com' },
  { id: 'emp-sr-be',   name: 'Kevin Park',         role: 'Senior Backend Engineer',  department: 'Engineering',         avatar: 'KP', email: 'kevin@nexuscorp.com' },
  { id: 'emp-sr-fe',   name: 'Maria Santos',       role: 'Senior Frontend Engineer', department: 'Engineering',         avatar: 'MS', email: 'maria@nexuscorp.com' },
  { id: 'emp-sr-mob',  name: 'Angela Kim',         role: 'Senior Mobile Engineer',   department: 'Engineering',         avatar: 'AK', email: 'angela@nexuscorp.com' },
  { id: 'emp-sr-qa',   name: 'Oscar Tan',          role: 'Senior QA Engineer',       department: 'Engineering',         avatar: 'OT', email: 'oscar@nexuscorp.com' },
  { id: 'emp-sr-acct', name: 'Sandra Lee',         role: 'Senior Accountant',        department: 'Finance & Accounting',avatar: 'SL', email: 'sandra@nexuscorp.com' },
  { id: 'emp-sr-sales',name: 'Claudia Reyes',      role: 'Senior Sales Executive',   department: 'Sales & Marketing',   avatar: 'CR', email: 'claudia@nexuscorp.com' },
  { id: 'emp-sr-rec',  name: 'Jake Torres',        role: 'Senior Recruiter',         department: 'Human Resources',     avatar: 'JT', email: 'jake@nexuscorp.com' },
];

const ALL_EMPLOYEES: ApprovalEmployee[] = [
  // C-Suite
  { id: 'emp-ceo',        name: 'Marcus Reyes',    role: 'CEO',                           department: 'Nexus Corp',          avatar: 'MR', email: 'marcus@nexuscorp.com',    positionId: 'ap-ceo' },
  { id: 'emp-cto',        name: 'Elena Torres',    role: 'CTO',                           department: 'Engineering',         avatar: 'ET', email: 'elena@nexuscorp.com',     positionId: 'ap-cto' },
  { id: 'emp-chro',       name: 'Sarah Wilson',    role: 'CHRO',                          department: 'Human Resources',     avatar: 'SW', email: 'sarah@nexuscorp.com',     positionId: 'ap-chro' },
  { id: 'emp-cfo',        name: 'Michael Santos',  role: 'CFO',                           department: 'Finance & Accounting',avatar: 'MS', email: 'michael@nexuscorp.com',   positionId: 'ap-cfo' },
  { id: 'emp-cmo',        name: 'Alice Guo',       role: 'Chief Sales & Marketing Officer',department: 'Sales & Marketing',  avatar: 'AG', email: 'alice@nexuscorp.com',     positionId: 'ap-cmo' },
  { id: 'emp-coo',        name: 'Robert Chen',     role: 'COO',                           department: 'Operations',          avatar: 'RC', email: 'robert@nexuscorp.com',    positionId: 'ap-coo' },
  { id: 'emp-gc',         name: 'Jennifer Lim',    role: 'General Counsel',               department: 'Legal & Compliance',  avatar: 'JL', email: 'jennifer@nexuscorp.com',  positionId: 'ap-gc' },
  // Engineering
  { id: 'emp-plat-lead',  name: 'James Cruz',      role: 'Platform Engineering Manager',  department: 'Engineering',         avatar: 'JC', email: 'james@nexuscorp.com',     positionId: 'ap-plat-lead' },
  { id: 'emp-be-lead',    name: 'John Doe',         role: 'Backend Lead',                  department: 'Engineering',         avatar: 'JD', email: 'john@nexuscorp.com',      positionId: 'ap-be-lead' },
  { id: 'emp-sr-be',      name: 'Kevin Park',       role: 'Senior Backend Engineer',       department: 'Engineering',         avatar: 'KP', email: 'kevin@nexuscorp.com',     positionId: 'ap-sr-be' },
  { id: 'emp-jr-be',      name: 'Minato Gottenburg',role: 'Junior Backend Engineer',       department: 'Engineering',         avatar: 'MG', email: 'minato@nexuscorp.com',    positionId: 'ap-jr-be' },
  { id: 'emp-fe-lead',    name: 'Emily Davis',      role: 'Frontend Lead',                 department: 'Engineering',         avatar: 'ED', email: 'emily@nexuscorp.com',     positionId: 'ap-fe-lead' },
  { id: 'emp-sr-fe',      name: 'Maria Santos',     role: 'Senior Frontend Engineer',      department: 'Engineering',         avatar: 'MF', email: 'maria@nexuscorp.com',     positionId: 'ap-sr-fe' },
  { id: 'emp-mob-lead',   name: 'Carlos Reyes',     role: 'Mobile Development Lead',       department: 'Engineering',         avatar: 'CR', email: 'carlos@nexuscorp.com',    positionId: 'ap-mob-lead' },
  { id: 'emp-sr-mob',     name: 'Angela Kim',       role: 'Senior Mobile Engineer',        department: 'Engineering',         avatar: 'AK', email: 'angela@nexuscorp.com',    positionId: 'ap-sr-mob' },
  { id: 'emp-devops-lead',name: 'David Kim',        role: 'DevOps Lead',                   department: 'Engineering',         avatar: 'DK', email: 'david@nexuscorp.com',     positionId: 'ap-devops-lead' },
  { id: 'emp-sr-devops',  name: 'Nathan Cruz',      role: 'Senior DevOps Engineer',        department: 'Engineering',         avatar: 'NC', email: 'nathan@nexuscorp.com',    positionId: 'ap-sr-devops' },
  { id: 'emp-qa-lead',    name: 'Nina Flores',      role: 'QA Lead',                       department: 'Engineering',         avatar: 'NF', email: 'nina@nexuscorp.com',      positionId: 'ap-qa-lead' },
  { id: 'emp-sr-qa',      name: 'Oscar Tan',        role: 'Senior QA Engineer',            department: 'Engineering',         avatar: 'OT', email: 'oscar@nexuscorp.com',     positionId: 'ap-sr-qa' },
  // Human Resources
  { id: 'emp-ta-mgr',     name: 'Patricia Cruz',   role: 'Talent Acquisition Manager',    department: 'Human Resources',     avatar: 'PC', email: 'patricia@nexuscorp.com',  positionId: 'ap-ta-mgr' },
  { id: 'emp-sr-rec',     name: 'Jake Torres',     role: 'Senior Recruiter',              department: 'Human Resources',     avatar: 'JT', email: 'jake@nexuscorp.com',      positionId: 'ap-sr-rec' },
  { id: 'emp-cb-mgr',     name: 'Lucy Reyes',      role: 'C&B Manager',                   department: 'Human Resources',     avatar: 'LR', email: 'lucy@nexuscorp.com',      positionId: 'ap-cb-mgr' },
  { id: 'emp-er-mgr',     name: 'Angela Tan',      role: 'Employee Relations Manager',    department: 'Human Resources',     avatar: 'AT', email: 'angela.tan@nexuscorp.com', positionId: 'ap-er-mgr' },
  // Finance & Accounting
  { id: 'emp-acct-mgr',   name: 'Mike Brown',      role: 'Accounting Manager',            department: 'Finance & Accounting',avatar: 'MB', email: 'mike@nexuscorp.com',      positionId: 'ap-acct-mgr' },
  { id: 'emp-sr-acct',    name: 'Sandra Lee',      role: 'Senior Accountant',             department: 'Finance & Accounting',avatar: 'SL', email: 'sandra@nexuscorp.com',    positionId: 'ap-sr-acct' },
  { id: 'emp-pay-mgr',    name: 'Raymond Garcia',  role: 'Payroll Manager',               department: 'Finance & Accounting',avatar: 'RG', email: 'raymond@nexuscorp.com',   positionId: 'ap-pay-mgr' },
  { id: 'emp-pay-spec',   name: 'Carla Santos',    role: 'Payroll Specialist',            department: 'Finance & Accounting',avatar: 'CS', email: 'carla@nexuscorp.com',     positionId: 'ap-pay-spec' },
  { id: 'emp-fp-mgr',     name: 'Eric Santos',     role: 'Financial Planning Manager',    department: 'Finance & Accounting',avatar: 'ES', email: 'eric@nexuscorp.com',      positionId: 'ap-fp-mgr' },
  // Sales & Marketing
  { id: 'emp-sales-mgr',  name: 'Victor Gomez',    role: 'Sales Manager',                 department: 'Sales & Marketing',   avatar: 'VG', email: 'victor@nexuscorp.com',    positionId: 'ap-sales-mgr' },
  { id: 'emp-sr-sales',   name: 'Claudia Reyes',   role: 'Senior Sales Executive',        department: 'Sales & Marketing',   avatar: 'CR', email: 'claudia@nexuscorp.com',   positionId: 'ap-sr-sales' },
  { id: 'emp-mkt-mgr',    name: 'Benjamin Tan',    role: 'Marketing Manager',             department: 'Sales & Marketing',   avatar: 'BT', email: 'benjamin@nexuscorp.com',  positionId: 'ap-mkt-mgr' },
  { id: 'emp-cs-mgr',     name: 'Sophia Navarro',  role: 'Customer Success Manager',      department: 'Sales & Marketing',   avatar: 'SN', email: 'sophia@nexuscorp.com',    positionId: 'ap-cs-mgr' },
  // Operations
  { id: 'emp-sc-mgr',     name: 'Raymond Cruz',    role: 'Supply Chain Manager',          department: 'Operations',          avatar: 'RZ', email: 'raycruz@nexuscorp.com',   positionId: 'ap-sc-mgr' },
  { id: 'emp-it-mgr',     name: 'Richard Lee',     role: 'IT Support Manager',            department: 'Operations',          avatar: 'RL', email: 'richard@nexuscorp.com',   positionId: 'ap-it-mgr' },
  // Legal & Compliance
  { id: 'emp-sr-legal',   name: 'Grace Velasco',   role: 'Senior Legal Counsel',          department: 'Legal & Compliance',  avatar: 'GV', email: 'grace@nexuscorp.com',     positionId: 'ap-sr-legal' },
];

const APPROVAL_ORG_UNITS: ApprovalOrgUnit[] = [
  { id: 'root',    name: 'Nexus Corp',               type: 'Company',    headPositionId: 'ap-ceo' },
  { id: 'div-1',   name: 'Engineering',              type: 'Division',   parentId: 'root',    headPositionId: 'ap-cto' },
  { id: 'dept-1',  name: 'Platform Engineering',     type: 'Department', parentId: 'div-1',   headPositionId: 'ap-plat-lead' },
  { id: 'team-1',  name: 'Backend Team',             type: 'Team',       parentId: 'dept-1',  headPositionId: 'ap-be-lead' },
  { id: 'team-2',  name: 'Frontend Team',            type: 'Team',       parentId: 'dept-1',  headPositionId: 'ap-fe-lead' },
  { id: 'dept-2',  name: 'Mobile Development',       type: 'Department', parentId: 'div-1',   headPositionId: 'ap-mob-lead' },
  { id: 'dept-3',  name: 'DevOps & Infrastructure',  type: 'Department', parentId: 'div-1',   headPositionId: 'ap-devops-lead' },
  { id: 'dept-4',  name: 'QA & Testing',             type: 'Department', parentId: 'div-1',   headPositionId: 'ap-qa-lead' },
  { id: 'div-2',   name: 'Human Resources',          type: 'Division',   parentId: 'root',    headPositionId: 'ap-chro' },
  { id: 'dept-5',  name: 'Talent Acquisition',       type: 'Department', parentId: 'div-2',   headPositionId: 'ap-ta-mgr' },
  { id: 'dept-6',  name: 'Compensation & Benefits',  type: 'Department', parentId: 'div-2',   headPositionId: 'ap-cb-mgr' },
  { id: 'dept-7',  name: 'Employee Relations',       type: 'Department', parentId: 'div-2',   headPositionId: 'ap-er-mgr' },
  { id: 'div-3',   name: 'Finance & Accounting',     type: 'Division',   parentId: 'root',    headPositionId: 'ap-cfo' },
  { id: 'dept-8',  name: 'Accounting',               type: 'Department', parentId: 'div-3',   headPositionId: 'ap-acct-mgr' },
  { id: 'dept-9',  name: 'Payroll',                  type: 'Department', parentId: 'div-3',   headPositionId: 'ap-pay-mgr' },
  { id: 'dept-10', name: 'Financial Planning',       type: 'Department', parentId: 'div-3',   headPositionId: 'ap-fp-mgr' },
  { id: 'div-4',   name: 'Sales & Marketing',        type: 'Division',   parentId: 'root',    headPositionId: 'ap-cmo' },
  { id: 'dept-11', name: 'Sales',                    type: 'Department', parentId: 'div-4',   headPositionId: 'ap-sales-mgr' },
  { id: 'dept-12', name: 'Marketing',                type: 'Department', parentId: 'div-4',   headPositionId: 'ap-mkt-mgr' },
  { id: 'dept-13', name: 'Customer Success',         type: 'Department', parentId: 'div-4',   headPositionId: 'ap-cs-mgr' },
  { id: 'div-5',   name: 'Operations',               type: 'Division',   parentId: 'root',    headPositionId: 'ap-coo' },
  { id: 'dept-14', name: 'Supply Chain',             type: 'Department', parentId: 'div-5',   headPositionId: 'ap-sc-mgr' },
  { id: 'dept-15', name: 'IT Support',               type: 'Department', parentId: 'div-5',   headPositionId: 'ap-it-mgr' },
  { id: 'div-6',   name: 'Legal & Compliance',       type: 'Division',   parentId: 'root',    headPositionId: 'ap-gc' },
];

const APPROVAL_POSITIONS: ApprovalPosition[] = [
  // C-Suite
  { id: 'ap-ceo',         title: 'CEO',                           orgUnitId: 'root' },
  { id: 'ap-cto',         title: 'CTO',                           orgUnitId: 'div-1',   supervisorId: 'ap-ceo' },
  { id: 'ap-chro',        title: 'CHRO',                          orgUnitId: 'div-2',   supervisorId: 'ap-ceo' },
  { id: 'ap-cfo',         title: 'CFO',                           orgUnitId: 'div-3',   supervisorId: 'ap-ceo' },
  { id: 'ap-cmo',         title: 'Chief Sales & Marketing Officer',orgUnitId: 'div-4',  supervisorId: 'ap-ceo' },
  { id: 'ap-coo',         title: 'COO',                           orgUnitId: 'div-5',   supervisorId: 'ap-ceo' },
  { id: 'ap-gc',          title: 'General Counsel',               orgUnitId: 'div-6',   supervisorId: 'ap-ceo' },
  // Engineering — Platform
  { id: 'ap-plat-lead',   title: 'Platform Engineering Manager',  orgUnitId: 'dept-1',  supervisorId: 'ap-cto' },
  { id: 'ap-be-lead',     title: 'Backend Lead',                  orgUnitId: 'team-1',  supervisorId: 'ap-plat-lead' },
  { id: 'ap-sr-be',       title: 'Senior Backend Engineer',       orgUnitId: 'team-1',  supervisorId: 'ap-be-lead' },
  { id: 'ap-jr-be',       title: 'Junior Backend Engineer',       orgUnitId: 'team-1',  supervisorId: 'ap-sr-be' },
  { id: 'ap-fe-lead',     title: 'Frontend Lead',                 orgUnitId: 'team-2',  supervisorId: 'ap-plat-lead' },
  { id: 'ap-sr-fe',       title: 'Senior Frontend Engineer',      orgUnitId: 'team-2',  supervisorId: 'ap-fe-lead' },
  // Engineering — Mobile, DevOps, QA
  { id: 'ap-mob-lead',    title: 'Mobile Development Lead',       orgUnitId: 'dept-2',  supervisorId: 'ap-cto' },
  { id: 'ap-sr-mob',      title: 'Senior Mobile Engineer',        orgUnitId: 'dept-2',  supervisorId: 'ap-mob-lead' },
  { id: 'ap-devops-lead', title: 'DevOps Lead',                   orgUnitId: 'dept-3',  supervisorId: 'ap-cto' },
  { id: 'ap-sr-devops',   title: 'Senior DevOps Engineer',        orgUnitId: 'dept-3',  supervisorId: 'ap-devops-lead' },
  { id: 'ap-qa-lead',     title: 'QA Lead',                       orgUnitId: 'dept-4',  supervisorId: 'ap-cto' },
  { id: 'ap-sr-qa',       title: 'Senior QA Engineer',            orgUnitId: 'dept-4',  supervisorId: 'ap-qa-lead' },
  // Human Resources
  { id: 'ap-ta-mgr',      title: 'Talent Acquisition Manager',    orgUnitId: 'dept-5',  supervisorId: 'ap-chro' },
  { id: 'ap-sr-rec',      title: 'Senior Recruiter',              orgUnitId: 'dept-5',  supervisorId: 'ap-ta-mgr' },
  { id: 'ap-cb-mgr',      title: 'C&B Manager',                   orgUnitId: 'dept-6',  supervisorId: 'ap-chro' },
  { id: 'ap-er-mgr',      title: 'Employee Relations Manager',    orgUnitId: 'dept-7',  supervisorId: 'ap-chro' },
  // Finance & Accounting
  { id: 'ap-acct-mgr',    title: 'Accounting Manager',            orgUnitId: 'dept-8',  supervisorId: 'ap-cfo' },
  { id: 'ap-sr-acct',     title: 'Senior Accountant',             orgUnitId: 'dept-8',  supervisorId: 'ap-acct-mgr' },
  { id: 'ap-pay-mgr',     title: 'Payroll Manager',               orgUnitId: 'dept-9',  supervisorId: 'ap-cfo' },
  { id: 'ap-pay-spec',    title: 'Payroll Specialist',            orgUnitId: 'dept-9',  supervisorId: 'ap-pay-mgr' },
  { id: 'ap-fp-mgr',      title: 'Financial Planning Manager',    orgUnitId: 'dept-10', supervisorId: 'ap-cfo' },
  // Sales & Marketing
  { id: 'ap-sales-mgr',   title: 'Sales Manager',                 orgUnitId: 'dept-11', supervisorId: 'ap-cmo' },
  { id: 'ap-sr-sales',    title: 'Senior Sales Executive',        orgUnitId: 'dept-11', supervisorId: 'ap-sales-mgr' },
  { id: 'ap-mkt-mgr',     title: 'Marketing Manager',             orgUnitId: 'dept-12', supervisorId: 'ap-cmo' },
  { id: 'ap-cs-mgr',      title: 'Customer Success Manager',      orgUnitId: 'dept-13', supervisorId: 'ap-cmo' },
  // Operations
  { id: 'ap-sc-mgr',      title: 'Supply Chain Manager',          orgUnitId: 'dept-14', supervisorId: 'ap-coo' },
  { id: 'ap-it-mgr',      title: 'IT Support Manager',            orgUnitId: 'dept-15', supervisorId: 'ap-coo' },
  // Legal & Compliance
  { id: 'ap-sr-legal',    title: 'Senior Legal Counsel',          orgUnitId: 'div-6',   supervisorId: 'ap-gc' },
];

const DEPARTMENTS = [...new Set(ALL_EMPLOYEES.map(e => e.department))].sort();

// --- Derived Approver Chain ---
interface DerivedApprover {
  positionId: string;
  positionTitle: string;
  orgUnitName: string;
  employeeId?: string;
  name: string;
  avatar: string;
  isVacant: boolean;
  isIntraUnit: boolean;
}

function deriveApproverChain(
  orgUnitId: string,
  orgUnits: ApprovalOrgUnit[],
  positions: ApprovalPosition[],
  employees: ApprovalEmployee[],
  maxDepth = 8
): DerivedApprover[] {
  const unit = orgUnits.find(u => u.id === orgUnitId);
  if (!unit || !unit.headPositionId) return [];
  const headPos = positions.find(p => p.id === unit.headPositionId);
  if (!headPos) return [];

  const unitPositions = positions.filter(p => p.orgUnitId === orgUnitId);
  const supervisorIdsInUnit = new Set(unitPositions.map(p => p.supervisorId).filter(Boolean) as string[]);
  const supervisoryPositions = unitPositions.filter(p => supervisorIdsInUnit.has(p.id));

  const orderedFromHead: ApprovalPosition[] = [];
  const remaining = new Set(supervisoryPositions.map(p => p.id));
  let curr: ApprovalPosition | undefined = supervisoryPositions.find(p => p.id === unit.headPositionId);
  while (curr) {
    orderedFromHead.push(curr);
    remaining.delete(curr.id);
    curr = supervisoryPositions.find(p => p.supervisorId === curr!.id && remaining.has(p.id));
  }
  const intraChain = orderedFromHead.reverse();

  const crossChain: ApprovalPosition[] = [];
  let crossId = headPos.supervisorId;
  let depth = 0;
  while (crossId && depth < maxDepth) {
    const pos = positions.find(p => p.id === crossId);
    if (!pos || pos.orgUnitId === orgUnitId) break;
    crossChain.push(pos);
    crossId = pos.supervisorId;
    depth++;
  }

  const toEntry = (pos: ApprovalPosition, isIntraUnit: boolean): DerivedApprover => {
    const emp = employees.find(e => e.positionId === pos.id);
    const posUnit = orgUnits.find(u => u.id === pos.orgUnitId);
    return {
      positionId: pos.id,
      positionTitle: pos.title,
      orgUnitName: posUnit?.name || '',
      employeeId: emp?.id,
      name: emp ? emp.name : `[Vacant — ${pos.title}]`,
      avatar: emp ? emp.avatar : '--',
      isVacant: !emp,
      isIntraUnit,
    };
  };

  return [
    ...intraChain.map(p => toEntry(p, true)),
    ...crossChain.map(p => toEntry(p, false)),
  ];
}

const ApprovalSetupPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [activeSetup, setActiveSetup] = useState<ApprovalSetup | null>(null);
  const [activeTab, setActiveTab] = useState<'General Settings' | 'Manage Employees'>('General Settings');

  // State for Assigned Employees
  const [assignedEmployees, setAssignedEmployees] = useState(INITIAL_ASSIGNED_EMPLOYEES);

  // Editor State
  const [editorName, setEditorName] = useState('');
  const [editorFeature, setEditorFeature] = useState('');
  const [editorAutoReject, setEditorAutoReject] = useState(0);

  // Unit / Org State
  const [editorUnitType, setEditorUnitType] = useState('Division');
  const [editorUnitTarget, setEditorUnitTarget] = useState('');

  // Drag-and-drop state for approver sequence
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [editorStartDate, setEditorStartDate] = useState('');
  const [editorEndDate, setEditorEndDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'approver' | 'assignee' | 'delegate' | 'co-approver'>('assignee');
  const [activeApproverId, setActiveApproverId] = useState<string | null>(null); // For delegate/co-approver logic

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeDept, setEmployeeDept] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  // Approver modal inner tab + hierarchy selection
  const [modalInnerTab, setModalInnerTab] = useState<'hierarchy' | 'all'>('hierarchy');
  const [selectedDerivedPositionIds, setSelectedDerivedPositionIds] = useState<Set<string>>(new Set());

  const MotionDiv = motion.div as any;

  // Derived chain for the currently selected unit scope
  const derivedChainForModal = useMemo(() => {
    if (!editorUnitTarget) return [];
    return deriveApproverChain(editorUnitTarget, APPROVAL_ORG_UNITS, APPROVAL_POSITIONS, ALL_EMPLOYEES);
  }, [editorUnitTarget]);

  const handleEdit = (setup: ApprovalSetup) => {
    setActiveSetup({ ...setup });
    setEditorName(setup.name);
    setEditorFeature(setup.feature);
    setEditorAutoReject(setup.autoRejectDays || 0);
    const unit = APPROVAL_ORG_UNITS.find(u => u.id === setup.orgUnitId);
    setEditorUnitType(unit?.type || setup.unitType || 'Division');
    setEditorUnitTarget(setup.orgUnitId || '');
    setEditorStartDate(setup.startDate || '');
    setEditorEndDate(setup.endDate || '');
    setAssignedEmployees(INITIAL_ASSIGNED_EMPLOYEES);
    setViewMode('editor');
    setActiveTab('General Settings');
  };

  const handleCreate = () => {
    const newSetup: ApprovalSetup = {
      id: Math.random().toString(),
      name: '',
      connectedEmployees: 0,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastModifiedBy: 'Current User',
      lastModified: 'Just now',
      feature: 'Leave Management',
      autoRejectDays: 0,
      approvers: []
    };
    handleEdit(newSetup);
  };

  // --- Save guard ---
  const handleSave = () => {
    if (!activeSetup) return;
    const vacantApprovers = activeSetup.approvers.filter(a => a.name.startsWith('[Vacant'));
    if (vacantApprovers.length > 0) {
      if (!window.confirm(
        `Warning: ${vacantApprovers.length} approver step(s) have vacant positions (no one currently holds the role). Save anyway?`
      )) return;
    }
    alert('Approval setup saved successfully.');
  };

  // --- Unit Scope Auto-Fill ---
  const handleUnitTargetChange = (unitId: string) => {
    setEditorUnitTarget(unitId);
    if (!activeSetup || !unitId) return;

    const chain = deriveApproverChain(unitId, APPROVAL_ORG_UNITS, APPROVAL_POSITIONS, ALL_EMPLOYEES);
    if (chain.length === 0) return;

    const newApprovers: Approver[] = chain.map(da => ({
      id: Math.random().toString(36).substr(2, 9),
      orderLabel: 'Approver',
      name: da.name,
      department: da.orgUnitName,
      role: da.positionTitle,
      avatar: da.avatar,
      lastModifiedBy: 'System',
      lastModified: 'Auto-filled',
    }));

    if (activeSetup.approvers.length > 0) {
      if (!window.confirm(
        `Replace the current ${activeSetup.approvers.length} approver(s) with ${chain.length} auto-filled step(s) from the selected unit?`
      )) return;
    }

    setActiveSetup({ ...activeSetup, approvers: newApprovers });
  };

  // --- Drag-and-Drop Handlers ---
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index || !activeSetup) return;
    const newApprovers = [...activeSetup.approvers];
    const [moved] = newApprovers.splice(dragIndex, 1);
    newApprovers.splice(index, 0, moved);
    setActiveSetup({ ...activeSetup, approvers: newApprovers });
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDeleteApprover = (id: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.filter(a => a.id !== id);
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  const handleDeleteAssignee = (id: string) => {
    setAssignedEmployees(assignedEmployees.filter(e => e.id !== id));
  };


  // --- Delegate & Co-Approver Logic ---
  const handleRemoveDelegate = (approverId: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.map(a => {
      if (a.id === approverId) {
        const { delegateId, delegateName, delegateAvatar, delegateStartDate, delegateEndDate, ...rest } = a;
        return rest;
      }
      return a;
    });
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  const handleRemoveCoApprover = (approverId: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.map(a => {
      if (a.id === approverId) {
        const { secondaryId, secondaryName, secondaryAvatar, secondaryRole, ...rest } = a;
        return rest;
      }
      return a;
    });
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  // --- Modal Logic ---
  const filteredEmployeesForModal = useMemo(() => {
    return ALL_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.role.toLowerCase().includes(employeeSearch.toLowerCase());
      const matchesDept = employeeDept ? emp.department === employeeDept : true;

      // Filter out logic
      let isAlreadyAdded = false;
      if (modalMode === 'assignee') {
        isAlreadyAdded = assignedEmployees.some(ae => ae.id === emp.id);
      } else if (modalMode === 'delegate' && activeApproverId) {
        const currentApprover = activeSetup?.approvers.find(a => a.id === activeApproverId);
        if (currentApprover && currentApprover.name === emp.name) isAlreadyAdded = true;
      } else if (modalMode === 'co-approver' && activeApproverId) {
        const currentApprover = activeSetup?.approvers.find(a => a.id === activeApproverId);
        if (currentApprover && currentApprover.name === emp.name) isAlreadyAdded = true;
        // Also verify they aren't already the co-approver (if editing)
      }

      return matchesSearch && matchesDept && !isAlreadyAdded;
    });
  }, [employeeSearch, employeeDept, modalMode, assignedEmployees, activeSetup, activeApproverId]);

  const toggleEmployeeSelection = (id: string) => {
    // For delegate and co-approver, only allow single selection
    if (modalMode === 'delegate' || modalMode === 'co-approver') {
      const newSet = new Set<string>();
      if (selectedEmployeeIds.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedEmployeeIds(newSet);
      return;
    }

    const newSet = new Set(selectedEmployeeIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEmployeeIds(newSet);
  };

  const openModal = (mode: 'approver' | 'assignee' | 'delegate' | 'co-approver', approverId?: string) => {
    setModalMode(mode);
    setEmployeeSearch('');
    setEmployeeDept('');
    setSelectedEmployeeIds(new Set());
    if (mode === 'approver') {
      const chain = deriveApproverChain(editorUnitTarget, APPROVAL_ORG_UNITS, APPROVAL_POSITIONS, ALL_EMPLOYEES);
      setSelectedDerivedPositionIds(new Set(chain.map(d => d.positionId)));
      setModalInnerTab(chain.length > 0 ? 'hierarchy' : 'all');
    } else {
      setSelectedDerivedPositionIds(new Set());
      setModalInnerTab('all');
    }
    if ((mode === 'delegate' || mode === 'co-approver') && approverId) {
      setActiveApproverId(approverId);
    }
    setIsEmployeeModalOpen(true);
  };

  const handleModalConfirm = () => {
    const selectedEmps = ALL_EMPLOYEES.filter(e => selectedEmployeeIds.has(e.id));

    if (modalMode === 'assignee') {
      setAssignedEmployees([...assignedEmployees, ...selectedEmps]);
    } else if (modalMode === 'approver' && activeSetup) {
      // Selected derived chain items (in chain order)
      const selectedDerived = derivedChainForModal.filter(d => selectedDerivedPositionIds.has(d.positionId));
      const derivedEmpIds = new Set(selectedDerived.map(d => d.employeeId).filter(Boolean));
      // Extra employees not already covered by the derived chain
      const extraEmps = selectedEmps.filter(e => !derivedEmpIds.has(e.id));

      const derivedNewApprovers: Approver[] = selectedDerived.map(da => ({
        id: Math.random().toString(36).substr(2, 9),
        orderLabel: 'Approver',
        name: da.name,
        department: da.orgUnitName,
        role: da.positionTitle,
        avatar: da.avatar,
        lastModifiedBy: 'Current User',
        lastModified: 'Just now',
      }));
      const extraNewApprovers: Approver[] = extraEmps.map(emp => ({
        id: Math.random().toString(36).substr(2, 9),
        orderLabel: 'Approver',
        name: emp.name,
        department: emp.department,
        role: emp.role,
        avatar: emp.avatar,
        lastModifiedBy: 'Current User',
        lastModified: 'Just now',
      }));
      setActiveSetup({
        ...activeSetup,
        approvers: [...activeSetup.approvers, ...derivedNewApprovers, ...extraNewApprovers],
      });
    } else if (modalMode === 'delegate' && activeSetup && activeApproverId && selectedEmps.length > 0) {
      const delegate = selectedEmps[0];
      const updatedApprovers = activeSetup.approvers.map(a => {
        if (a.id === activeApproverId) {
          return {
            ...a,
            delegateId: delegate.id,
            delegateName: delegate.name,
            delegateAvatar: delegate.avatar,
            delegateStartDate: new Date().toISOString().split('T')[0],
            delegateEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          };
        }
        return a;
      });
      setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
      setActiveApproverId(null);
    } else if (modalMode === 'co-approver' && activeSetup && activeApproverId && selectedEmps.length > 0) {
      const secondary = selectedEmps[0];
      const updatedApprovers = activeSetup.approvers.map(a => {
        if (a.id === activeApproverId) {
          return {
            ...a,
            secondaryId: secondary.id,
            secondaryName: secondary.name,
            secondaryRole: secondary.role,
            secondaryAvatar: secondary.avatar
          };
        }
        return a;
      });
      setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
      setActiveApproverId(null);
    }

    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* List Mode is mostly unchanged, skipping for brevity in this response unless requested */}
      {viewMode === 'list' && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Approvals Setup
                <FileCheck className="text-indigo-600" size={24} />
              </h1>
              <p className="text-slate-500 font-medium mt-1">Design approval workflows and reviewer sequences.</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <Plus size={18} />
              Add Setup
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={14} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/40">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                      Setup Name <span className="opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Applied To
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Feature
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Effectivity
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Last Modified
                    </th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_SETUPS.map((setup) => (
                    <tr
                      key={setup.id}
                      onClick={() => handleEdit(setup)}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <FileCheck size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-900">{setup.name || 'Untitled Setup'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">
                            {setup.connectedEmployees} Employees
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {setup.feature}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {setup.startDate ? (
                          <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 w-fit">
                            <CalendarDays size={10} /> {setup.startDate} {setup.endDate ? `to ${setup.endDate}` : '(On-going)'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">No schedule</span>
                        )}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{setup.lastModifiedBy}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{setup.lastModified}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button className="text-slate-300 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionDiv>
      )}

      {viewMode === 'editor' && activeSetup && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Editor Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeSetup.name || 'New Setup'}</h1>
                <p className="text-xs text-slate-500 font-medium">Configuration mode</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tabs in Header */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['General Settings', 'Manage Employees'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            {activeTab === 'General Settings' && (
              <div className="p-8 space-y-8 animate-in fade-in">
                {/* Form Fields */}
                <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Approval Setup Name</label>
                    <input
                      type="text"
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      disabled={MOCK_SETUPS.some(s => s.id === activeSetup.id)}
                      className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 ${MOCK_SETUPS.some(s => s.id === activeSetup.id) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                      placeholder="e.g. Department Leave Request"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Feature</label>
                    <div className="relative">
                      <select
                        value={editorFeature}
                        onChange={(e) => setEditorFeature(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="Leave Management">Leave Management</option>
                        <option value="Time & Attendance">Time & Attendance</option>
                        <option value="Payroll Dispute">Payroll Dispute</option>
                        <option value="PAF Request">PAF Request</option>
                        <option value="Official Business">Official Business</option>
                        <option value="Shift Change Request">Shift Change Request</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Dynamic Unit Scope Selection */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        Unit Type <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded ml-2 normal-case">Hierarchy Level</span>
                      </label>
                      <div className="relative">
                        <select
                          value={editorUnitType}
                          onChange={(e) => {
                            setEditorUnitType(e.target.value);
                            setEditorUnitTarget('');
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          {[...new Set(APPROVAL_ORG_UNITS.map(u => u.type))].map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Unit Scope
                      </label>
                      <div className="relative">
                        <select
                          value={editorUnitTarget}
                          onChange={(e) => handleUnitTargetChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          <option value="">-- No {editorUnitType} Selected --</option>
                          {APPROVAL_ORG_UNITS.filter(u => u.type === editorUnitType).map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                        <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Effectivity Start</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={editorStartDate}
                          onChange={(e) => setEditorStartDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">End Date (Optional)</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={editorEndDate}
                          onChange={(e) => setEditorEndDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Rejection Policy Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl opacity-70">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Auto-Rejection Policy</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                        Automatically reject pending requests if no action is taken by approvers within the specified timeframe. <i>Configured in Company Policies - Rules & Policies.</i>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 sm:mt-0 opacity-70">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reject after</span>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{editorAutoReject}</span>
                      <span className="text-[10px] font-bold text-slate-400">Days</span>
                    </div>
                  </div>
                </div>

                {/* Approvers Table */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-lg font-bold text-slate-900">Approver Sequence</h3>
                    <p className="text-xs text-slate-500 font-medium">Define who needs to approve requests in this workflow.</p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest w-10"></th>
                          <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Step</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Approver(s) & Delegation</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Department</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Last Modified</th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-slate-100"
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverIndex(null);
                        }}
                      >
                        {activeSetup.approvers.length > 0 ? activeSetup.approvers.map((approver, index) => (
                          <tr
                            key={approver.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={() => handleDrop(index)}
                            onDragEnd={handleDragEnd}
                            className={`transition-colors group select-none
                              ${dragIndex === index ? 'opacity-30 bg-slate-50' : dragOverIndex === index ? 'bg-indigo-50 shadow-[inset_0_2px_0_0_#6366f1]' : 'bg-white hover:bg-slate-50'}
                            `}
                          >
                            <td className="px-4 py-4 text-center">
                              <GripVertical size={16} className="text-slate-300 hover:text-slate-500 mx-auto cursor-grab active:cursor-grabbing" />
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                                Step {index + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-4">
                                {/* Main Approver */}
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200 shadow-sm">
                                    {approver.avatar}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900">{approver.name}</div>
                                    <div className="text-[10px] text-slate-500 font-medium">{approver.role}</div>
                                  </div>
                                </div>

                                {/* Secondary Approver (Dual) */}
                                {approver.secondaryId && (
                                  <div className="flex items-center gap-3 pl-2 relative">
                                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1 z-10">AND</div>
                                    <div className="absolute left-[19px] -top-6 bottom-1/2 w-[2px] bg-slate-200"></div>

                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-200 shadow-sm ml-1">
                                      {approver.secondaryAvatar}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <div className="font-bold text-slate-900">{approver.secondaryName}</div>
                                          <div className="text-[10px] text-slate-500 font-medium">{approver.secondaryRole}</div>
                                        </div>
                                        <button onClick={() => handleRemoveCoApprover(approver.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100"><X size={12} /></button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Delegate Section */}
                                {approver.delegateId && (
                                  <div className="flex items-start gap-3 pl-2 relative">
                                    {/* Connector Branch */}
                                    <div className="absolute left-[19px] -top-5 bottom-1/2 w-[2px] bg-slate-200 rounded-bl-full"></div>
                                    <div className="absolute left-[19px] top-1/2 w-4 h-[2px] bg-slate-200"></div>

                                    <div className="flex-1 ml-4 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-indigo-300 hover:shadow-md transition-all group/delegate">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 flex items-center gap-1">
                                            <UserCog size={10} /> Representative
                                          </span>
                                        </div>
                                        <button onClick={() => handleRemoveDelegate(approver.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 opacity-0 group-hover/delegate:opacity-100"><X size={12} /></button>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                                          {approver.delegateAvatar}
                                        </div>
                                        <div>
                                          <div className="font-bold text-xs text-slate-800">{approver.delegateName}</div>
                                          <div className="text-[10px] text-slate-500">Acting on behalf</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="flex items-center gap-2 text-slate-600 font-medium">
                                <Briefcase size={14} className="text-slate-400" />
                                {approver.department}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{approver.lastModifiedBy}</span>
                                <span className="text-[10px] text-slate-400">{approver.lastModified}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right align-top">
                              <div className="flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleDeleteApprover(approver.id)}
                                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Remove Approver"
                                >
                                  <Trash2 size={16} />
                                </button>
                                {!approver.delegateId && (
                                  <button
                                    onClick={() => openModal('delegate', approver.id)}
                                    className="p-2 text-slate-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                    title="Assign Representative"
                                  >
                                    <UserCog size={16} />
                                  </button>
                                )}
                                {!approver.secondaryId && (
                                  <button
                                    onClick={() => openModal('co-approver', approver.id)}
                                    className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Add Co-Approver"
                                  >
                                    <Users size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/20">
                              <FileCheck size={32} className="mx-auto mb-2 opacity-20" />
                              No approvers configured yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Add Button Area */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200">
                      <button
                        onClick={() => openModal('approver')}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                          <Plus size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Add Approver Step</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Manage Employees' && (
              <div className="p-8 space-y-6 animate-in fade-in h-full flex flex-col">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Filter assigned employees..."
                      className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      {assignedEmployees.length} Active Members
                    </div>
                    <button
                      onClick={() => openModal('assignee')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                    >
                      <User size={16} /> Add Member
                    </button>
                  </div>
                </div>

                {assignedEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {assignedEmployees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                      <div key={emp.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                        <button
                          onClick={() => handleDeleteAssignee(emp.id)}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-3 flex items-center justify-center text-slate-500 text-sm font-bold shadow-inner">
                            {emp.avatar}
                          </div>
                          <h4 className="font-bold text-slate-900">{emp.name}</h4>
                          <p className="text-xs text-slate-500 font-medium mb-2">{emp.role}</p>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-bold uppercase tracking-wide border border-slate-200">{emp.department}</span>
                        </div>
                      </div>
                    ))}
                    {/* Add New Card */}
                    <button
                      onClick={() => openModal('assignee')}
                      className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all min-h-[200px] gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Plus size={24} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Assign Employee</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Users size={48} className="text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No employees assigned</h3>
                    <p className="text-slate-400 text-sm max-w-xs">Start by adding employees to this approval group.</p>
                    <button
                      onClick={() => openModal('assignee')}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                    >
                      Add Employee
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </MotionDiv>
      )}

      {/* Employee Selection Modal */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} className="max-w-3xl">
        <div className="flex flex-col h-[640px] bg-white">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                <UserPlus size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {modalMode === 'approver' ? 'Configure Approver Sequence' : modalMode === 'delegate' ? 'Assign Representative' : modalMode === 'co-approver' ? 'Add Co-Approver' : 'Assign Employee'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {modalMode === 'approver'
                    ? derivedChainForModal.length > 0
                      ? `Showing suggested chain for ${APPROVAL_ORG_UNITS.find(u => u.id === editorUnitTarget)?.name || 'selected unit'}. Uncheck steps to remove.`
                      : 'Select employees to add as approver steps.'
                    : modalMode === 'delegate'
                      ? 'Select a designated representative for this approver.'
                      : modalMode === 'co-approver'
                        ? 'Select a second person to approve alongside the primary approver.'
                        : `Select employees to assign to ${activeSetup?.name || 'this setup'}.`
                  }
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-indigo-700 text-xs font-bold">
              {modalMode === 'approver'
                ? `${selectedDerivedPositionIds.size + selectedEmployeeIds.size} Selected`
                : `${selectedEmployeeIds.size} Selected`}
            </div>
          </div>

          {/* Tabs — only shown for approver mode when a hierarchy exists */}
          {modalMode === 'approver' && derivedChainForModal.length > 0 && (
            <div className="px-6 pt-4 pb-0 border-b border-slate-100 flex gap-1 bg-white">
              <button
                onClick={() => setModalInnerTab('hierarchy')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all ${modalInnerTab === 'hierarchy' ? 'border-indigo-500 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Network size={14} /> Org Hierarchy
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ml-1 ${modalInnerTab === 'hierarchy' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  {derivedChainForModal.length}
                </span>
              </button>
              <button
                onClick={() => setModalInnerTab('all')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-lg border-b-2 transition-all ${modalInnerTab === 'all' ? 'border-indigo-500 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Users size={14} /> All Employees
                {selectedEmployeeIds.size > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold ml-1 bg-indigo-100 text-indigo-700">+{selectedEmployeeIds.size}</span>
                )}
              </button>
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Filters — hidden on hierarchy tab */}
            {(modalMode !== 'approver' || modalInnerTab === 'all') && (
              <div className="w-56 border-r border-slate-100 bg-slate-50/50 p-5 flex flex-col gap-6 shrink-0">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Filters</label>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1.5 block">Department</label>
                    <select
                      className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      value={employeeDept}
                      onChange={(e) => setEmployeeDept(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* ── Hierarchy Tab ── */}
              {modalMode === 'approver' && modalInnerTab === 'hierarchy' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                  {derivedChainForModal.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                      <Network size={40} className="mb-3 opacity-30" />
                      <p className="font-medium">No unit scope selected.</p>
                      <p className="text-xs mt-1">Select a Unit Scope in the editor to see the suggested chain.</p>
                    </div>
                  ) : (
                    <>
                      {/* Intra-unit section */}
                      {(() => {
                        const intra = derivedChainForModal.filter(d => d.isIntraUnit);
                        const cross = derivedChainForModal.filter(d => !d.isIntraUnit);
                        const unitName = APPROVAL_ORG_UNITS.find(u => u.id === editorUnitTarget)?.name || 'Unit';
                        return (
                          <>
                            {intra.length > 0 && (
                              <div className="mb-1">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                  <Network size={10} /> Within {unitName}
                                </p>
                                <div className="space-y-1.5">
                                  {intra.map((da, idx) => {
                                    const globalIdx = derivedChainForModal.indexOf(da);
                                    const isChecked = selectedDerivedPositionIds.has(da.positionId);
                                    return (
                                      <div
                                        key={da.positionId}
                                        onClick={() => {
                                          const next = new Set(selectedDerivedPositionIds);
                                          if (next.has(da.positionId)) next.delete(da.positionId);
                                          else next.add(da.positionId);
                                          setSelectedDerivedPositionIds(next);
                                        }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 opacity-50 hover:opacity-80'}`}
                                      >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                          {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0 w-12 text-center">
                                          Step {globalIdx + 1}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${da.isVacant ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-indigo-100 text-indigo-600 border border-indigo-200'}`}>
                                          {da.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className={`text-sm font-bold truncate ${da.isVacant ? 'text-amber-700 italic' : 'text-slate-900'}`}>{da.name}</div>
                                          <div className="text-[10px] text-slate-500 truncate">{da.positionTitle}</div>
                                        </div>
                                        {da.isVacant && (
                                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                            <AlertCircle size={10} /> Vacant
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {cross.length > 0 && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 mt-3">
                                  <Layers size={10} /> Cross-Unit Escalation
                                </p>
                                <div className="space-y-1.5">
                                  {cross.map((da) => {
                                    const globalIdx = derivedChainForModal.indexOf(da);
                                    const isChecked = selectedDerivedPositionIds.has(da.positionId);
                                    return (
                                      <div
                                        key={da.positionId}
                                        onClick={() => {
                                          const next = new Set(selectedDerivedPositionIds);
                                          if (next.has(da.positionId)) next.delete(da.positionId);
                                          else next.add(da.positionId);
                                          setSelectedDerivedPositionIds(next);
                                        }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200 opacity-50 hover:opacity-80'}`}
                                      >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                          {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0 w-12 text-center">
                                          Step {globalIdx + 1}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${da.isVacant ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                          {da.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className={`text-sm font-bold truncate ${da.isVacant ? 'text-amber-700 italic' : 'text-slate-900'}`}>{da.name}</div>
                                          <div className="text-[10px] text-slate-500 truncate">{da.positionTitle}
                                            <span className="text-slate-300 mx-1">·</span>{da.orgUnitName}
                                          </div>
                                        </div>
                                        {da.isVacant && (
                                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                                            <AlertCircle size={10} /> Vacant
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* ── All Employees Tab (or non-approver modes) ── */}
              {(modalMode !== 'approver' || modalInnerTab === 'all') && (
                <>
                  <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name or role..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        autoFocus
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">
                    {filteredEmployeesForModal.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {filteredEmployeesForModal.map(emp => {
                          const isSelected = selectedEmployeeIds.has(emp.id);
                          return (
                            <div
                              key={emp.id}
                              onClick={() => toggleEmployeeSelection(emp.id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${isSelected ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'}`}
                            >
                              {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600 -mr-4 -mt-4 rotate-45 transform"></div>}
                              {isSelected && <Check size={10} className="absolute top-1 right-1 text-white" />}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected ? 'bg-white text-indigo-600 border-2 border-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                                {emp.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{emp.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                                <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                          <Search className="text-slate-400" size={24} />
                        </div>
                        <p className="text-slate-500 font-medium">No employees found matching filters.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-white gap-3">
            <div className="text-xs text-slate-400 font-medium">
              {modalMode === 'approver' && (
                <>
                  {selectedDerivedPositionIds.size > 0 && (
                    <span className="text-indigo-600 font-bold">{selectedDerivedPositionIds.size} from hierarchy</span>
                  )}
                  {selectedDerivedPositionIds.size > 0 && selectedEmployeeIds.size > 0 && <span className="mx-2 text-slate-300">+</span>}
                  {selectedEmployeeIds.size > 0 && (
                    <span className="text-slate-600 font-bold">{selectedEmployeeIds.size} additional</span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEmployeeModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                disabled={
                  modalMode === 'approver'
                    ? selectedDerivedPositionIds.size === 0 && selectedEmployeeIds.size === 0
                    : selectedEmployeeIds.size === 0
                }
              >
                {modalMode === 'approver' ? `Add ${selectedDerivedPositionIds.size + selectedEmployeeIds.size} Step(s)` : modalMode === 'delegate' ? 'Assign Delegate' : modalMode === 'co-approver' ? 'Add Co-Approver' : 'Add Member(s)'}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalSetupPage;
