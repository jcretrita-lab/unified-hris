
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
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
  Layers, 
  Shield, 
  Palette, 
  Trash2, 
  Database, 
  Server, 
  FileText, 
  Key, 
  Eye, 
  Globe, 
  Building, 
  PenTool, 
  Send, 
  Gavel, 
  Download, 
  Power,
  ChevronDown,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleSetup } from '../../types';
import Modal from '../../components/Modal';

const MotionDiv = motion.div as any;

// --- MOCK DATA ---

const MODULE_PERMISSIONS = [
  {
    category: 'Employee Profile',
    icon: <User size={18} />,
    modules: [
      { id: 'emp_details', name: 'Personal Details', description: 'Basic info, address, and contact details.' },
      { id: 'emp_docs', name: 'Employee Documents', description: 'Contracts, IDs, and uploaded files.' },
      { id: 'emp_history', name: 'Employment History', description: 'Past positions and movements.' },
    ]
  },
  {
    category: 'Payroll & Compensation',
    icon: <Briefcase size={18} />,
    modules: [
      { id: 'pay_salary', name: 'Salary Configuration', description: 'Base pay, rank, and step settings.' },
      { id: 'pay_slip', name: 'Payslip Generation', description: 'View and generate payslips.' },
      { id: 'pay_bank', name: 'Bank Account Details', description: 'Direct deposit information.' },
    ]
  },
  {
    category: 'Time & Attendance',
    icon: <Layers size={18} />,
    modules: [
      { id: 'ta_shift', name: 'Shift Schedule', description: 'Work hours and day assignments.' },
      { id: 'ta_logs', name: 'Attendance Logs', description: 'Daily time records and biometric data.' },
      { id: 'ta_ot', name: 'Overtime Requests', description: 'OT applications and approvals.' },
    ]
  }
];

// Available Permission Protocols with assigned colors
const AVAILABLE_PROTOCOLS = [
  { id: 'p_full', name: 'Full System Access', description: 'Unrestricted access.', type: 'System', colorName: 'rose', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'p_hr_core', name: 'HR Core Access', description: 'Manage employees & HR.', type: 'Department', colorName: 'purple', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'p_payroll', name: 'Payroll Processing', description: 'Access to salary data.', type: 'Module', colorName: 'emerald', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'p_attendance', name: 'Time & Attendance', description: 'Access to shifts & logs.', type: 'Module', colorName: 'amber', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'p_approver', name: 'Approval Workflow', description: 'View and act on requests.', type: 'Feature', colorName: 'blue', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'p_recruit', name: 'Recruitment & Structure', description: 'Access to Employee module & structure.', type: 'Module', colorName: 'emerald', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'p_self', name: 'Self Service', description: 'Own profile access.', type: 'Base', colorName: 'slate', color: 'text-slate-600 bg-slate-100 border-slate-200' },
];

// Definition of what each protocol grants
// Added 'states' to match PermissionPage structure
const PROTOCOL_DEFINITIONS: Record<string, any> = {
  'p_full': { authority: 'Approver', scopes: ['Global'], actions: ['View', 'Create', 'Edit', 'Deactivate', 'Approve', 'Export'], states: ['Draft', 'Pending', 'Approved', 'Rejected', 'Archived'] },
  'p_hr_core': { authority: 'Contributor', scopes: ['Department'], actions: ['View', 'Create', 'Edit', 'Export'], states: ['Draft', 'Pending', 'Approved'] },
  'p_payroll': { authority: 'Contributor', scopes: ['Global'], actions: ['View', 'Edit', 'Export'], states: ['Draft', 'Approved'] },
  'p_attendance': { authority: 'Contributor', scopes: ['Department'], actions: ['View', 'Edit'], states: ['Draft', 'Pending'] },
  'p_approver': { authority: 'Approver', scopes: ['Direct Reports'], actions: ['View', 'Approve'], states: ['Pending'] },
  'p_recruit': { authority: 'Contributor', scopes: ['Global'], actions: ['View', 'Create', 'Edit'], states: ['Draft', 'Pending'] },
  'p_self': { authority: 'Viewer', scopes: ['Self'], actions: ['View'], states: ['Approved'] },
};

// UI Dimensions
const SCOPES = [
  { id: 'Self', label: 'Self Only', icon: <User size={12} /> },
  { id: 'Direct Reports', label: 'Direct Reports', icon: <Users size={12} /> },
  { id: 'Department', label: 'Department', icon: <Building size={12} /> },
  { id: 'Global', label: 'Global (All)', icon: <Globe size={12} /> },
];

