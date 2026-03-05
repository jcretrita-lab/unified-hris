
import React, { useState } from 'react';
import { Formula, LookupTable, PayComponent, PayTemplate, DailyPayTemplate } from '../types';
import { MOCK_DAILY_PAY_TEMPLATES } from './pay-structure/DailyPayTemplates';
import FormulaBuilder from './pay-structure/FormulaBuilder';
import PayComponents from './pay-structure/PayComponents';
import PayTemplates from './pay-structure/PayTemplates';
import DailyPayTemplates from './pay-structure/DailyPayTemplates';

// --- MOCK INITIAL DATA ---
const INITIAL_FORMULAS: Formula[] = [
  {
    id: 'f1',
    name: 'Regular Overtime',
    description: 'Calculates OT pay at 125% of the employee\'s hourly rate (DOLE Labor Code Art. 87).',
    expression: '(base_pay / 21.75 / 8) * 1.25 * hours_ot',
    variables: ['base_pay', 'hours_ot']
  },
  {
    id: 'f2',
    name: '13th Month Pay',
    description: 'Pro-rated 13th month pay based on total basic salary earned within the calendar year (PD 851).',
    expression: 'total_basic_salary_earned / 12',
    variables: ['total_basic_salary_earned']
  },
  {
    id: 'f3',
    name: 'Rest Day Overtime',
    description: 'OT pay for work rendered on a designated rest day at 130% of the hourly rate.',
    expression: '(base_pay / 21.75 / 8) * 1.30 * hours_ot',
    variables: ['base_pay', 'hours_ot']
  },
  {
    id: 'f4',
    name: 'Regular Holiday Pay',
    description: 'Daily pay for a regular holiday even if no work is rendered — 100% of daily rate.',
    expression: 'base_pay / 21.75',
    variables: ['base_pay']
  },
  {
    id: 'f5',
    name: 'Regular Holiday OT',
    description: 'Overtime on a regular holiday: 200% of the hourly rate plus an additional 30% for OT hours.',
    expression: '(base_pay / 21.75 / 8) * 2.00 * hours_worked + (base_pay / 21.75 / 8) * 2.00 * 0.30 * hours_ot',
    variables: ['base_pay', 'hours_worked', 'hours_ot']
  },
  {
    id: 'f6',
    name: 'Special Non-Working Holiday Pay',
    description: 'Pay for work done on a special non-working holiday: 130% of daily rate per 8 hours.',
    expression: '(base_pay / 21.75 / 8) * 1.30 * hours_worked',
    variables: ['base_pay', 'hours_worked']
  },
  {
    id: 'f7',
    name: 'Tardiness Deduction',
    description: 'Deduction for tardiness based on the per-minute equivalent of the daily rate.',
    expression: '(base_pay / 21.75 / 8 / 60) * minutes_late',
    variables: ['base_pay', 'minutes_late']
  },
  {
    id: 'f8',
    name: 'Undertime Deduction',
    description: 'Deduction for undertime hours — same rate as tardiness, applied to hours left early.',
    expression: '(base_pay / 21.75 / 8) * hours_undertime',
    variables: ['base_pay', 'hours_undertime']
  },
  {
    id: 'f9',
    name: 'AWOL Deduction',
    description: 'Absence without official leave deduction: one full daily rate per absent day.',
    expression: '(base_pay / 21.75) * days_absent',
    variables: ['base_pay', 'days_absent']
  },
  {
    id: 'f10',
    name: 'Night Differential',
    description: 'Night shift differential: 10% premium on the hourly rate for hours worked between 10 PM and 6 AM.',
    expression: '(base_pay / 21.75 / 8) * 0.10 * nd_hours',
    variables: ['base_pay', 'nd_hours']
  },
  {
    id: 'f11',
    name: 'SSS Employee Share',
    description: 'Employee SSS contribution derived from the applicable MSC bracket (approximated at 4.5% of MSC).',
    expression: 'msc * 0.045',
    variables: ['msc']
  },
  {
    id: 'f12',
    name: 'PhilHealth Employee Share',
    description: 'Employee PhilHealth premium: 2.5% of basic monthly salary, split equally with employer.',
    expression: '(base_pay * 0.05) / 2',
    variables: ['base_pay']
  }
];

const INITIAL_TABLES: LookupTable[] = [];

