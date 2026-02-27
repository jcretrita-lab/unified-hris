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
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

// Mock Data for the Permissions Matrix
const MODULE_PERMISSIONS = [
  {
    category: 'Employee Profile',
    icon: <User size={18} />,
    modules: [
      'Personal Details - Employee Details',
      'Personal Details - Employee Documents',
      'Employment History',
      'Education Background'
    ]
  },
  {
    category: 'Payroll & Compensation',
    icon: <Briefcase size={18} />,
    modules: [
      'Salary Configuration',
      'Payslip Generation',
      'Bank Account Details',
      'Tax Information'
    ]
  },
  {
    category: 'Time & Attendance',
    icon: <Layers size={18} />,
    modules: [
      'Shift Schedule Management',
      'Attendance Logs',
      'Overtime Approval',
      'Leave Management'
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
  { id: '7', name: 'HR Recruiter', users: 4, lastModified: 'Aug 11, 2025', description: 'Access to Employee Directory, Pay Schedule/Structure, Rank, and Salary Grade.' },
];

const PermissionsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [roleName, setRoleName] = useState('');
  
  // State for checkboxes: { "ModuleName": { view: true, edit: false, create: false } }
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  const togglePermission = (moduleName: string, type: 'View' | 'Edit' | 'Create' | 'All') => {
    setPermissions(prev => {
      const modulePerms = prev[moduleName] || { View: false, Edit: false, Create: false };
      
      if (type === 'All') {
        const newState = !modulePerms.View || !modulePerms.Edit || !modulePerms.Create;
        return {
          ...prev,
          [moduleName]: { View: newState, Edit: newState, Create: newState }
        };
      }

      const updatedModule = { ...modulePerms, [type]: !modulePerms[type] };
      return { ...prev, [moduleName]: updatedModule };
    });
  };

  const getPermissionState = (moduleName: string) => {
    return permissions[moduleName] || { View: false, Edit: false, Create: false };
  };

  const isAllChecked = (moduleName: string) => {
    const p = getPermissionState(moduleName);
    return p.View && p.Edit && p.Create;
  };

  const handleCreateNew = () => {
    setRoleName('');
    setPermissions({});
    setViewMode('editor');
  };

  const handleEditRole = (role: any) => {
    setRoleName(role.name);
    // Mock pre-filled permissions would go here
    setViewMode('editor');
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
            <p className="text-slate-500 text-sm">Configure granular access rights for this protocol group.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            
            {/* GENERAL SETTINGS CONTENT */}
            <div className="p-8 space-y-10 animate-in fade-in">
              {/* Role Name Input */}
              <div className="max-w-xl">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Protocol Name</label>
                <input 
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Standard Employee Access"
                  className="w-full border border-slate-200 bg-slate-50/50 p-4 rounded-xl text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Permissions Matrix */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Settings size={16} className="text-indigo-500" />
                    Module Permissions
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Standard Access Control</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold uppercase text-[10px] tracking-widest w-1/2">System Module</th>
                        <th className="px-4 py-4 text-center font-bold uppercase text-[10px] tracking-widest">View</th>
                        <th className="px-4 py-4 text-center font-bold uppercase text-[10px] tracking-widest">Edit</th>
                        <th className="px-4 py-4 text-center font-bold uppercase text-[10px] tracking-widest">Create</th>
                        <th className="px-4 py-4 text-center font-bold uppercase text-[10px] tracking-widest text-indigo-600 bg-indigo-50/30">Full Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MODULE_PERMISSIONS.map((group, groupIdx) => (
                        <React.Fragment key={groupIdx}>
                          {/* Category Header */}
                          <tr className="bg-slate-50/80 border-b border-slate-100">
                            <td colSpan={5} className="px-6 py-3">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                <span className="text-slate-400">{group.icon}</span>
                                {group.category}
                              </div>
                            </td>
                          </tr>
                          {/* Modules */}
                          {group.modules.map((moduleName, modIdx) => {
                            const state = getPermissionState(moduleName);
                            const allChecked = isAllChecked(moduleName);
                            return (
                              <tr key={modIdx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors last:border-none group">
                                <td className="px-6 py-4 font-medium text-slate-600 group-hover:text-indigo-900 transition-colors">{moduleName}</td>
                                {['View', 'Edit', 'Create'].map((type) => (
                                  <td key={type} className="px-4 py-4 text-center">
                                    <label className="inline-flex items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                      <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                        checked={state[type as keyof typeof state]}
                                        onChange={() => togglePermission(moduleName, type as any)}
                                      />
                                    </label>
                                  </td>
                                ))}
                                <td className={`px-4 py-4 text-center border-l border-slate-50 transition-colors ${allChecked ? 'bg-indigo-50/50' : ''}`}>
                                  <label className="inline-flex items-center justify-center cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                                      checked={allChecked}
                                      onChange={() => togglePermission(moduleName, 'All')}
                                    />
                                  </label>
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
            </div>

          </div>
        </MotionDiv>
      )}
    </div>
  );
};

export default PermissionsPage;