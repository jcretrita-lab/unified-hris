
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Building2,
  User,
  Briefcase,
  Settings,
  CalendarDays,
  Calendar,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Data for Schedule ---
interface EmployeeScheduleItem {
  id: string;
  name: string;
  jobTitle: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  shiftTime: string;
  workdays: string;
  department: string;
  roleBadge: string;
}

// --- Mock Data for Leave Requests ---
interface LeaveRequestItem {
  id: string;
  name: string;
  jobTitle: string;
  avatar: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  leaveType: 'Vacation Leave' | 'Sick Leave' | 'Emergency Leave';
  leaveDate: string;
  department: string;
  roleBadge: string;
}

const MOCK_SCHEDULES: EmployeeScheduleItem[] = [
  {
    id: 'emp-1',
    name: 'James Cordon',
    jobTitle: 'IT Developer Intern',
    avatar: 'JC',
    status: 'Active',
    shiftTime: '8:00 AM - 6:00 PM',
    workdays: 'T, W, TH',
    department: 'IT Department',
    roleBadge: 'IT Developer Intern'
  },
  {
    id: 'emp-2',
    name: 'Louis Panganiban',
    jobTitle: 'Senior Developer',
    avatar: 'LP',
    status: 'Inactive',
    shiftTime: '7:00 AM - 5:00 PM',
    workdays: 'M, T, W, TH, F',
    department: 'IT Department',
    roleBadge: 'Senior Developer'
  },
  {
    id: 'emp-3',
    name: 'Juan Dela Cruz',
    jobTitle: 'Senior Developer',
    avatar: 'JD',
    status: 'Active',
    shiftTime: '6:00 AM - 4:00 PM',
    workdays: 'M, T, W, TH, F',
    department: 'IT Department',
    roleBadge: 'Senior Developer'
  },
  {
    id: 'emp-4',
    name: 'Sarah Wilson',
    jobTitle: 'HR Manager',
    avatar: 'SW',
    status: 'Active',
    shiftTime: '9:00 AM - 6:00 PM',
    workdays: 'M, T, W, TH, F',
    department: 'HR Department',
    roleBadge: 'HR Manager'
  },
  {
    id: 'emp-5',
    name: 'Mike Brown',
    jobTitle: 'Payroll Specialist',
    avatar: 'MB',
    status: 'Active',
    shiftTime: '8:00 AM - 5:00 PM',
    workdays: 'M, T, W, TH, F',
    department: 'Finance',
    roleBadge: 'Payroll Specialist'
  }
];

const MOCK_LEAVE_REQUESTS: LeaveRequestItem[] = [
  {
    id: 'lr-1',
    name: 'James Cordon',
    jobTitle: 'IT Developer Intern',
    avatar: 'JC',
    approvalStatus: 'Approved',
    leaveType: 'Vacation Leave',
    leaveDate: 'August 5, 2025',
    department: 'IT Department',
    roleBadge: 'IT Developer Intern'
  },
  {
    id: 'lr-2',
    name: 'Louis Panganiban',
    jobTitle: 'Senior Developer',
    avatar: 'LP',
    approvalStatus: 'Pending',
    leaveType: 'Sick Leave',
    leaveDate: 'December 25, 2025',
    department: 'IT Department',
    roleBadge: 'Senior Developer'
  },
  {
    id: 'lr-3',
    name: 'Juan Dela Cruz',
    jobTitle: 'Senior Developer',
    avatar: 'JD',
    approvalStatus: 'Rejected',
    leaveType: 'Emergency Leave',
    leaveDate: 'September 10, 2025',
    department: 'IT Department',
    roleBadge: 'Senior Developer'
  },
  {
    id: 'lr-4',
    name: 'Sarah Wilson',
    jobTitle: 'HR Manager',
    avatar: 'SW',
    approvalStatus: 'Approved',
    leaveType: 'Vacation Leave',
    leaveDate: 'July 20, 2025',
    department: 'HR Department',
    roleBadge: 'HR Manager'
  }
];

const EmployeeSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Schedule Management');
  
  // Filter Handling (Mock)
  const filteredSchedules = MOCK_SCHEDULES.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaves = MOCK_LEAVE_REQUESTS.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = ['Schedule Management', 'Leave Management'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {activeTab === 'Schedule Management' ? 'Employee Shift Information' : 'Employee Leave Information'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {activeTab === 'Schedule Management' 
              ? 'View and filter employee work schedules and statuses.' 
              : 'Track leave requests, statuses and balances.'}
          </p>
        </div>
        <div className="flex gap-3">
            {activeTab === 'Schedule Management' ? (
                <button 
                    onClick={() => navigate('/settings/shift')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                    <Clock size={18} />
                    Manage Shifts
                </button>
            ) : (
                <>
                    <button 
                        onClick={() => navigate('/manage/leave-balances')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Wallet size={18} />
                        View Balances
                    </button>
                    <button 
                        onClick={() => navigate('/settings/leave')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Clock size={18} />
                        Manage Leaves
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative
                ${activeTab === tab 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Schedule Management Tab */}
      {activeTab === 'Schedule Management' && (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {['Role', 'Shift', 'Department', 'Status'].map(filter => (
                        <button key={filter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                            {filter === 'Role' && <User size={14} />}
                            {filter === 'Shift' && <Clock size={14} />}
                            {filter === 'Department' && <Building2 size={14} />}
                            {filter === 'Status' && <Filter size={14} />}
                            {filter}
                            <ChevronLeft className="-rotate-90 ml-1 text-slate-300" size={12} />
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-50">
                    <thead className="bg-slate-50/20 text-left">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                                Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Shift</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workdays</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredSchedules.map((item) => (
                            <tr 
                                key={item.id} 
                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                onClick={() => navigate(`/manage/schedule/${item.id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                            {item.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{item.jobTitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${
                                        item.status === 'Active' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-slate-900">{item.shiftTime}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-slate-600">{item.workdays}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-slate-600">{item.department}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                                        {item.roleBadge}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredSchedules.length} Employees</span>
                <div className="flex gap-2">
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50"><ChevronLeft size={16}/></button>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold">2</button>
                    </div>
                    <button className="flex items-center gap-1 px-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 text-xs font-bold">
                        Next <ChevronRight size={14}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Leave Management Tab */}
      {activeTab === 'Leave Management' && (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {['Role', 'Leave Type', 'Department', 'Approval Status'].map(filter => (
                        <button key={filter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                            {filter === 'Role' && <User size={14} />}
                            {filter === 'Leave Type' && <Clock size={14} />}
                            {filter === 'Department' && <Building2 size={14} />}
                            {filter === 'Approval Status' && <AlertCircle size={14} />}
                            {filter}
                            <ChevronLeft className="-rotate-90 ml-1 text-slate-300" size={12} />
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Leave Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-50">
                    <thead className="bg-slate-50/20 text-left">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                                Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approval Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredLeaves.map((item) => (
                            <tr 
                                key={item.id} 
                                onClick={() => navigate(`/manage/leave-request/${item.id}`)}
                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                                            {item.avatar}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                                            <div className="text-[10px] text-slate-500 font-medium">{item.jobTitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm border ${
                                        item.approvalStatus === 'Approved' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : item.approvalStatus === 'Pending'
                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                            : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {item.approvalStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                                        {item.leaveType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-slate-700">{item.leaveDate}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-slate-600">{item.department}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                                        {item.roleBadge}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredLeaves.length} Requests</span>
                <div className="flex gap-2">
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50"><ChevronLeft size={16}/></button>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold">2</button>
                    </div>
                    <button className="flex items-center gap-1 px-3 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 text-xs font-bold">
                        Next <ChevronRight size={14}/>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSchedule;