const ACTIONS = [
  { id: 'View', label: 'View', icon: <Eye size={12} /> },
  { id: 'Create', label: 'Create', icon: <Plus size={12} /> },
  { id: 'Edit', label: 'Edit', icon: <Edit2 size={12} /> },
  { id: 'Activate', label: 'Activate', icon: <Power size={12} /> },
  { id: 'Deactivate', label: 'Deactivate', icon: <Trash2 size={12} /> },
  { id: 'Export', label: 'Export', icon: <Download size={12} /> },
  { id: 'Approve', label: 'Approve', icon: <Check size={12} /> },
];

const STATES = [
  { id: 'Draft', label: 'Draft' },
  { id: 'Pending', label: 'Pending Review' },
  { id: 'Approved', label: 'Approved' },
  { id: 'Rejected', label: 'Rejected' },
  { id: 'Archived', label: 'Archived' },
];

const AUTHORITIES = [
  { id: 'Viewer', label: 'Viewer', description: 'Read-only access', icon: <Eye size={14} /> },
  { id: 'Contributor', label: 'Contributor', description: 'Can create and edit drafts', icon: <PenTool size={14} /> },
  { id: 'Requester', label: 'Requester', description: 'Can submit for approval', icon: <Send size={14} /> },
  { id: 'Approver', label: 'Approver', description: 'Can authorize transactions', icon: <Gavel size={14} /> },
];

const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'Sarah Wilson', role: 'HR Manager', department: 'HR', avatar: 'SW', email: 'sarah@company.com' },
  { id: 'emp-2', name: 'John Doe', role: 'Senior Developer', department: 'IT', avatar: 'JD', email: 'john@company.com' },
  { id: 'emp-3', name: 'Jane Smith', role: 'Junior Developer', department: 'IT', avatar: 'JS', email: 'jane@company.com' },
  { id: 'emp-4', name: 'Mike Brown', role: 'Payroll Specialist', department: 'Finance', avatar: 'MB', email: 'mike@company.com' },
];

interface RoleWithIcon extends RoleSetup {
  iconName: string;
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
    name: 'HR Approver - Timekeeping', 
    connectedEmployees: 2, 
    dateAdded: 'Oct 1, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 15, 2025',
    iconName: 'ShieldCheck',
    colorTheme: 'Blue',
    defaultProtocols: ['p_attendance', 'p_approver']
  },
  { 
    id: '8', 
    name: 'HR Approver - PIS', 
    connectedEmployees: 1, 
    dateAdded: 'Oct 1, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 15, 2025',
    iconName: 'UserCog',
    colorTheme: 'Purple',
    defaultProtocols: ['p_hr_core', 'p_approver']
  },
  { 
    id: '9', 
    name: 'HR Approver - Payroll', 
    connectedEmployees: 1, 
    dateAdded: 'Oct 1, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 15, 2025',
    iconName: 'Briefcase',
    colorTheme: 'Amber',
    defaultProtocols: ['p_payroll', 'p_approver']
  },
  { 
    id: '10', 
    name: 'HR Personnel', 
    connectedEmployees: 5, 
    dateAdded: 'Oct 5, 2024', 
    lastModifiedBy: 'HR Admin', 
    lastModified: 'Aug 15, 2025',
    iconName: 'Users',
    colorTheme: 'Emerald',
    defaultProtocols: ['p_hr_core', 'p_recruit', 'p_self']
  },
  { 
    id: '11', 
    name: 'Evaluator', 
    connectedEmployees: 3, 
    dateAdded: 'Oct 10, 2024', 
    lastModifiedBy: 'Superadmin', 
    lastModified: 'Aug 15, 2025',
    iconName: 'Shield',
    colorTheme: 'Slate',
    defaultProtocols: ['p_approver', 'p_self']
  }
];

const RoleManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [activeTab, setActiveTab] = useState<'General Settings' | 'Manage Employees'>('General Settings');
  
  // Editor State
  const [roleName, setRoleName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('User');
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [assignedProtocols, setAssignedProtocols] = useState<string[]>([]);
  
  // Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteDept, setInviteDept] = useState('');
  const [selectedInviteIds, setSelectedInviteIds] = useState<Set<string>>(new Set());

  // Protocol Modal State
  const [isAddProtocolOpen, setIsAddProtocolOpen] = useState(false);
  const [isOverallViewOpen, setIsOverallViewOpen] = useState(false);
  
  // New Expanded State for the Modal
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // --- Handlers ---

  const handleCreateNew = () => {
    setRoleName('');
    setSelectedIcon('User');
    setSelectedColor('Blue');
    setAssignedProtocols(['p_self']);
    setActiveTab('General Settings');
    setViewMode('editor');
  };

  const handleEditRole = (role: RoleWithIcon) => {
    setRoleName(role.name);
    setSelectedIcon(role.iconName);
    setSelectedColor(role.colorTheme);
    setAssignedProtocols(role.defaultProtocols);
    setActiveTab('General Settings');
    setViewMode('editor');
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

  // --- Logic Helpers ---

  const getIconComponent = (name: string) => {
      return ICON_OPTIONS.find(i => i.name === name)?.icon || <User size={20} />;
  };

  const getColorClasses = (name: string) => {
      return COLOR_OPTIONS.find(c => c.name === name) || COLOR_OPTIONS[0];
  };

  const availableProtocolsToAdd = AVAILABLE_PROTOCOLS.filter(p => !assignedProtocols.includes(p.id));

  // --- Advanced Source Aggregation Logic ---
  // Returns: { value: string|boolean, sources: ProtocolObject[] }
  const getAggregatedSource = (moduleId: string, dimension: 'authority' | 'scopes' | 'actions' | 'states', value?: string) => {
      const activeDefs = assignedProtocols.map(pid => ({ id: pid, def: PROTOCOL_DEFINITIONS[pid], meta: AVAILABLE_PROTOCOLS.find(ap => ap.id === pid) })).filter(p => p.def);
      
      const grantingProtocols: any[] = [];

      activeDefs.forEach(protocol => {
          // Simple mock filtering logic for modules
          let applies = false;
          // In real app, check if module is in protocol. Using heuristics for mock:
          if (protocol.id === 'p_full') applies = true;
          else if (protocol.id === 'p_self' && (moduleId.includes('emp_') || moduleId.includes('pay_slip'))) applies = true;
          else if (protocol.id === 'p_hr_core' && moduleId.includes('emp_')) applies = true;
          else if (protocol.id === 'p_payroll' && moduleId.includes('pay_')) applies = true;
          else if (protocol.id === 'p_attendance' && moduleId.includes('ta_')) applies = true;
          else if (protocol.id === 'p_approver' && moduleId.includes('ot')) applies = true;
          else if (protocol.id === 'p_recruit' && moduleId.includes('emp_')) applies = true;
          
          if (applies) {
              const def = protocol.def;
              if (dimension === 'authority') {
                  // For authority, we want the highest, but here we just check if it matches the requested value for source tracking
                   if (def.authority === value) grantingProtocols.push(protocol.meta);
              } else {
                  // For arrays (scopes, actions, states)
                  if (def[dimension]?.includes(value)) grantingProtocols.push(protocol.meta);
              }
          }
      });

      return grantingProtocols;
  };

  // Determines the effective authority for the collapsed view
  const getEffectiveAuthority = (moduleId: string) => {
     const authLevels = ['Viewer', 'Contributor', 'Requester', 'Approver'];
     const activeDefs = assignedProtocols.map(pid => ({ id: pid, def: PROTOCOL_DEFINITIONS[pid], meta: AVAILABLE_PROTOCOLS.find(ap => ap.id === pid) })).filter(p => p.def);
     
     let maxAuthIndex = -1;
     let winner = { authority: 'Restricted', sources: [] as any[] };

     activeDefs.forEach(protocol => {
         // Same mock filter logic
         let applies = false;
         if (protocol.id === 'p_full') applies = true;
         else if (protocol.id === 'p_self' && (moduleId.includes('emp_') || moduleId.includes('pay_slip'))) applies = true;
         else if (protocol.id === 'p_hr_core' && moduleId.includes('emp_')) applies = true;
         else if (protocol.id === 'p_payroll' && moduleId.includes('pay_')) applies = true;
         else if (protocol.id === 'p_attendance' && moduleId.includes('ta_')) applies = true;
         else if (protocol.id === 'p_approver' && moduleId.includes('ot')) applies = true;
         else if (protocol.id === 'p_recruit' && moduleId.includes('emp_')) applies = true;

         if (applies) {
             const idx = authLevels.indexOf(protocol.def.authority);
             if (idx > maxAuthIndex) {
                 maxAuthIndex = idx;
                 winner = { authority: protocol.def.authority, sources: [protocol.meta] };
             } else if (idx === maxAuthIndex) {
                 winner.sources.push(protocol.meta);
             }
         }
     });

     return winner;
  };

  // Helper to generate dynamic styles based on source protocols
  const getSourceStyle = (sources: any[]) => {
      if (sources.length === 0) return 'bg-white border-slate-200 text-slate-300 opacity-50 grayscale';
      if (sources.length > 1) return 'bg-slate-800 text-white border-slate-900 shadow-md ring-1 ring-slate-700'; // Mixed sources
      
      // Single source styling
      const color = sources[0].colorName; // e.g. 'rose', 'purple'
      return `bg-${color}-50 text-${color}-700 border-${color}-200 ring-1 ring-${color}-500 shadow-sm`;
  };

  const getBadgeColor = (sources: any[]) => {
      if (sources.length === 0) return 'bg-slate-100 text-slate-400 border-slate-200';
      if (sources.length > 1) return 'bg-slate-800 text-white border-slate-800';
      const color = sources[0].colorName;
      return `bg-${color}-100 text-${color}-700 border-${color}-200`;
  }

  // --- RENDERERS FOR MODAL ---

  const renderEffectiveRow = (module: any) => {
      const isExpanded = expandedModuleId === module.id;
      const authorityData = getEffectiveAuthority(module.id);
      
      // Calculate active scopes count for summary
      const activeScopes = SCOPES.filter(s => getAggregatedSource(module.id, 'scopes', s.id).length > 0);
      
      return (
          <div className={`border-b border-slate-100 last:border-0 transition-all ${isExpanded ? 'bg-slate-50/50' : 'bg-white'}`}>
             <div 
                onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
             >
                 <div className="flex-1">
                     <div className="flex items-center gap-3">
                         <h4 className={`text-sm font-bold ${isExpanded ? 'text-indigo-900' : 'text-slate-900'}`}>{module.name}</h4>
                         {!isExpanded && (
                             <div className="flex items-center gap-2">
                                 <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getBadgeColor(authorityData.sources)}`}>
                                     {authorityData.authority}
                                 </span>
                                 <div className="w-px h-3 bg-slate-300"></div>
                                 <div className="flex gap-1">
                                    {activeScopes.map(s => {
                                        const sources = getAggregatedSource(module.id, 'scopes', s.id);
                                        // Quick hack for colored dots
                                        const color = sources.length > 1 ? 'bg-slate-800' : `bg-${sources[0].colorName}-500`;
                                        return (
                                            <div key={s.id} className={`w-2 h-2 rounded-full ${color}`} title={`${s.label} via ${sources.map((src: any) => src.name).join(', ')}`}></div>
                                        )
                                    })}
                                 </div>
                             </div>
                         )}
                     </div>
                     <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                 </div>
                 <div className="flex items-center gap-4">
                     {isExpanded ? (
                         <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Viewing Details</span>
                     ) : (
                         <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">View Permissions</span>
                     )}
                     <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
                 </div>
             </div>

             <AnimatePresence>
                 {isExpanded && (
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                     >
                        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-6">
                            
                            {/* Sentence */}
                            <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm mb-6">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <span className="font-medium text-slate-400 uppercase text-[10px] tracking-widest block mb-1">Effective Policy</span>
                                    Allows <strong className={`px-1.5 py-0.5 rounded text-xs ${getBadgeColor(authorityData.sources)}`}>{authorityData.authority}</strong> to perform actions on records owned by enabled scopes below.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* 1. Authority */}
                                <div>
                                   <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">1. Effective Authority</h5>
                                   <div className="space-y-2">
                                      {AUTHORITIES.map(auth => {
                                          const sources = getAggregatedSource(module.id, 'authority', auth.id);
                                          const isActive = sources.length > 0;
                                          return (
                                              <div key={auth.id} className={`w-full flex items-center p-3 rounded-xl border text-left transition-all ${getSourceStyle(sources)}`}>
                                                  <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                                                      {auth.icon}
                                                  </div>
                                                  <div>
                                                      <div className="text-sm font-bold">{auth.label}</div>
                                                      <div className={`text-[10px] opacity-80`}>{auth.description}</div>
                                                  </div>
                                                  {isActive && <Check size={16} className="ml-auto" />}
                                              </div>
                                          )
                                      })}
                                   </div>
                                </div>

                                <div className="space-y-6">
                                    {/* 2. Actions */}
                                    <div>
                                       <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">2. Allowed Actions</h5>
                                       <div className="flex flex-wrap gap-2">
                                           {ACTIONS.map(action => {
                                               const sources = getAggregatedSource(module.id, 'actions', action.id);
                                               return (
                                                   <div key={action.id} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${getSourceStyle(sources)}`}>
                                                       {action.icon}
                                                       {action.label}
                                                   </div>
                                               )
                                           })}
                                       </div>
                                    </div>

                                    {/* 3. Scope */}
                                    <div>
                                       <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">3. Data Scope</h5>
                                       <div className="flex flex-wrap gap-2">
                                           {SCOPES.map(scope => {
                                               const sources = getAggregatedSource(module.id, 'scopes', scope.id);
                                               return (
                                                   <div key={scope.id} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${getSourceStyle(sources)}`}>
                                                       {scope.icon}
                                                       {scope.label}
                                                   </div>
                                               )
                                           })}
                                       </div>
                                    </div>

                                    {/* 4. States */}
                                    <div>
                                       <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">4. Allowed Lifecycle States</h5>
                                       <div className="flex flex-wrap gap-2">
                                           {STATES.map(state => {
                                               const sources = getAggregatedSource(module.id, 'states', state.id);
                                               return (
                                                   <div key={state.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${getSourceStyle(sources)}`}>
                                                       {state.label}
                                                   </div>
                                               )
                                           })}
                                       </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </motion.div>
                 )}
             </AnimatePresence>
          </div>
      );
  };

  return (
    <div className="space-y-8">
      {viewMode === 'list' && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
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
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <div className="relative max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search roles by name or modifier..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 font-medium" 
                  />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
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
                  {MOCK_ROLES.map((role) => {
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
                            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={18} />
                            </div>
                        </td>
                        </tr>
                    );
                  })}
                </tbody>
              </table>
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
                        </div>
                    </div>

                    {/* Applying Permissions - Right Col */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Lock size={18} className="text-indigo-600" /> Applying Protocols
                            </h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsOverallViewOpen(true)}
                                    className="text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                                >
                                    <Eye size={14} /> View Effective Permissions
                                </button>
                                <button 
                                    onClick={() => setIsAddProtocolOpen(true)}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Plus size={14} /> Add Protocol
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
                                                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${protocol.color.replace('text-', 'bg-').replace('bg-', 'text-').replace('border-', 'border-').split(' ')[0]} text-white`}>Source</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* MANAGE EMPLOYEES TAB */}
            {activeTab === 'Manage Employees' && (
              <div className="p-8 space-y-6 animate-in fade-in">
                {/* Same as before */}
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

      {/* Consolidated Permissions Modal (Redesigned) */}
      <Modal isOpen={isOverallViewOpen} onClose={() => setIsOverallViewOpen(false)} className="max-w-5xl">
        <div className="flex flex-col h-[750px] bg-white">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <ShieldCheck size={24} className="text-indigo-600" />
                Effective Permission Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-1">Aggregated access rights based on assigned protocols.</p>
            </div>
            
            <div className="flex gap-2">
                {assignedProtocols.map(pid => {
                    const p = AVAILABLE_PROTOCOLS.find(ap => ap.id === pid);
                    if (!p) return null;
                    return (
                        <div key={pid} className={`flex items-center gap-1.5 px-2 py-0.5 rounded bg-${p.colorName}-50 border border-${p.colorName}-100`}>
                            <div className={`w-2 h-2 rounded-full bg-${p.colorName}-500`}></div>
                            <span className={`text-[10px] font-bold text-${p.colorName}-700 uppercase`}>{p.name}</span>
                        </div>
                    )
                })}
                <button onClick={() => setIsOverallViewOpen(false)} className="ml-4 p-2 hover:bg-white rounded-lg text-slate-400 transition-colors">
                    <X size={20} />
                </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden flex flex-col bg-slate-50/30">
            <div className="space-y-8 overflow-y-auto pr-2">
                {MODULE_PERMISSIONS.map(category => (
                    <div key={category.category} className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                            {category.icon} {category.category}
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            {category.modules.map(module => renderEffectiveRow(module))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="p-5 border-t border-slate-100 flex justify-end bg-white">
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
