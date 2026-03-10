
import React, { useState } from 'react';
import {
    Layers,
    Box,
    Zap,
    ArrowLeft
} from 'lucide-react';

import DeductionPackageTab from './deductions/DeductionPackageTab';
import DeductionComponentTab from './deductions/DeductionComponentTab';
import DeductionFormulaTab from './deductions/DeductionFormulaTab';
import { PayComponent, Formula, PayTemplate, LookupTable } from '../../types';

// Mock data for initial implementation
const MOCK_COMPONENTS: PayComponent[] = [
    {
        id: 'comp-d1',
        name: 'SSS Contribution',
        type: 'deduction',
        valueType: 'table',
        tableId: 'sss',
        isTaxable: false,
        category: 'government',
        frequency: 'Semi-Monthly',
        distribution: [
            { period: '1st Pay Period', amount: 675 },
            { period: '2nd Pay Period', amount: 675 }
        ]
    },
    {
        id: 'comp-d2',
        name: 'PhilHealth',
        type: 'deduction',
        valueType: 'table',
        tableId: 'philhealth',
        isTaxable: false,
        category: 'government',
        frequency: 'Monthly',
        distribution: [
            { period: 'Full Month', amount: 900 }
        ]
    },
    {
        id: 'comp-d3',
        name: 'HDMF Pag-IBIG',
        type: 'deduction',
        valueType: 'table',
        tableId: 'pagibig',
        isTaxable: false,
        category: 'government',
        frequency: 'Monthly',
        distribution: [
            { period: 'Full Month', amount: 200 }
        ]
    },
    {
        id: 'comp-d4',
        name: 'BIR Withholding Tax',
        type: 'deduction',
        valueType: 'table',
        tableId: 'tax',
        isTaxable: true,
        category: 'government',
        frequency: 'Semi-Monthly'
    },
    {
        id: 'comp-d5',
        name: 'SSS Salary Loan',
        type: 'deduction',
        valueType: 'fixed',
        fixedValue: 1200,
        isTaxable: false,
        category: 'loan',
        frequency: 'Semi-Monthly',
        distribution: [
            { period: '1st Pay Period', amount: 600 },
            { period: '2nd Pay Period', amount: 600 }
        ]
    }
];

const MOCK_FORMULAS: Formula[] = [
    { id: 'f1', name: 'LWP Deduction', description: 'Leaves without pay formula', expression: '(base_pay / 21.75) * days_absent', variables: ['base_pay', 'days_absent'] }
];

const MOCK_LOOKUP_TABLES: LookupTable[] = [
    {
        id: 'sss',
        name: 'SSS Contribution 2024',
        description: 'Social Security System rates',
        rows: [
            { id: '1', min: 0, max: 4250, baseAmount: 180, rate: 0, employeeShare: 180, employerShare: 370 },
            { id: '2', min: 4250.01, max: 4750, baseAmount: 202.5, rate: 0, employeeShare: 202.5, employerShare: 415 },
            { id: '3', min: 4750.01, max: 5250, baseAmount: 225, rate: 0, employeeShare: 225, employerShare: 460 },
            { id: '4', min: 29750, max: null, baseAmount: 1350, rate: 0, employeeShare: 1350, employerShare: 2700 },
        ],
        currentVersion: '2024'
    },
    {
        id: 'philhealth',
        name: 'PhilHealth 2025',
        description: 'NHIP Premium rates',
        rows: [
            { id: 'p1', min: 0, max: 10000, baseAmount: 500, rate: 0, employeeShare: 250, employerShare: 250 },
            { id: 'p2', min: 10000.01, max: 99999.99, baseAmount: 0, rate: 0.05, employeeShare: 0, employerShare: 0 }, // 5% total
            { id: 'p3', min: 100000, max: null, baseAmount: 5000, rate: 0, employeeShare: 2500, employerShare: 2500 },
        ],
        currentVersion: '2025'
    },
    {
        id: 'pagibig',
        name: 'HDMF Pag-IBIG',
        description: 'Pag-IBIG contribution rates',
        rows: [
            { id: 'h1', min: 0, max: 1500, baseAmount: 0, rate: 0.01, employeeShare: 0, employerShare: 0 },
            { id: 'h2', min: 1500.01, max: null, baseAmount: 200, rate: 0, employeeShare: 200, employerShare: 200 },
        ],
        currentVersion: '2024'
    },
    { id: 'tax', name: 'TRAIN Tax Table', description: 'BIR TRAIN Withholding Tax', rows: [], currentVersion: '2018' }
];

