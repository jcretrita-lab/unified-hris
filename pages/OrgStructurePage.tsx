import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  OrgUnit,
  Position,
  SalaryGrade,
  Rank,
  Employee,
  OrgUnitType,
} from "../types";

import {
  Plus,
  FolderPlus,
  UserPlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Briefcase,
  Building2,
  Edit2,
  List,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Shield,
  AlertCircle,
  Save,
  Banknote,
  Users,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Layout,
} from "lucide-react";
import Modal from "../components/Modal";
import * as d3 from "d3";
import { useOrganization } from "../context/OrganizationContext";
import { OrganizationStructureConfig } from "../types";
import { Settings as Cog } from "lucide-react";
import { useSystemSettings } from "../context/SystemSettingsContext";
import { RankStructureConfig } from "../types";

// --- MOCK DATA ---
const MOCK_UNIT_TYPES: OrgUnitType[] = [
  { id: 'ut0', name: 'Company', level: 1 },
  { id: 'ut1', name: 'Division', level: 2 },
  { id: 'ut2', name: 'Department', level: 3 },
  { id: 'ut3', name: 'Team', level: 4 },
];

const MOCK_ORG_UNITS: OrgUnit[] = [
  {
    id: 'root',
    name: 'Nexus Corp',
    type: 'Company',
    headPositionId: 'p-ceo',
    children: [
      {
        id: 'div-1',
        name: 'Engineering',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-cto',
        children: [
          {
            id: 'dept-1',
            name: 'Platform Engineering',
            type: 'Department',
            parentId: 'div-1',
            headPositionId: 'p-plat-lead',
            children: [
              { id: 'team-1', name: 'Backend Team', type: 'Team', parentId: 'dept-1', headPositionId: 'p-be-lead', children: [] },
              { id: 'team-2', name: 'Frontend Team', type: 'Team', parentId: 'dept-1', headPositionId: 'p-fe-lead', children: [] },
            ],
          },
          { id: 'dept-2', name: 'Mobile Development', type: 'Department', parentId: 'div-1', headPositionId: 'p-mob-lead', children: [] },
          { id: 'dept-3', name: 'DevOps & Infrastructure', type: 'Department', parentId: 'div-1', headPositionId: 'p-devops-lead', children: [] },
          { id: 'dept-4', name: 'QA & Testing', type: 'Department', parentId: 'div-1', headPositionId: 'p-qa-lead', children: [] },
        ],
      },
      {
        id: 'div-2',
        name: 'Human Resources',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-chro',
        children: [
          { id: 'dept-5', name: 'Talent Acquisition', type: 'Department', parentId: 'div-2', headPositionId: 'p-ta-mgr', children: [] },
          { id: 'dept-6', name: 'Compensation & Benefits', type: 'Department', parentId: 'div-2', headPositionId: 'p-cb-mgr', children: [] },
          { id: 'dept-7', name: 'Employee Relations', type: 'Department', parentId: 'div-2', headPositionId: 'p-er-mgr', children: [] },
        ],
      },
      {
        id: 'div-3',
        name: 'Finance & Accounting',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-cfo',
        children: [
          { id: 'dept-8', name: 'Accounting', type: 'Department', parentId: 'div-3', headPositionId: 'p-acct-mgr', children: [] },
          { id: 'dept-9', name: 'Payroll', type: 'Department', parentId: 'div-3', headPositionId: 'p-pay-mgr', children: [] },
          { id: 'dept-10', name: 'Financial Planning', type: 'Department', parentId: 'div-3', headPositionId: 'p-fp-mgr', children: [] },
        ],
      },
      {
        id: 'div-4',
        name: 'Sales & Marketing',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-cmo',
        children: [
          { id: 'dept-11', name: 'Sales', type: 'Department', parentId: 'div-4', headPositionId: 'p-sales-mgr', children: [] },
          { id: 'dept-12', name: 'Marketing', type: 'Department', parentId: 'div-4', headPositionId: 'p-mkt-mgr', children: [] },
          { id: 'dept-13', name: 'Customer Success', type: 'Department', parentId: 'div-4', headPositionId: 'p-cs-mgr', children: [] },
        ],
      },
      {
        id: 'div-5',
        name: 'Operations',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-coo',
        children: [
          { id: 'dept-14', name: 'Supply Chain', type: 'Department', parentId: 'div-5', headPositionId: 'p-sc-mgr', children: [] },
          { id: 'dept-15', name: 'IT Support', type: 'Department', parentId: 'div-5', headPositionId: 'p-it-mgr', children: [] },
        ],
      },
      {
        id: 'div-6',
        name: 'Legal & Compliance',
        type: 'Division',
        parentId: 'root',
        headPositionId: 'p-gc',
        children: [],
      },
    ],
  },
];

