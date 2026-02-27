
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Search, 
  Users, 
  User, 
  ShieldCheck, 
  UserCog, 
  Briefcase, 
  ArrowLeft, 
  Save, 
  Settings, 
  Lock, 
  Check, 
  UserPlus, 
  X, 
  Filter, 
  Layers, 
  Shield, 
  Palette, 
  LayoutGrid, 
  Trash2, 
  Edit2, 
  Database, 
  Server, 
  FileText, 
  Key, 
  Eye, 
  Slash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleSetup } from '../types';
import Modal from '../components/Modal';

const MotionDiv = motion.div as any;

// --- MOCK DATA ---

const MODULE_PERMISSIONS = [
  {
    category: 'Employee Profile',
    icon: <User size={16} />,
    modules: [
      'Personal Details',
      'Employee Documents',
      'Employment History',
      'Education Background'
    ]
  },
  {
    category: 'Payroll & Compensation',
    icon: <Briefcase size={16} />,
    modules: [
      'Salary Configuration',
      'Payslip Generation',
      'Bank Account Details',
      'Tax Information',
      'Pay Structure',
      'Pay Schedule'
    ]
  },
  {
    category: 'Time & Attendance',
    icon: <Layers size={16} />,
    modules: [
      'Shift Schedule',
      'Attendance Logs',
      'Overtime Approval',
      'Leave Management'
    ]
  },
  {
    category: 'System Administration',
    icon: <Settings size={16} />,
    modules: [
      'User Management',
      'Audit Logs',
      'System Settings', // Includes Roles, Permissions
      'Rank & Salary Grades'
    ]
  }
];

