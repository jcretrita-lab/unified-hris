
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Save, 
  FileCheck,
  Users,
  Briefcase,
  User,
  GripVertical,
  Trash2,
  X,
  Filter,
  UserPlus,
  Check,
  UserCog,
  ArrowRight as ArrowRightIcon,
  Calendar,
  Clock,
  AlertCircle,
  ShieldAlert,
  Building2,
  CalendarDays,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

// --- MOCK DATA ---
interface Approver {
  id: string;
  orderLabel: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
  lastModifiedBy: string;
  lastModified: string;
  // Delegation Fields
  delegateId?: string;
  delegateName?: string;
  delegateAvatar?: string;
  delegateStartDate?: string;
  delegateEndDate?: string;
  // Co-Approver Fields (Dual Approval)
  secondaryId?: string;
  secondaryName?: string;
  secondaryAvatar?: string;
  secondaryRole?: string;
}

interface ApprovalSetup {
  id: string;
  name: string;
  connectedEmployees: number;
  dateAdded: string;
  lastModifiedBy: string;
  lastModified: string;
  feature: string;
  autoRejectDays: number;
  // New Fields
  department?: string; // Serves as Unit Target
  unitType?: string;   // Serves as Unit Type
  startDate?: string;
  endDate?: string;
  approvers: Approver[];
}

const MOCK_SETUPS: ApprovalSetup[] = [
  {
    id: '1',
    name: 'IT Leave Request',
    connectedEmployees: 12,
    dateAdded: 'Sept 23, 2024',
    lastModifiedBy: 'Louis Panganiban',
    lastModified: 'Aug 8, 2025 23:56',
    feature: 'Leave Management',
    autoRejectDays: 7,
    department: 'IT Department',
    unitType: 'Department',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    approvers: [
      { 
        id: 'a1', 
        orderLabel: 'Approver 1', 
        name: 'Sarah Geronimo', 
        role: 'Team Lead', 
        avatar: 'SG', 
        department: 'IT Department', 
        lastModifiedBy: 'Louis Panganiban', 
        lastModified: 'Aug 8, 2025' 
      },
      { 
        id: 'a2', 
        orderLabel: 'Verifier 1', 
        name: 'Alex Thompson', 
        role: 'HR Manager', 
        avatar: 'AT', 
        department: 'HR Department', 
        lastModifiedBy: 'Juan Dela Cruz', 
        lastModified: 'Aug 8, 2025',
        // Mock Delegation
        delegateId: 'emp-5',
        delegateName: 'Minato Gottenburg',
        delegateAvatar: 'MG',
        delegateStartDate: '2025-08-10',
        delegateEndDate: '2025-08-15'
      }
    ]
  },
  {
    id: '2',
    name: 'Official Business (OB)',
    connectedEmployees: 45,
    dateAdded: 'Sept 2, 2024',
    lastModifiedBy: 'Juan Dela Cruz',
    lastModified: 'Aug 8, 2025 12:05',
    feature: 'Time & Attendance',
    autoRejectDays: 0,
    startDate: '2025-01-01',
    approvers: []
  },
  {
    id: '3',
    name: 'Overtime Request',
    connectedEmployees: 8,
    dateAdded: 'Sept 1, 2023',
    lastModifiedBy: 'Juan Dela Cruz',
    lastModified: 'Aug 8, 2025 12:05',
    feature: 'Time & Attendance',
    autoRejectDays: 3,
    approvers: []
  },
];

const INITIAL_ASSIGNED_EMPLOYEES = [
  { id: 'emp-2', name: 'John Doe', role: 'Senior Developer', department: 'IT', avatar: 'JD', email: 'john@company.com' },
  { id: 'emp-3', name: 'Jane Smith', role: 'Junior Developer', department: 'IT', avatar: 'JS', email: 'jane@company.com' },
  { id: 'emp-5', name: 'Minato Gottenburg', role: 'IT Developer Intern', department: 'IT', avatar: 'MG', email: 'minato@company.com' },
  { id: 'emp-8', name: 'Emily Davis', role: 'UX Designer', department: 'Design', avatar: 'ED', email: 'emily@company.com' },
];

