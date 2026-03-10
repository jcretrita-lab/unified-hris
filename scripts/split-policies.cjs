// Script to split PoliciesPage.tsx into GovernmentStandardsTab and CompanyPoliciesTab
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'pages', 'PoliciesPage.tsx'), 'utf8');
const lines = src.split(/\r?\n/);

// Helper: extract lines (1-indexed, inclusive)
function extract(start, end) {
    return lines.slice(start - 1, end).join('\n');
}

// ============ GOVERNMENT STANDARDS TAB ============
const govImports = `
import React from 'react';
import { Divisor } from '../../types';
import {
    Clock,
    DollarSign,
    ShieldCheck,
    AlertTriangle,
    Info,
    CheckCircle2,
    Calendar,
    Scale,
    BadgePercent,
    History,
    Heart,
    Baby,
    Briefcase,
    Coins,
    AlertCircle,
    User,
    GraduationCap,
    Stethoscope,
    Users,
    FileMinus,
    CalendarCheck,
    Gift,
    ArrowRight,
    Gavel,
    BookMarked,
    Calculator,
    Check,
    ToggleLeft,
    ToggleRight,
    TrendingUp
} from 'lucide-react';
import { PolicyState, LeaveConfig, LEGAL_STANDARDS, LEAVE_TYPES_LIST } from './PolicyTypes';
import { ComplianceBadge, LegalNote, SectionTitle, getComplianceStatus } from './PolicyComponents';

interface GovernmentStandardsTabProps {
    activeTab: string;
    policies: PolicyState;
    updatePolicy: (field: keyof PolicyState, value: any) => void;
    selectedLeaveId: string;
    setSelectedLeaveId: (id: string) => void;
    currentLeaveConfig: LeaveConfig;
    updateLeaveConfig: (id: string, field: keyof LeaveConfig, value: any) => void;
    leaveSettings: Record<string, LeaveConfig>;
}

const GovernmentStandardsTab: React.FC<GovernmentStandardsTabProps> = ({
    activeTab, policies, updatePolicy,
    selectedLeaveId, setSelectedLeaveId,
    currentLeaveConfig, updateLeaveConfig, leaveSettings
}) => {

    const getProbationStatus = () => {
        const value = policies.probationaryDays;
        const standard = LEGAL_STANDARDS.PROBATIONARY_DAYS;
        if (policies.isApprenticeshipEnabled && value <= 730) {
            return { status: 'compliant', msg: 'Compliant (Apprentice)', citation: 'Art. 61' };
        }
        if (policies.isProbationExtensionEnabled && value > standard) {
            return { status: 'compliant', msg: 'Compliant (By Agreement)', citation: 'Mariwasa Doctrine' };
        }
        if (policies.isTollingEnabled && value > standard) {
            return { status: 'compliant', msg: 'Compliant (Tolled)', citation: 'RA 11210' };
        }
        return { ...getComplianceStatus(value, standard, 'max'), citation: 'Art. 296' };
    };

    return (
        <>
`;

// Government Book3: lines 1048-1304
const govBook3 = extract(1048, 1304);
// Government Book1_2: lines 1306-1497
const govBook1_2 = extract(1306, 1497);
// Government Book4_5: lines 1499-1552
const govBook4_5 = extract(1499, 1552);
// Government Book6: lines 1554-1673
const govBook6 = extract(1554, 1673);
// Government Special/Leaves: lines 1675-2085
const govSpecial = extract(1675, 2085);

const govClosing = `
        </>
    );
};

export default GovernmentStandardsTab;
`;