const MOCK_PACKAGES: PayTemplate[] = [
    {
        id: 'ded-pkg-1',
        name: 'Standard Mandatory Deductions',
        targetType: 'Global',
        targetId: null,
        components: ['comp-d1', 'comp-d2', 'comp-d3', 'comp-d4'],
    }
];

const MOCK_INSTALLMENTS = [
    {
        id: 'LAPTOP_LOAN',
        name: 'Lenovo ThinkPad X1 Carbon',
        category: 'Equipment',
        totalPrice: 24000,
        payPeriod: 'Monthly',
        description: 'Employee workstation laptop purchase program.',
        options: [
            { months: 3, interestEnabled: false, interestRate: 0, monthlyPayment: 8000 },
            { months: 6, interestEnabled: false, interestRate: 0, monthlyPayment: 4000 },
            { months: 12, interestEnabled: true, interestRate: 5, monthlyPayment: 2100 }
        ]
    },
    {
        id: 'HMO_MAXICARE',
        name: 'MaxiCare Platinum HMO',
        category: 'HMO',
        totalPrice: 18000,
        payPeriod: 'Semi-monthly',
        description: 'Executive health coverage annual premium.',
        options: [
            { months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 18000 },
            { months: 6, interestEnabled: false, interestRate: 0, monthlyPayment: 3000 },
            { months: 12, interestEnabled: false, interestRate: 0, monthlyPayment: 1500 }
        ]
    },
    {
        id: 'SSS_LOAN',
        name: 'SSS Salary Loan',
        category: 'Loan',
        totalPrice: 15000,
        payPeriod: 'Semi-monthly',
        description: 'Government mandated salary loan repayment.',
        options: [
            { months: 12, interestEnabled: true, interestRate: 10, monthlyPayment: 1375 },
            { months: 24, interestEnabled: true, interestRate: 10, monthlyPayment: 687.5 }
        ]
    }
];

const DeductionsTab: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<'package' | 'component' | 'formula'>('package');
    const [components, setComponents] = useState<PayComponent[]>(MOCK_COMPONENTS);
    const [formulas, setFormulas] = useState<Formula[]>(MOCK_FORMULAS);
    const [templates, setTemplates] = useState<PayTemplate[]>(MOCK_PACKAGES);
    const [lookupTables, setLookupTables] = useState<LookupTable[]>(MOCK_LOOKUP_TABLES);
    const [installmentProducts, setInstallmentProducts] = useState<any[]>(MOCK_INSTALLMENTS);

    const subTabs = [
        { id: 'package', label: 'Deduction Package', icon: Layers },
        { id: 'component', label: 'Deduction Component', icon: Box },
        { id: 'formula', label: 'Formula Builder', icon: Zap },
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Sub-navigation */}
            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200">
                {subTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSubTab === tab.id
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeSubTab === 'package' && (
                    <DeductionPackageTab
                    // Note: DeductionPackageTab logic currently uses internal state
                    // This matches the user's legacy PayTemplates structure
                    />
                )}
                {activeSubTab === 'component' && (
                    <DeductionComponentTab
                        components={components}
                        setComponents={setComponents}
                        formulas={formulas}
                        lookupTables={lookupTables}
                        installments={installmentProducts}
                    />
                )}
                {activeSubTab === 'formula' && (
                    <DeductionFormulaTab
                        formulas={formulas}
                        setFormulas={setFormulas}
                        lookupTables={lookupTables}
                        setLookupTables={setLookupTables}
                        installmentProducts={installmentProducts}
                        setInstallmentProducts={setInstallmentProducts}
                    />
                )}
            </div>
        </div>
    );
};

export default DeductionsTab;