const ALL_EMPLOYEES = [
  { id: 'emp-1', name: 'Sarah Wilson', role: 'HR Manager', department: 'HR', avatar: 'SW', email: 'sarah@company.com' },
  { id: 'emp-2', name: 'John Doe', role: 'Senior Developer', department: 'IT', avatar: 'JD', email: 'john@company.com' },
  { id: 'emp-3', name: 'Jane Smith', role: 'Junior Developer', department: 'IT', avatar: 'JS', email: 'jane@company.com' },
  { id: 'emp-4', name: 'Mike Brown', role: 'Payroll Specialist', department: 'Finance', avatar: 'MB', email: 'mike@company.com' },
  { id: 'emp-5', name: 'Minato Gottenburg', role: 'IT Developer Intern', department: 'IT', avatar: 'MG', email: 'minato@company.com' },
  { id: 'emp-6', name: 'Alice Guo', role: 'Marketing Lead', department: 'Marketing', avatar: 'AG', email: 'alice@company.com' },
  { id: 'emp-7', name: 'Robert Chen', role: 'Product Owner', department: 'Product', avatar: 'RC', email: 'robert@company.com' },
  { id: 'emp-8', name: 'Emily Davis', role: 'UX Designer', department: 'Design', avatar: 'ED', email: 'emily@company.com' },
];

const MOCK_ORG_DATA: Record<string, string[]> = {
  'Division': ['Engineering', 'Corporate Services', 'Sales & Marketing', 'Operations'],
  'Department': ['IT Department', 'HR Department', 'Finance', 'Marketing', 'Product', 'Design'],
  'Team': ['Backend Team', 'Frontend Team', 'QA Team', 'Recruitment Team', 'Payroll Team', 'Creative Team']
};

const DEPARTMENTS = MOCK_ORG_DATA['Department']; // Fallback for employee filters

const ApprovalSetupPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [activeSetup, setActiveSetup] = useState<ApprovalSetup | null>(null);
  const [activeTab, setActiveTab] = useState<'General Settings' | 'Manage Employees'>('General Settings');
  
  // State for Assigned Employees
  const [assignedEmployees, setAssignedEmployees] = useState(INITIAL_ASSIGNED_EMPLOYEES);

  // Editor State
  const [editorName, setEditorName] = useState('');
  const [editorFeature, setEditorFeature] = useState('');
  const [editorAutoReject, setEditorAutoReject] = useState(0);
  
  // Unit / Org State
  const [editorUnitType, setEditorUnitType] = useState('Department');
  const [editorUnitTarget, setEditorUnitTarget] = useState('');

  const [editorStartDate, setEditorStartDate] = useState('');
  const [editorEndDate, setEditorEndDate] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'approver' | 'assignee' | 'delegate' | 'co-approver'>('assignee');
  const [activeApproverId, setActiveApproverId] = useState<string | null>(null); // For delegate/co-approver logic
  
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeDept, setEmployeeDept] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const MotionDiv = motion.div as any;

  const handleEdit = (setup: ApprovalSetup) => {
    setActiveSetup({ ...setup }); 
    setEditorName(setup.name);
    setEditorFeature(setup.feature);
    setEditorAutoReject(setup.autoRejectDays || 0);
    setEditorUnitType(setup.unitType || 'Department');
    setEditorUnitTarget(setup.department || '');
    setEditorStartDate(setup.startDate || '');
    setEditorEndDate(setup.endDate || '');
    
    setAssignedEmployees(INITIAL_ASSIGNED_EMPLOYEES);
    setViewMode('editor');
    setActiveTab('General Settings');
  };

  const handleCreate = () => {
    const newSetup: ApprovalSetup = {
      id: Math.random().toString(),
      name: '',
      connectedEmployees: 0,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastModifiedBy: 'Current User',
      lastModified: 'Just now',
      feature: 'Leave Management',
      autoRejectDays: 0,
      approvers: []
    };
    handleEdit(newSetup);
  };

  const handleDeleteApprover = (id: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.filter(a => a.id !== id);
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  const handleDeleteAssignee = (id: string) => {
    setAssignedEmployees(assignedEmployees.filter(e => e.id !== id));
  };

  // --- Department Auto-fill Logic ---
  const handleUnitTargetChange = (target: string) => {
    setEditorUnitTarget(target);
    
    // Simulate Inheritance Logic
    if (target && activeSetup) {
      // Create mock inherited approvers based on the selected department
      const inheritedApprovers: Approver[] = [
        {
          id: `inh-${Math.random()}`,
          orderLabel: 'Step 1 (Inherited)',
          name: `${target} Lead`,
          role: 'Team Lead',
          department: target,
          avatar: 'TL',
          lastModifiedBy: 'System',
          lastModified: 'Auto-filled'
        },
        {
          id: `inh-${Math.random()}`,
          orderLabel: 'Step 2 (Inherited)',
          name: `${target} Manager`,
          role: 'Manager',
          department: target,
          avatar: 'MG',
          lastModifiedBy: 'System',
          lastModified: 'Auto-filled'
        }
      ];
      
      // Auto-fill (Overwrite current for demo purposes)
      setActiveSetup({
        ...activeSetup,
        approvers: inheritedApprovers
      });
    }
  };

  // --- Delegate & Co-Approver Logic ---
  const handleRemoveDelegate = (approverId: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.map(a => {
        if (a.id === approverId) {
            const { delegateId, delegateName, delegateAvatar, delegateStartDate, delegateEndDate, ...rest } = a;
            return rest;
        }
        return a;
    });
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  const handleRemoveCoApprover = (approverId: string) => {
    if (!activeSetup) return;
    const updatedApprovers = activeSetup.approvers.map(a => {
        if (a.id === approverId) {
            const { secondaryId, secondaryName, secondaryAvatar, secondaryRole, ...rest } = a;
            return rest;
        }
        return a;
    });
    setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
  };

  // --- Modal Logic ---
  const filteredEmployeesForModal = useMemo(() => {
    return ALL_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) || 
                            emp.role.toLowerCase().includes(employeeSearch.toLowerCase());
      const matchesDept = employeeDept ? emp.department === employeeDept : true;
      
      // Filter out logic
      let isAlreadyAdded = false;
      if (modalMode === 'assignee') {
        isAlreadyAdded = assignedEmployees.some(ae => ae.id === emp.id);
      } else if (modalMode === 'delegate' && activeApproverId) {
         const currentApprover = activeSetup?.approvers.find(a => a.id === activeApproverId);
         if (currentApprover && currentApprover.name === emp.name) isAlreadyAdded = true; 
      } else if (modalMode === 'co-approver' && activeApproverId) {
         const currentApprover = activeSetup?.approvers.find(a => a.id === activeApproverId);
         if (currentApprover && currentApprover.name === emp.name) isAlreadyAdded = true; 
         // Also verify they aren't already the co-approver (if editing)
      }

      return matchesSearch && matchesDept && !isAlreadyAdded;
    });
  }, [employeeSearch, employeeDept, modalMode, assignedEmployees, activeSetup, activeApproverId]);

  const toggleEmployeeSelection = (id: string) => {
    // For delegate and co-approver, only allow single selection
    if (modalMode === 'delegate' || modalMode === 'co-approver') {
        const newSet = new Set<string>();
        if (selectedEmployeeIds.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedEmployeeIds(newSet);
        return;
    }

    const newSet = new Set(selectedEmployeeIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEmployeeIds(newSet);
  };

  const openModal = (mode: 'approver' | 'assignee' | 'delegate' | 'co-approver', approverId?: string) => {
    setModalMode(mode);
    setEmployeeSearch('');
    setEmployeeDept('');
    setSelectedEmployeeIds(new Set());
    if ((mode === 'delegate' || mode === 'co-approver') && approverId) {
        setActiveApproverId(approverId);
    }
    setIsEmployeeModalOpen(true);
  };

  const handleModalConfirm = () => {
    const selectedEmps = ALL_EMPLOYEES.filter(e => selectedEmployeeIds.has(e.id));

    if (modalMode === 'assignee') {
      setAssignedEmployees([...assignedEmployees, ...selectedEmps]);
    } else if (modalMode === 'approver' && activeSetup) {
      const newApprovers = selectedEmps.map((emp, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        orderLabel: `Approver`, 
        name: emp.name,
        department: emp.department,
        role: emp.role,
        avatar: emp.avatar,
        lastModifiedBy: 'Current User',
        lastModified: 'Just now'
      }));
      setActiveSetup({
        ...activeSetup,
        approvers: [...activeSetup.approvers, ...newApprovers]
      });
    } else if (modalMode === 'delegate' && activeSetup && activeApproverId && selectedEmps.length > 0) {
        const delegate = selectedEmps[0];
        const updatedApprovers = activeSetup.approvers.map(a => {
            if (a.id === activeApproverId) {
                return {
                    ...a,
                    delegateId: delegate.id,
                    delegateName: delegate.name,
                    delegateAvatar: delegate.avatar,
                    delegateStartDate: new Date().toISOString().split('T')[0],
                    delegateEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
            }
            return a;
        });
        setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
        setActiveApproverId(null);
    } else if (modalMode === 'co-approver' && activeSetup && activeApproverId && selectedEmps.length > 0) {
        const secondary = selectedEmps[0];
        const updatedApprovers = activeSetup.approvers.map(a => {
            if (a.id === activeApproverId) {
                return {
                    ...a,
                    secondaryId: secondary.id,
                    secondaryName: secondary.name,
                    secondaryRole: secondary.role,
                    secondaryAvatar: secondary.avatar
                };
            }
            return a;
        });
        setActiveSetup({ ...activeSetup, approvers: updatedApprovers });
        setActiveApproverId(null);
    }

    setIsEmployeeModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* List Mode is mostly unchanged, skipping for brevity in this response unless requested */}
      {viewMode === 'list' && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Approvals Setup
                <FileCheck className="text-indigo-600" size={24} />
              </h1>
              <p className="text-slate-500 font-medium mt-1">Design approval workflows and reviewer sequences.</p>
            </div>
            <button 
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <Plus size={18} />
              Add Setup
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search workflows..." 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700" 
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/40">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                      Setup Name <span className="opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Applied To
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Feature
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Effectivity
                    </th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Last Modified
                    </th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_SETUPS.map((setup) => (
                    <tr 
                      key={setup.id}
                      onClick={() => handleEdit(setup)}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                <FileCheck size={18} />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{setup.name || 'Untitled Setup'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">
                            {setup.connectedEmployees} Employees
                            </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {setup.feature}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {setup.startDate ? (
                            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 w-fit">
                                <CalendarDays size={10} /> {setup.startDate} {setup.endDate ? `to ${setup.endDate}` : '(On-going)'}
                            </span>
                        ) : (
                            <span className="text-[10px] text-slate-400 font-medium italic">No schedule</span>
                        )}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{setup.lastModifiedBy}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{setup.lastModified}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <button className="text-slate-300 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MotionDiv>
      )}

      {viewMode === 'editor' && activeSetup && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Editor Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewMode('list')}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeSetup.name || 'New Setup'}</h1>
                    <p className="text-xs text-slate-500 font-medium">Configuration mode</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                 {/* Tabs in Header */}
                 <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['General Settings', 'Manage Employees'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        activeTab === tab 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                    <Save size={16} /> Save Changes
                </button>
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            {activeTab === 'General Settings' && (
              <div className="p-8 space-y-8 animate-in fade-in">
                {/* Form Fields */}
                <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Approval Setup Name</label>
                    <input 
                      type="text" 
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      disabled={MOCK_SETUPS.some(s => s.id === activeSetup.id)}
                      className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:font-medium placeholder:text-slate-400 ${MOCK_SETUPS.some(s => s.id === activeSetup.id) ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-900'}`}
                      placeholder="e.g. Department Leave Request"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System Feature</label>
                    <div className="relative">
                      <select 
                        value={editorFeature}
                        onChange={(e) => setEditorFeature(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="Leave Management">Leave Management</option>
                        <option value="Time & Attendance">Time & Attendance</option>
                        <option value="Payroll Dispute">Payroll Dispute</option>
                        <option value="Official Business">Official Business</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  
                  {/* Dynamic Unit Scope Selection */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            Unit Type <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded ml-2 normal-case">Hierarchy Level</span>
                        </label>
                        <div className="relative">
                          <select 
                            value={editorUnitType}
                            onChange={(e) => {
                                setEditorUnitType(e.target.value);
                                setEditorUnitTarget(''); // Reset target on type change
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                          >
                            {Object.keys(MOCK_ORG_DATA).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            Unit Scope <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 rounded ml-2 normal-case">Auto-fills Approvers</span>
                        </label>
                        <div className="relative">
                          <select 
                            value={editorUnitTarget}
                            onChange={(e) => handleUnitTargetChange(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                          >
                            <option value="">-- No {editorUnitType} Inherited --</option>
                            {MOCK_ORG_DATA[editorUnitType]?.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                          <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Effectivity Start</label>
                        <div className="relative">
                            <input 
                                type="date"
                                value={editorStartDate}
                                onChange={(e) => setEditorStartDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                            />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">End Date (Optional)</label>
                        <div className="relative">
                            <input 
                                type="date"
                                value={editorEndDate}
                                onChange={(e) => setEditorEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                            />
                        </div>
                      </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                {/* Auto Rejection Policy Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Auto-Rejection Policy</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                                Automatically reject pending requests if no action is taken by approvers within the specified timeframe. Set to 0 to disable.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reject after</span>
                        <div className="relative">
                            <input 
                                type="number" 
                                min="0"
                                max="365"
                                className="w-20 pl-4 pr-8 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-white"
                                value={editorAutoReject}
                                onChange={(e) => setEditorAutoReject(Number(e.target.value))}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">Days</span>
                        </div>
                    </div>
                </div>

                {/* Approvers Table */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h3 className="text-lg font-bold text-slate-900">Approver Sequence</h3>
                        <p className="text-xs text-slate-500 font-medium">Define who needs to approve requests in this workflow.</p>
                    </div>
                    
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest w-10"></th>
                            <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Step</th>
                            <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Approver(s) & Delegation</th>
                            <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Department</th>
                            <th className="px-6 py-4 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">Last Modified</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {activeSetup.approvers.length > 0 ? activeSetup.approvers.map((approver, index) => (
                            <tr key={approver.id} className="bg-white hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-4 text-center">
                                <GripVertical size={16} className="text-slate-300 cursor-grab hover:text-slate-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 align-top">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                                    Step {index + 1}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-4">
                                    {/* Main Approver */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200 shadow-sm">
                                            {approver.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{approver.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{approver.role}</div>
                                        </div>
                                    </div>

                                    {/* Secondary Approver (Dual) */}
                                    {approver.secondaryId && (
                                        <div className="flex items-center gap-3 pl-2 relative">
                                            <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1 z-10">AND</div>
                                            <div className="absolute left-[19px] -top-6 bottom-1/2 w-[2px] bg-slate-200"></div>
                                            
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-200 shadow-sm ml-1">
                                                {approver.secondaryAvatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-bold text-slate-900">{approver.secondaryName}</div>
                                                        <div className="text-[10px] text-slate-500 font-medium">{approver.secondaryRole}</div>
                                                    </div>
                                                    <button onClick={() => handleRemoveCoApprover(approver.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100"><X size={12}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Delegate Section */}
                                    {approver.delegateId && (
                                        <div className="flex items-start gap-3 pl-2 relative">
                                            {/* Connector Branch */}
                                            <div className="absolute left-[19px] -top-5 bottom-1/2 w-[2px] bg-slate-200 rounded-bl-full"></div>
                                            <div className="absolute left-[19px] top-1/2 w-4 h-[2px] bg-slate-200"></div>
                                            
                                            <div className="flex-1 ml-4 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-indigo-300 hover:shadow-md transition-all group/delegate">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 flex items-center gap-1">
                                                            <UserCog size={10} /> Representative
                                                        </span>
                                                    </div>
                                                    <button onClick={() => handleRemoveDelegate(approver.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50 opacity-0 group-hover/delegate:opacity-100"><X size={12}/></button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                                                        {approver.delegateAvatar}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-xs text-slate-800">{approver.delegateName}</div>
                                                        <div className="text-[10px] text-slate-500">Acting on behalf</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                                <div className="flex items-center gap-2 text-slate-600 font-medium">
                                    <Briefcase size={14} className="text-slate-400" />
                                    {approver.department}
                                </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">{approver.lastModifiedBy}</span>
                                    <span className="text-[10px] text-slate-400">{approver.lastModified}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right align-top">
                                <div className="flex flex-col gap-2 items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handleDeleteApprover(approver.id)}
                                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                      title="Remove Approver"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                    {!approver.delegateId && (
                                        <button 
                                            onClick={() => openModal('delegate', approver.id)}
                                            className="p-2 text-slate-300 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                            title="Assign Representative"
                                        >
                                            <UserCog size={16} />
                                        </button>
                                    )}
                                    {!approver.secondaryId && (
                                        <button 
                                            onClick={() => openModal('co-approver', approver.id)}
                                            className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                            title="Add Co-Approver"
                                        >
                                            <Users size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                            </tr>
                        )) : (
                            <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic bg-slate-50/20">
                                <FileCheck size={32} className="mx-auto mb-2 opacity-20" />
                                No approvers configured yet.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    
                    {/* Add Button Area */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200">
                        <button 
                          onClick={() => openModal('approver')}
                          className="w-full border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Add Approver Step</span>
                        </button>
                    </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'Manage Employees' && (
              <div className="p-8 space-y-6 animate-in fade-in h-full flex flex-col">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Filter assigned employees..." 
                      className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all outline-none" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      {assignedEmployees.length} Active Members
                    </div>
                    <button 
                      onClick={() => openModal('assignee')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                    >
                      <User size={16} /> Add Member
                    </button>
                  </div>
                </div>

                {assignedEmployees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {assignedEmployees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                            <div key={emp.id} className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                                <button 
                                  onClick={() => handleDeleteAssignee(emp.id)}
                                  className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={14} />
                                </button>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-3 flex items-center justify-center text-slate-500 text-sm font-bold shadow-inner">
                                        {emp.avatar}
                                    </div>
                                    <h4 className="font-bold text-slate-900">{emp.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium mb-2">{emp.role}</p>
                                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-bold uppercase tracking-wide border border-slate-200">{emp.department}</span>
                                </div>
                            </div>
                        ))}
                        {/* Add New Card */}
                        <button 
                          onClick={() => openModal('assignee')}
                          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all min-h-[200px] gap-3"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                <Plus size={24} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider">Assign Employee</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Users size={48} className="text-slate-200 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No employees assigned</h3>
                        <p className="text-slate-400 text-sm max-w-xs">Start by adding employees to this approval group.</p>
                        <button 
                          onClick={() => openModal('assignee')}
                          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                        >
                          Add Employee
                        </button>
                    </div>
                )}
              </div>
            )}
          </div>
        </MotionDiv>
      )}

      {/* Employee Selection Modal */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} className="max-w-3xl">
        <div className="flex flex-col h-[600px] bg-white">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                <UserPlus size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {modalMode === 'approver' ? 'Add Approver Step' : modalMode === 'delegate' ? 'Assign Representative' : modalMode === 'co-approver' ? 'Add Co-Approver' : 'Assign Employee'}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {modalMode === 'approver' 
                    ? 'Select an employee to add as a new step in the approval sequence.'
                    : modalMode === 'delegate'
                    ? 'Select a designated survivor for this approver.' 
                    : modalMode === 'co-approver'
                    ? 'Select a second person to approve alongside the primary approver.'
                    : `Select employees to assign to ${activeSetup?.name || 'this setup'}.`
                  }
                </p>
              </div>
            </div>
            <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-indigo-700 text-xs font-bold">
              {selectedEmployeeIds.size} Selected
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Filters */}
            <div className="w-64 border-r border-slate-100 bg-slate-50/50 p-5 flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Filters</label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1.5 block">Department</label>
                      <select 
                        className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        value={employeeDept}
                        onChange={(e) => setEmployeeDept(e.target.value)}
                      >
                        <option value="">All Departments</option>
                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
            </div>

            {/* Main List Content */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search by name or role..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">
                {filteredEmployeesForModal.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredEmployeesForModal.map(emp => {
                      const isSelected = selectedEmployeeIds.has(emp.id);
                      return (
                        <div 
                          key={emp.id}
                          onClick={() => toggleEmployeeSelection(emp.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${isSelected ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'}`}
                        >
                          {isSelected && <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600 -mr-4 -mt-4 rotate-45 transform"></div>}
                          {isSelected && <Check size={10} className="absolute top-1 right-1 text-white" />}
                          
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected ? 'bg-white text-indigo-600 border-2 border-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                            {emp.avatar}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{emp.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{emp.role}</p>
                            <p className="text-[10px] text-slate-400 truncate">{emp.department}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <Search className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No employees found matching filters.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 flex justify-end items-center bg-white gap-3">
            <button 
              onClick={() => setIsEmployeeModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleModalConfirm}
              className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              disabled={selectedEmployeeIds.size === 0}
            >
              {modalMode === 'approver' ? 'Add Approver(s)' : modalMode === 'delegate' ? 'Assign Delegate' : modalMode === 'co-approver' ? 'Add Co-Approver' : 'Add Member(s)'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalSetupPage;