// Strip the primaryTab === 'Government' && conditions since we know we're in Government tab
function stripPrimaryTabCheck(code) {
    return code
        .replace(/\{primaryTab === 'Government' && activeTab/g, '{activeTab')
        .replace(/\{primaryTab === 'Company' && activeTab/g, '{false && activeTab');
}

const govContent = govImports + stripPrimaryTabCheck(govBook3) + '\n' + stripPrimaryTabCheck(govBook1_2) + '\n' + stripPrimaryTabCheck(govBook4_5) + '\n' + stripPrimaryTabCheck(govBook6) + '\n' + stripPrimaryTabCheck(govSpecial) + govClosing;

fs.writeFileSync(path.join(__dirname, '..', 'pages', 'policies', 'GovernmentStandardsTab.tsx'), govContent, 'utf8');
console.log('Created GovernmentStandardsTab.tsx');

// ============ COMPANY POLICIES TAB ============
const compImports = `
import React from 'react';
import { Divisor } from '../../types';
import {
    Clock,
    DollarSign,
    ShieldCheck,
    AlertTriangle,
    Info,
    CheckCircle2,
    Calendar,
    Scale,
    BadgePercent,
    History,
    Heart,
    Baby,
    Briefcase,
    Coins,
    AlertCircle,
    User,
    Stethoscope,
    FileMinus,
    CalendarCheck,
    Gift,
    BookMarked,
    Calculator,
    Check,
    ToggleLeft,
    ToggleRight,
    Building2,
    Plus,
    Trash2,
    Edit
} from 'lucide-react';
import { PolicyState, LeaveConfig, LEGAL_STANDARDS } from './PolicyTypes';
import { ComplianceBadge, LegalNote, SectionTitle, getComplianceStatus } from './PolicyComponents';

interface CompanyPoliciesTabProps {
    activeTab: string;
    policies: PolicyState;
    updatePolicy: (field: keyof PolicyState, value: any) => void;
    // Divisor
    divisors: Divisor[];
    isAddingDivisor: boolean;
    setIsAddingDivisor: (v: boolean) => void;
    editingDivisorId: string | null;
    setEditingDivisorId: (v: string | null) => void;
    divisorForm: Partial<Divisor>;
    setDivisorForm: (v: Partial<Divisor>) => void;
    handleSaveDivisor: () => void;
    handleEditDivisor: (d: Divisor) => void;
    handleDeleteDivisor: (id: string) => void;
    // Separation calculator
    sepCalcSalary: number;
    setSepCalcSalary: (v: number) => void;
    sepCalcYears: number;
    setSepCalcYears: (v: number) => void;
    sepCalcCause: 'redundancy' | 'retrenchment' | 'disease';
    setSepCalcCause: (v: 'redundancy' | 'retrenchment' | 'disease') => void;
    sepMultiplier: number;
    sepPerYear: number;
    sepComputed: number;
    sepPayResult: number;
    // Retirement calculator
    retCalcSalary: number;
    setRetCalcSalary: (v: number) => void;
    retCalcYears: number;
    setRetCalcYears: (v: number) => void;
    retCalcAge: number;
    setRetCalcAge: (v: number) => void;
    retDivisor: number;
    retDailyRate: number;
    retPayResult: number;
    retEligible: boolean;
    retCompulsory: boolean;
    // Shift request
    shiftRequestApprovalDeadlineDays: number;
    setShiftRequestApprovalDeadlineDays: (v: number) => void;
}

const CompanyPoliciesTab: React.FC<CompanyPoliciesTabProps> = (props) => {
    const {
        activeTab, policies, updatePolicy,
        divisors, isAddingDivisor, setIsAddingDivisor, editingDivisorId, setEditingDivisorId,
        divisorForm, setDivisorForm, handleSaveDivisor, handleEditDivisor, handleDeleteDivisor,
        sepCalcSalary, setSepCalcSalary, sepCalcYears, setSepCalcYears, sepCalcCause, setSepCalcCause,
        sepMultiplier, sepPerYear, sepComputed, sepPayResult,
        retCalcSalary, setRetCalcSalary, retCalcYears, setRetCalcYears, retCalcAge, setRetCalcAge,
        retDivisor, retDailyRate, retPayResult, retEligible, retCompulsory,
        shiftRequestApprovalDeadlineDays, setShiftRequestApprovalDeadlineDays
    } = props;

    return (
        <>
`;

// Company Divisor: lines 626-710
const compDivisor = extract(626, 710);
// Company Works: lines 712-970
const compWorks = extract(712, 970);
// Company Special: lines 972-1045
const compSpecial = extract(972, 1045);
// Company PostEmployment: lines 2086-2326
const compPost = extract(2086, 2326);

function stripCompanyCheck(code) {
    return code
        .replace(/\{primaryTab === 'Company' && activeTab/g, '{activeTab')
        .replace(/\{primaryTab === 'Government' && activeTab/g, '{false && activeTab');
}

const compClosing = `
        </>
    );
};

export default CompanyPoliciesTab;
`;

const compContent = compImports + stripCompanyCheck(compDivisor) + '\n' + stripCompanyCheck(compWorks) + '\n' + stripCompanyCheck(compSpecial) + '\n' + stripCompanyCheck(compPost) + compClosing;

fs.writeFileSync(path.join(__dirname, '..', 'pages', 'policies', 'CompanyPoliciesTab.tsx'), compContent, 'utf8');
console.log('Created CompanyPoliciesTab.tsx');

console.log('Done! Policies split complete.');