const MOCK_POSITIONS: Position[] = [
  // C-Suite — SG-15 (President / CEO band)
  { id: 'p-ceo',        title: 'Chief Executive Officer',         orgUnitId: 'root',    defaultBasePay: 550000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular' },
  { id: 'p-cto',        title: 'Chief Technology Officer',        orgUnitId: 'div-1',   defaultBasePay: 480000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  { id: 'p-chro',       title: 'Chief HR Officer',                orgUnitId: 'div-2',   defaultBasePay: 450000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  { id: 'p-cfo',        title: 'Chief Financial Officer',         orgUnitId: 'div-3',   defaultBasePay: 470000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  { id: 'p-cmo',        title: 'Chief Sales & Marketing Officer', orgUnitId: 'div-4',   defaultBasePay: 450000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  { id: 'p-coo',        title: 'Chief Operating Officer',         orgUnitId: 'div-5',   defaultBasePay: 450000, salaryGradeId: 'sg-15', rankId: 'rank-15', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  // SG-13 — Senior Director / VP
  { id: 'p-gc',         title: 'General Counsel',                 orgUnitId: 'div-6',   defaultBasePay: 320000, salaryGradeId: 'sg-13', rankId: 'rank-13', employmentStatus: 'Regular', supervisorId: 'p-ceo' },
  // Engineering — Platform  (SG-12 Director manages multiple departments)
  { id: 'p-plat-lead',  title: 'Platform Engineering Manager',    orgUnitId: 'dept-1',  defaultBasePay: 255000, salaryGradeId: 'sg-12', rankId: 'rank-12', employmentStatus: 'Regular', supervisorId: 'p-cto' },
  // SG-09 Manager — team leads
  { id: 'p-be-lead',    title: 'Backend Lead',                    orgUnitId: 'team-1',  defaultBasePay: 135000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-plat-lead' },
  { id: 'p-fe-lead',    title: 'Frontend Lead',                   orgUnitId: 'team-2',  defaultBasePay: 135000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-plat-lead' },
  { id: 'p-mob-lead',   title: 'Mobile Development Lead',         orgUnitId: 'dept-2',  defaultBasePay: 138000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cto' },
  { id: 'p-devops-lead',title: 'DevOps Lead',                     orgUnitId: 'dept-3',  defaultBasePay: 138000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cto' },
  // SG-08 Team Lead — smaller QA team
  { id: 'p-qa-lead',    title: 'QA Lead',                         orgUnitId: 'dept-4',  defaultBasePay: 110000, salaryGradeId: 'sg-08', rankId: 'rank-08', employmentStatus: 'Regular', supervisorId: 'p-cto' },
  // SG-07 Senior Specialist — senior individual contributors
  { id: 'p-sr-be',      title: 'Senior Backend Engineer',         orgUnitId: 'team-1',  defaultBasePay: 80000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-be-lead' },
  { id: 'p-sr-fe',      title: 'Senior Frontend Engineer',        orgUnitId: 'team-2',  defaultBasePay: 78000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-fe-lead' },
  { id: 'p-sr-mob',     title: 'Senior Mobile Engineer',          orgUnitId: 'dept-2',  defaultBasePay: 78000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-mob-lead' },
  { id: 'p-sr-devops',  title: 'Senior DevOps Engineer',          orgUnitId: 'dept-3',  defaultBasePay: 82000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-devops-lead' },
  // SG-06 Specialist II
  { id: 'p-sr-qa',      title: 'Senior QA Engineer',              orgUnitId: 'dept-4',  defaultBasePay: 62000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-qa-lead' },
  // SG-04 Rank & File II — junior engineers
  { id: 'p-jr-be',      title: 'Junior Backend Engineer',         orgUnitId: 'team-1',  defaultBasePay: 35000,  salaryGradeId: 'sg-04', rankId: 'rank-04', employmentStatus: 'Regular', supervisorId: 'p-sr-be' },
  { id: 'p-jr-fe',      title: 'Junior Frontend Engineer',        orgUnitId: 'team-2',  defaultBasePay: 33000,  salaryGradeId: 'sg-04', rankId: 'rank-04', employmentStatus: 'Probationary', supervisorId: 'p-sr-fe' },
  { id: 'p-jr-mob',     title: 'Junior Mobile Engineer',          orgUnitId: 'dept-2',  defaultBasePay: 33000,  salaryGradeId: 'sg-04', rankId: 'rank-04', employmentStatus: 'Probationary', supervisorId: 'p-sr-mob' },
  // Human Resources — SG-09 Managers
  { id: 'p-ta-mgr',     title: 'Talent Acquisition Manager',      orgUnitId: 'dept-5',  defaultBasePay: 128000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-chro' },
  { id: 'p-cb-mgr',     title: 'Compensation & Benefits Manager', orgUnitId: 'dept-6',  defaultBasePay: 132000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-chro' },
  { id: 'p-er-mgr',     title: 'Employee Relations Manager',      orgUnitId: 'dept-7',  defaultBasePay: 128000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-chro' },
  // SG-07 Senior Specialist
  { id: 'p-sr-rec',     title: 'Senior Recruiter',                orgUnitId: 'dept-5',  defaultBasePay: 75000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-ta-mgr' },
  // SG-06 Specialist II
  { id: 'p-cb-spec',    title: 'C&B Specialist',                  orgUnitId: 'dept-6',  defaultBasePay: 60000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-cb-mgr' },
  { id: 'p-er-spec',    title: 'Employee Relations Specialist',   orgUnitId: 'dept-7',  defaultBasePay: 58000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-er-mgr' },
  // SG-04 Rank & File II
  { id: 'p-jr-rec',     title: 'Junior Recruiter',                orgUnitId: 'dept-5',  defaultBasePay: 33000,  salaryGradeId: 'sg-04', rankId: 'rank-04', employmentStatus: 'Probationary', supervisorId: 'p-sr-rec' },
  // Finance & Accounting — SG-09 Managers
  { id: 'p-acct-mgr',   title: 'Accounting Manager',              orgUnitId: 'dept-8',  defaultBasePay: 130000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cfo' },
  { id: 'p-pay-mgr',    title: 'Payroll Manager',                 orgUnitId: 'dept-9',  defaultBasePay: 130000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cfo' },
  { id: 'p-fp-mgr',     title: 'Financial Planning Manager',      orgUnitId: 'dept-10', defaultBasePay: 135000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cfo' },
  // SG-07 Senior Specialist
  { id: 'p-sr-acct',    title: 'Senior Accountant',               orgUnitId: 'dept-8',  defaultBasePay: 72000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-acct-mgr' },
  { id: 'p-fp-analyst', title: 'Financial Analyst',               orgUnitId: 'dept-10', defaultBasePay: 72000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-fp-mgr' },
  // SG-06 Specialist II
  { id: 'p-pay-spec',   title: 'Payroll Specialist',              orgUnitId: 'dept-9',  defaultBasePay: 58000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-pay-mgr' },
  // SG-04 Rank & File II
  { id: 'p-jr-acct',    title: 'Junior Accountant',               orgUnitId: 'dept-8',  defaultBasePay: 33000,  salaryGradeId: 'sg-04', rankId: 'rank-04', employmentStatus: 'Regular', supervisorId: 'p-sr-acct' },
  // Sales & Marketing — SG-09 Managers
  { id: 'p-sales-mgr',  title: 'Sales Manager',                   orgUnitId: 'dept-11', defaultBasePay: 132000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cmo' },
  { id: 'p-mkt-mgr',    title: 'Marketing Manager',               orgUnitId: 'dept-12', defaultBasePay: 128000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cmo' },
  { id: 'p-cs-mgr',     title: 'Customer Success Manager',        orgUnitId: 'dept-13', defaultBasePay: 128000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-cmo' },
  // SG-07 Senior Specialist
  { id: 'p-sr-sales',   title: 'Senior Sales Executive',          orgUnitId: 'dept-11', defaultBasePay: 75000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-sales-mgr' },
  { id: 'p-sr-mkt',     title: 'Senior Marketing Specialist',     orgUnitId: 'dept-12', defaultBasePay: 72000,  salaryGradeId: 'sg-07', rankId: 'rank-07', employmentStatus: 'Regular', supervisorId: 'p-mkt-mgr' },
  // SG-06 Specialist II
  { id: 'p-cs-spec',    title: 'Customer Success Specialist',     orgUnitId: 'dept-13', defaultBasePay: 58000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-cs-mgr' },
  // SG-05 Specialist I — sales reps (incentive-based)
  { id: 'p-sales-rep',  title: 'Sales Representative',            orgUnitId: 'dept-11', defaultBasePay: 45000,  salaryGradeId: 'sg-05', rankId: 'rank-05', employmentStatus: 'Regular', supervisorId: 'p-sr-sales' },
  // Operations — SG-09 Manager / SG-08 Team Lead
  { id: 'p-sc-mgr',     title: 'Supply Chain Manager',            orgUnitId: 'dept-14', defaultBasePay: 128000, salaryGradeId: 'sg-09', rankId: 'rank-09', employmentStatus: 'Regular', supervisorId: 'p-coo' },
  { id: 'p-it-mgr',     title: 'IT Support Manager',              orgUnitId: 'dept-15', defaultBasePay: 112000, salaryGradeId: 'sg-08', rankId: 'rank-08', employmentStatus: 'Regular', supervisorId: 'p-coo' },
  // SG-06 Specialist II
  { id: 'p-sc-analyst', title: 'Supply Chain Analyst',            orgUnitId: 'dept-14', defaultBasePay: 58000,  salaryGradeId: 'sg-06', rankId: 'rank-06', employmentStatus: 'Regular', supervisorId: 'p-sc-mgr' },
  // SG-05 Specialist I
  { id: 'p-it-spec',    title: 'IT Support Specialist',           orgUnitId: 'dept-15', defaultBasePay: 48000,  salaryGradeId: 'sg-05', rankId: 'rank-05', employmentStatus: 'Regular', supervisorId: 'p-it-mgr' },
  // Legal & Compliance — SG-11 Associate Director / SG-05 Specialist I
  { id: 'p-sr-legal',   title: 'Senior Legal Counsel',            orgUnitId: 'div-6',   defaultBasePay: 210000, salaryGradeId: 'sg-11', rankId: 'rank-11', employmentStatus: 'Regular', supervisorId: 'p-gc' },
  { id: 'p-legal-asst', title: 'Legal Assistant',                 orgUnitId: 'div-6',   defaultBasePay: 42000,  salaryGradeId: 'sg-05', rankId: 'rank-05', employmentStatus: 'Regular', supervisorId: 'p-sr-legal' },
];

const MOCK_GRADES: SalaryGrade[] = [
  { id: 'sg-01', code: 'SG-01', name: 'Entry Level I',          amount: 18000,  minSalary: 15000,  maxSalary: 21000  },
  { id: 'sg-02', code: 'SG-02', name: 'Entry Level II',         amount: 22000,  minSalary: 21000,  maxSalary: 26000  },
  { id: 'sg-03', code: 'SG-03', name: 'Junior Associate',       amount: 28000,  minSalary: 26000,  maxSalary: 33000  },
  { id: 'sg-04', code: 'SG-04', name: 'Associate',              amount: 35000,  minSalary: 33000,  maxSalary: 42000  },
  { id: 'sg-05', code: 'SG-05', name: 'Senior Associate',       amount: 48000,  minSalary: 42000,  maxSalary: 57000  },
  { id: 'sg-06', code: 'SG-06', name: 'Specialist I',           amount: 63000,  minSalary: 57000,  maxSalary: 72000  },
  { id: 'sg-07', code: 'SG-07', name: 'Specialist II',          amount: 80000,  minSalary: 72000,  maxSalary: 95000  },
  { id: 'sg-08', code: 'SG-08', name: 'Senior Specialist',      amount: 100000, minSalary: 95000,  maxSalary: 120000 },
  { id: 'sg-09', code: 'SG-09', name: 'Lead / Principal',       amount: 135000, minSalary: 120000, maxSalary: 155000 },
  { id: 'sg-10', code: 'SG-10', name: 'Manager I',              amount: 170000, minSalary: 155000, maxSalary: 195000 },
  { id: 'sg-11', code: 'SG-11', name: 'Manager II / Sr Manager',amount: 210000, minSalary: 195000, maxSalary: 240000 },
  { id: 'sg-12', code: 'SG-12', name: 'Director',               amount: 260000, minSalary: 240000, maxSalary: 300000 },
  { id: 'sg-13', code: 'SG-13', name: 'Senior Director',        amount: 330000, minSalary: 300000, maxSalary: 380000 },
  { id: 'sg-14', code: 'SG-14', name: 'Vice President',         amount: 420000, minSalary: 380000, maxSalary: 490000 },
  { id: 'sg-15', code: 'SG-15', name: 'C-Level / Executive',    amount: 570000, minSalary: 490000, maxSalary: 750000 },
];

const MOCK_RANKS: Rank[] = [
  { id: 'rank-01', name: 'Entry Level I',           level: 1,  salaryGradeId: 'sg-01' },
  { id: 'rank-02', name: 'Entry Level II',          level: 2,  salaryGradeId: 'sg-02' },
  { id: 'rank-03', name: 'Junior Associate',        level: 3,  salaryGradeId: 'sg-03' },
  { id: 'rank-04', name: 'Associate',               level: 4,  salaryGradeId: 'sg-04' },
  { id: 'rank-05', name: 'Senior Associate',        level: 5,  salaryGradeId: 'sg-05' },
  { id: 'rank-06', name: 'Specialist I',            level: 6,  salaryGradeId: 'sg-06' },
  { id: 'rank-07', name: 'Specialist II',           level: 7,  salaryGradeId: 'sg-07' },
  { id: 'rank-08', name: 'Senior Specialist',       level: 8,  salaryGradeId: 'sg-08' },
  { id: 'rank-09', name: 'Lead / Principal',        level: 9,  salaryGradeId: 'sg-09' },
  { id: 'rank-10', name: 'Manager I',               level: 10, salaryGradeId: 'sg-10' },
  { id: 'rank-11', name: 'Manager II / Sr Manager', level: 11, salaryGradeId: 'sg-11' },
  { id: 'rank-12', name: 'Director',                level: 12, salaryGradeId: 'sg-12' },
  { id: 'rank-13', name: 'Senior Director',         level: 13, salaryGradeId: 'sg-13' },
  { id: 'rank-14', name: 'Vice President',          level: 14, salaryGradeId: 'sg-14' },
  { id: 'rank-15', name: 'C-Level / Executive',     level: 15, salaryGradeId: 'sg-15' },
];

// Helper
const getEmployeePay = (employee: Employee | undefined, position: Position, grades: SalaryGrade[]) => {
  return position.defaultBasePay;
};

const SensitiveValue = ({ showAll, value }: { showAll: boolean, value: number }) => {
  if (showAll) return <span>₱{(value / 1000).toFixed(1)}k</span>;
  return <span className="blur-[4px] select-none text-slate-300">XXXXXX</span>;
};

const OrgStructurePage: React.FC = () => {
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>(MOCK_ORG_UNITS);
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [unitTypes, setUnitTypes] = useState<OrgUnitType[]>(MOCK_UNIT_TYPES);
  const [grades] = useState<SalaryGrade[]>(MOCK_GRADES);
  const [ranks] = useState<Rank[]>(MOCK_RANKS);
  // Using empty employees list for structure setup page to simulate vacancies
  const [employees] = useState<Employee[]>([]);
  const { orgLabels, updateOrgLabels } = useOrganization();
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);

  const { rankConfig } = useSystemSettings();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Structure</h1>
          <p className="text-slate-500 font-medium mt-1">
            Design the company hierarchy, departments, and position map.
          </p>
        </div>
      </div>

      <OrgStructure
        orgUnits={orgUnits}
        setOrgUnits={setOrgUnits}
        positions={positions}
        setPositions={setPositions}
        grades={grades}
        ranks={ranks}
        employees={employees}
        unitTypes={unitTypes}
        setUnitTypes={setUnitTypes}
        rankConfig={rankConfig}
      />
      {isLabelsModalOpen && (
        <OrgLabelsModal
          initialLabels={orgLabels}
          onClose={() => setIsLabelsModalOpen(false)}
          onSave={updateOrgLabels}
        />
      )}
    </div>
  );
};

interface Props {
  orgUnits: OrgUnit[];
  setOrgUnits: (units: OrgUnit[]) => void;
  positions: Position[];
  setPositions: (pos: Position[]) => void;
  grades: SalaryGrade[];
  ranks: Rank[];
  employees: Employee[];
  unitTypes: OrgUnitType[];
  setUnitTypes: (types: OrgUnitType[]) => void;
  rankConfig: RankStructureConfig;
}

interface UnitStats {
  totalBudget: number;
  headcount: number;
  totalPositions: number;
  vacancies: number;
}

const OrgStructure: React.FC<Props> = ({
  orgUnits,
  setOrgUnits,
  positions,
  setPositions,
  grades,
  ranks,
  employees,
  unitTypes,
  setUnitTypes,
  rankConfig,
}) => {
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root', 'div-1']));
  const [modalMode, setModalMode] = useState<
    | "create-unit"
    | "edit-unit"
    | "create-pos"
    | "edit-pos"
    | "manage-types"
    | null
  >(null);
  const [targetUnitId, setTargetUnitId] = useState<string | null>(null);
  const [editingPosId, setEditingPosId] = useState<string | null>(null);
  const [unitForm, setUnitForm] = useState({ name: "", type: "" });
  const [posForm, setPosForm] = useState({
    title: "",
    gradeId: "",
    pay: 0,
    rankId: "",
    subRankId: "",
    employmentStatus: "Regular",
    supervisorId: "",
    isUnitHead: false
  });
  const [newTypeForm, setNewTypeForm] = useState({ name: "", level: 1 });
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [zoomDisplay, setZoomDisplay] = useState(1);
  const [showAllValues, setShowAllValues] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );

  const calculateStats = (unit: OrgUnit): UnitStats => {
    const unitPositions = positions.filter((p) => p.orgUnitId === unit.id);
    let localBudget = 0;
    let localHeadcount = 0;
    let localVacancies = 0;

    unitPositions.forEach((p) => {
      const employee = employees.find((e) => e.positionId === p.id);
      if (employee) {
        localBudget += getEmployeePay(employee, p, grades);
        localHeadcount++;
      } else {
        localBudget += p.defaultBasePay;
        localVacancies++;
      }
    });

    let childBudget = 0;
    let childHeadcount = 0;
    let childPositions = 0;
    let childVacancies = 0;

    unit.children.forEach((child) => {
      const stats = calculateStats(child);
      childBudget += stats.totalBudget;
      childHeadcount += stats.headcount;
      childPositions += stats.totalPositions;
      childVacancies += stats.vacancies;
    });

    return {
      totalBudget: localBudget + childBudget,
      headcount: localHeadcount + childHeadcount,
      totalPositions: unitPositions.length + childPositions,
      vacancies: localVacancies + childVacancies,
    };
  };

  const toggleExpand = (id: string, force?: boolean) => {
    const next = new Set(expanded);
    if (force === true) next.add(id);
    else if (force === false) next.delete(id);
    else {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    }
    setExpanded(next);
  };

  const findUnit = (units: OrgUnit[], id: string): OrgUnit | null => {
    for (const u of units) {
      if (u.id === id) return u;
      const found = findUnit(u.children, id);
      if (found) return found;
    }
    return null;
  };

  const getAllDescendantIds = (unit: OrgUnit): string[] => {
    let ids = [unit.id];
    unit.children.forEach((c) => {
      ids = [...ids, ...getAllDescendantIds(c)];
    });
    return ids;
  };

  const handleOpenCreateUnit = (parentId: string | null) => {
    setTargetUnitId(parentId);
    const defaultType = unitTypes.length > 0 ? unitTypes[0].name : "Department";
    setUnitForm({ name: "", type: defaultType });
    setModalMode("create-unit");
  };

  const handleOpenEditUnit = (unit: OrgUnit) => {
    setTargetUnitId(unit.id);
    setUnitForm({ name: unit.name, type: unit.type });
    setModalMode("edit-unit");
  };

  const handleOpenCreatePos = (unitId: string) => {
    setTargetUnitId(unitId);
    setEditingPosId(null);
    setPosForm({
      title: "",
      gradeId: "",
      pay: 0,
      rankId: "",
      subRankId: "",
      employmentStatus: "Regular",
      supervisorId: "",
      isUnitHead: false
    });
    setModalMode("create-pos");
  };

  const handleOpenEditPos = (pos: Position) => {
    setTargetUnitId(pos.orgUnitId);
    setEditingPosId(pos.id);
    const unit = findUnit(orgUnits, pos.orgUnitId);
    setPosForm({
      title: pos.title,
      gradeId: pos.salaryGradeId || "",
      pay: pos.defaultBasePay,
      rankId: pos.rankId || "",
      subRankId: pos.subRankId || "",
      employmentStatus: pos.employmentStatus || "Regular",
      supervisorId: pos.supervisorId || "",
      isUnitHead: unit?.headPositionId === pos.id
    });
    setModalMode("edit-pos");
  };

  const handleRankSelect = (rankId: string) => {
    const rank = ranks.find((r) => r.id === rankId);
    if (!rank) return;
    let gradeId = rank.salaryGradeId;
    let title = rank.name;
    if (rank.subRanks && rank.subRanks.length > 0) {
      setPosForm({
        ...posForm,
        rankId: rank.id,
        subRankId: "",
        gradeId: "",
        title: title + " ...",
        pay: 0,
      });
      return;
    }
    const grade = grades.find((g) => g.id === gradeId);
    setPosForm({
      ...posForm,
      rankId: rank.id,
      subRankId: "",
      gradeId: gradeId || "",
      pay: grade ? (grade.minSalary || 0) : 0,
      title: title,
    });
  };

  const handleSubRankSelect = (subRankId: string) => {
    const rank = ranks.find((r) => r.id === posForm.rankId);
    if (!rank || !rank.subRanks) return;
    const subRank = rank.subRanks.find((s) => s.id === subRankId);
    if (!subRank) return;
    const grade = grades.find((g) => g.id === subRank.salaryGradeId);
    setPosForm({
      ...posForm,
      subRankId: subRankId,
      gradeId: subRank.salaryGradeId,
      pay: grade ? (grade.minSalary || 0) : 0,
      title: `${rank.name} ${subRank.name}`,
    });
  };

  const handleGradeChange = (gradeId: string) => {
    const grade = grades.find((g) => g.id === gradeId);
    setPosForm({
      ...posForm,
      gradeId: gradeId,
      pay: grade ? (grade.minSalary || 0) : 0,
    });
  };

  const handleDeleteUnit = (unitId: string) => {
    if (
      !window.confirm(
        "Delete this unit and all its sub-units? Positions will also be removed."
      )
    )
      return;
    const unitToDelete = findUnit(orgUnits, unitId);
    if (!unitToDelete) return;
    const idsToRemove = getAllDescendantIds(unitToDelete);
    setPositions(positions.filter((p) => !idsToRemove.includes(p.orgUnitId)));
    const deleteRecursive = (units: OrgUnit[]): OrgUnit[] => {
      return units
        .filter((u) => u.id !== unitId)
        .map((u) => ({ ...u, children: deleteRecursive(u.children) }));
    };
    setOrgUnits(deleteRecursive(orgUnits));
  };

  const handleSubmitUnit = () => {
    if (!unitForm.name) return;
    if (modalMode === "edit-unit" && targetUnitId) {
      const updateRecursive = (units: OrgUnit[]): OrgUnit[] => {
        return units.map((u) => {
          if (u.id === targetUnitId)
            return { ...u, name: unitForm.name, type: unitForm.type };
          return { ...u, children: updateRecursive(u.children) };
        });
      };
      setOrgUnits(updateRecursive(orgUnits));
    } else {
      const newUnit: OrgUnit = {
        id: Math.random().toString(36).substr(2, 9),
        name: unitForm.name,
        type: unitForm.type,
        parentId: targetUnitId,
        children: [],
      };
      if (!targetUnitId) {
        setOrgUnits([...orgUnits, newUnit]);
      } else {
        const addRecursive = (units: OrgUnit[]): OrgUnit[] => {
          return units.map((u) => {
            if (u.id === targetUnitId)
              return { ...u, children: [...u.children, newUnit] };
            return { ...u, children: addRecursive(u.children) };
          });
        };
        setOrgUnits(addRecursive(orgUnits));
        toggleExpand(targetUnitId, true);
      }
    }
    closeModal();
  };

  const updateUnitHeadRecursive = (units: OrgUnit[], unitId: string, headPositionId: string | undefined): OrgUnit[] => {
    return units.map(u => {
      if (u.id === unitId) return { ...u, headPositionId };
      return { ...u, children: updateUnitHeadRecursive(u.children, unitId, headPositionId) };
    });
  };

  const handleSubmitPos = () => {
    if (!targetUnitId || !posForm.title || !posForm.gradeId) return;
    const posData: Position = {
      id:
        modalMode === "edit-pos" && editingPosId
          ? editingPosId
          : Math.random().toString(36).substr(2, 9),
      title: posForm.title,
      orgUnitId: targetUnitId,
      salaryGradeId: posForm.gradeId,
      rankId: posForm.rankId || undefined,
      subRankId: posForm.subRankId || undefined,
      defaultBasePay: Number(posForm.pay),
      employmentStatus: posForm.employmentStatus,
      supervisorId: posForm.supervisorId || undefined
    };
    if (modalMode === "edit-pos") {
      setPositions(positions.map((p) => (p.id === editingPosId ? posData : p)));
    } else {
      setPositions([...positions, posData]);
      toggleExpand(targetUnitId, true);
    }
    // Handle unit head designation
    const unit = findUnit(orgUnits, targetUnitId);
    if (posForm.isUnitHead) {
      setOrgUnits(updateUnitHeadRecursive(orgUnits, targetUnitId, posData.id));
    } else if (unit?.headPositionId === posData.id) {
      // Unchecked and was previously head — clear it
      setOrgUnits(updateUnitHeadRecursive(orgUnits, targetUnitId, undefined));
    }
    closeModal();
  };

  const handleSaveUnitType = () => {
    if (!newTypeForm.name) return;
    if (editingTypeId) {
      const updated = unitTypes
        .map((t) =>
          t.id === editingTypeId
            ? { ...t, name: newTypeForm.name, level: Number(newTypeForm.level) }
            : t
        )
        .sort((a, b) => a.level - b.level);
      setUnitTypes(updated);
      setEditingTypeId(null);
    } else {
      const newType: OrgUnitType = {
        id: Math.random().toString(36).substr(2, 9),
        name: newTypeForm.name,
        level: Number(newTypeForm.level),
      };
      const updated = [...unitTypes, newType].sort((a, b) => a.level - b.level);
      setUnitTypes(updated);
    }
    setNewTypeForm({ name: "", level: 1 });
  };

  const handleEditUnitType = (t: OrgUnitType) => {
    setNewTypeForm({ name: t.name, level: t.level });
    setEditingTypeId(t.id);
  };

  const handleDeleteUnitType = (id: string) => {
    if (confirm("Delete this unit type?")) {
      setUnitTypes(unitTypes.filter((t) => t.id !== id));
      if (editingTypeId === id) {
        setEditingTypeId(null);
        setNewTypeForm({ name: "", level: 1 });
      }
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setTargetUnitId(null);
    setEditingPosId(null);
  };

  const hierarchyData = useMemo(() => {
    if (orgUnits.length === 0) return null;
    if (orgUnits.length === 1) return orgUnits[0];
    return {
      id: "root",
      name: "Organization",
      type: "Root",
      children: orgUnits,
      parentId: null,
    } as unknown as OrgUnit;
  }, [orgUnits]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current)
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 1.2);
  };
  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current)
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 0.8);
  };
  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current && wrapperRef.current) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(
          zoomBehaviorRef.current.transform,
          d3.zoomIdentity.translate(width / 2, 50).scale(0.8)
        );
    }
  };

  useEffect(() => {
    if (
      viewMode === "chart" &&
      hierarchyData &&
      svgRef.current &&
      wrapperRef.current
    ) {
      const wrapper = wrapperRef.current;
      const { width } = wrapper.getBoundingClientRect();
      const root = d3.hierarchy(hierarchyData);
      const nodeWidth = 260;
      const treeLayout = d3.tree<OrgUnit>().nodeSize([nodeWidth + 40, 180]);
      treeLayout(root);
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      const g = svg.append("g");
      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 2.5])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
          setZoomDisplay(event.transform.k);
        });
      zoomBehaviorRef.current = zoom;
      svg.call(zoom).on("dblclick.zoom", null);
      svg.call(
        zoom.transform,
        d3.zoomIdentity.translate(width / 2, 50).scale(0.8)
      );

      g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .linkVertical()
            .x((d) => (d as any).x)
            .y((d) => (d as any).y) as any
        );

      const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => {
          const saved = nodePositionsRef.current.get((d.data as OrgUnit).id);
          return saved
            ? `translate(${saved.x},${saved.y})`
            : `translate(${(d as any).x},${(d as any).y})`;
        });

      node.call(
        d3
          .drag<SVGGElement, d3.HierarchyNode<OrgUnit>>()
          .on("start", (e) => e.sourceEvent.stopPropagation())
          .on("drag", function (event, d) {
            const unitId = (d.data as OrgUnit).id;
            const newX = event.x;
            const newY = event.y;
            nodePositionsRef.current.set(unitId, { x: newX, y: newY });
            d3.select(this).attr("transform", `translate(${newX},${newY})`);
            g.selectAll("path.link").attr("d", (linkData: any) => {
              const source = linkData.source;
              const target = linkData.target;
              const sourcePos = nodePositionsRef.current.get(
                (source.data as OrgUnit).id
              ) || { x: source.x, y: source.y };
              const targetPos = nodePositionsRef.current.get(
                (target.data as OrgUnit).id
              ) || { x: target.x, y: target.y };
              return d3.linkVertical()({
                source: [sourcePos.x, sourcePos.y],
                target: [targetPos.x, targetPos.y],
              } as any);
            });
          })
      );

      node
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", (d) => {
          const posCount = positions.filter(
            (p) => p.orgUnitId === (d.data as OrgUnit).id
          ).length;
          return Math.max(100, 80 + posCount * 28);
        })
        .attr("x", -nodeWidth / 2)
        .attr("y", 0)
        .attr("rx", 8)
        .attr("fill", "white")
        .attr("stroke", (d) =>
          (d.data as OrgUnit).id === targetUnitId ? "#2563eb" : "#e2e8f0"
        )
        .attr("stroke-width", (d) =>
          (d.data as OrgUnit).id === targetUnitId ? 2 : 1
        )
        .attr(
          "class",
          "shadow-sm cursor-pointer hover:stroke-blue-400 transition-colors"
        );
      node
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", 36)
        .attr("x", -nodeWidth / 2)
        .attr("y", 0)
        .attr("rx", 8)
        .attr("fill", (d) => (d.depth === 0 ? "#1e293b" : "#f1f5f9"));
      node
        .append("rect")
        .attr("width", nodeWidth)
        .attr("height", 10)
        .attr("x", -nodeWidth / 2)
        .attr("y", 26)
        .attr("fill", (d) => (d.depth === 0 ? "#1e293b" : "#f1f5f9"));
      node
        .append("text")
        .attr("dy", 22)
        .attr("text-anchor", "middle")
        .text((d) => (d.data as OrgUnit).name)
        .attr("fill", (d) => (d.depth === 0 ? "white" : "#0f172a"))
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .each(function (d) {
          const self = d3.select(this);
          const textLength = self.node()?.getComputedTextLength() || 0;
          if (textLength > nodeWidth - 20) {
            self.text((d.data as OrgUnit).name.substring(0, 30) + "...");
          }
        });

      const fo = node
        .append("foreignObject")
        .attr("width", nodeWidth)
        .attr("height", (d) => {
          const posCount = positions.filter(
            (p) => p.orgUnitId === (d.data as OrgUnit).id
          ).length;
          return Math.max(100, 80 + posCount * 28);
        })
        .attr("x", -nodeWidth / 2)
        .attr("y", 36);

      fo.append("xhtml:div")
        .style("height", "100%")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .html((d) => {
          const unitId = (d.data as OrgUnit).id;
          if (unitId === "root") return "";
          const stats = calculateStats(d.data as OrgUnit);
          const unitPos = positions.filter((p) => p.orgUnitId === unitId);
          const budgetId = `budget-val-${unitId}`;
          const budgetValue = showAllValues
            ? `₱${(stats.totalBudget / 1000).toFixed(1)}k`
            : "••••••";
          const iconSvg = showAllValues
            ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
            : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

          const footerHtml = `
                    <div class="absolute bottom-0 w-full flex border-t border-slate-100 divide-x divide-slate-100 bg-slate-50 rounded-b-lg overflow-hidden">
                        <div class="flex-1 py-1.5 flex flex-col items-center justify-center">
                            <span class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Budget</span>
                            <div class="flex items-center gap-1 cursor-default">
                                <span id="${budgetId}" class="text-[10px] font-mono font-bold ${showAllValues ? "text-slate-700" : "text-slate-400"
            }" data-value="${budgetValue}">${budgetValue}</span>
                                ${iconSvg}
                            </div>
                        </div>
                         <div class="flex-1 py-1.5 flex flex-col items-center justify-center">
                            <span class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Headcount</span>
                            <span class="text-[10px] font-mono font-bold ${stats.vacancies > 0
              ? "text-orange-600"
              : "text-slate-700"
            }">
                                ${stats.headcount} / ${stats.totalPositions}
                            </span>
                        </div>
                    </div>
                 `;

          const posHtml =
            unitPos.length > 0
              ? `<div class="text-[10px] text-slate-500 w-full px-2 mt-2 flex flex-col gap-1 pb-10">
                        ${unitPos
                .map((p) => {
                  const rank = ranks.find((r) => r.id === p.rankId);
                  const subRank = rank?.subRanks?.find(
                    (s) => s.id === p.subRankId
                  );
                  const emp = employees.find(
                    (e) => e.positionId === p.id
                  );
                  let expectedGradeId = rank?.salaryGradeId;
                  if (subRank)
                    expectedGradeId = subRank.salaryGradeId;
                  const isGradeOverride =
                    expectedGradeId &&
                    expectedGradeId !== p.salaryGradeId;
                  const isVacant = !emp;
                  const rankBadge = rank
                    ? `<span class="bg-slate-200 text-slate-600 px-1 rounded mx-1">${rank.level
                    }${subRank ? `.${subRank.name}` : ""}</span>`
                    : "";
                  const overrideBadge = isGradeOverride
                    ? `<span class="text-[8px] uppercase font-bold text-orange-600 bg-orange-50 px-1 rounded ml-1 border border-orange-100">Ovrd</span>`
                    : "";
                  const salaryDisplay = showAllValues
                    ? `₱${p.defaultBasePay.toLocaleString()}`
                    : "••••••";
                  const rowClass = isVacant
                    ? "border-dashed border-slate-300 bg-slate-50 text-slate-400"
                    : "bg-white border-transparent hover:border-blue-200 text-slate-700 shadow-sm";
                  const icon = isVacant
                    ? `<svg class="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
                    : `<svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
                  return `<div id="pos-row-${p.id
                    }" class="truncate flex justify-between items-center p-1 rounded cursor-pointer border transition-all group-pos ${rowClass}">
                                      <div class="flex items-center overflow-hidden"><div class="mr-1 shrink-0">${icon}</div>${rankBadge}<span class="truncate ${isVacant ? "italic" : ""
                    }" title="${p.title} ${isVacant ? "(Vacant)" : ""
                    }">${p.title}</span></div>
                                      <div class="flex items-center shrink-0 font-mono text-xs ${showAllValues
                      ? "text-slate-600"
                      : "text-slate-400"
                    }">${salaryDisplay}${overrideBadge}${isVacant
                      ? '<span class="text-[8px] bg-red-50 text-red-500 px-1 rounded ml-1 border border-red-100">VACANT</span>'
                      : ""
                    }</div>
                                    </div>`;
                })
                .join("")}
                       </div>`
              : '<div class="text-[10px] text-slate-300 italic mt-4">No positions</div>';

          return `
                    <div class="w-full h-full relative flex flex-col">
                        ${posHtml}
                        ${footerHtml}
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 justify-center opacity-0 hover:opacity-100 transition-opacity" id="controls-${unitId}">
                           <button id="add-child-${unitId}" class="p-1.5 bg-blue-600 text-white rounded shadow-lg hover:scale-110 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg></button>
                           <button id="add-pos-${unitId}" class="p-1.5 bg-green-600 text-white rounded shadow-lg hover:scale-110 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg></button>
                           <button id="edit-${unitId}" class="p-1.5 bg-orange-500 text-white rounded shadow-lg hover:scale-110 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                           <button id="delete-${unitId}" class="p-1.5 bg-red-600 text-white rounded shadow-lg hover:scale-110 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
                        </div>
                    </div>
                 `;
        });

      node
        .on("mouseenter", function () {
          d3.select(this).select("[id^='controls-']").style("opacity", 1);
        })
        .on("mouseleave", function () {
          d3.select(this).select("[id^='controls-']").style("opacity", 0);
        });

      setTimeout(() => {
        root.descendants().forEach((d) => {
          const u = d.data as OrgUnit;
          if (u.id === "root") return;
          const btnAddChild = document.getElementById(`add-child-${u.id}`);
          const btnAddPos = document.getElementById(`add-pos-${u.id}`);
          const btnEdit = document.getElementById(`edit-${u.id}`);
          const btnDelete = document.getElementById(`delete-${u.id}`);

          const unitPositions = positions.filter((p) => p.orgUnitId === u.id);
          unitPositions.forEach((p) => {
            const posRow = document.getElementById(`pos-row-${p.id}`);
            if (posRow) {
              posRow.onmousedown = (e) => e.stopPropagation();
              posRow.onclick = (e) => {
                e.stopPropagation();
                handleOpenEditPos(p);
              };
            }
          });

          const stop = (e: MouseEvent) => e.stopPropagation();
          if (btnAddChild) {
            btnAddChild.onmousedown = stop;
            btnAddChild.onclick = (e) => {
              e.stopPropagation();
              handleOpenCreateUnit(u.id);
            };
          }
          if (btnAddPos) {
            btnAddPos.onmousedown = stop;
            btnAddPos.onclick = (e) => {
              e.stopPropagation();
              handleOpenCreatePos(u.id);
            };
          }
          if (btnEdit) {
            btnEdit.onmousedown = stop;
            btnEdit.onclick = (e) => {
              e.stopPropagation();
              handleOpenEditUnit(u);
            };
          }
          if (btnDelete) {
            btnDelete.onmousedown = stop;
            btnDelete.onclick = (e) => {
              e.stopPropagation();
              handleDeleteUnit(u.id);
            };
          }
        });
      }, 100);
    }
  }, [
    orgUnits,
    positions,
    viewMode,
    hierarchyData,
    grades,
    ranks,
    employees,
    unitTypes,
    showAllValues,
  ]);

  const renderUnitList = (unit: OrgUnit, depth: number, isLast: boolean) => {
    const unitPositions = positions.filter((p) => p.orgUnitId === unit.id);
    const hasChildren = unit.children.length > 0 || unitPositions.length > 0;
    const isExp = expanded.has(unit.id);
    const stats = calculateStats(unit);

    return (
      <div key={unit.id} className="relative select-none">
        {/* Tree lines - vertical line for child connections */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"
            style={{ left: `${depth * 20 - 10}px` }}
          />
        )}

        {/* Tree lines - horizontal connector to parent */}
        {depth > 0 && (
          <div
            className="absolute top-6 w-3 h-px bg-slate-200"
            style={{ left: `${depth * 20 - 10}px` }}
          />
        )}

        <div
          className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 group ${depth === 0
            ? "bg-slate-900 text-slate-300 border-slate-900 mb-2 shadow-md ml-0"
            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm mb-1 ml-6"
            }`}
          style={{
            marginLeft: depth === 0 ? 0 : `${depth * 20}px`,
            position: "relative",
          }}
        >
          {/* Expand/collapse button with tree lines */}
          <div className="relative">
            <button
              onClick={() => toggleExpand(unit.id)}
              className={`p-1 rounded transition-colors relative z-10 ${depth === 0
                ? "hover:bg-slate-700 text-slate-300"
                : "hover:bg-slate-100 text-slate-400"
                }`}
              disabled={!hasChildren}
            >
              {hasChildren ? (
                isExp ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )
              ) : (
                <div className="w-4" />
              )}
            </button>
            {/* Tree line connector circle */}
            {depth > 0 && (
              <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 z-0" />
            )}
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Building2
              size={18}
              className={depth === 0 ? "text-blue-400" : "text-blue-600"}
            />
            <div className="flex flex-col min-w-0">
              <span
                className={`font-semibold text-sm truncate ${depth === 0 ? "text-slate-300" : "text-slate-800"
                  }`}
              >
                {unit.name}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider ${depth === 0 ? "text-white/50" : "text-slate-500"
                  }`}
              >
                {unit.type}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 px-3">
            <div
              className={`flex items-center gap-1.5 text-xs ${depth === 0 ? "text-slate-300" : "text-slate-500"
                }`}
              title="Monthly Budget (Recursive)"
            >
              <Banknote size={14} />
              <span className="font-mono">
                <SensitiveValue
                  showAll={showAllValues}
                  value={stats.totalBudget}
                />
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs ${depth === 0 ? "text-slate-300" : "text-slate-500"
                }`}
              title="Headcount / Total Positions"
            >
              <Users size={14} />
              <span className="font-mono">
                {stats.headcount}/{stats.totalPositions}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 ${depth === 0 ? "bg-slate-800 rounded" : ""
              }`}
          >
            <button
              onClick={() => handleOpenCreateUnit(unit.id)}
              className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded text-slate-400"
              title="Add Sub-Unit"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={() => handleOpenCreatePos(unit.id)}
              className="p-1.5 hover:bg-green-50 hover:text-green-600 rounded text-slate-400"
              title="Add Position"
            >
              <Briefcase size={14} />
            </button>
            <button
              onClick={() => handleOpenEditUnit(unit)}
              className="p-1.5 hover:bg-orange-50 hover:text-orange-600 rounded text-slate-400"
              title="Edit Unit"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => handleDeleteUnit(unit.id)}
              className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400"
              title="Delete Unit"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {isExp && (
          <div className="relative">
            {/* Tree line for children container */}
            {hasChildren && (
              <div
                className="absolute w-px bg-slate-200"
                style={{
                  left: `${depth * 20 + 6}px`,
                  top: "0px",
                  height: "100%",
                }}
              />
            )}

            <div className="pt-1">
              {/* Positions */}
              {unitPositions.map((pos, posIndex) => {
                const grade = grades.find((g) => g.id === pos.salaryGradeId);
                const rank = ranks.find((r) => r.id === pos.rankId);
                const subRank = rank?.subRanks?.find(
                  (s) => s.id === pos.subRankId
                );
                const emp = employees.find((e) => e.positionId === pos.id);
                const isVacant = !emp;
                let expectedGradeId = rank?.salaryGradeId;
                if (subRank) expectedGradeId = subRank.salaryGradeId;
                const isGradeOverride =
                  expectedGradeId && expectedGradeId !== pos.salaryGradeId;
                const isLastPosition =
                  posIndex === unitPositions.length - 1 &&
                  unit.children.length === 0;

                return (
                  <div
                    key={pos.id}
                    className="relative flex items-center mb-1 group"
                    style={{ marginLeft: `${(depth + 1) * 20 + 6}px` }}
                  >
                    {/* Tree line connector */}
                    <div className="absolute -left-3 top-1/2 w-3 h-px bg-slate-300"></div>

                    {/* Connector dot */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-400"></div>

                    <div
                      className={`flex-1 flex items-center justify-between p-2 border rounded-md transition-all ml-2 ${isVacant
                        ? "bg-slate-50 border-slate-200 border-dashed"
                        : "bg-green-50/50 border-green-100 hover:border-green-300"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isVacant
                            ? "bg-slate-200 text-slate-400"
                            : "bg-green-100 text-green-600"
                            }`}
                        >
                          {rank ? rank.level : <UserPlus size={12} />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                            <span
                              className={`truncate ${isVacant ? "text-slate-400 italic" : ""
                                }`}
                            >
                              {pos.title}
                            </span>
                            {isGradeOverride && (
                              <span className="text-[9px] uppercase font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full border border-orange-200">
                                Override
                              </span>
                            )}
                            {isVacant && (
                              <span className="text-[9px] uppercase font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">
                                Vacant
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex gap-2">
                            <span className="font-mono text-green-700">
                              <SensitiveValue
                                showAll={showAllValues}
                                value={pos.defaultBasePay}
                              />
                            </span>
                            <span>•</span>
                            <span
                              className={
                                isGradeOverride
                                  ? "text-orange-600 font-bold"
                                  : ""
                              }
                            >
                              {grade?.code || "No Grade"}
                            </span>
                            {subRank && (
                              <span className="text-slate-400 ml-1">
                                ({subRank.name})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditPos(pos)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                          title="Edit Position"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setPositions(
                              positions.filter((p) => p.id !== pos.id)
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                          title="Remove Position"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Child units */}
              {unit.children.map((child, idx) =>
                renderUnitList(
                  child,
                  depth + 1,
                  idx === unit.children.length - 1
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getModalRankInfo = () => {
    const selectedRank = ranks.find((r) => r.id === posForm.rankId);
    const selectedSubRank = selectedRank?.subRanks?.find(
      (s) => s.id === posForm.subRankId
    );
    let standardGradeId = selectedRank?.salaryGradeId;
    if (selectedSubRank) standardGradeId = selectedSubRank.salaryGradeId;
    const isOverride = standardGradeId && standardGradeId !== posForm.gradeId;
    return { selectedRank, selectedSubRank, isOverride };
  };

  const { selectedRank, selectedSubRank, isOverride } = getModalRankInfo();
  const showSubRankSelect =
    selectedRank && selectedRank.subRanks && selectedRank.subRanks.length > 0;
  const selectedGrade = grades.find((g) => g.id === posForm.gradeId);
  const isFixedRate =
    selectedGrade && selectedGrade.minSalary === selectedGrade.maxSalary;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Organization Hierarchy
          </h2>
          <p className="text-sm text-slate-500">
            Construct your company hierarchy and assign ranks to departments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Updated eye toggle button with text */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden md:inline">
              {showAllValues ? "Hide Values" : "Show Values"}
            </span>
            <button
              onClick={() => setShowAllValues(!showAllValues)}
              className={`p-2 rounded-lg transition-colors ${showAllValues
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              title={
                showAllValues
                  ? "Hide all monetary values"
                  : "Show all monetary values"
              }
            >
              {showAllValues ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <List size={14} /> List
            </button>
            <button onClick={() => setViewMode("chart")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "chart" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}><Layout size={14} /> Diagram</button>
          </div>
          <div className="h-6 w-px bg-slate-300 mx-1"></div>
          <button
            onClick={() => {
              setModalMode("manage-types");
              setEditingTypeId(null);
              setNewTypeForm({ name: "", level: 1 });
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Configure Unit Types"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => handleOpenCreateUnit(null)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-lg shadow-slate-200"
          >
            <Plus size={16} /> New Root
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-hidden relative bg-slate-50/30"
        ref={wrapperRef}
      >
        {orgUnits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Building2 size={32} className="opacity-40" />
            </div>
            <p className="font-medium">No structure defined yet.</p>
            <p className="text-sm opacity-70">
              Create a root department to get started.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "list" && (
              <div className="p-6 h-full overflow-y-auto pb-20">
                {orgUnits.map((u, idx) =>
                  renderUnitList(u, 0, idx === orgUnits.length - 1)
                )}
              </div>
            )}
            {viewMode === "chart" && (
              <div className="h-full w-full relative overflow-hidden cursor-move">
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border border-slate-100">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-slate-50 rounded text-slate-600 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-slate-50 rounded text-slate-600 font-mono text-xs transition-colors"
                    title="Reset View"
                  >
                    {Math.round(zoomDisplay * 100)}%
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-slate-50 rounded text-slate-600 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <hr className="border-slate-100 my-1" />
                  <button
                    onClick={handleResetZoom}
                    className="p-2 hover:bg-slate-50 rounded text-slate-600 transition-colors"
                    title="Recenter"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <svg
                  ref={svgRef}
                  width="100%"
                  height="100%"
                  className="block touch-none"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-500 pointer-events-none flex items-center gap-2 shadow-sm">
                  <Move size={12} className="text-blue-500" />
                  <span className="font-medium">Interactive Mode</span>
                  <span className="w-px h-3 bg-slate-300 mx-1"></span>
                  <span>
                    Drag nodes to arrange • Scroll to zoom • Click positions to
                    edit
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Modal isOpen={!!modalMode} onClose={closeModal}>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-1 text-slate-900">
            {modalMode === "create-unit"
              ? "Create Unit"
              : modalMode === "edit-unit"
                ? "Edit Unit"
                : modalMode === "manage-types"
                  ? "Configure Unit Types"
                  : modalMode === "edit-pos"
                    ? "Edit Position"
                    : "Create Position"}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {modalMode?.includes("unit") && modalMode !== "manage-types"
              ? "Define a company, division, or department."
              : modalMode === "manage-types"
                ? "Define the types of organizational units available (e.g. Division, Department, Section)."
                : "Configure the specific details for this role in the department."}
          </p>
          {modalMode === "manage-types" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                  Defined Types
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...unitTypes]
                    .sort((a, b) => a.level - b.level)
                    .map((type) => (
                      <div
                        key={type.id}
                        className={`flex justify-between items-center p-2 rounded border text-sm transition-colors ${editingTypeId === type.id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-slate-200"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${editingTypeId === type.id
                              ? "bg-blue-200 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {type.level}
                          </span>
                          <span className="font-medium text-slate-800">
                            {type.name}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditUnitType(type)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-blue-100"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteUnitType(type.id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  {unitTypes.length === 0 && (
                    <p className="text-center text-slate-400 text-xs py-2">
                      No types defined.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-end pt-2 border-t border-slate-100">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    {editingTypeId ? "Edit Type Name" : "New Type Name"}
                  </label>
                  <input
                    className="w-full border p-2 rounded text-sm outline-none bg-white text-slate-900 focus:border-blue-500"
                    placeholder="e.g. Campus"
                    value={newTypeForm.name}
                    onChange={(e) =>
                      setNewTypeForm({ ...newTypeForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Level
                  </label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded text-sm outline-none bg-white text-slate-900 focus:border-blue-500 text-center"
                    value={newTypeForm.level}
                    onChange={(e) =>
                      setNewTypeForm({
                        ...newTypeForm,
                        level: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <button
                  onClick={handleSaveUnitType}
                  disabled={!newTypeForm.name}
                  className={`text-white p-2 rounded disabled:opacity-50 transition-colors ${editingTypeId
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  title={editingTypeId ? "Update Type" : "Add Type"}
                >
                  {editingTypeId ? <Save size={18} /> : <Plus size={18} />}
                </button>
              </div>
              {editingTypeId && (
                <button
                  onClick={() => {
                    setEditingTypeId(null);
                    setNewTypeForm({ name: "", level: 1 });
                  }}
                  className="w-full text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={closeModal}
                className="w-full mt-4 bg-slate-900 text-white py-2 rounded"
              >
                Done
              </button>
            </div>
          )}
          {modalMode?.includes("unit") && modalMode !== "manage-types" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Unit Name
                </label>
                <input
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  value={unitForm.name}
                  onChange={(e) =>
                    setUnitForm({ ...unitForm, name: e.target.value })
                  }
                  placeholder="e.g. Finance"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Unit Type
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  value={unitForm.type}
                  onChange={(e) =>
                    setUnitForm({ ...unitForm, type: e.target.value })
                  }
                >
                  {[...unitTypes]
                    .sort((a, b) => a.level - b.level)
                    .map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} (Level {t.level})
                      </option>
                    ))}
                </select>
              </div>
              <button
                onClick={handleSubmitUnit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium mt-2 transition-colors"
              >
                {modalMode === "edit-unit" ? "Save Changes" : "Create Unit"}
              </button>
            </div>
          )}
          {(modalMode === "create-pos" || modalMode === "edit-pos") && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg space-y-3">
                <div>
                  <label className="block text-xs font-bold text-indigo-800 uppercase mb-1 flex items-center gap-1">
                    <Shield size={12} /> {rankConfig.rankLabel}
                  </label>
                  <select
                    className="w-full border border-indigo-200 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={posForm.rankId}
                    onChange={(e) => handleRankSelect(e.target.value)}
                  >
                    <option value="">-- Choose {rankConfig.rankLabel} --</option>
                    {ranks.map((r) => (
                      <option key={r.id} value={r.id}>
                        Level {r.level}: {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                {showSubRankSelect && (
                  <div className="animate-in fade-in slide-in-from-top-1">
                    <label className="block text-xs font-bold text-indigo-800 uppercase mb-1 flex items-center gap-1">
                      {rankConfig.subRankLabel}
                    </label>
                    <select
                      className="w-full border border-indigo-200 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={posForm.subRankId}
                      onChange={(e) => handleSubRankSelect(e.target.value)}
                    >
                      <option value="">-- Choose {rankConfig.subRankLabel} --</option>
                      {selectedRank.subRanks!.map((s) => {
                        const sg = grades.find((g) => g.id === s.salaryGradeId);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name} ({sg?.code})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Position Title
                </label>
                <input
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                  value={posForm.title}
                  onChange={(e) =>
                    setPosForm({ ...posForm, title: e.target.value })
                  }
                  placeholder="e.g. Senior Analyst"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Supervisor Position <span className="text-slate-400 normal-case font-normal">(optional)</span>
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  value={posForm.supervisorId}
                  onChange={(e) => setPosForm({ ...posForm, supervisorId: e.target.value })}
                >
                  <option value="">-- No Supervisor --</option>
                  {positions
                    .filter(p => p.id !== (editingPosId || ''))
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="isUnitHead"
                  checked={posForm.isUnitHead}
                  onChange={(e) => setPosForm({ ...posForm, isUnitHead: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="isUnitHead" className="text-xs font-bold text-amber-800 cursor-pointer select-none">
                  Designate as unit head
                  <span className="block font-normal text-amber-700 mt-0.5">This position anchors the approval chain for this org unit.</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between items-center">
                  <span>Salary Grade</span>
                  {isOverride ? (
                    <span className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 animate-in fade-in">
                      <AlertCircle size={10} /> Local Override
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">
                      {posForm.subRankId
                        ? "Using Sub-Rank Default"
                        : "Using Global Default"}
                    </span>
                  )}
                </label>
                <select
                  disabled
                  className={`w-full border p-2.5 rounded-lg bg-slate-100 text-slate-500 outline-none cursor-not-allowed transition-colors ${isOverride
                    ? "border-orange-200 bg-orange-50/50"
                    : "border-slate-200"
                    }`}
                  value={posForm.gradeId}
                  onChange={(e) => handleGradeChange(e.target.value)}
                >
                  <option value="">-- Select Grade --</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} - {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Monthly Base Pay
                </label>
                <div className="flex gap-2 items-center">
                  <span className="text-slate-400 font-bold">₱</span>
                  <input
                    type="number"
                    className="w-full bg-transparent border-none p-0 text-lg font-mono font-bold text-slate-800 focus:ring-0"
                    value={posForm.pay}
                    onChange={(e) =>
                      setPosForm({ ...posForm, pay: Number(e.target.value) })
                    }
                  />
                </div>
                {posForm.gradeId && selectedGrade && (
                  <div className="mt-2 text-xs text-slate-500 flex justify-between border-t border-slate-200 pt-2">
                    {isFixedRate ? (
                      <span className="flex items-center gap-1 text-purple-600 font-bold">
                        <Lock size={10} /> Fixed Rate
                      </span>
                    ) : (
                      <span>Allowed Range:</span>
                    )}
                    <span className="font-mono">
                      {isFixedRate
                        ? `₱${selectedGrade.minSalary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `₱${selectedGrade.minSalary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ₱${selectedGrade.maxSalary?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmitPos}
                disabled={!posForm.title || !posForm.gradeId}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium mt-2 transition-colors"
              >
                {modalMode === "edit-pos"
                  ? "Update Position"
                  : "Assign Position"}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

const OrgLabelsModal = ({
  initialLabels,
  onSave,
  onClose,
}: {
  initialLabels: OrganizationStructureConfig;
  onSave: (labels: OrganizationStructureConfig) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState(initialLabels);

  const handleChange = (field: keyof OrganizationStructureConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.level1Label.trim() || !form.level2Label.trim()) {
      alert("Level 1 and Level 2 labels are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Organization Structure Labels</h2>

        <div className="space-y-3">
          {["level1Label", "level2Label", "level3Label", "level4Label", "level5Label"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.replace("Label", "").replace("level", "Level ")}
              </label>
              <input
                className="w-full border rounded px-2 py-1 text-sm"
                value={(form as any)[field] ?? ""}
                onChange={(e) => handleChange(field as keyof OrganizationStructureConfig, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 border rounded bg-gray-50 text-xs">
          <p className="font-medium mb-1">Preview:</p>
          <p>
            {form.level1Label} → {form.level2Label} → {form.level3Label} → {form.level4Label}
            {form.level5Label ? ` → ${form.level5Label}` : ""}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 text-sm border rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgStructurePage;
