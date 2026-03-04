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

  lastModifiedBy: string;
  lastModified: string;
  isDefault?: boolean;
  subShifts?: SubShift[];
  assignedEmployees: number;
}

// --- Mock Data ---
const MOCK_SHIFTS: Shift[] = [
  {
    id: '1',
    name: 'Standard Regular Shift',
    isCompressible: false,
    workHours: 8,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // your version
    workdays: 'Mon – Fri', // main version
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
    id: '2',
    name: 'Sales Flexi Group',
    isCompressible: false,
    workHours: 9,
    startTime: '09:00',
    endTime: '18:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
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
    id: '3',
    name: 'Weekend Support',
    isCompressible: false,
    workHours: 8,
    startTime: '09:00',
    endTime: '18:00',
    workDays: ['Sat', 'Sun'],
    workdays: 'Sat – Sun',
    lastModifiedBy: 'System Admin',
    lastModified: 'Aug 1, 2025 09:00',
    isDefault: false,
    assignedEmployees: 12
  },
  {
    id: '4',
    name: 'NSWP',
    isCompressible: false,
    workHours: 8,
    startTime: '08:00',
    endTime: '17:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lastModifiedBy: 'System Admin',
    lastModified: 'Sep 15, 2025 10:00',
    isDefault: false,
    assignedEmployees: 28
  },
  {
    id: '5',
    name: 'CWS Production Group',
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
    lastModifiedBy: 'Louis Panganiban',
    lastModified: 'Jan 10, 2026 08:00',
    isDefault: false,
    assignedEmployees: 64
  },
  {
    id: '6',
    name: 'Night Shift',
    isCompressible: false,
    workHours: 8,
    startTime: '22:00',
    endTime: '06:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:00',
    isDefault: false,
    assignedEmployees: 35
  },
  {
    id: '7',
    name: 'Mid Shift',
    isCompressible: false,
    workHours: 8,
    startTime: '14:00',
    endTime: '22:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:15',
    isDefault: false,
    assignedEmployees: 22
  },
  {
    id: '8',
    name: 'Early Morning Shift',
    isCompressible: false,
    workHours: 8,
    startTime: '06:00',
    endTime: '14:00',
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workdays: 'Mon – Fri',
    lastModifiedBy: 'System Admin',
    lastModified: 'Oct 5, 2025 09:30',
    isDefault: false,
    assignedEmployees: 18
  },
  {
    id: '9',
    name: 'IT Support CWS',
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
    isCompressible: true,
    // Non-compressed (9-hour workday, Mon–Fri)
    workHours: 9,
    startTime: '08:00',
    endTime: '17:00',
    workdays: 'Mon – Fri',
    // Compressed (10-hour workday, Mon–Fri)
    compressedWorkHours: 10,
    compressedStartTime: '08:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Fri',
    lastModifiedBy: 'Sarah Wilson',
    lastModified: 'Feb 3, 2026 14:30',
    isDefault: false,
    assignedEmployees: 56
  }
];

