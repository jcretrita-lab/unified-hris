import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
  CalendarDays,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Briefcase,
  CornerDownRight,
  Users,
  UserPlus,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

// --- Types ---
type ShiftType = 'Default' | 'Biometric' | 'Official Business';
type ShiftCategory = 'Standard' | 'Compressed' | 'Flexible';

interface SubShift {
  id: string;
  type: ShiftType;
  name: string;
  startTime: string;
  endTime: string;
  condition: string;
  workDays: string[]; // ARRAY VERSION (your logic)
}

interface Shift {
  id: string;
  name: string;
  category: ShiftCategory;
  isCompressible: boolean;

  // Regular schedule
  workHours: number;
  startTime: string;
  endTime: string;

  // ARRAY version (your logic)
  workDays: string[];

  // STRING version (main branch display)
  workdays: string;

  // Compressed schedule (main branch)
  compressedWorkHours?: number;
  compressedStartTime?: string;
  compressedEndTime?: string;
  compressedWorkdays?: string;
  compressedDayOff?: string; // The specific day left out when compressed

  lunchIncluded: boolean;
  lunchBreakMinutes: number;
  compressedLunchIncluded?: boolean;
  compressedLunchBreakMinutes?: number;

  // Flexible-specific
  requiredHoursPerDay?: number;
  policyNote?: string;

  lastModifiedBy: string;
  lastModified: string;
  isDefault?: boolean;
  subShifts?: SubShift[];
  assignedEmployees: number;
}

// --- Mock Data ---
const MOCK_SHIFTS: Shift[] = [
  // ─── Standard ───────────────────────────────────────────────
  {
    id: '1',
    name: 'Standard Regular Shift',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'Louis Panganiban',
    lastModified: 'Aug 8, 2025 23:56',
    isDefault: true,
    assignedEmployees: 142,
    subShifts: [
      {
        id: 'sub-1',
        type: 'Biometric',
        name: 'Early Bird Entry',
        startTime: '07:00',
        endTime: '16:00',
        condition: 'Clock-in between 06:30 AM - 07:30 AM',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      }
    ]
  },
  {
    id: '4',
    name: 'NSWP',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Sep 15, 2025 10:00',
    isDefault: false,
    assignedEmployees: 28
  },
  {
    id: '6',
    name: 'Night Shift',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '22:00',
    endTime: '06:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:00',
    isDefault: false,
    assignedEmployees: 35
  },
  {
    id: '7',
    name: 'Mid Shift',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '14:00',
    endTime: '22:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:15',
    isDefault: false,
    assignedEmployees: 22
  },
  {
    id: '8',
    name: 'Early Morning Shift',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '06:00',
    endTime: '14:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:30',
    isDefault: false,
    assignedEmployees: 18
  },
  {
    id: '3',
    name: 'Weekend Support',
    category: 'Standard',
    isCompressible: false,
    workHours: 8,
    startTime: '09:00',
    endTime: '18:00',
    workDays: ['Sat', 'Sun'],
    workdays: 'Sat – Sun',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Aug 1, 2025 09:00',
    isDefault: false,
    assignedEmployees: 12
  },
  {
    id: '12',
    name: 'Admin Flex Shift',
    category: 'Standard',
    isCompressible: false,
    workHours: 8.5,
    startTime: '08:00',
    endTime: '17:30',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lunchIncluded: true,
    lunchBreakMinutes: 30,
    lastModifiedBy: 'HR Admin',
    lastModified: 'Mar 5, 2026 09:00',
    isDefault: false,
    assignedEmployees: 9
  },
  // ─── Compressed ─────────────────────────────────────────────
  {
    id: '5',
    name: 'CWS Production Group',
    category: 'Compressed',
    isCompressible: true,
    workHours: 10,
    startTime: '08:00',
    endTime: '18:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    compressedWorkHours: 12,
    compressedStartTime: '06:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Thu',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    compressedLunchIncluded: false,
    compressedLunchBreakMinutes: 60,
    lastModifiedBy: 'Louis Panganiban',
    lastModified: 'Jan 10, 2026 08:00',
    isDefault: false,
    assignedEmployees: 64
  },
  {
    id: '9',
    name: 'IT Support CWS',
    category: 'Compressed',
    isCompressible: true,
    workHours: 9,
    startTime: '09:00',
    endTime: '18:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    compressedWorkHours: 12,
    compressedStartTime: '07:00',
    compressedEndTime: '19:00',
    compressedWorkdays: 'Mon – Thu',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    compressedLunchIncluded: false,
    compressedLunchBreakMinutes: 60,
    lastModifiedBy: 'Juan Dela Cruz',
    lastModified: 'Feb 1, 2026 10:00',
    isDefault: false,
    assignedEmployees: 17,
    subShifts: [
      {
        id: 'sub-9',
        type: 'Official Business',
        name: 'On-Site Support',
        startTime: '08:00',
        endTime: '20:00',
        condition: 'Approved OB Application',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      }
    ]
  },
  {
    id: '10',
    name: 'Warehouse Operations CWS',
    category: 'Compressed',
    isCompressible: true,
    workHours: 9,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    compressedWorkHours: 10,
    compressedStartTime: '08:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Fri',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    compressedLunchIncluded: true,
    compressedLunchBreakMinutes: 60,
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Feb 3, 2026 14:30',
    isDefault: false,
    assignedEmployees: 56
  },
  {
    id: '11',
    name: 'Diwa Employees',
    category: 'Compressed',
    isCompressible: true,
    workHours: 9,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workdays: 'Mon – Sat',
    compressedWorkHours: 10,
    compressedStartTime: '08:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Fri',
    compressedDayOff: 'Sat',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    compressedLunchIncluded: true,
    compressedLunchBreakMinutes: 60,
    lastModifiedBy: 'HR Admin',
    lastModified: 'Mar 4, 2026 10:15',
    isDefault: false,
    assignedEmployees: 42
  },
  // ─── Flexible ────────────────────────────────────────────────
  {
    id: '2',
    name: 'Sales Flexi Group',
    category: 'Flexible',
    isCompressible: false,
    workHours: 8,
    startTime: '',
    endTime: '',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    requiredHoursPerDay: 8,
    policyNote: 'Must render at least 8 hours per day. Core hours: 10 AM – 3 PM.',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'Juan Dela Cruz',
    lastModified: 'Aug 8, 2025 12:05',
    isDefault: false,
    assignedEmployees: 45,
    subShifts: [
      {
        id: 'sub-2',
        type: 'Official Business',
        name: 'Client Visit Mode',
        startTime: '08:00',
        endTime: '17:00',
        condition: 'Approved OB Application',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      }
    ]
  },
  {
    id: '13',
    name: 'Engineering Flex',
    category: 'Flexible',
    isCompressible: false,
    workHours: 9,
    startTime: '',
    endTime: '',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    requiredHoursPerDay: 9,
    policyNote: 'Engineers must render 9 hours daily. Flexible start between 7 AM – 10 AM.',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'System Admin',
    lastModified: 'Mar 6, 2026 08:00',
    isDefault: false,
    assignedEmployees: 31
  },
  {
    id: '14',
    name: 'Field Operations Flex',
    category: 'Flexible',
    isCompressible: false,
    workHours: 8,
    startTime: '',
    endTime: '',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    workdays: 'Mon – Sat',
    requiredHoursPerDay: 8,
    policyNote: 'Field staff must complete 8 hours per shift. Schedule varies per deployment.',
    lunchIncluded: false,
    lunchBreakMinutes: 60,
    lastModifiedBy: 'HR Admin',
    lastModified: 'Mar 7, 2026 09:30',
    isDefault: false,
    assignedEmployees: 23
  }
];