const INITIAL_PAY_COMPONENTS: PayComponent[] = [
  // --- SYSTEM COMPONENT ---
  {
    id: 'pc-basic',
    name: 'Basic Pay',
    type: 'earning',
    isTaxable: true,
    valueType: 'fixed',
    fixedValue: 0,
    includeIn13thMonth: true,
    isSystem: true,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  // --- EARNINGS ---
  {
    id: 'pc-rice',
    name: 'Rice Subsidy',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 2000,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0',
    frequency: 'Monthly',
    distribution: [
      { period: 'Pay Period 1', amount: 2000 }
    ]
  },
  {
    id: 'pc-transport',
    name: 'Transportation Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 3000,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0',
    frequency: 'Semi-Monthly',
    distribution: [
      { period: 'Pay Period 1', amount: 1500 },
      { period: 'Pay Period 2', amount: 1500 }
    ]
  },
  {
    id: 'pc-meal',
    name: 'Meal Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 3000,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc-clothing',
    name: 'Clothing Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 400,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0',
    frequency: 'Weekly',
    distribution: [
      { period: 'Week 1', amount: 100 },
      { period: 'Week 2', amount: 100 },
      { period: 'Week 3', amount: 100 },
      { period: 'Week 4', amount: 100 }
    ]
  },
  {
    id: 'pc-medical',
    name: 'Medical / HMO Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 1500,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc-phone',
    name: 'Mobile Phone Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 1200,
    includeIn13thMonth: false,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  // --- DEDUCTIONS ---
  {
    id: 'pc-sss',
    name: 'SSS Contribution',
    type: 'deduction',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 1350,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc-phic',
    name: 'PhilHealth Premium',
    type: 'deduction',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 900,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc-hdmf',
    name: 'Pag-IBIG (HDMF)',
    type: 'deduction',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 200,
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc-wtax',
    name: 'Withholding Tax',
    type: 'deduction',
    isTaxable: false,
    valueType: 'formula',
    formulaId: 'f1',
    archiveAfterDays: 0,
    isArchived: false,
    currentVersion: '1.0.0'
  },
  // --- ARCHIVED ---
  {
    id: 'pc_old',
    name: '2023 Performance Bonus',
    type: 'earning',
    isTaxable: true,
    valueType: 'fixed',
    fixedValue: 5000,
    isArchived: true,
    archiveAfterDays: 0
  }
];

const INITIAL_TEMPLATES: PayTemplate[] = [
  {
    id: 'pt-001',
    name: 'Standard Rank-and-File Package',
    targetType: 'Global',
    targetId: null,
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-002',
    name: 'Probationary Employee Package',
    targetType: 'Global',
    targetId: null,
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-003',
    name: 'IT Department Professional',
    targetType: 'Department',
    targetId: 'dept-1',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-phone', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-004',
    name: 'HR Department Standard',
    targetType: 'Department',
    targetId: 'dept-2',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-005',
    name: 'Junior Associate Bundle',
    targetType: 'Rank',
    targetId: 'rank-1',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-transport', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-006',
    name: 'Senior Professional Bundle',
    targetType: 'Rank',
    targetId: 'rank-2',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-phone', 'pc-clothing', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-007',
    name: 'Manager Executive Package',
    targetType: 'Rank',
    targetId: 'rank-3',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-phone', 'pc-clothing', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-008',
    name: 'Senior Developer Compensation',
    targetType: 'Position',
    targetId: 'pos-2',
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-phone', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  },
  {
    id: 'pt-009',
    name: 'Minimum Wage Compliant Package',
    targetType: 'Global',
    targetId: null,
    isTaxExempt: true,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-sss', 'pc-phic', 'pc-hdmf']
  },
  {
    id: 'pt-010',
    name: 'Full Allowance Corporate Package',
    targetType: 'Global',
    targetId: null,
    isTaxExempt: false,
    components: ['pc-basic', 'pc-rice', 'pc-meal', 'pc-transport', 'pc-phone', 'pc-clothing', 'pc-medical', 'pc-sss', 'pc-phic', 'pc-hdmf', 'pc-wtax']
  }
];

export const PayStructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pay Templates');
  const [formulas, setFormulas] = useState<Formula[]>(INITIAL_FORMULAS);
  const [lookupTables, setLookupTables] = useState<LookupTable[]>(INITIAL_TABLES);
  const [payComponents, setPayComponents] = useState<PayComponent[]>(INITIAL_PAY_COMPONENTS);
  const [payTemplates, setPayTemplates] = useState<PayTemplate[]>(INITIAL_TEMPLATES);
  const [dailyPayTemplates, setDailyPayTemplates] = useState<DailyPayTemplate[]>(MOCK_DAILY_PAY_TEMPLATES);

  const tabs = ['Pay Templates', 'Daily Pay Templates', 'Pay Components', 'Formula Builder'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pay Structure</h1>
        <p className="text-slate-500 font-medium mt-1">Manage salary grades, pay components, templates, and calculation formulas.</p>
      </div>

      <div className="border-b border-slate-100">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative
                ${activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Formula Builder' && (
        <FormulaBuilder
          formulas={formulas}
          setFormulas={setFormulas}
          lookupTables={lookupTables}
          setLookupTables={setLookupTables}
        />
      )}

      {activeTab === 'Pay Components' && (
        <PayComponents
          components={payComponents}
          setComponents={setPayComponents}
          formulas={formulas}
        />
      )}

      {activeTab === 'Pay Templates' && (
        <PayTemplates
          templates={payTemplates}
          setTemplates={setPayTemplates}
          components={payComponents}
        />
      )}

      {activeTab === 'Daily Pay Templates' && (
        <DailyPayTemplates
          templates={dailyPayTemplates}
          setTemplates={setDailyPayTemplates}
          components={payComponents}
        />
      )}
    </div>
  );
};

export default PayStructure;
