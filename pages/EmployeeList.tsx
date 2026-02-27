import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Filter,
  Building2,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Employee, EmployeeStatus } from '../types';

const MOCK_EMPLOYEES: Employee[] = [
  { id: '0192823', name: 'Jane Doe', role: 'IT Developer Intern', department: 'IT Department', email: 'jane@gmail.com', status: EmployeeStatus.ACTIVE, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop', phone: '09123456789', jobType: 'Internship' },
  { id: '0785652', name: 'Juan Dela Cruz', role: 'Senior Developer', department: 'IT Department', email: 'juan@gmail.com', status: EmployeeStatus.INACTIVE, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop', phone: '09123456780', jobType: 'Full-time' },
  { id: '0565543', name: 'Louis Panganiban', role: 'Senior Developer', department: 'IT Department', email: 'louis@gmail.com', status: EmployeeStatus.INACTIVE, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop', phone: '09123456781', jobType: 'Full-time' },
  { id: '0489545', name: 'John Doe', role: 'Junior Developer', department: 'IT Department', email: 'johndoe@gmail.com', status: EmployeeStatus.ACTIVE, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop', phone: '09453728483', jobType: 'Full-Time' },
];

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const MotionTr = motion.tr as any;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage, filter and track all team members in one place.</p>
        </div>
        <button 
          onClick={() => navigate('/manage/employee/new')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 p-1">
          {[
            { label: 'Role', icon: <Briefcase size={16} /> },
            { label: 'Department', icon: <Building2 size={16} /> },
            { label: 'Status', icon: <Filter size={16} /> }
          ].map((f) => (
            <button key={f.label} className="inline-flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-600 transition-all">
              {f.icon}
              {f.label}
              <ChevronDown size={14} className="text-slate-300" />
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md p-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 font-medium"
            placeholder="Search by name, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Employee
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  ID & Contact
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Work Info
                </th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_EMPLOYEES.map((employee, idx) => (
                <MotionTr 
                  key={employee.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-indigo-50/20 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/manage/employee/${employee.id}`)}
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img className="h-11 w-11 rounded-xl object-cover ring-2 ring-white shadow-sm" src={employee.avatar} alt="" />
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${employee.status === EmployeeStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{employee.name}</div>
                        <div className="text-xs text-slate-400 font-semibold">{employee.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-[10px] font-bold rounded-lg uppercase tracking-wider
                      ${employee.status === EmployeeStatus.ACTIVE 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-700">#{employee.id}</div>
                    <div className="text-xs text-slate-400 font-medium lowercase">{employee.email}</div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-700">{employee.department}</div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase">
                      {employee.jobType}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </td>
                </MotionTr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        <div className="bg-slate-50/50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Showing 1 to 4 of 428 Employees</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 43].map((n, i) => (
                <button 
                  key={i}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                    ${n === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button className="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;