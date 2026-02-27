
export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  avatar: string;
  phone: string;
  jobType: string;
  // Added for Pay Template Simulator
  positionId?: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Superadmin' | 'Employee' | 'HR Admin' | 'HR Payroll Personnel' | 'HR Attendance Personnel' | 'Approver' | 'HR Recruiter';
  employeeId?: string; // Links to the Employee record
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RoleSetup {
  id: string;
  name: string;
  connectedEmployees: number;
  dateAdded: string;
  lastModifiedBy: string;
  lastModified: string;
}

export interface PaySchedule {
  id: string;
  name: string;
  frequency: 'Weekly' | 'Semi-Monthly' | 'Monthly';
  targetType: 'Global' | 'Department' | 'Position';
  targetId: string | null;
  firstCutoff?: number;
  firstPayDate?: number | string;
  secondCutoff?: number;
  secondPayDate?: number;
  divisorId?: string; // Links to a Divisor
}

export interface Divisor {
  id: string;
  name: string;
  days: number;
}

export interface VersionHistory {
  version: string;
  date: string;
  author: string;
  dataSnapshot: any; // Snapshot of the object state at that time
}

export interface Formula {
  id: string;
  name: string;
  description: string;
  expression: string;
  variables: string[];
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface LookupTableRow {
  id: string;
  min: number;
  max: number | null;
  baseAmount: number;     // Used for Standard Calculation
  rate: number;           // Used for Standard Calculation
  employeeShare?: number; // Used for Contribution Tables (SSS)
  employerShare?: number; // Used for Contribution Tables (SSS)
}

export interface LookupTable {
  id: string;
  name: string;
  description: string;
  type?: 'standard' | 'contribution'; // Added to distinguish logic
  rows: LookupTableRow[];
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface PayComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction';
  isTaxable: boolean;
  valueType: 'fixed' | 'formula' | 'table';
  fixedValue?: number;
  formulaId?: string;
  tableId?: string;
  archiveAfterDays?: number;
  isArchived?: boolean;
  includeIn13thMonth?: boolean; // Added field
  isSystem?: boolean; // Added to prevent deletion of critical components like Basic Pay
  currentVersion?: string;
  versions?: VersionHistory[];
}

export interface AdjustmentType {
  id: string;
  code: string;
  name: string;
  category: 'Earning' | 'Deduction';
  isTaxable: boolean;
  description?: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  type: string;
  parentId?: string | null;
  children: OrgUnit[];
}

export interface OrgUnitType {
  id: string;
  name: string;
  level: number;
}

export interface SalaryStep {
  id: string;
  name: string;
  amount: number;
}

export interface SalaryGrade {
  id: string;
  code: string;
  name: string;
  amount?: number; // Legacy single amount
  type?: 'ALIGNED' | 'RANGE';
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  steps?: SalaryStep[];
}

export interface SubRank {
  id: string;
  name: string;
  salaryGradeId: string;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
  salaryGradeId?: string;
  subRanks?: SubRank[];
  color?: string;
}

export interface Position {
  id: string;
  title: string;
  orgUnitId: string;
  salaryGradeId?: string; // Made optional to fix strict check in some contexts
  rankId?: string;
  subRankId?: string;
  defaultBasePay: number;
  employmentStatus?: string; // Added field
  supervisorId?: string; // Added field (links to another Position.id)
}

export interface PayTemplate {
  id: string;
  name: string;
  targetType: 'Global' | 'Department' | 'Rank' | 'Position' | 'Employee';
  targetId: string | null;
  targetSubRankId?: string;
  components: string[]; // IDs of PayComponents
  isTaxExempt?: boolean;
  taxRate?: number;
}
