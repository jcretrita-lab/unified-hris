
import {
    Calendar,
    ShieldCheck,
    Gift,
    Baby,
    User,
    AlertCircle,
    Stethoscope,
    Heart,
} from 'lucide-react';

// COMPREHENSIVE LABOR CODE STANDARDS (Philippines)
export const LEGAL_STANDARDS = {
    // Book I & II: Pre-Employment & HRD
    PROBATIONARY_DAYS: 180, // Art. 296 (formerly 281)
    APPRENTICE_WAGE_PERCENT: 75, // Art. 61 & 75

    // Book III: Conditions of Employment
    NORMAL_HOURS: 8, // Art 83
    MEAL_BREAK_MINUTES: 60, // Art 85
    NIGHT_DIFF_RATE: 10, // Art 86
    OT_REGULAR: 25, // Art 87
    OT_REST_DAY: 30, // Art 87 (Plus 30% of rest day rate)

    // Holiday Pay (Art 93-94)
    PREMIUM_SPECIAL_HOLIDAY: 30, // 30% premium
    PREMIUM_REGULAR_HOLIDAY: 100, // 100% premium (Double pay)
    PREMIUM_REST_DAY: 30, // 30% premium

    REST_DAY_FREQ: 6, // Art 91
    SIL_DAYS: 5, // Art 95
    SERVICE_CHARGE_DIST: 100, // Art 96 (RA 11360)

    // De Minimis (TRAIN Law / RR 11-2018)
    DEMINIMIS_RICE: 2000,
    DEMINIMIS_CLOTHING: 6000, // Annual
    DEMINIMIS_LAUNDRY: 300,

    // Book IV: Health, Safety & Social Welfare
    DENTAL_SERVICES_THRESHOLD: 50, // Art. 163 (Req dental if > 50 employees)

    // Book V: Labor Relations
    GRIEVANCE_SETTLEMENT_DAYS: 7, // Art. 260 (Typical CBA timeline)

    // Book VI: Post-Employment
    SEPARATION_PAY_REDUNDANCY: 1.0, // Art. 298 (1 month per year)
    SEPARATION_PAY_DISEASE: 0.5, // Art. 299 (1/2 month per year)
    RETIREMENT_AGE_MIN: 60, // Art 302
    RETIREMENT_AGE_MAX: 65, // Art 302
    RETIREMENT_PAY_MULTIPLIER: 22.5, // Art 302

    // Special Laws
    MATERNITY_DAYS: 105, // RA 11210
    PATERNITY_DAYS: 7, // RA 8187
    SOLO_PARENT_DAYS: 7, // RA 8972
    VAWC_DAYS: 10, // RA 9262
    MAGNA_CARTA_WOMEN_DAYS: 60, // RA 9710
};

export interface PolicyState {
    // Book I & II
    probationaryDays: number;
    apprenticeWagePercent: number;

    // Book III
    normalHours: number;
    mealBreakMinutes: number;
    isMealBreakCompensated: boolean;
    gracePeriod: number; // Minutes
    deductGracePeriod: boolean;

    // Premiums & Holiday Pay
    nightDiffRate: number;
    otRegularRate: number;
    otRestDayRate: number;
    specialHolidayRate: number;
    regularHolidayRate: number;

    serviceChargeDistribution: number;
    thirteenthMonthBasis: 'Basic Pay' | 'Total Earnings';
    serviceIncentiveLeave: number;

    // De Minimis (Tax Exempt Ceilings)
    riceSubsidyCap: number;
    clothingAllowanceCap: number;
    laundryAllowanceCap: number;
    leaveConversionTaxExemptDays: number;

    // Book IV
    provideDental: boolean;
    provideMedical: boolean;

    // Book V
    grievanceResolutionDays: number;

    // Book VI
    separationPayRedundancy: number;
    separationPayDisease: number;
    retirementAgeMin: number;
    retirementAgeMax: number;
    retirementPayMultiplier: number;
    noticePeriodDays: number;

    // Special Laws
    maternityLeave: number;
    paternityLeave: number;
    soloParentLeave: number;
    vawcLeave: number;
    magnaCartaLeave: number;
    nonCompressedWorkWeek: boolean;
    isProbationExtensionEnabled: boolean;
    isApprenticeshipEnabled: boolean;
    isTollingEnabled: boolean;
    // Work Schedule Types (MR1)
    workScheduleType: 'Standard' | 'Compressed' | 'Flexible';
    sixthDay: string;
    compressedDailyHours: number;
    standardDailyHours: number;
    flexibleMinimumHours: number;
    holidayDecompressionEnabled: boolean;
}

export const INITIAL_STATE: PolicyState = {
    // Book I & II
    probationaryDays: 180,
    apprenticeWagePercent: 75,

    // Book III
    normalHours: 8,
    mealBreakMinutes: 60,
    isMealBreakCompensated: false,
    gracePeriod: 15,
    deductGracePeriod: true,

    nightDiffRate: 10,
    otRegularRate: 25,
    otRestDayRate: 30,
    specialHolidayRate: 30,
    regularHolidayRate: 100,

    serviceChargeDistribution: 100,
    thirteenthMonthBasis: 'Basic Pay',
    serviceIncentiveLeave: 5,

    riceSubsidyCap: 2000,
    clothingAllowanceCap: 6000,
    laundryAllowanceCap: 300,
    leaveConversionTaxExemptDays: 10,

    // Book IV
    provideDental: false,
    provideMedical: true,

    // Book V
    grievanceResolutionDays: 7,

    // Book VI
    separationPayRedundancy: 1.0,
    separationPayDisease: 0.5,
    retirementAgeMin: 60,
    retirementAgeMax: 65,
    retirementPayMultiplier: 22.5,
    noticePeriodDays: 30,

    // Special Laws
    maternityLeave: 105,
    paternityLeave: 7,
    soloParentLeave: 7,
    vawcLeave: 10,
    magnaCartaLeave: 60,
    nonCompressedWorkWeek: false,
    isProbationExtensionEnabled: false,
    isApprenticeshipEnabled: false,
    isTollingEnabled: false,
    // Work Schedule Types (MR1)
    workScheduleType: 'Standard',
    sixthDay: 'Saturday',
    compressedDailyHours: 9.5,
    standardDailyHours: 8,
    flexibleMinimumHours: 8.5,
    holidayDecompressionEnabled: false,
};