const MOCK_EMPLOYEES_FOR_ASSIGN = [
  { id: '1', name: 'Sarah Wilson', role: 'HR Manager', dept: 'Human Resources', orgUnitId: 'ou-2', positionId: 'pos-3' },
  { id: '2', name: 'John Doe', role: 'Senior Developer', dept: 'IT', orgUnitId: 'ou-1', positionId: 'pos-2' },
  { id: '3', name: 'Jane Smith', role: 'Software Engineer', dept: 'IT', orgUnitId: 'ou-1', positionId: 'pos-1' },
  { id: '4', name: 'Mike Brown', role: 'Payroll Specialist', dept: 'Finance', orgUnitId: 'ou-3', positionId: 'pos-4' },
  { id: '5', name: 'Alice Guo', role: 'Marketing Lead', dept: 'Marketing', orgUnitId: 'ou-4', positionId: 'pos-5' },
  { id: '6', name: 'Carlo Reyes', role: 'Operations Supervisor', dept: 'Operations', orgUnitId: 'ou-5', positionId: 'pos-6' },
  { id: '7', name: 'Maria Santos', role: 'Sales Representative', dept: 'Sales', orgUnitId: 'ou-6', positionId: 'pos-7' },
  { id: '8', name: 'Robert Cruz', role: 'Warehouse Staff', dept: 'Operations', orgUnitId: 'ou-5', positionId: 'pos-8' },
  { id: '9', name: 'Diana Lopez', role: 'Software Engineer', dept: 'IT', orgUnitId: 'ou-7', positionId: 'pos-1' },
  { id: '10', name: 'Kevin Tan', role: 'Software Engineer', dept: 'IT', orgUnitId: 'ou-8', positionId: 'pos-1' },
];

const MOCK_ORG_UNITS = [
  { id: 'ou-1', name: 'Information Technology', type: 'Department', employeeCount: 24 },
  { id: 'ou-2', name: 'Human Resources', type: 'Department', employeeCount: 12 },
  { id: 'ou-3', name: 'Finance', type: 'Department', employeeCount: 18 },
  { id: 'ou-4', name: 'Marketing', type: 'Department', employeeCount: 15 },
  { id: 'ou-5', name: 'Operations', type: 'Department', employeeCount: 42 },
  { id: 'ou-6', name: 'Sales', type: 'Division', employeeCount: 30 },
  { id: 'ou-7', name: 'Engineering Team A', type: 'Team', employeeCount: 8 },
  { id: 'ou-8', name: 'Engineering Team B', type: 'Team', employeeCount: 7 },
];

