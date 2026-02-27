import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  RefreshCcw, 
  Mail, 
  User,
  Trash2,
  Edit2,
  Key,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

// --- MOCK DATA ---
type UserStatus = 'Active' | 'Inactive' | 'Locked' | 'Pending Invite';

interface SystemUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: UserStatus;
  lastLogin: string;
  dateAdded: string;
  mfaEnabled: boolean;
}

const MOCK_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    employeeId: 'emp-1',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    role: 'HR Admin',
    avatar: 'SW',
    status: 'Active',
    lastLogin: 'Today, 9:42 AM',
    dateAdded: 'Sep 1, 2024',
    mfaEnabled: true
  },
  {
    id: 'usr-2',
    employeeId: 'emp-2',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Superadmin',
    avatar: 'JD',
    status: 'Active',
    lastLogin: 'Yesterday, 4:20 PM',
    dateAdded: 'Aug 15, 2024',
    mfaEnabled: true
  },
  {
    id: 'usr-3',
    employeeId: 'emp-4',
    name: 'Mike Brown',
    email: 'mike@company.com',
    role: 'HR Payroll Personnel',
    avatar: 'MB',
    status: 'Locked',
    lastLogin: 'Oct 20, 2025 (Failed)',
    dateAdded: 'Sep 5, 2024',
    mfaEnabled: false
  },
  {
    id: 'usr-4',
    employeeId: 'emp-3',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'Employee',
    avatar: 'JS',
    status: 'Inactive',
    lastLogin: 'Never',
    dateAdded: 'Oct 1, 2025',
    mfaEnabled: false
  },
  {
    id: 'usr-5',
    employeeId: 'emp-7',
    name: 'Robert Chen',
    email: 'robert@company.com',
    role: 'Approver',
    avatar: 'RC',
    status: 'Pending Invite',
    lastLogin: '-',
    dateAdded: 'Oct 24, 2025',
    mfaEnabled: false
  }
];

const ROLES = [
  'Superadmin', 
  'HR Admin', 
  'HR Payroll Personnel', 
  'HR Attendance Personnel', 
  'Approver', 
  'Employee', 
  'HR Recruiter'
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    status: 'Active',
    sendInvite: true
  });

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Inactive': return 'bg-slate-50 text-slate-500 border-slate-200';
      case 'Locked': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Pending Invite': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'Superadmin') return 'bg-rose-50 text-rose-700 border-rose-100';
    if (role.includes('HR')) return 'bg-purple-50 text-purple-700 border-purple-100';
    if (role === 'Approver') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', role: 'Employee', status: 'Pending Invite', sendInvite: true });
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setModalMode('edit');
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status as string,
      sendInvite: false 
    });
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.email || !formData.name) return;

    if (modalMode === 'create') {
      const newUser: SystemUser = {
        id: Math.random().toString(36).substr(2, 9),
        employeeId: 'new-emp',
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        status: 'Pending Invite',
        lastLogin: '-',
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        mfaEnabled: false
      };
      setUsers([...users, newUser]);
    } else if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { 
        ...u, 
        name: formData.name, 
        role: formData.role, 
        status: formData.status as UserStatus 
      } : u));
    }
    setIsModalOpen(false);
  };

  const handleResetPassword = (id: string) => {
    alert(`Password reset link sent to user.`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            User Management
            <Shield className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage system access, roles, and user credentials.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white">
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
               <div className="relative">
                  <select 
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl pr-8 outline-none focus:border-indigo-500 cursor-pointer"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="All">All Roles</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
               </div>
               
               <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                  <Filter size={14} /> More Filters
               </button>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-50">
                <thead className="bg-slate-50/30 text-left">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Role</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Login</th>
                        <th className="px-6 py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                        <tr 
                            key={user.id} 
                            onClick={() => handleOpenEdit(user)}
                            className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                                        <div className="text-[11px] text-slate-500 font-medium">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${getRoleBadge(user.role)}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Locked' ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                                    <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-700' : user.status === 'Locked' ? 'text-rose-700' : 'text-slate-600'}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.mfaEnabled ? (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit border border-emerald-100">
                                        <ShieldAlert size={12} /> MFA On
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-200">
                                        <Shield size={12} /> MFA Off
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-mono text-slate-600">{user.lastLogin}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleResetPassword(user.id); }}
                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                        title="Reset Password"
                                    >
                                        <Key size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(user); }}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Edit User"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredUsers.length} Users</span>
            <div className="flex gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16}/></button>
                <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-lg">
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{modalMode === 'create' ? 'Add New User' : 'Edit User'}</h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><User size={20} /></div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Employee Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            className="w-full pl-10 border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="email"
                            className="w-full pl-10 border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all disabled:opacity-50 disabled:bg-slate-50"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            disabled={modalMode === 'edit'}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Role</label>
                        <select 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Status</label>
                        <select 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer disabled:bg-slate-50 disabled:opacity-50"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            disabled={modalMode === 'create'}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Locked">Locked</option>
                            <option value="Pending Invite">Pending Invite</option>
                        </select>
                    </div>
                </div>

                {modalMode === 'create' && (
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                        <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={16} />
                        <div>
                            <h4 className="text-xs font-bold text-blue-800">Email Invitation</h4>
                            <p className="text-[11px] text-blue-600 mt-1 leading-relaxed">
                                An email will be sent to the user with instructions to set up their password and MFA authentication.
                            </p>
                        </div>
                    </div>
                )}

                {modalMode === 'edit' && selectedUser?.status === 'Locked' && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 items-start">
                        <Lock className="text-rose-600 shrink-0 mt-0.5" size={16} />
                        <div>
                            <h4 className="text-xs font-bold text-rose-800">Account Locked</h4>
                            <p className="text-[11px] text-rose-600 mt-1 leading-relaxed">
                                This account has been locked due to multiple failed login attempts. Resetting the password will unlock it.
                            </p>
                            <button 
                                onClick={() => handleResetPassword(selectedUser.id)}
                                className="mt-2 text-[10px] font-bold text-white bg-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
                            >
                                Unlock & Reset Password
                            </button>
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                        {modalMode === 'create' ? 'Send Invitation' : 'Save Changes'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;