// Leave Monetization Types
export interface LeaveConfig {
    id: string;
    name: string;
    code: string;
    isStatutory: boolean;
    enabled: boolean;
    days: number;
    icon: any;
    color: string;
    citation: string;
    // Monetization
    monetizationEnabled: boolean;
    monetizationMaxDays: number;
    monetizationRate: number;
    monetizationBasis: 'Daily Rate' | 'Monthly Rate';
    // Detailed Setup
    eligibility: string[];
    accrualPolicy: 'Immediate' | 'Monthly' | 'Yearly' | 'Upon regularization';
    maxFiledPerMonth: number;
    expiration: 'Never' | 'Every Year-End' | 'After 12 Months';
    maxAccrued: number;
    isForfeited: boolean;
}

export const LEAVE_TYPES_LIST: LeaveConfig[] = [
    {
        id: 'sil', name: 'Service Incentive Leave', code: 'SIL', isStatutory: true, enabled: true, days: 5, icon: Calendar, color: 'text-slate-400', citation: 'Art. 95',
        monetizationEnabled: true, monetizationMaxDays: 5, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Regular'], accrualPolicy: 'Yearly', maxFiledPerMonth: 5, expiration: 'Never', maxAccrued: 15, isForfeited: false
    },
    {
        id: 'vl', name: 'Vacation Leave', code: 'VL', isStatutory: false, enabled: true, days: 10, icon: Gift, color: 'text-sky-400', citation: 'Company Policy',
        monetizationEnabled: true, monetizationMaxDays: 10, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Regular', 'Full-time'], accrualPolicy: 'Monthly', maxFiledPerMonth: 10, expiration: 'Every Year-End', maxAccrued: 30, isForfeited: true
    },
    {
        id: 'sl', name: 'Sick Leave', code: 'SL', isStatutory: false, enabled: true, days: 12, icon: Stethoscope, color: 'text-emerald-400', citation: 'Company Policy',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Regular', 'Full-time', 'Probationary'], accrualPolicy: 'Monthly', maxFiledPerMonth: 15, expiration: 'Every Year-End', maxAccrued: 60, isForfeited: true
    },
    {
        id: 'el', name: 'Emergency Leave', code: 'EL', isStatutory: false, enabled: true, days: 3, icon: AlertCircle, color: 'text-rose-400', citation: 'Company Policy',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Regular'], accrualPolicy: 'Immediate', maxFiledPerMonth: 3, expiration: 'Every Year-End', maxAccrued: 3, isForfeited: true
    },
    {
        id: 'maternity', name: 'Expanded Maternity', code: 'ML', isStatutory: true, enabled: true, days: 105, icon: Baby, color: 'text-pink-400', citation: 'RA 11210',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Female', 'All status'], accrualPolicy: 'Immediate', maxFiledPerMonth: 105, expiration: 'Never', maxAccrued: 105, isForfeited: false
    },
    {
        id: 'paternity', name: 'Paternity Leave', code: 'PL', isStatutory: true, enabled: true, days: 7, icon: Baby, color: 'text-blue-400', citation: 'RA 8187',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Male', 'Married'], accrualPolicy: 'Immediate', maxFiledPerMonth: 7, expiration: 'Never', maxAccrued: 7, isForfeited: false
    },
    {
        id: 'solo_parent', name: 'Solo Parent Leave', code: 'SPL', isStatutory: true, enabled: true, days: 7, icon: User, color: 'text-amber-400', citation: 'RA 8972',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Solo Parent'], accrualPolicy: 'Yearly', maxFiledPerMonth: 7, expiration: 'Every Year-End', maxAccrued: 7, isForfeited: true
    },
    {
        id: 'vawc', name: 'VAWC Leave', code: 'VAWC', isStatutory: true, enabled: true, days: 10, icon: ShieldCheck, color: 'text-purple-400', citation: 'RA 9262',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Female'], accrualPolicy: 'Immediate', maxFiledPerMonth: 10, expiration: 'Never', maxAccrued: 10, isForfeited: false
    },
    {
        id: 'magna_carta', name: 'Magna Carta (Surgery)', code: 'MCW', isStatutory: true, enabled: true, days: 60, icon: Heart, color: 'text-rose-500', citation: 'RA 9710',
        monetizationEnabled: false, monetizationMaxDays: 0, monetizationRate: 100, monetizationBasis: 'Daily Rate',
        eligibility: ['Female'], accrualPolicy: 'Immediate', maxFiledPerMonth: 60, expiration: 'Never', maxAccrued: 60, isForfeited: false
    }
];

export const INITIAL_LEAVE_CONFIGS: Record<string, LeaveConfig> = LEAVE_TYPES_LIST.reduce((acc, current) => ({
    ...acc,
    [current.id]: current
}), {});
