
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
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
}

interface Shift {
  id: string;
  name: string;
  isCompressible: boolean;
  // Regular / Non-compressed schedule
  workHours: number;
  startTime: string;
  endTime: string;
  workdays: string;
  // Compressed schedule (only when isCompressible = true)
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
    workdays: 'Mon – Fri',
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
        condition: 'Clock-in between 06:30 AM – 07:30 AM'
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
        condition: 'Approved OB Application'
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
    // Non-compressed version (10-hour workday, Mon–Fri)
    workHours: 10,
    startTime: '08:00',
    endTime: '18:00',
    workdays: 'Mon – Fri',
    // Compressed version (12-hour workday, Mon–Thu)
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
    // Non-compressed (9-hour workday, Mon–Fri)
    workHours: 9,
    startTime: '09:00',
    endTime: '18:00',
    workdays: 'Mon – Fri',
    // Compressed (12-hour workday, Mon–Thu)
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
        condition: 'Approved OB Application'
      }
    ]
  }
];

const MOCK_EMPLOYEES_FOR_ASSIGN = [
  { id: '1', name: 'Sarah Wilson', role: 'HR Manager', dept: 'HR' },
  { id: '2', name: 'John Doe', role: 'Senior Dev', dept: 'IT' },
  { id: '3', name: 'Jane Smith', role: 'Junior Dev', dept: 'IT' },
  { id: '4', name: 'Mike Brown', role: 'Payroll Specialist', dept: 'Finance' },
  { id: '5', name: 'Alice Guo', role: 'Marketing Lead', dept: 'Marketing' },
];

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
    workdays: 'Mon – Fri',
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
    setSelectedEmployees(new Set()); // Reset selection
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
      workHours: calcHours(formData.startTime!, formData.endTime!),
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      workdays: formData.workdays || 'Mon – Fri',
      ...(formData.isCompressible && {
        compressedWorkHours: calcHours(formData.compressedStartTime!, formData.compressedEndTime!),
        compressedStartTime: formData.compressedStartTime,
        compressedEndTime: formData.compressedEndTime,
        compressedWorkdays: formData.compressedWorkdays || 'Mon – Thu',
      }),
      lastModifiedBy: 'Current User',
      lastModified: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
      isDefault: formData.isDefault,
      subShifts: formData.subShifts || [],
      assignedEmployees: editingId ? (shifts.find(s => s.id === editingId)?.assignedEmployees || 0) : 0
    };

    if (editingId) {
      setShifts(shifts.map(s => s.id === editingId ? payload : s));
    } else {
      setShifts([...shifts, payload]);
    }
    setIsModalOpen(false);
  };

  const handleSaveAssignment = () => {
    if (!assigningShiftId) return;
    setShifts(shifts.map(s => s.id === assigningShiftId ? { ...s, assignedEmployees: s.assignedEmployees + selectedEmployees.size } : s));
    setIsAssignModalOpen(false);
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
      condition: type === 'Biometric' ? 'Detected Entry range...' : 'Approved Application'
    };
    setFormData({ ...formData, subShifts: [...(formData.subShifts || []), newSub] });
  };

  const updateSubShift = (id: string, field: keyof SubShift, value: any) => {
    const updated = formData.subShifts?.map(s => s.id === id ? { ...s, [field]: value } : s);
    setFormData({ ...formData, subShifts: updated });
  };

  const removeSubShift = (id: string) => {
    setFormData({ ...formData, subShifts: formData.subShifts?.filter(s => s.id !== id) });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const filteredShifts = shifts.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <p className="text-slate-500 font-medium mt-1">Configure default schedules and conditional sub-shifts.</p>
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
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Shift Group / Scenarios</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assignments</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredShifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-8 py-5 align-top">
                    <div className="flex flex-col gap-4">
                      {/* Default Shift */}
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                            {shift.name}
                            {shift.isDefault && <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Default</span>}
                            {shift.isCompressible && <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">CWS</span>}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {shift.isCompressible ? 'Compressed Work Schedule' : 'Standard Config'}
                          </span>
                        </div>
                      </div>

                      {/* Sub Shifts (Tree View) */}
                      {shift.subShifts && shift.subShifts.map((sub, idx) => (
                        <div key={sub.id} className="relative pl-6 flex items-start gap-3">
                          {/* Lines */}
                          <div className="absolute left-[19px] -top-6 bottom-1/2 w-[2px] bg-slate-200 rounded-bl-full"></div>
                          <div className="absolute left-[19px] top-1/2 w-4 h-[2px] bg-slate-200"></div>

                          <div className={`p-2 rounded-lg ${sub.type === 'Biometric' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'}`}>
                            {sub.type === 'Biometric' ? <Fingerprint size={16} /> : <Briefcase size={16} />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 block">{sub.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium italic block">{sub.condition}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-8 py-5 align-top">
                    <div className="flex flex-col gap-3">
                      {shift.isCompressible ? (
                        <>
                          {/* Compressed */}
                          <div>
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block mb-1">Compressed · {shift.compressedWorkdays} · {shift.compressedWorkHours}h</span>
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                              <span className="text-xs font-mono font-bold text-amber-700">
                                {formatTime(shift.compressedStartTime!)} – {formatTime(shift.compressedEndTime!)}
                              </span>
                            </div>
                          </div>
                          {/* Non-Compressed */}
                          <div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Non-Compressed · {shift.workdays} · {shift.workHours}h</span>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                              <span className="text-xs font-mono font-bold text-slate-700">
                                {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{shift.workdays} · {shift.workHours}h</span>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                            <span className="text-xs font-mono font-bold text-slate-700">
                              {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Sub Shift Times */}
                      {shift.subShifts && shift.subShifts.map(sub => (
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

                  <td className="px-8 py-5 align-top">
                    <div className="flex items-center h-[40px] gap-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <Users size={14} className="text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-700">{shift.assignedEmployees} Assigned</span>
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

                  <td className="px-8 py-5 text-right align-top">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity h-[40px] items-center">
                      <button onClick={() => handleOpenModal(shift)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(shift.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Showing {filteredShifts.length} Groups</span>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50"><ChevronLeft size={16} /></button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Shift Group' : 'Create Shift Group'}</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={20} /></div>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">

            {/* Group Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Group Name</label>
              <input
                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                placeholder="e.g. Regular Day Shift"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Compressible Toggle */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isCompressible: !formData.isCompressible })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.isCompressible ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className="text-left">
                <span className="text-sm font-bold text-slate-800 block">Compressible Work Schedule (CWS)</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  {formData.isCompressible
                    ? 'Define both a compressed and a non-compressed version of this shift.'
                    : 'Enable to configure a compressed and non-compressed variant of this shift.'}
                </span>
              </div>
              <div className={`relative w-10 h-6 rounded-full transition-all shrink-0 ml-4 ${formData.isCompressible ? 'bg-amber-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.isCompressible ? 'left-5' : 'left-1'}`} />
              </div>
            </button>

            {formData.isCompressible ? (
              <div className="space-y-4">
                {/* Compressed Schedule */}
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    Compressed Schedule
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Start Time</label>
                        <input type="time" className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                          value={formData.compressedStartTime} onChange={e => setFormData({ ...formData, compressedStartTime: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">End Time</label>
                        <input type="time" className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                          value={formData.compressedEndTime} onChange={e => setFormData({ ...formData, compressedEndTime: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Work Days</label>
                      <input className="w-full border border-amber-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-100 text-sm font-bold text-slate-900"
                        placeholder="e.g. Mon – Thu"
                        value={formData.compressedWorkdays} onChange={e => setFormData({ ...formData, compressedWorkdays: e.target.value })} />
                    </div>
                    {formData.compressedStartTime && formData.compressedEndTime && (
                      <p className="text-[11px] text-amber-600 font-bold">
                        ≈ {calcHours(formData.compressedStartTime, formData.compressedEndTime)} hrs/day
                      </p>
                    )}
                  </div>
                </div>

                {/* Non-Compressed Schedule */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Non-Compressed Schedule
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Time</label>
                        <input type="time" className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                          value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">End Time</label>
                        <input type="time" className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                          value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Work Days</label>
                      <input className="w-full border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900"
                        placeholder="e.g. Mon – Fri"
                        value={formData.workdays} onChange={e => setFormData({ ...formData, workdays: e.target.value })} />
                    </div>
                    {formData.startTime && formData.endTime && (
                      <p className="text-[11px] text-slate-500 font-bold">
                        ≈ {calcHours(formData.startTime, formData.endTime)} hrs/day
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular (non-compressible) config */
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Schedule Configuration</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Start Time</label>
                      <input type="time" className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                        value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">End Time</label>
                      <input type="time" className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                        value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Work Days</label>
                    <input className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                      placeholder="e.g. Mon – Fri"
                      value={formData.workdays} onChange={e => setFormData({ ...formData, workdays: e.target.value })} />
                  </div>
                  {formData.startTime && formData.endTime && (
                    <p className="text-[11px] text-slate-500 font-bold">
                      ≈ {calcHours(formData.startTime, formData.endTime)} hrs/day
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Sub Shifts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Conditional Sub-Shifts</h4>
                <div className="flex gap-2">
                  <button onClick={() => addSubShift('Biometric')} className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors flex items-center gap-1"><Plus size={10} /> Biometric</button>
                  <button onClick={() => addSubShift('Official Business')} className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded hover:bg-amber-100 transition-colors flex items-center gap-1"><Plus size={10} /> OB</button>
                </div>
              </div>

              {formData.subShifts?.map((sub, idx) => (
                <div key={sub.id} className="relative p-4 rounded-xl border border-slate-200 bg-white shadow-sm group">
                  {/* Connector Visual inside modal */}
                  <div className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300"></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${sub.type === 'Biometric' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
                        {sub.type === 'Biometric' ? <Fingerprint size={14} /> : <Briefcase size={14} />}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{sub.type} Variant</span>
                    </div>
                    <button onClick={() => removeSubShift(sub.id)} className="text-slate-300 hover:text-rose-500"><X size={14} /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Variant Name</label>
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500" value={sub.name} onChange={e => updateSubShift(sub.id, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Trigger Condition</label>
                      <input className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-indigo-500" value={sub.condition} onChange={e => updateSubShift(sub.id, 'condition', e.target.value)} placeholder="e.g. Clock in 7am-8am" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">Start:</span>
                      <input type="time" className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold outline-none" value={sub.startTime} onChange={e => updateSubShift(sub.id, 'startTime', e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500">End:</span>
                      <input type="time" className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold outline-none" value={sub.endTime} onChange={e => updateSubShift(sub.id, 'endTime', e.target.value)} />
                    </div>
                  </div>

                </div>
              ))}
              {(!formData.subShifts || formData.subShifts.length === 0) && (
                <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs italic">
                  No sub-shifts configured. Employees will strictly follow default time.
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.isDefault ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                {formData.isDefault && <Check size={12} className="text-white" />}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block">Set as Default Group</span>
                <span className="text-[10px] text-slate-400 font-medium block">New employees will automatically be assigned this schedule group.</span>
              </div>
            </label>

            <div className="pt-4 flex gap-3">
              <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                {editingId ? 'Save Changes' : 'Create Group'}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} className="max-w-lg">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Assign Employees</h3>
              <p className="text-xs text-slate-500 font-medium">Add members to this shift group.</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100">
              {selectedEmployees.size} Selected
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[400px] flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <input
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:border-indigo-500"
                placeholder="Search employees..."
              />
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {MOCK_EMPLOYEES_FOR_ASSIGN.map(emp => {
                const isSelected = selectedEmployees.has(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployeeSelect(emp.id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                  >
                    <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                      {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{emp.name}</div>
                      <div className="text-[10px] text-slate-500">{emp.role} • {emp.dept}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button onClick={handleSaveAssignment} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 text-sm">
              Confirm Assignment
            </button>
            <button onClick={() => setIsAssignModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShiftManagement;