// Available Permission Protocols with assigned colors
const AVAILABLE_PROTOCOLS = [
  { id: 'p_full', name: 'Full System Access', description: 'Unrestricted access to all modules and settings.', type: 'System', color: 'rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'p_hr_core', name: 'HR Core Access', description: 'Manage employees, recruitment, and general HR functions.', type: 'Department', color: 'purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { id: 'p_payroll', name: 'Payroll Processing', description: 'Access to salary data, tax configurations, and payroll generation.', type: 'Module', color: 'amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'p_attendance', name: 'Time & Attendance', description: 'Access to shifts, logs, and schedule management.', type: 'Module', color: 'blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'p_approver', name: 'Approval Workflow', description: 'Access to view and act on pending requests.', type: 'Feature', color: 'indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'p_self', name: 'Self Service', description: 'Basic access to own profile and requests.', type: 'Base', color: 'slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  { id: 'p_recruit', name: 'Recruitment & Structure', description: 'Access to Employee module, Pay Schedules, and Rank settings.', type: 'Module', color: 'emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'Sarah Wilson', role: 'HR Manager', department: 'HR', avatar: 'SW', email: 'sarah@company.com' },
  { id: 'emp-2', name: 'John Doe', role: 'Senior Developer', department: 'IT', avatar: 'JD', email: 'john@company.com' },
  { id: 'emp-3', name: 'Jane Smith', role: 'Junior Developer', department: 'IT', avatar: 'JS', email: 'jane@company.com' },
  { id: 'emp-4', name: 'Mike Brown', role: 'Payroll Specialist', department: 'Finance', avatar: 'MB', email: 'mike@company.com' },
  { id: 'emp-5', name: 'Minato Gottenburg', role: 'IT Developer Intern', department: 'IT', avatar: 'MG', email: 'minato@company.com' },
  { id: 'emp-6', name: 'Alice Guo', role: 'Marketing Lead', department: 'Marketing', avatar: 'AG', email: 'alice@company.com' },
  { id: 'emp-7', name: 'Robert Chen', role: 'Product Owner', department: 'Product', avatar: 'RC', email: 'robert@company.com' },
  { id: 'emp-8', name: 'Emily Davis', role: 'UX Designer', department: 'Design', avatar: 'ED', email: 'emily@company.com' },
];

interface RoleWithIcon extends RoleSetup {
  iconName: string; // Store icon name instead of component for editing
  colorTheme: string;
  defaultProtocols: string[];
}

const ICON_OPTIONS = [
  { name: 'User', icon: <User size={20} /> },
  { name: 'Shield', icon: <Shield size={20} /> },
  { name: 'ShieldCheck', icon: <ShieldCheck size={20} /> },
  { name: 'Briefcase', icon: <Briefcase size={20} /> },
  { name: 'UserCog', icon: <UserCog size={20} /> },
  { name: 'Users', icon: <Users size={20} /> },
  { name: 'Lock', icon: <Lock size={20} /> },
  { name: 'Key', icon: <Key size={20} /> },
  { name: 'Database', icon: <Database size={20} /> },
  { name: 'Server', icon: <Server size={20} /> },
];

const COLOR_OPTIONS = [
  { name: 'Blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { name: 'Indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  { name: 'Emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  { name: 'Amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  { name: 'Rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  { name: 'Purple', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  { name: 'Slate', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
];

const MOCK_ROLES: RoleWithIcon[] = [
  { 
    id: '1', 
    name: 'Superadmin', 
    connectedEmployees: 1, 
    dateAdded: 'Sept 1, 2024', 
    lastModifiedBy: 'System', 
    lastModified: 'Aug 8, 2025',
    iconName: 'Shield',
    colorTheme: 'Rose',
    defaultProtocols: ['p_full']
  },
  { 
    id: '2', 
    name: 'HR Admin', 
    connectedEmployees: 2, 
    dateAdded: 'Sept 2, 2024', 
    lastModifiedBy: 'Superadmin', 
    lastModified: 'Aug 8, 2025',
    iconName: 'UserCog',
    colorTheme: 'Purple',
    defaultProtocols: ['p_hr_core', 'p_payroll', 'p_attendance', 'p_approver', 'p_recruit']
  },
  { 
    id: '3', 
    name: 'HR Payroll Personnel', 
    connectedEmployees: 3, 
    dateAdded: 'Sept 5, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 9, 2025',
    iconName: 'Briefcase',
    colorTheme: 'Amber',
    defaultProtocols: ['p_payroll']
  },
  { 
    id: '4', 
    name: 'HR Attendance Personnel', 
    connectedEmployees: 2, 
    dateAdded: 'Sept 5, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 9, 2025',
    iconName: 'Database', 
    colorTheme: 'Blue',
    defaultProtocols: ['p_attendance']
  },
  { 
    id: '5', 
    name: 'Approver', 
    connectedEmployees: 12, 
    dateAdded: 'Sept 10, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 10, 2025',
    iconName: 'ShieldCheck',
    colorTheme: 'Indigo',
    defaultProtocols: ['p_approver', 'p_self']
  },
  { 
    id: '6', 
    name: 'Employee', 
    connectedEmployees: 410, 
    dateAdded: 'Jan 1, 2024', 
    lastModifiedBy: 'System', 
    lastModified: 'Aug 1, 2025',
    iconName: 'User',
    colorTheme: 'Slate',
    defaultProtocols: ['p_self']
  },
  { 
    id: '7', 
    name: 'HR Recruiter', 
    connectedEmployees: 4, 
    dateAdded: 'Oct 12, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 11, 2025',
    iconName: 'Users',
    colorTheme: 'Emerald',
    defaultProtocols: ['p_recruit', 'p_self']
  },
];

// Helper to check if a protocol grants a specific permission
const checkPermission = (protocolId: string, module: string, action: 'View' | 'Edit' | 'Create' | 'Archive') => {
  // P_FULL: Superadmin - All access
  if (protocolId === 'p_full') return true;

  // P_SELF: Employee - View own profile stuff (Simulated)
  if (protocolId === 'p_self') {
    if (module.includes('Personal Details') && action === 'View') return true;
    if (module.includes('Payslip') && action === 'View') return true;
    if (module.includes('Attendance') && (action === 'View')) return true;
    return false;
  }

  // P_HR_CORE: HR Admin - Everything EXCEPT System Admin
  if (protocolId === 'p_hr_core') {
     if (module.includes('Audit Logs') || module.includes('User Management') || module.includes('System Settings')) return false;
     return true; 
  }

  // P_PAYROLL: Payroll Personnel - Payroll Modules
  if (protocolId === 'p_payroll') {
    if (MODULE_PERMISSIONS.find(mp => mp.category === 'Payroll & Compensation')?.modules.includes(module)) return true;
    return false;
  }

  // P_ATTENDANCE: Attendance Personnel - Time & Attendance Modules
  if (protocolId === 'p_attendance') {
    if (MODULE_PERMISSIONS.find(mp => mp.category === 'Time & Attendance')?.modules.includes(module)) return true;
    return false;
  }

  // P_RECRUIT: HR Recruiter - Employee, Pay Schedule, Pay Structure, Ranks, Salary Grades
  if (protocolId === 'p_recruit') {
    if (module.includes('Personal Details') || module.includes('Employee Documents')) return true;
    if (module.includes('Pay Schedule')) return true; 
    if (module.includes('Pay Structure')) return true; 
    if (module.includes('Rank')) return true; 
    return false;
  }

  // P_APPROVER: Approver - Overtime Approval
  if (protocolId === 'p_approver') {
      if (module.includes('Approval')) return true;
      return false;
  }

  return false;
};

const RoleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [activeTab, setActiveTab] = useState<'General Settings' | 'Manage Employees'>('General Settings');
  
  // Editor State
  const [roleName, setRoleName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('User');
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [assignedProtocols, setAssignedProtocols] = useState<string[]>([]); // IDs of protocols
  
  // Override State: { ModuleName: { Action: 'add' | 'remove' } }
  const [permissionOverrides, setPermissionOverrides] = useState<Record<string, Record<string, 'add' | 'remove'>>>({});

  // Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteDept, setInviteDept] = useState('');
  const [selectedInviteIds, setSelectedInviteIds] = useState<Set<string>>(new Set());

  // Protocol Modal State
  const [isAddProtocolOpen, setIsAddProtocolOpen] = useState(false);
  const [isOverallViewOpen, setIsOverallViewOpen] = useState(false);

  // --- Handlers ---

  const handleCreateNew = () => {
    setRoleName('');
    setSelectedIcon('User');
    setSelectedColor('Blue');
    setAssignedProtocols(['p_self']); // Default to standard employee access
    setPermissionOverrides({});
    setActiveTab('General Settings');
    setViewMode('editor');
  };

  const handleEditRole = (role: RoleWithIcon) => {
    setRoleName(role.name);
    setSelectedIcon(role.iconName);
    setSelectedColor(role.colorTheme);
    setAssignedProtocols(role.defaultProtocols);
    setPermissionOverrides({}); // Reset overrides on new edit for simplicity
    setActiveTab('General Settings');
    setViewMode('editor');
  };

  // --- Invite Modal Logic ---
  const filteredEmployeesForInvite = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(inviteSearch.toLowerCase()) || 
                            emp.role.toLowerCase().includes(inviteSearch.toLowerCase());
      const matchesDept = inviteDept ? emp.department === inviteDept : true;
      return matchesSearch && matchesDept;
    });
  }, [inviteSearch, inviteDept]);

  const toggleInviteSelection = (id: string) => {
    const newSet = new Set(selectedInviteIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedInviteIds(newSet);
  };

  const handleInviteConfirm = () => {
    setIsInviteModalOpen(false);
    setSelectedInviteIds(new Set());
    setInviteSearch('');
    setInviteDept('');
  };

  const handleAddProtocol = (protocolId: string) => {
    if (!assignedProtocols.includes(protocolId)) {
        setAssignedProtocols([...assignedProtocols, protocolId]);
    }
    setIsAddProtocolOpen(false);
  };

  const handleRemoveProtocol = (protocolId: string) => {
    setAssignedProtocols(assignedProtocols.filter(id => id !== protocolId));
  };

  const departments = Array.from(new Set(MOCK_EMPLOYEES.map(e => e.department)));

  const getIconComponent = (name: string) => {
      return ICON_OPTIONS.find(i => i.name === name)?.icon || <User size={20} />;
  };

  const getColorClasses = (name: string) => {
      return COLOR_OPTIONS.find(c => c.name === name) || COLOR_OPTIONS[0];
  };

  const availableProtocolsToAdd = AVAILABLE_PROTOCOLS.filter(p => !assignedProtocols.includes(p.id));

  // --- Consolidated Permission Logic with Overrides ---
  const getPermissionStatus = (module: string, action: string) => {
    // 1. Check Protocol Status
    const grantingProtocols = assignedProtocols
      .map(id => AVAILABLE_PROTOCOLS.find(p => p.id === id))
      .filter(p => p && checkPermission(p.id, module, action as any));
    
    const protocolGranted = grantingProtocols.length > 0;
    
    // 2. Check Override Status
    const override = permissionOverrides[module]?.[action];

    // 3. Visual Props Calculation
    let styleClass = '';
    let icon = null;

    if (override === 'add') {
       // Hollow box, thick black border, black check (Added Override)
       styleClass = 'border-2 border-slate-900 bg-white text-slate-900 shadow-sm';
       icon = <Check size={14} strokeWidth={4} />;
    } else if (override === 'remove') {
       // Thick black bordered hollow box, red diagonal line (Removed Override)
       styleClass = 'border-2 border-slate-900 bg-white relative overflow-hidden shadow-sm';
       icon = (
         <svg viewBox="0 0 24 24" className="w-full h-full absolute inset-0 text-red-500 p-0.5 pointer-events-none">
            <line x1="0" y1="24" x2="24" y2="0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
         </svg>
       );
    } else {
       // Protocol Driven
       if (!protocolGranted) {
         styleClass = 'bg-white border-slate-300';
       } else if (grantingProtocols.length > 1) {
         styleClass = 'bg-slate-900 border-slate-900 text-white';
         icon = <Check size={12} strokeWidth={3} />;
       } else {
         const proto = grantingProtocols[0]!;
         styleClass = `bg-${proto.color} border-${proto.color} text-white`;
         icon = <Check size={12} strokeWidth={3} />;
       }
    }

    return { 
        protocolGranted, 
        styleClass, 
        override, 
        icon 
    };
  };

  const handleOverrideClick = (module: string, action: string, isProtocolGranted: boolean) => {
    setPermissionOverrides(prev => {
        const mod = prev[module] || {};
        const current = mod[action];
        
        if (current) {
            // If already overridden, clear it (return to protocol default)
            const nextMod = { ...mod };
            delete nextMod[action];
            // Clean up empty objects
            if (Object.keys(nextMod).length === 0) {
                const nextPrev = { ...prev };
                delete nextPrev[module];
                return nextPrev;
            }
            return { ...prev, [module]: nextMod };
        } else {
            // If not overridden, set opposite of protocol
            return { 
                ...prev, 
                [module]: { 
                    ...mod, 
                    [action]: isProtocolGranted ? 'remove' : 'add' 
                } 
            };
        }
    });
  };

  return (
    <div className="space-y-8">
      {viewMode === 'list' && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                Role Management
                <ShieldAlert className="text-indigo-600" size={24} />
              </h1>
              <p className="text-slate-500 font-medium mt-1">Configure workspace access levels and permission groups.</p>
            </div>
            <button 
              onClick={handleCreateNew}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              <Plus size={20} />
              Create New Role
            </button>
          </div>

          {/* Main Table Container */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <div className="relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search roles by name or modifier..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 font-medium" 
                  />
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort:</span>
                    <select className="bg-transparent border-none text-xs font-bold text-slate-600 outline-none cursor-pointer">
                      <option>Recent Activity</option>
                      <option>Connected Members</option>
                      <option>Alphabetical</option>
                    </select>
                  </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/30">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Setup Name</th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Connected Users</th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Created Date</th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Modified</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_ROLES.map((role, idx) => {
                    const theme = getColorClasses(role.colorTheme);
                    return (
                        <tr 
                        key={role.id}
                        onClick={() => handleEditRole(role)}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                {getIconComponent(role.iconName)}
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">{role.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Permission ID: #{role.id}</span>
                            </div>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-600">{role.connectedEmployees} Employees</span>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-xs text-slate-500 font-medium tabular-nums">{role.dateAdded}</td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                {role.lastModifiedBy[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{role.lastModifiedBy}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{role.lastModified}</span>
                            </div>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                            <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                                EDIT
                            </button>
                            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={18} />
                            </div>
                        </td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Section */}
            <div className="p-6 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {MOCK_ROLES.length} of {MOCK_ROLES.length} Roles</p>
              <div className="flex items-center gap-2">
                  <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-50" disabled>
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-1">
                    {[1].map(n => (
                      <button 
                        key={n}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${n === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                    <ChevronRight size={18} />
                  </button>
              </div>
            </div>
          </div>

          {/* Helper Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                <Users size={16} /> Use Group Permissions
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed font-medium">Assign multiple employees to a single role to streamline access control. Changes to a role setup will instantly propagate to all connected members.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl space-y-3 text-white">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-400" /> Security Best Practices
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Regularly audit roles with high-level access. We recommend reviewing "Admin" and "Approver" roles every 90 days to maintain system integrity.</p>
            </div>
          </div>
        </MotionDiv>
      )}

      {/* EDITOR MODE */}
      {viewMode === 'editor' && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
             <button 
                onClick={() => setViewMode('list')}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
             >
                <ArrowLeft size={16} /> Back to Role Management
             </button>
             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all">
                <Save size={18} /> Save Role
             </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{roleName || 'New Role'}</h2>
            <p className="text-slate-500 text-sm">Configure granular access rights and appearance for this role.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl w-fit">
            {['General Settings', 'Manage Employees'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            
            {/* GENERAL SETTINGS TAB */}
            {activeTab === 'General Settings' && (
              <div className="p-8 animate-in fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    
                    {/* Appearance Settings - Left Col */}
                    <div className="lg:col-span-5 space-y-6">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Palette size={18} className="text-indigo-600" /> Appearance Settings
                        </h3>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                            
                            {/* Name Input */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role Name</label>
                                <input 
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="e.g. Standard Employee"
                                    className="w-full border border-slate-200 bg-white p-3 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                                />
                            </div>

                            {/* Icon Selector */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Icon Symbol</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ICON_OPTIONS.map(opt => (
                                        <button 
                                            key={opt.name}
                                            onClick={() => setSelectedIcon(opt.name)}
                                            className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedIcon === opt.name ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'}`}
                                        >
                                            {opt.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Color Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_OPTIONS.map(opt => (
                                        <button 
                                            key={opt.name}
                                            onClick={() => setSelectedColor(opt.name)}
                                            className={`h-10 px-3 rounded-xl flex items-center gap-2 transition-all border ${selectedColor === opt.name ? `${opt.bg} ${opt.text} ${opt.border} ring-2 ring-offset-1 ring-indigo-100` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${opt.bg.replace('50', '500')}`}></div>
                                            <span className="text-xs font-bold">{opt.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="pt-4 border-t border-slate-200 mt-4">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Preview</label>
                                <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClasses(selectedColor).bg} ${getColorClasses(selectedColor).text}`}>
                                        {getIconComponent(selectedIcon)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{roleName || 'Role Name'}</h4>
                                        <p className="text-xs text-slate-400 font-medium">Permission ID: #NEW</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applying Permissions - Right Col */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Lock size={18} className="text-indigo-600" /> Applying Permissions
                            </h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsOverallViewOpen(true)}
                                    className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Eye size={14} /> View Overall Permissions
                                </button>
                                <button 
                                    onClick={() => setIsAddProtocolOpen(true)}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add Permission
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[520px]">
                            <div className="flex-1 overflow-y-auto p-2">
                                {assignedProtocols.length > 0 ? (
                                    <div className="space-y-2">
                                        {assignedProtocols.map(protoId => {
                                            const protocol = AVAILABLE_PROTOCOLS.find(p => p.id === protoId);
                                            if (!protocol) return null;
                                            return (
                                                <div key={protoId} className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group">
                                                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 shadow-sm mt-1">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900">{protocol.name}</h4>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className="text-[10px] font-bold uppercase tracking-wide bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{protocol.type} Protocol</span>
                                                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded text-white bg-${protocol.color}`}>Source</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all" title="Configure Protocol">
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleRemoveProtocol(protoId)}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all" 
                                                                    title="Remove Assignment"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{protocol.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                        <Shield size={48} className="mb-4 opacity-20" />
                                        <p className="text-sm font-medium">No permissions assigned.</p>
                                        <p className="text-xs mt-1">Add protocols to define what this role can access.</p>
                                        <button 
                                            onClick={() => setIsAddProtocolOpen(true)}
                                            className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all"
                                        >
                                            Browse Protocols
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
                                Protocols define granular view, edit, and create rights for modules.
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* MANAGE EMPLOYEES TAB */}
            {activeTab === 'Manage Employees' && (
              <div className="p-8 space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Filter assigned employees..." 
                      className="w-full pl-11 pr-4 py-2.5 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all bg-white font-medium" 
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      {MOCK_EMPLOYEES.slice(0,4).length} Active Members
                    </div>
                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
                    >
                      <UserPlus size={16} /> Add Member
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {MOCK_EMPLOYEES.slice(0,4).map(emp => (
                    <div key={emp.id} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all bg-white group relative">
                      <button className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
                        <X size={16} />
                      </button>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 mb-3 border-2 border-white shadow-sm group-hover:scale-110 transition-transform group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          {emp.avatar}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{emp.role}</p>
                        <p className="text-[10px] text-slate-400 mt-2 bg-slate-50 px-2 py-1 rounded-full">{emp.email}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Placeholder Card */}
                  <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all min-h-[180px] gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-bold">Assign New Employee</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </MotionDiv>
      )}

      {/* Invite Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} className="max-w-3xl">
        <div className="flex flex-col h-[600px] bg-white">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-indigo-600">
                <UserPlus size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add Employee to Role</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Select employees to assign to <span className="text-indigo-600 font-bold">{roleName || 'this role'}</span>.</p>
              </div>
            </div>
            <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 text-indigo-700 text-xs font-bold">
              {selectedInviteIds.size} Selected
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
                        value={inviteDept}
                        onChange={(e) => setInviteDept(e.target.value)}
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
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
                    value={inviteSearch}
                    onChange={(e) => setInviteSearch(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20">
                {filteredEmployeesForInvite.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredEmployeesForInvite.map(emp => {
                      const isSelected = selectedInviteIds.has(emp.id);
                      return (
                        <div 
                          key={emp.id}
                          onClick={() => toggleInviteSelection(emp.id)}
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
              onClick={() => setIsInviteModalOpen(false)}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleInviteConfirm}
              className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              disabled={selectedInviteIds.size === 0}
            >
              Add {selectedInviteIds.size > 0 ? `${selectedInviteIds.size} Members` : 'Selected'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Protocol Modal */}
      <Modal isOpen={isAddProtocolOpen} onClose={() => setIsAddProtocolOpen(false)} className="max-w-md">
          <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-slate-900">Add Permission Protocol</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableProtocolsToAdd.length > 0 ? availableProtocolsToAdd.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => handleAddProtocol(p.id)}
                        className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all group"
                      >
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-900">{p.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-white group-hover:text-indigo-500">{p.type}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{p.description}</p>
                      </button>
                  )) : (
                      <p className="text-center text-slate-400 text-sm py-4 italic">No other protocols available to add.</p>
                  )}
              </div>
              <div className="mt-4 flex justify-end">
                  <button onClick={() => setIsAddProtocolOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Close</button>
              </div>
          </div>
      </Modal>

      {/* Consolidated Permissions Modal */}
      <Modal isOpen={isOverallViewOpen} onClose={() => setIsOverallViewOpen(false)} className="max-w-4xl">
        <div className="flex flex-col h-[700px] bg-white">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <ShieldCheck size={24} className="text-indigo-600" />
                Overall Permission Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-1">Aggregated view of all effective permissions for this role. Click cells to override.</p>
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wide flex-wrap justify-end max-w-lg">
              {assignedProtocols.map(pid => {
                const p = AVAILABLE_PROTOCOLS.find(ap => ap.id === pid);
                if (!p) return null;
                return (
                  <div key={pid} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full bg-${p.color}`}></div>
                    <span className="text-slate-500">{p.name}</span>
                  </div>
                );
              })}
              {assignedProtocols.length > 1 && (
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                  <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                  <span className="text-slate-500">Multiple Sources</span>
                </div>
              )}
              {/* Override Legends */}
              <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                 <div className="w-3 h-3 border-2 border-slate-900 bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900"></div>
                 </div>
                 <span className="text-slate-500">Override (Add)</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 border-2 border-slate-900 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 left-0 border-t border-r border-transparent">
                       <svg viewBox="0 0 24 24" className="w-full h-full text-red-500"><line x1="0" y1="24" x2="24" y2="0" stroke="currentColor" strokeWidth="6" /></svg>
                    </div>
                 </div>
                 <span className="text-slate-500">Override (Remove)</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left w-1/2">Module / Action</th>
                    <th className="px-4 py-4 text-center">View</th>
                    <th className="px-4 py-4 text-center">Edit</th>
                    <th className="px-4 py-4 text-center">Create</th>
                    <th className="px-4 py-4 text-center">Archive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MODULE_PERMISSIONS.map((group, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      <tr className="bg-slate-50/80">
                        <td colSpan={5} className="px-6 py-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
                            <span className="text-slate-400">{group.icon}</span>
                            {group.category}
                          </div>
                        </td>
                      </tr>
                      {group.modules.map((moduleName, modIdx) => {
                        const viewPerm = getPermissionStatus(moduleName, 'View');
                        const editPerm = getPermissionStatus(moduleName, 'Edit');
                        const createPerm = getPermissionStatus(moduleName, 'Create');
                        const archivePerm = getPermissionStatus(moduleName, 'Archive');

                        return (
                          <tr key={modIdx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700">{moduleName}</td>
                            <td className="px-4 py-4 text-center">
                              <div 
                                onClick={() => handleOverrideClick(moduleName, 'View', viewPerm.protocolGranted)}
                                className={`w-5 h-5 mx-auto rounded cursor-pointer flex items-center justify-center transition-all hover:scale-110 ${viewPerm.styleClass}`}
                                title={viewPerm.override ? `Manual Override: ${viewPerm.override.toUpperCase()}` : (viewPerm.protocolGranted ? 'Granted by Protocol' : 'Denied')}
                              >
                                {viewPerm.icon}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div 
                                onClick={() => handleOverrideClick(moduleName, 'Edit', editPerm.protocolGranted)}
                                className={`w-5 h-5 mx-auto rounded cursor-pointer flex items-center justify-center transition-all hover:scale-110 ${editPerm.styleClass}`}
                                title={editPerm.override ? `Manual Override: ${editPerm.override.toUpperCase()}` : (editPerm.protocolGranted ? 'Granted by Protocol' : 'Denied')}
                              >
                                {editPerm.icon}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div 
                                onClick={() => handleOverrideClick(moduleName, 'Create', createPerm.protocolGranted)}
                                className={`w-5 h-5 mx-auto rounded cursor-pointer flex items-center justify-center transition-all hover:scale-110 ${createPerm.styleClass}`}
                                title={createPerm.override ? `Manual Override: ${createPerm.override.toUpperCase()}` : (createPerm.protocolGranted ? 'Granted by Protocol' : 'Denied')}
                              >
                                {createPerm.icon}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div 
                                onClick={() => handleOverrideClick(moduleName, 'Archive', archivePerm.protocolGranted)}
                                className={`w-5 h-5 mx-auto rounded cursor-pointer flex items-center justify-center transition-all hover:scale-110 ${archivePerm.styleClass}`}
                                title={archivePerm.override ? `Manual Override: ${archivePerm.override.toUpperCase()}` : (archivePerm.protocolGranted ? 'Granted by Protocol' : 'Denied')}
                              >
                                {archivePerm.icon}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-100 flex justify-end">
             <button onClick={() => setIsOverallViewOpen(false)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Close View
             </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;