const MOCK_EMPLOYEES_FOR_ASSIGN = [
  { id: '1', name: 'Sarah Wilson', role: 'HR Manager', dept: 'HR' },
  { id: '2', name: 'John Doe', role: 'Senior Dev', dept: 'IT' },
  { id: '3', name: 'Jane Smith', role: 'Junior Dev', dept: 'IT' },
  { id: '4', name: 'Mike Brown', role: 'Payroll Specialist', dept: 'Finance' },
  { id: '5', name: 'Alice Guo', role: 'Marketing Lead', dept: 'Marketing' },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ShiftManagement: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [assigningShiftId, setAssigningShiftId] = useState<string | null>(null);

  // Create/Edit Form State
  const [formData, setFormData] = useState<Partial<Shift>>({
    name: '',
    isCompressible: false,
    startTime: '09:00',
    endTime: '18:00',

    // ARRAY version (your logic)
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],

    // STRING version (main)
    workdays: 'Mon – Fri',

    // compressed schedule defaults
    compressedStartTime: '06:00',
    compressedEndTime: '18:00',
    compressedWorkdays: 'Mon – Thu',

    isDefault: false,
    subShifts: []
  });

  // Assignment Form State
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  const handleOpenModal = (shift?: Shift) => {
    if (shift) {
      setEditingId(shift.id);
      setFormData({ ...shift });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        isCompressible: false,
        startTime: '09:00',
        endTime: '18:00',
        workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        workdays: 'Mon – Fri',
        compressedStartTime: '06:00',
        compressedEndTime: '18:00',
        compressedWorkdays: 'Mon – Thu',
        isDefault: false,
        subShifts: []
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenAssign = (shiftId: string) => {
    setAssigningShiftId(shiftId);
    setSelectedEmployees(new Set());
    setIsAssignModalOpen(true);
  };

  const calcHours = (start: string, end: string) => {
    const s = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const e = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    let mins = e - s;
    if (mins < 0) mins += 24 * 60;
    return Math.round(mins / 60);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startTime || !formData.endTime) return;

    const payload: Shift = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      isCompressible: formData.isCompressible || false,

      // hours
      workHours: calcHours(formData.startTime!, formData.endTime!),

      startTime: formData.startTime!,
      endTime: formData.endTime!,

      // ARRAY version
      workDays: formData.workDays || [],

      // STRING version
      workdays: formData.workdays || 'Mon – Fri',

      // compressed schedule
      ...(formData.isCompressible && {
        compressedWorkHours: calcHours(
          formData.compressedStartTime!,
          formData.compressedEndTime!
        ),
        compressedStartTime: formData.compressedStartTime,
        compressedEndTime: formData.compressedEndTime,
        compressedWorkdays: formData.compressedWorkdays || 'Mon – Thu'
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
    setShifts(
      shifts.map(s =>
        s.id === assigningShiftId
          ? { ...s, assignedEmployees: s.assignedEmployees + selectedEmployees.size }
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
                  Active Days
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
                            {shift.isCompressible && (
                              <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">
                                CWS
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {shift.isCompressible ? 'Compressed Work Schedule' : 'Standard Config'}
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
                      {shift.isCompressible ? (
                        <>
                          <div>
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                              Compressed · {shift.compressedWorkdays} · {shift.compressedWorkHours}h
                            </span>
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                              <span className="text-xs font-mono font-bold text-amber-700">
                                {formatTime(shift.compressedStartTime!)} – {formatTime(shift.compressedEndTime!)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              Non-Compressed · {shift.workdays} · {shift.workHours}h
                            </span>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                              <span className="text-xs font-mono font-bold text-slate-700">
                                {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            {shift.workdays} · {shift.workHours}h
                          </span>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                            </span>
                          </div>
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

                  {/* Active Days */}
                  <td className="px-8 py-5 align-top">
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-1 h-[40px] items-center">
                        {DAYS_OF_WEEK.map((day) => (
                          <div
                            key={day}
                            className={`w-5 h-5 flex items-center justify-center rounded text-[8px] font-bold ${
                              shift.workDays.includes(day)
                                ? 'bg-slate-800 text-white'
                                : 'bg-slate-100 text-slate-300'
                            }`}
                          >
                            {day[0]}
                          </div>
                        ))}
                      </div>

                      {shift.subShifts?.map((sub) => (
                        <div key={sub.id} className="flex gap-1 h-[40px] items-center">
                          {DAYS_OF_WEEK.map((day) => (
                            <div
                              key={day}
                              className={`w-4 h-4 flex items-center justify-center rounded text-[7px] font-bold ${
                                sub.workDays.includes(day)
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-50 text-slate-200'
                              }`}
                            >
                              {day[0]}
                            </div>
                          ))}
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

            {/* Compressible Toggle */}
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, isCompressible: !formData.isCompressible })
              }
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                formData.isCompressible
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-left">
                <span className="text-sm font-bold text-slate-800 block">
                  Compressible Work Schedule (CWS)
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {formData.isCompressible
                    ? 'Define both a compressed and a non-compressed version of this shift.'
                    : 'Enable to configure a compressed and non-compressed variant of this shift.'}
                </span>
              </div>
              <div
                className={`relative w-10 h-6 rounded-full transition-all shrink-0 ml-4 ${
                  formData.isCompressible ? 'bg-amber-500' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    formData.isCompressible ? 'left-5' : 'left-1'
                  }`}
                />
              </div>
            </button>

            {/* Non-Compressed Schedule */}
            {!formData.isCompressible && (
              <div className="space-y-4">
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
              </div>
            )}

            {/* Compressed Schedule */}
            {formData.isCompressible && (
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

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Active Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleSubShiftDay(sub.id, day)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                            sub.workDays.includes(day)
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
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
        className="max-w-lg"
      >
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Assign Employees</h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {MOCK_EMPLOYEES_FOR_ASSIGN.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                  <p className="text-xs text-slate-500">
                    {emp.role} · {emp.dept}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEmployeeSelect(emp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedEmployees.has(emp.id)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {selectedEmployees.has(emp.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveAssignment}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-md active:scale-95"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShiftManagement;