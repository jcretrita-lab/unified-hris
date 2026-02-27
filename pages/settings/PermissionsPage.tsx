
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Search, 
  Plus, 
  ChevronRight, 
  User, 
  Save, 
  Briefcase, 
  Layers, 
  Settings,
  ChevronDown,
  Check,
  Globe,
  Users,
  Building,
  FileText,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Download,
  Gavel,
  PenTool,
  Send,
  Archive,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

// --- Dimensions & Options ---

const SCOPES = [
  { id: 'Self', label: 'Self Only', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <User size={12} /> },
  { id: 'Direct Reports', label: 'Direct Reports', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Users size={12} /> },
  { id: 'Department', label: 'Department', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Building size={12} /> },
  { id: 'Global', label: 'Global (All)', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <Globe size={12} /> },
];

const ACTIONS = [
  { id: 'View', label: 'View', icon: <Eye size={12} /> },
  { id: 'Create', label: 'Create', icon: <Plus size={12} /> },
  { id: 'Edit', label: 'Edit', icon: <Edit3 size={12} /> },
  { id: 'Activate', label: 'Activate', icon: <Power size={12} /> },
  { id: 'Deactivate', label: 'Deactivate', icon: <Trash2 size={12} /> },
  { id: 'Export', label: 'Export', icon: <Download size={12} /> },
  { id: 'Approve', label: 'Approve', icon: <Check size={12} /> },
];

const STATES = [
  { id: 'Draft', label: 'Draft', color: 'bg-slate-100 text-slate-600' },
  { id: 'Pending', label: 'Pending Review', color: 'bg-amber-50 text-amber-600' },
  { id: 'Approved', label: 'Approved', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-600' },
  { id: 'Archived', label: 'Archived', color: 'bg-gray-100 text-gray-500' },
];

const AUTHORITIES = [
  { id: 'Viewer', label: 'Viewer', description: 'Read-only access', icon: <Eye size={14} /> },
  { id: 'Contributor', label: 'Contributor', description: 'Can create and edit drafts', icon: <PenTool size={14} /> },
  { id: 'Requester', label: 'Requester', description: 'Can submit for approval', icon: <Send size={14} /> },
  { id: 'Approver', label: 'Approver', description: 'Can authorize transactions', icon: <Gavel size={14} /> },
];

// --- Mock Data ---

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

const MOCK_ROLES = [
  { id: '1', name: 'Superadmin', users: 1, lastModified: 'Aug 8, 2025', description: 'System Owner. Full unrestricted access to all modules, settings, and logs.' },
  { id: '2', name: 'HR Admin', users: 2, lastModified: 'Aug 8, 2025', description: 'Full access to Employee, Payroll, Attendance. Restricted from System Settings and Audit Logs.' },
  { id: '3', name: 'HR Payroll Personnel', users: 3, lastModified: 'Aug 9, 2025', description: 'Focused access to Payroll Module: Disbursement, Payslips, Tax Config.' },
  { id: '4', name: 'HR Attendance Personnel', users: 2, lastModified: 'Aug 9, 2025', description: 'Focused access to Attendance Module: Shifts, DTR Review, Leave Credits.' },
  { id: '5', name: 'Approver', users: 12, lastModified: 'Aug 10, 2025', description: 'Limited access to the Approvals Module for verifying requests.' },
  { id: '6', name: 'Employee', users: 410, lastModified: 'Aug 1, 2025', description: 'Self-service access only: Own Profile, Payslips, and Filing Requests.' },
];

interface PermissionConfig {
  authority: string;
  scope: string[];
  actions: string[];
  states: string[];
}

const PermissionsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [roleName, setRoleName] = useState('');
  
  // State: { moduleId: PermissionConfig }
  const [permissions, setPermissions] = useState<Record<string, PermissionConfig>>({});
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const getPerm = (moduleId: string): PermissionConfig => {
    return permissions[moduleId] || {
      authority: 'Viewer',
      scope: ['Self'],
      actions: ['View'],
      states: ['Approved']
    };
  };

  const updatePerm = (moduleId: string, updates: Partial<PermissionConfig>) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: { ...getPerm(moduleId), ...updates }
    }));
  };

  const toggleArrayItem = (moduleId: string, field: 'scope' | 'actions' | 'states', item: string) => {
    const current = getPerm(moduleId);
    const array = current[field];
    const newArray = array.includes(item) 
      ? array.filter(i => i !== item) 
      : [...array, item];
    
    // Ensure at least one selection usually, but empty meant 'None' effectively
    updatePerm(moduleId, { [field]: newArray });
  };

  const handleCreateNew = () => {
    setRoleName('');
    setPermissions({});
    setViewMode('editor');
  };

  const handleEditRole = (role: any) => {
    setRoleName(role.name);
    // In a real app, load permissions here
    setViewMode('editor');
  };

  // --- Renderers ---

  const renderConfigPanel = (module: any) => {
    const config = getPerm(module.id);
    
    return (
      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-6">
        {/* Sentence Builder */}
        <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm mb-6">
           <p className="text-sm text-slate-600 leading-relaxed">
             <span className="font-medium text-slate-400">Policy Statement:</span> <br/>
             Allows <strong className="text-indigo-700">{config.authority}</strong> to <strong className="text-slate-800">[{config.actions.join(', ') || 'None'}]</strong> records owned by <strong className="text-slate-800">[{config.scope.join(', ') || 'None'}]</strong> when status is <strong className="text-slate-800">[{config.states.join(', ') || 'None'}]</strong>.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Authority Level */}
            <div>
               <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">1. Authority Level</h5>
               <div className="space-y-2">
                  {AUTHORITIES.map(auth => (
                      <button
                        key={auth.id}
                        onClick={() => updatePerm(module.id, { authority: auth.id })}
                        className={`w-full flex items-center p-3 rounded-xl border text-left transition-all ${
                            config.authority === auth.id 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                          <div className={`p-2 rounded-lg mr-3 ${config.authority === auth.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                              {auth.icon}
                          </div>
                          <div>
                              <div className="text-sm font-bold">{auth.label}</div>
                              <div className={`text-[10px] ${config.authority === auth.id ? 'text-indigo-200' : 'text-slate-400'}`}>{auth.description}</div>
                          </div>
                          {config.authority === auth.id && <Check size={16} className="ml-auto" />}
                      </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
                {/* 2. Actions */}
                <div>
                   <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">2. Allowed Actions</h5>
                   <div className="flex flex-wrap gap-2">
                       {ACTIONS.map(action => (
                           <button
                             key={action.id}
                             onClick={() => toggleArrayItem(module.id, 'actions', action.id)}
                             className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                                 config.actions.includes(action.id)
                                 ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                                 : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                             }`}
                           >
                               {action.icon}
                               {action.label}
                           </button>
                       ))}
                   </div>
                </div>

                {/* 3. Scope */}
                <div>
                   <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">3. Data Scope</h5>
                   <div className="flex flex-wrap gap-2">
                       {SCOPES.map(scope => {
                           const isActive = config.scope.includes(scope.id);
                           return (
                               <button
                                    key={scope.id}
                                    onClick={() => toggleArrayItem(module.id, 'scope', scope.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                                        isActive
                                        ? `${scope.color} shadow-sm ring-1 ring-inset ring-black/5`
                                        : 'bg-white border-slate-200 text-slate-500 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                                    }`}
                               >
                                   {scope.icon}
                                   {scope.label}
                               </button>
                           )
                       })}
                   </div>
                </div>

                {/* 4. Lifecycle State */}
                <div>
                   <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">4. Allowed Lifecycle States</h5>
                   <div className="flex flex-wrap gap-2">
                       {STATES.map(state => {
                           const isActive = config.states.includes(state.id);
                           return (
                               <button
                                    key={state.id}
                                    onClick={() => toggleArrayItem(module.id, 'states', state.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                                        isActive
                                        ? `${state.color} border-current`
                                        : 'bg-white border-slate-200 text-slate-400'
                                    }`}
                               >
                                   {state.label}
                               </button>
                           )
                       })}
                   </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {viewMode === 'list' && (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Permission Protocols
                <Shield className="text-indigo-600" size={24} />
              </h1>
              <p className="text-slate-500 font-medium mt-1">Configure access levels, security policies, and user assignments.</p>
            </div>
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
            >
              <Plus size={20} /> Create Permission Protocol
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search protocols..." 
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Permission Protocol Name</th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned Roles</th>
                    <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Modified</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {MOCK_ROLES.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleEditRole(role)}>
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl mt-0.5">
                            <Lock size={20} />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block mb-1">{role.name}</span>
                            <span className="text-xs text-slate-500 font-medium block">{role.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            {role.users} Active Roles
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                        {role.lastModified}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <ChevronRight size={20} />
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

      {viewMode === 'editor' && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
             <button 
                onClick={() => setViewMode('list')}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
             >
                <ArrowLeft size={16} /> Back to Protocol Management
             </button>
             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all">
                <Save size={18} /> Save Protocol
             </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{roleName ? `Edit Permission Protocol` : 'Add Permission Protocol'}</h2>
            <p className="text-slate-500 text-sm">Define granular access rights using the multi-dimensional permission matrix.</p>
          </div>

          {/* Name Input */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Protocol Name</label>
             <input 
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Standard Employee Access"
                className="w-full max-w-lg border border-slate-200 bg-slate-50 p-3 rounded-xl text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400"
             />
          </div>

          {/* New Matrix Editor */}
          <div className="space-y-8">
             {MODULE_PERMISSIONS.map(category => (
                 <div key={category.category} className="space-y-4">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        {category.icon} {category.category}
                     </h3>
                     
                     <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                         {category.modules.map((module, idx) => {
                             const config = getPerm(module.id);
                             const isExpanded = expandedModule === module.id;
                             
                             return (
                                 <div key={module.id} className={`border-b border-slate-100 last:border-0 transition-all ${isExpanded ? 'bg-slate-50/50' : 'bg-white'}`}>
                                     {/* Header Row */}
                                     <div 
                                        onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                                     >
                                         <div className="flex-1">
                                             <div className="flex items-center gap-3">
                                                 <h4 className={`text-sm font-bold ${isExpanded ? 'text-indigo-900' : 'text-slate-900'}`}>{module.name}</h4>
                                                 {/* Summary Badges (Collapsed View) */}
                                                 {!isExpanded && (
                                                     <div className="flex items-center gap-2">
                                                         <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-bold">{config.authority}</span>
                                                         <div className="w-px h-3 bg-slate-300"></div>
                                                         <div className="flex gap-1">
                                                            {config.scope.map(s => {
                                                                const scopeObj = SCOPES.find(sc => sc.id === s);
                                                                return (
                                                                    <span key={s} className={`w-2 h-2 rounded-full ${scopeObj?.color.split(' ')[0].replace('bg-', 'bg-')} ring-1 ring-white`} title={s}></span>
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
                                                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Editing</span>
                                             ) : (
                                                 <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Click to configure</span>
                                             )}
                                             <ChevronDown size={18} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
                                         </div>
                                     </div>

                                     {/* Expanded Config Panel */}
                                     <AnimatePresence>
                                         {isExpanded && (
                                             <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                             >
                                                {renderConfigPanel(module)}
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </div>
                             );
                         })}
                     </div>
                 </div>
             ))}
          </div>

        </MotionDiv>
      )}
    </div>
  );
};

export default PermissionsPage;