const MOCK_POSITIONS = [
  { id: 'pos-1', title: 'Software Engineer', department: 'IT', employeeCount: 12 },
  { id: 'pos-2', title: 'Senior Developer', department: 'IT', employeeCount: 6 },
  { id: 'pos-3', title: 'HR Manager', department: 'Human Resources', employeeCount: 3 },
  { id: 'pos-4', title: 'Payroll Specialist', department: 'Finance', employeeCount: 5 },
  { id: 'pos-5', title: 'Marketing Lead', department: 'Marketing', employeeCount: 4 },
  { id: 'pos-6', title: 'Operations Supervisor', department: 'Operations', employeeCount: 8 },
  { id: 'pos-7', title: 'Sales Representative', department: 'Sales', employeeCount: 15 },
  { id: 'pos-8', title: 'Warehouse Staff', department: 'Operations', employeeCount: 20 },
];

const MOCK_EMPLOYEE_GROUPS = [
  { id: 'grp-1', name: 'Night Shift Pool', description: 'All employees eligible for night shift', employeeCount: 35 },
  { id: 'grp-2', name: 'Production Floor Staff', description: 'Manufacturing and assembly workers', employeeCount: 64 },
  { id: 'grp-3', name: 'Field Agents', description: 'Mobile and field operations staff', employeeCount: 23 },
  { id: 'grp-4', name: 'Office Regulars', description: 'Standard office-based employees', employeeCount: 87 },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ShiftManagement: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ShiftCategory>('Standard');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [assigningShiftId, setAssigningShiftId] = useState<string | null>(null);

  // Create/Edit Form State
  const [formData, setFormData] = useState<Partial<Shift>>({
    name: '',
    category: 'Standard',
    isCompressible: false,
    startTime: '09:00',
    endTime: '18:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    compressedStartTime: '06:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Thu',
    lunchIncluded: true,
    lunchBreakMinutes: 60,
    compressedLunchIncluded: false,
    compressedLunchBreakMinutes: 60,
    requiredHoursPerDay: 8,
    policyNote: '',
    isDefault: false,
    subShifts: []
  });

  // Assignment Form State
  const [assignTab, setAssignTab] = useState<'org-unit' | 'position' | 'individual' | 'group'>('org-unit');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [selectedOrgUnits, setSelectedOrgUnits] = useState<Set<string>>(new Set());
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [assignSearch, setAssignSearch] = useState('');

  const handleOpenModal = (shift?: Shift) => {
    if (shift) {
      setEditingId(shift.id);
      setFormData({ ...shift });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: activeCategory,
        isCompressible: activeCategory === 'Compressed',
        startTime: '09:00',
        endTime: '18:00',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workdays: 'Mon – Fri',
        compressedStartTime: '06:00',
        compressedEndTime: '18:00',
        compressedWorkdays: 'Mon – Thu',
        compressedDayOff: '',
        lunchIncluded: true,
        lunchBreakMinutes: 60,
        compressedLunchIncluded: false,
        compressedLunchBreakMinutes: 60,
        requiredHoursPerDay: 8,
        policyNote: '',
        isDefault: false,
        subShifts: []
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenAssign = (shiftId: string) => {
    setAssigningShiftId(shiftId);
    setSelectedEmployees(new Set());
    setSelectedOrgUnits(new Set());
    setSelectedPositions(new Set());
    setSelectedGroups(new Set());
    setAssignTab('org-unit');
    setAssignSearch('');
    setIsAssignModalOpen(true);
  };

  const calcNetHours = (start: string, end: string, lunchIncluded: boolean, lunchMinutes: number): number => {
    const s = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const e = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    let mins = e - s;
    if (mins < 0) mins += 24 * 60;
    if (lunchIncluded) mins = Math.max(0, mins - lunchMinutes);
    return parseFloat((mins / 60).toFixed(1));
  };

  const handleSave = () => {
    const cat = formData.category || 'Standard';
    if (!formData.name) return;
    if (cat !== 'Flexible' && (!formData.startTime || !formData.endTime)) return;

    const payload: Shift = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      category: cat,
      isCompressible: cat === 'Compressed',

      workHours: cat === 'Flexible'
        ? formData.requiredHoursPerDay || 8
        : calcNetHours(formData.startTime!, formData.endTime!, formData.lunchIncluded ?? true, formData.lunchBreakMinutes ?? 60),

      startTime: cat === 'Flexible' ? '' : formData.startTime!,
      endTime: cat === 'Flexible' ? '' : formData.endTime!,

      lunchIncluded: formData.lunchIncluded ?? true,
      lunchBreakMinutes: formData.lunchBreakMinutes ?? 60,

      workDays: formData.workDays || [],
      workdays: formData.workdays || 'Mon – Fri',

      ...(cat === 'Compressed' && {
        compressedWorkHours: calcNetHours(
          formData.compressedStartTime!,
          formData.compressedEndTime!,
          formData.compressedLunchIncluded ?? false,
          formData.compressedLunchBreakMinutes ?? 60
        ),
        compressedStartTime: formData.compressedStartTime,
        compressedEndTime: formData.compressedEndTime,
        compressedWorkdays: formData.compressedWorkdays || 'Mon – Thu',
        compressedLunchIncluded: formData.compressedLunchIncluded ?? false,
        compressedLunchBreakMinutes: formData.compressedLunchBreakMinutes ?? 60,
        ...(formData.compressedDayOff && { compressedDayOff: formData.compressedDayOff }),
      }),

      ...(cat === 'Flexible' && {
        requiredHoursPerDay: formData.requiredHoursPerDay || 8,
        policyNote: formData.policyNote || '',
      }),

      lastModifiedBy: 'Current User',
      lastModified: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),

      isDefault: formData.isDefault,
      subShifts: formData.subShifts || [],
      assignedEmployees: editingId
        ? shifts.find(s => s.id === editingId)?.assignedEmployees || 0
        : 0
    };

    if (editingId) {
      setShifts(shifts.map(s => (s.id === editingId ? payload : s)));
    } else {
      setShifts([...shifts, payload]);
    }

    setIsModalOpen(false);
  };

  const handleSaveAssignment = () => {
    if (!assigningShiftId) return;
    const fromOrgUnits = MOCK_ORG_UNITS.filter(u => selectedOrgUnits.has(u.id)).reduce((s, u) => s + u.employeeCount, 0);
    const fromPositions = MOCK_POSITIONS.filter(p => selectedPositions.has(p.id)).reduce((s, p) => s + p.employeeCount, 0);
    const fromGroups = MOCK_EMPLOYEE_GROUPS.filter(g => selectedGroups.has(g.id)).reduce((s, g) => s + g.employeeCount, 0);
    const total = fromOrgUnits + fromPositions + fromGroups + selectedEmployees.size;
    setShifts(
      shifts.map(s =>
        s.id === assigningShiftId
          ? { ...s, assignedEmployees: s.assignedEmployees + total }
          : s
      )
    );
    setIsAssignModalOpen(false);
  };

  const toggleDay = (day: string) => {
    const current = formData.workDays || [];
    if (current.includes(day)) {
      setFormData({ ...formData, workDays: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, workDays: [...current, day] });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shift group?')) {
      setShifts(shifts.filter(s => s.id !== id));
    }
  };

  // --- Sub Shift Logic ---
  const addSubShift = (type: ShiftType) => {
    const newSub: SubShift = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: type === 'Biometric' ? 'Biometric Match' : 'OB Schedule',
      startTime: formData.startTime || '09:00',
      endTime: formData.endTime || '18:00',
      condition: type === 'Biometric' ? 'Detected Entry range...' : 'Approved Application',
      workDays: [...(formData.workDays || [])]
    };
    setFormData({
      ...formData,
      subShifts: [...(formData.subShifts || []), newSub]
    });
  };

  const updateSubShift = (id: string, field: keyof SubShift, value: any) => {
    const updated = formData.subShifts?.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setFormData({ ...formData, subShifts: updated });
  };

  const toggleSubShiftDay = (subId: string, day: string) => {
    const sub = formData.subShifts?.find(s => s.id === subId);
    if (!sub) return;

    const current = sub.workDays || [];
    const updatedDays = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];

    updateSubShift(subId, 'workDays', updatedDays);
  };

  const removeSubShift = (id: string) => {
    setFormData({
      ...formData,
      subShifts: formData.subShifts?.filter(s => s.id !== id)
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const filteredShifts = shifts.filter(s =>
    s.category === activeCategory &&
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEmployeeSelect = (id: string) => {
    const next = new Set(selectedEmployees);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEmployees(next);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Shift Management
            <Clock className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Configure default schedules and conditional sub-shifts.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Add Shift Group
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        {/* Category Tabs */}
        <div className="px-5 pt-5 flex gap-2 border-b border-slate-50 pb-4">
          {(['Standard', 'Compressed', 'Flexible'] as ShiftCategory[]).map((cat) => {
            const count = shifts.filter(s => s.category === cat).length;
            const isActive = activeCategory === cat;
            const activeStyle =
              cat === 'Standard' ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100' :
              cat === 'Compressed' ? 'bg-amber-500 text-white border-amber-500 shadow-amber-100' :
              'bg-violet-600 text-white border-violet-600 shadow-violet-100';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  isActive ? activeStyle : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[10px] font-semibold ${isActive ? 'opacity-75' : 'opacity-50'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search shifts..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/40">
              <tr>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Shift Group / Scenarios
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Schedule
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Assignments
                </th>
                <th className="px-8 py-5 text-right" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Shift / Sub-shifts */}
                  <td className="px-8 py-5 align-top">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                            {shift.name}
                            {shift.isDefault && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                                Default
                              </span>
                            )}
                            {shift.category === 'Compressed' && (
                              <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">
                                CWS
                              </span>
                            )}
                            {shift.category === 'Flexible' && (
                              <span className="text-[9px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded border border-violet-100 uppercase tracking-wider">
                                Flexi
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {shift.category === 'Compressed' ? 'Compressed Work Schedule' : shift.category === 'Flexible' ? 'Flexible Schedule' : 'Standard Schedule'}
                          </span>
                        </div>
                      </div>

                      {shift.subShifts?.map((sub) => (
                        <div key={sub.id} className="relative pl-6 flex items-start gap-3">
                          <div className="absolute left-[19px] -top-6 bottom-1/2 w-[2px] bg-slate-200 rounded-bl-full" />
                          <div className="absolute left-[19px] top-1/2 w-4 h-[2px] bg-slate-200" />

                          <div
                            className={`p-2 rounded-lg ${
                              sub.type === 'Biometric'
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {sub.type === 'Biometric' ? (
                              <Fingerprint size={16} />
                            ) : (
                              <Briefcase size={16} />
                            )}
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-700 block">{sub.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium italic block">
                              {sub.condition}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-8 py-5 align-top">
                    <div className="flex flex-col gap-3">
                      {shift.category === 'Flexible' ? (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold text-violet-500 uppercase tracking-wider">
                              Flexible Schedule
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            {shift.workDays.map(day => (
                              <span key={day} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5 w-fit">
                            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider block">Required</span>
                            <span className="text-lg font-extrabold text-violet-700">
                              {shift.requiredHoursPerDay}h
                              <span className="text-xs font-bold text-violet-400">/day</span>
                            </span>
                          </div>
                          <span className="text-[9px] text-violet-400 font-medium mt-1 block">
                            Weekly: {((shift.requiredHoursPerDay || 0) * shift.workDays.length).toFixed(1)}h
                          </span>
                          {shift.policyNote && (
                            <p className="text-[10px] text-slate-400 italic mt-2 max-w-xs leading-relaxed">{shift.policyNote}</p>
                          )}
                        </div>
                      ) : shift.category === 'Compressed' ? (
                        <>
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">
                                Compressed · {calcNetHours(shift.compressedStartTime!, shift.compressedEndTime!, shift.compressedLunchIncluded ?? false, shift.compressedLunchBreakMinutes ?? 60)}h/day
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${(shift.compressedLunchIncluded ?? false) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                                {(shift.compressedLunchIncluded ?? false) ? `–${shift.compressedLunchBreakMinutes ?? 60}min lunch` : 'no lunch deducted'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                              {shift.workDays.map(day => {
                                const isOff = day === shift.compressedDayOff;
                                return (
                                  <span key={day} title={isOff ? `${day} — day off (compressed)` : day} className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${isOff ? 'bg-rose-50 text-rose-400 border-rose-200 line-through decoration-rose-300' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                    {day}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                              <span className="text-xs font-mono font-bold text-amber-700">
                                {formatTime(shift.compressedStartTime!)} – {formatTime(shift.compressedEndTime!)}
                              </span>
                            </div>
                            <span className="text-[9px] text-amber-500 font-medium mt-1 block">
                              Weekly: {(calcNetHours(shift.compressedStartTime!, shift.compressedEndTime!, shift.compressedLunchIncluded ?? false, shift.compressedLunchBreakMinutes ?? 60) * shift.workDays.filter(d => d !== shift.compressedDayOff).length).toFixed(1)}h
                            </span>
                            {shift.compressedDayOff && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Day Off:</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-500 border border-rose-100">
                                  {shift.compressedDayOff}
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                Non-Compressed · {calcNetHours(shift.startTime, shift.endTime, shift.lunchIncluded, shift.lunchBreakMinutes)}h/day
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${shift.lunchIncluded ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                {shift.lunchIncluded ? `–${shift.lunchBreakMinutes}min lunch` : 'no lunch deducted'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                              {shift.workDays.map(day => (
                                <span key={day} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  {day}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                              <span className="text-xs font-mono font-bold text-slate-700">
                                {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                              Weekly: {(calcNetHours(shift.startTime, shift.endTime, shift.lunchIncluded, shift.lunchBreakMinutes) * (shift.workDays?.length || 5)).toFixed(1)}h
                            </span>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              {calcNetHours(shift.startTime, shift.endTime, shift.lunchIncluded, shift.lunchBreakMinutes)}h/day
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${shift.lunchIncluded ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                              {shift.lunchIncluded ? `–${shift.lunchBreakMinutes}min lunch` : 'no lunch deducted'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                            {shift.workDays.map(day => (
                              <span key={day} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-medium mt-1 block">
                            Weekly: {(calcNetHours(shift.startTime, shift.endTime, shift.lunchIncluded, shift.lunchBreakMinutes) * (shift.workDays?.length || 5)).toFixed(1)}h
                          </span>
                        </div>
                      )}

                      {shift.subShifts?.map((sub) => (
                        <div key={sub.id}>
                          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-fit shadow-sm">
                            <span className="text-xs font-mono font-bold text-slate-600">
                              {formatTime(sub.startTime)} – {formatTime(sub.endTime)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Assignments */}
                  <td className="px-8 py-5 align-top">
                    <div className="flex items-center h-[40px] gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <Users size={14} className="text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-700">
                          {shift.assignedEmployees} Assigned
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenAssign(shift.id)}
                        className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all opacity-0 group-hover:opacity-100"
                        title="Manage Assignments"
                      >
                        <UserPlus size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5 text-right align-top">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity h-[40px] items-center">
                      <button
                        onClick={() => handleOpenModal(shift)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(shift.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30 mt-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">
            Showing {filteredShifts.length} Groups
          </span>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {editingId ? 'Edit Shift Group' : 'Create Shift Group'}
            </h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock size={20} />
            </div>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {/* Group Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Group Name
              </label>
              <input
                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                placeholder="e.g. Regular Day Shift"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Schedule Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Compressed', 'Flexible'] as ShiftCategory[]).map((cat) => {
                  const isActive = formData.category === cat;
                  const activeStyle =
                    cat === 'Standard' ? 'bg-indigo-50 border-indigo-400 text-indigo-700' :
                    cat === 'Compressed' ? 'bg-amber-50 border-amber-400 text-amber-700' :
                    'bg-violet-50 border-violet-400 text-violet-700';
                  const desc =
                    cat === 'Standard' ? 'Fixed start & end times' :
                    cat === 'Compressed' ? 'CWS with regular variant' :
                    'Required hours per day';
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat, isCompressible: cat === 'Compressed' })}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all ${isActive ? activeStyle : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className="text-xs font-bold">{cat}</span>
                      <span className="text-[10px] font-medium opacity-70 mt-0.5 text-left">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flexible Schedule Fields */}
            {formData.category === 'Flexible' && (
              <div className="space-y-4 bg-violet-50 p-5 rounded-2xl border border-violet-200">
                <h4 className="text-xs font-bold text-violet-700 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
                  Flexible Hours Policy
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-1">
                    Required Hours Per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    step="0.5"
                    className="w-full border border-violet-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-100 text-sm font-bold text-slate-900"
                    value={formData.requiredHoursPerDay ?? 8}
                    onChange={(e) => setFormData({ ...formData, requiredHoursPerDay: parseFloat(e.target.value) || 8 })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-2">
                    Work Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                          formData.workDays?.includes(day)
                            ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-100'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-1">
                    Policy Note
                  </label>
                  <textarea
                    className="w-full border border-violet-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-100 text-sm text-slate-700 resize-none"
                    rows={2}
                    placeholder="e.g. Must render 8 hours. Core hours: 10 AM – 3 PM."
                    value={formData.policyNote || ''}
                    onChange={(e) => setFormData({ ...formData, policyNote: e.target.value })}
                  />
                </div>
                <div className="bg-violet-100 border border-violet-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest block">Required Working Hours</span>
                    <span className="text-[10px] text-violet-500 font-medium">
                      {(formData.workDays?.length ?? 0) > 0 && `${((formData.requiredHoursPerDay || 8) * (formData.workDays?.length || 5)).toFixed(1)}h/week`}
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-violet-700">
                    {formData.requiredHoursPerDay || 8}h
                    <span className="text-sm font-bold text-violet-400">/day</span>
                  </span>
                </div>
              </div>
            )}

            {/* Standard / Non-Compressed Schedule */}
            {formData.category !== 'Flexible' && (
            <div className={`space-y-4 ${formData.category === 'Compressed' ? 'bg-slate-50 p-5 rounded-2xl border border-slate-200' : ''}`}>
              {formData.category === 'Compressed' && (
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />
                  Non-Compressed Schedule
                </h4>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Work Days (array-based) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Work Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                        formData.workDays?.includes(day)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lunch Break Toggle */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Lunch Break
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, lunchIncluded: !formData.lunchIncluded })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.lunchIncluded
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 block">
                      {formData.lunchIncluded ? 'Lunch Included in Shift Time' : 'Lunch Excluded from Shift Time'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      {formData.lunchIncluded
                        ? 'Lunch break is counted within the shift window and deducted from work hours.'
                        : 'Shift time already reflects pure working hours — no deduction applied.'}
                    </span>
                  </div>
                  <div className={`relative w-10 h-6 rounded-full transition-all shrink-0 ml-4 ${formData.lunchIncluded ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.lunchIncluded ? 'left-5' : 'left-1'}`} />
                  </div>
                </button>
                {formData.lunchIncluded && (
                  <div className="mt-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="120"
                      className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                      value={formData.lunchBreakMinutes ?? 60}
                      onChange={(e) => setFormData({ ...formData, lunchBreakMinutes: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>

              {/* Live Total Hours Preview */}
              {formData.startTime && formData.endTime && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest block">Total Working Hours</span>
                    <span className="text-[10px] text-indigo-400 font-medium">
                      {formData.lunchIncluded ? `Gross – ${formData.lunchBreakMinutes ?? 60}min lunch` : 'No lunch deducted'}
                      {(formData.workDays?.length ?? 0) > 0 && ` · ${(calcNetHours(formData.startTime, formData.endTime, formData.lunchIncluded ?? true, formData.lunchBreakMinutes ?? 60) * (formData.workDays?.length || 5)).toFixed(1)}h/week`}
                    </span>
                  </div>
                  <span className="text-2xl font-extrabold text-indigo-700">
                    {calcNetHours(formData.startTime, formData.endTime, formData.lunchIncluded ?? true, formData.lunchBreakMinutes ?? 60)}h
                    <span className="text-sm font-bold text-indigo-400">/day</span>
                  </span>
                </div>
              )}
            </div>
            )}

            {/* Compressed Schedule */}
            {formData.category === 'Compressed' && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    Compressed Schedule
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                          value={formData.compressedStartTime}
                          onChange={(e) =>
                            setFormData({ ...formData, compressedStartTime: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                          value={formData.compressedEndTime}
                          onChange={(e) =>
                            setFormData({ ...formData, compressedEndTime: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                        Work Days
                      </label>
                      <input
                        className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                        placeholder="e.g. Mon – Thu"
                        value={formData.compressedWorkdays}
                        onChange={(e) =>
                          setFormData({ ...formData, compressedWorkdays: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                        Compressed Day Off
                      </label>
                      <select
                        className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                        value={formData.compressedDayOff || ''}
                        onChange={(e) => setFormData({ ...formData, compressedDayOff: e.target.value })}
                      >
                        <option value="">-- None / Auto --</option>
                        {(formData.workDays || []).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-amber-600 mt-1">The day left out (rest day) when compressed schedule is active.</p>
                    </div>

                    {/* Compressed Lunch Toggle */}
                    <div>
                      <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">
                        Lunch Break
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, compressedLunchIncluded: !formData.compressedLunchIncluded })}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.compressedLunchIncluded
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-800">
                          {formData.compressedLunchIncluded ? 'Lunch Included in Compressed Time' : 'Lunch Excluded from Compressed Time'}
                        </span>
                        <div className={`relative w-10 h-6 rounded-full transition-all shrink-0 ml-4 ${formData.compressedLunchIncluded ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.compressedLunchIncluded ? 'left-5' : 'left-1'}`} />
                        </div>
                      </button>
                      {formData.compressedLunchIncluded && (
                        <div className="mt-2">
                          <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
                            Break Duration (minutes)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                            value={formData.compressedLunchBreakMinutes ?? 60}
                            onChange={(e) => setFormData({ ...formData, compressedLunchBreakMinutes: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      )}
                    </div>

                    {/* Live Compressed Hours Preview */}
                    {formData.compressedStartTime && formData.compressedEndTime && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Compressed Working Hours</span>
                          <span className="text-[10px] text-amber-500 font-medium">
                            {formData.compressedLunchIncluded ? `Gross – ${formData.compressedLunchBreakMinutes ?? 60}min lunch` : 'No lunch deducted'}
                          </span>
                        </div>
                        <span className="text-2xl font-extrabold text-amber-700">
                          {calcNetHours(formData.compressedStartTime, formData.compressedEndTime, formData.compressedLunchIncluded ?? false, formData.compressedLunchBreakMinutes ?? 60)}h
                          <span className="text-sm font-bold text-amber-400">/day</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Shifts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Conditional Sub-Shifts
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addSubShift('Biometric')}
                    className="px-3 py-1.5 text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100"
                  >
                    + Biometric
                  </button>
                  <button
                    type="button"
                    onClick={() => addSubShift('Official Business')}
                    className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-100"
                  >
                    + OB
                  </button>
                </div>
              </div>

              {formData.subShifts?.length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  No sub-shifts added. Add a Biometric or OB scenario above.
                </p>
              )}

              {formData.subShifts?.map((sub) => (
                <div
                  key={sub.id}
                  className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">{sub.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSubShift(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                        value={sub.startTime}
                        onChange={(e) =>
                          updateSubShift(sub.id, 'startTime', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                        value={sub.endTime}
                        onChange={(e) =>
                          updateSubShift(sub.id, 'endTime', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Condition
                    </label>
                    <input
                      className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                      value={sub.condition}
                      onChange={(e) =>
                        updateSubShift(sub.id, 'condition', e.target.value)
                      }
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-md active:scale-95"
              >
                Save Shift Group
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        className="max-w-2xl"
      >
        {(() => {
          const assigningShift = shifts.find(s => s.id === assigningShiftId);
          const totalFromOrgUnits = MOCK_ORG_UNITS.filter(u => selectedOrgUnits.has(u.id)).reduce((s, u) => s + u.employeeCount, 0);
          const totalFromPositions = MOCK_POSITIONS.filter(p => selectedPositions.has(p.id)).reduce((s, p) => s + p.employeeCount, 0);
          const totalFromGroups = MOCK_EMPLOYEE_GROUPS.filter(g => selectedGroups.has(g.id)).reduce((s, g) => s + g.employeeCount, 0);
          const grandTotal = totalFromOrgUnits + totalFromPositions + totalFromGroups + selectedEmployees.size;

          const tabs = [
            { key: 'org-unit' as const, label: 'Org Unit', icon: <Users size={13} /> },
            { key: 'position' as const, label: 'Position', icon: <Briefcase size={13} /> },
            { key: 'individual' as const, label: 'Individual', icon: <UserPlus size={13} /> },
            { key: 'group' as const, label: 'Group', icon: <CalendarDays size={13} /> },
          ];

          const filteredOrgUnits = MOCK_ORG_UNITS.filter(u =>
            u.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
            u.type.toLowerCase().includes(assignSearch.toLowerCase())
          );
          const filteredPositions = MOCK_POSITIONS.filter(p =>
            p.title.toLowerCase().includes(assignSearch.toLowerCase()) ||
            p.department.toLowerCase().includes(assignSearch.toLowerCase())
          );
          const filteredEmployees = MOCK_EMPLOYEES_FOR_ASSIGN.filter(e =>
            e.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
            e.role.toLowerCase().includes(assignSearch.toLowerCase()) ||
            e.dept.toLowerCase().includes(assignSearch.toLowerCase())
          );
          const filteredGroups = MOCK_EMPLOYEE_GROUPS.filter(g =>
            g.name.toLowerCase().includes(assignSearch.toLowerCase()) ||
            g.description.toLowerCase().includes(assignSearch.toLowerCase())
          );

          return (
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Assign to Shift</h3>
                  {assigningShift && (
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {assigningShift.name}
                    </p>
                  )}
                </div>
                {grandTotal > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <Users size={13} className="text-indigo-500" />
                    <span className="text-xs font-bold text-indigo-700">{grandTotal} to assign</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl">
                {tabs.map(tab => {
                  const count =
                    tab.key === 'org-unit' ? selectedOrgUnits.size :
                    tab.key === 'position' ? selectedPositions.size :
                    tab.key === 'individual' ? selectedEmployees.size :
                    selectedGroups.size;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => { setAssignTab(tab.key); setAssignSearch(''); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        assignTab === tab.key
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {count > 0 && (
                        <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder={
                    assignTab === 'org-unit' ? 'Search departments, teams...' :
                    assignTab === 'position' ? 'Search positions...' :
                    assignTab === 'individual' ? 'Search employees...' :
                    'Search groups...'
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700"
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                />
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {/* Org Unit Tab */}
                {assignTab === 'org-unit' && (
                  <>
                    {filteredOrgUnits.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">No org units found.</p>
                    )}
                    {filteredOrgUnits.map(unit => {
                      const isSelected = selectedOrgUnits.has(unit.id);
                      return (
                        <div
                          key={unit.id}
                          onClick={() => {
                            const next = new Set(selectedOrgUnits);
                            isSelected ? next.delete(unit.id) : next.add(unit.id);
                            setSelectedOrgUnits(next);
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                              <Users size={15} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{unit.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{unit.type} · {unit.employeeCount} employees</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={11} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Position Tab */}
                {assignTab === 'position' && (
                  <>
                    {filteredPositions.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">No positions found.</p>
                    )}
                    {filteredPositions.map(pos => {
                      const isSelected = selectedPositions.has(pos.id);
                      return (
                        <div
                          key={pos.id}
                          onClick={() => {
                            const next = new Set(selectedPositions);
                            isSelected ? next.delete(pos.id) : next.add(pos.id);
                            setSelectedPositions(next);
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                              <Briefcase size={15} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{pos.title}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{pos.department} · {pos.employeeCount} employees</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={11} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Individual Tab */}
                {assignTab === 'individual' && (
                  <>
                    {filteredEmployees.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">No employees found.</p>
                    )}
                    {filteredEmployees.map(emp => {
                      const isSelected = selectedEmployees.has(emp.id);
                      return (
                        <div
                          key={emp.id}
                          onClick={() => toggleEmployeeSelect(emp.id)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{emp.role} · {emp.dept}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={11} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Group Tab */}
                {assignTab === 'group' && (
                  <>
                    {filteredGroups.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">No groups found.</p>
                    )}
                    {filteredGroups.map(grp => {
                      const isSelected = selectedGroups.has(grp.id);
                      return (
                        <div
                          key={grp.id}
                          onClick={() => {
                            const next = new Set(selectedGroups);
                            isSelected ? next.delete(grp.id) : next.add(grp.id);
                            setSelectedGroups(next);
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                              <CalendarDays size={15} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{grp.name}</p>
                              <p className="text-[11px] text-slate-400 font-medium">{grp.description} · {grp.employeeCount} employees</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={11} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Selection Summary */}
              {grandTotal > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selection Summary</p>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_ORG_UNITS.filter(u => selectedOrgUnits.has(u.id)).map(u => (
                      <span key={u.id} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700">
                        <Users size={11} />
                        {u.name}
                        <span className="text-indigo-400 font-medium">({u.employeeCount})</span>
                        <button type="button" onClick={() => { const n = new Set(selectedOrgUnits); n.delete(u.id); setSelectedOrgUnits(n); }} className="ml-0.5 text-indigo-300 hover:text-rose-500">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {MOCK_POSITIONS.filter(p => selectedPositions.has(p.id)).map(p => (
                      <span key={p.id} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700">
                        <Briefcase size={11} />
                        {p.title}
                        <span className="text-indigo-400 font-medium">({p.employeeCount})</span>
                        <button type="button" onClick={() => { const n = new Set(selectedPositions); n.delete(p.id); setSelectedPositions(n); }} className="ml-0.5 text-indigo-300 hover:text-rose-500">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {MOCK_EMPLOYEE_GROUPS.filter(g => selectedGroups.has(g.id)).map(g => (
                      <span key={g.id} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700">
                        <CalendarDays size={11} />
                        {g.name}
                        <span className="text-indigo-400 font-medium">({g.employeeCount})</span>
                        <button type="button" onClick={() => { const n = new Set(selectedGroups); n.delete(g.id); setSelectedGroups(n); }} className="ml-0.5 text-indigo-300 hover:text-rose-500">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {MOCK_EMPLOYEES_FOR_ASSIGN.filter(e => selectedEmployees.has(e.id)).map(e => (
                      <span key={e.id} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700">
                        {e.name}
                        <button type="button" onClick={() => toggleEmployeeSelect(e.id)} className="ml-0.5 text-indigo-300 hover:text-rose-500">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400 font-medium">
                  {grandTotal > 0 ? `${grandTotal} employee${grandTotal !== 1 ? 's' : ''} will be assigned` : 'Select items above to assign'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveAssignment}
                  disabled={grandTotal === 0}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Assignments
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};

export default ShiftManagement;