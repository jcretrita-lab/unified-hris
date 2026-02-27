import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  CheckCircle2, 
  Edit2,
  Calendar,
  Briefcase,
  MapPin,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, EmployeeStatus } from '../types';
import { useAuth } from '../context/AuthContext';

import ProfileTab from './employee-detail/ProfileTab';
import ScheduleTab from './employee-detail/ScheduleTab';
import JobHistoryTab from './employee-detail/JobHistoryTab';
import PayrollTab from './employee-detail/PayrollTab';
import PayStructureTab from './employee-detail/PayStructureTab';
import AttendanceTab from './employee-detail/AttendanceTab';

const EMPLOYEE_DETAIL_TABS = ['Profile', 'Schedule', 'Pay Structure', 'Payroll', 'Attendance', 'Job History'];

const getTabFromSearch = (search: string) => {
  const tab = new URLSearchParams(search).get('tab');
  return tab && EMPLOYEE_DETAIL_TABS.includes(tab) ? tab : 'Profile';
};

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => getTabFromSearch(location.search));
  const MotionDiv = motion.div as any;
  const isEmployeeView = user?.role === 'Employee';

  useEffect(() => {
    const nextTab = getTabFromSearch(location.search);
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [location.search, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`${location.pathname}?tab=${encodeURIComponent(tab)}`, { replace: true });
  };

  const employee: Employee = {
    id: id || '0489545',
    name: 'John Doe',
    role: 'Senior Developer',
    department: 'IT Department',
    email: 'johndoe@gmail.com',
    status: EmployeeStatus.ACTIVE,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&auto=format&fit=crop',
    phone: '+1 (555) 234-5678',
    jobType: 'Full-Time'
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/manage/employee')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all group px-3 py-1.5 hover:bg-indigo-50 rounded-lg"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Directory
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-xl transition-all">Actions</button>
          <button className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-md active:scale-95 transition-all">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden ring-8 ring-slate-50 shadow-xl transition-transform group-hover:scale-[1.02]">
              <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl shadow-lg border-4 border-white">
              <CheckCircle2 size={20} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{employee.name}</h1>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full border border-emerald-100 tracking-widest">
                  {employee.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-500 text-sm font-semibold">
                <span className="flex items-center gap-2"><Mail size={16} className="text-slate-300" /> {employee.email}</span>
                <span className="flex items-center gap-2"><Phone size={16} className="text-slate-300" /> {employee.phone}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-300" /> San Francisco, CA</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatItem label="Role" value={employee.role} icon={<Briefcase size={14} />} />
              <StatItem label="Dept" value={employee.department} icon={<Building size={14} />} />
              <StatItem label="ID" value={employee.id} icon={<Globe size={14} />} />
              <StatItem label="Type" value={employee.jobType} icon={<Calendar size={14} />} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      {!isEmployeeView && (
        <div className="border-b border-slate-100">
          <nav className="flex gap-10">
            {EMPLOYEE_DETAIL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
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
      )}

      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="space-y-8"
        >
          {activeTab === 'Profile' && <ProfileTab employee={employee} />}
          {activeTab === 'Schedule' && <ScheduleTab />}
          {activeTab === 'Pay Structure' && <PayStructureTab />}
          {activeTab === 'Payroll' && <PayrollTab />}
          {activeTab === 'Attendance' && <AttendanceTab />}
          {activeTab === 'Job History' && <JobHistoryTab />}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
};

// Reusable Components
const StatItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 text-left">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-slate-300">{icon}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-xs font-bold text-slate-800 truncate">{value}</p>
  </div>
);

export default EmployeeDetail;
