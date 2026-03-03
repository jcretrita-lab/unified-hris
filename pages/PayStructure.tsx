
import React, { useState } from 'react';
import { Formula, LookupTable, PayComponent, PayTemplate } from '../types';
import FormulaBuilder from './pay-structure/FormulaBuilder';
import PayComponents from './pay-structure/PayComponents';
import PayTemplates from './pay-structure/PayTemplates';

// --- MOCK INITIAL DATA ---
const INITIAL_FORMULAS: Formula[] = [
  {
    id: 'f1',
    name: 'Regular Overtime',
    description: 'Calculates OT pay at 125% of hourly rate',
    expression: '(base_pay / 21.75 / 8) * 1.25 * hours_ot',
    variables: ['base_pay', 'hours_ot']
  },
  {
    id: 'f2',
    name: '13th Month Pay',
    description: 'Pro-rated 13th month calculation',
    expression: 'total_basic_salary_earned / 12',
    variables: ['total_basic_salary_earned']
  }
];

const INITIAL_TABLES: LookupTable[] = [];

const INITIAL_PAY_COMPONENTS: PayComponent[] = [
  {
    id: 'pc-basic',
    name: 'Basic Pay',
    type: 'earning',
    isTaxable: true,
    valueType: 'fixed',
    fixedValue: 0, // Placeholder, actual value comes from Position
    includeIn13thMonth: true,
    isSystem: true, // Prevents deletion/editing
    isArchived: false,
    currentVersion: '1.0.0'
  },
  {
    id: 'pc1',
    name: 'Rice Subsidy',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 2000,
    archiveAfterDays: 365,
    isArchived: false
  },
  {
    id: 'pc2',
    name: 'Clothing Allowance',
    type: 'earning',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 1000,
    archiveAfterDays: 180,
    isArchived: false
  },
  {
    id: 'pc3',
    name: 'SSS Contribution',
    type: 'deduction',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 1350,
    isArchived: false
  },
  {
    id: 'pc4',
    name: 'PhilHealth',
    type: 'deduction',
    isTaxable: false,
    valueType: 'fixed',
    fixedValue: 450,
    isArchived: false
  },
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
    id: 'pt1',
    name: 'Regular Employee Standard',
    targetType: 'Global',
    targetId: null,
    components: ['pc-basic', 'pc1', 'pc2', 'pc3', 'pc4']
  },
  {
    id: 'pt2',
    name: 'Senior Management Perks',
    targetType: 'Rank',
    targetId: 'rank-2', // Senior Level
    components: ['pc-basic', 'pc1', 'pc2'] // Just mock extra components
  }
];

export const PayStructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Pay Templates');
  const [formulas, setFormulas] = useState<Formula[]>(INITIAL_FORMULAS);
  const [lookupTables, setLookupTables] = useState<LookupTable[]>(INITIAL_TABLES);
  const [payComponents, setPayComponents] = useState<PayComponent[]>(INITIAL_PAY_COMPONENTS);
  const [payTemplates, setPayTemplates] = useState<PayTemplate[]>(INITIAL_TEMPLATES);

  const tabs = ['Pay Templates', 'Pay Components', 'Formula Builder'];

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
    </div>
  );
};

export default PayStructure;
