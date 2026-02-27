
import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  UserPlus,
  MessageSquare,
  FileText,
  DollarSign,
  AlertCircle,
  Briefcase,
  CheckCircle2, 
  FileCheck, 
  ShieldAlert, 
  Activity, 
  Wallet, 
  Calendar, 
  XCircle, 
  Search, 
  Settings, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Layout, 
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

// --- Widget Configuration Types ---
type WidgetKey = 'stats' | 'attendanceTrend' | 'departmentDist' | 'securityLogs' | 'quickActions' | 'modules' | 'notifications';

interface DashboardConfig {
    stats: boolean;
    attendanceTrend: boolean;
    departmentDist: boolean;
    securityLogs: boolean;
    quickActions: boolean;
    modules: boolean;
    notifications: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Configuration State ---
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState<DashboardConfig>({
      stats: true,
      attendanceTrend: true,
      departmentDist: true,
      securityLogs: true,
      quickActions: true,
      modules: true,
      notifications: true
  });

  const toggleWidget = (key: WidgetKey) => {
      setVisibleWidgets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Mock Charts (Visual Components) ---
  const AttendanceLineChart = () => (
      <div className="h-64 w-full flex items-end justify-between gap-2 pt-4 px-2">
          {[40, 65, 55, 80, 75, 90, 85, 95, 88, 70, 92, 98, 85, 90, 78].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-slate-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                       <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${h}%` }} 
                          className="w-full bg-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"
                       ></motion.div>
                  </div>
              </div>
          ))}
      </div>
  );

  const DepartmentBarChart = () => (
      <div className="space-y-5">
          {[
              { label: 'Engineering', val: 75, color: 'bg-blue-500' },
              { label: 'Sales & Marketing', val: 45, color: 'bg-emerald-500' },
              { label: 'Human Resources', val: 20, color: 'bg-purple-500' },
              { label: 'Finance', val: 15, color: 'bg-amber-500' },
          ].map((dept, i) => (
              <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700">{dept.label}</span>
                      <span className="text-slate-500 font-medium">{dept.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.val}%` }}
                          className={`h-full ${dept.color} rounded-full`}
                      />
                  </div>
              </div>
          ))}
      </div>
  );

  const RecentNotifications = () => (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="text-amber-500" size={20} /> Recent Alerts
              </h2>
              <button onClick={() => navigate('/monitor/notifications')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  View All
              </button>
          </div>
          <div className="space-y-1 overflow-y-auto flex-1 -mx-2 px-2 custom-scrollbar">
              {[
                  { title: 'Payroll Generated', time: '10 mins ago', type: 'success', msg: 'Batch #2025-08-A is ready for review.' },
                  { title: 'Leave Request', time: '2 hours ago', type: 'warning', msg: 'James Cordon requested sick leave.' },
                  { title: 'System Update', time: 'Yesterday', type: 'info', msg: 'Maintenance scheduled for Aug 30.' },
                  { title: 'Attendance Flag', time: 'Yesterday', type: 'error', msg: '3 employees marked as AWOL.' },
                  { title: 'New Applicant', time: '2 days ago', type: 'info', msg: 'Senior Dev application received.' },
              ].map((notif, i) => (
                  <div key={i} className="flex gap-3 items-start group cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-100" onClick={() => navigate('/monitor/notifications')}>
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                          notif.type === 'success' ? 'bg-emerald-500' :
                          notif.type === 'warning' ? 'bg-amber-500' :
                          notif.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-slate-800 truncate">{notif.title}</h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{notif.msg}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  // --- 1. SUPERADMIN DASHBOARD (Refined Layout) ---
  const renderSuperAdmin = () => {
    const stats = [
        { label: 'Total System Users', value: '428', change: '+12%', icon: <Users size={20} />, color: 'bg-blue-500' },
        { label: 'Active Sessions', value: '84', change: 'Live', icon: <Activity size={20} />, color: 'bg-emerald-500' },
        { label: 'System Health', value: '99.9%', change: 'Stable', icon: <ShieldAlert size={20} />, color: 'bg-indigo-500' },
        { label: 'Audit Alerts', value: '3', change: '+1', icon: <AlertCircle size={20} />, color: 'bg-rose-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            {visibleWidgets.stats && <StatsGrid stats={stats} />}
            
            {/* Top Row: Attendance & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Attendance Chart - Takes up 2/3 */}
                {visibleWidgets.attendanceTrend && (
                    <div className={`bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col ${visibleWidgets.notifications ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <LineChart className="text-indigo-600" size={20} /> System Activity Traffic
                                </h2>
                                <p className="text-xs text-slate-500">Real-time server load and user concurrency.</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Traffic</span>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end">
                            <AttendanceLineChart />
                        </div>
                    </div>
                )}

                {/* Notifications - Takes up 1/3 (or full width if chart hidden) */}
                {visibleWidgets.notifications && (
                    <div className={!visibleWidgets.attendanceTrend ? 'lg:col-span-3' : 'lg:col-span-1'}>
                        <RecentNotifications />
                    </div>
                )}
            </div>

            {/* Bottom Row: Secondary Widgets (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Department Distribution */}
                {visibleWidgets.departmentDist && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <PieChart className="text-emerald-600" size={20} /> Resource Allocation
                            </h2>
                            <p className="text-xs text-slate-500">Departmental usage breakdown.</p>
                        </div>
                        <div className="flex-1">
                            <DepartmentBarChart />
                        </div>
                    </div>
                )}

                {/* Security Logs */}
                {visibleWidgets.securityLogs && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <ShieldAlert size={20} className="text-slate-600" /> Security & Access
                        </h2>
                        <div className="space-y-3 flex-1">
                            {[
                                { action: 'Role Modified', user: 'Admin User', time: '10m', type: 'warning' },
                                { action: 'Data Export', user: 'HR Manager', time: '2h', type: 'info' },
                                { action: 'Login Failed', user: 'Unknown IP', time: '5h', type: 'error' },
                                { action: 'Rule Update', user: 'Finance', time: '1d', type: 'info' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'error' ? 'bg-rose-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{log.action}</p>
                                            <p className="text-[10px] text-slate-500">by {log.user}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => navigate('/monitor/audit-logs')} className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">View Audit Trail</button>
                    </div>
                )}

                {/* Module Config */}
                {visibleWidgets.modules && (
                    <div className="bg-indigo-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-indigo-100 min-h-[300px]">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Layout size={20} className="text-indigo-300" />
                                <h2 className="text-xl font-bold">System Modules</h2>
                            </div>
                            <p className="text-indigo-200 mb-6 text-xs max-w-sm leading-relaxed">Manage active subscriptions and feature flags for the organization.</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Core HR', 'Payroll', 'Timekeeping', 'Recruit'].map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-indigo-800/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-200 border border-indigo-700">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <button onClick={() => navigate('/settings/roles')} className="w-full bg-white text-indigo-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg">Manage Configuration</button>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-white">
                            <Settings size={100} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  };

  // --- 2. HR ADMIN DASHBOARD ---
  const renderHRAdmin = () => {
    const stats = [
        { label: 'Total Headcount', value: '428', change: '+5 New', icon: <Users size={20} />, color: 'bg-indigo-500' },
        { label: 'On Leave Today', value: '14', change: '3 Sick', icon: <CalendarCheck size={20} />, color: 'bg-orange-500' },
        { label: 'Onboarding', value: '8', change: 'In Progress', icon: <UserPlus size={20} />, color: 'bg-emerald-500' },
        { label: 'Attr. Rate (YTD)', value: '2.4%', change: '-0.1%', icon: <TrendingUp size={20} />, color: 'bg-rose-500' },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Onboarding Pipeline</h2>
                        <button onClick={() => navigate('/manage/employee')} className="text-xs font-bold text-indigo-600 hover:underline">View Directory</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Sarah Wilson', role: 'UI Designer', status: 'Document Review', progress: 75 },
                            { name: 'David Chen', role: 'Backend Dev', status: 'Contract Signed', progress: 90 },
                            { name: 'Molly Richards', role: 'Marketing Lead', status: 'Account Creation', progress: 40 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">{item.name.charAt(0)}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                        <span className="text-xs font-medium text-slate-500">{item.status}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    {visibleWidgets.notifications && <RecentNotifications />}
                    {visibleWidgets.quickActions && (
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <ActionButton icon={<UserPlus size={18} />} label="New Hire" onClick={() => navigate('/manage/employee/new')} />
                                <ActionButton icon={<FileText size={18} />} label="Policies" />
                                <ActionButton icon={<MessageSquare size={18} />} label="Announce" />
                                <ActionButton icon={<FileCheck size={18} />} label="Approvals" onClick={() => navigate('/monitor/approvals')} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  // --- 3. PAYROLL DASHBOARD ---
  const renderPayroll = () => {
    const stats = [
        { label: 'Next Payout', value: 'Aug 30', change: '5 Days Left', icon: <Calendar size={20} />, color: 'bg-indigo-500' },
        { label: 'Est. Gross', value: '₱4.2M', change: 'Pending Calc', icon: <DollarSign size={20} />, color: 'bg-emerald-500' },
        { label: 'Disputes', value: '4', change: 'Requires Action', icon: <MessageSquare size={20} />, color: 'bg-rose-500' },
        { label: 'Processed', value: '12%', change: 'Draft Mode', icon: <FileText size={20} />, color: 'bg-amber-500' },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Payroll Calendar</h2>
                    <div className="flex gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                        <div className="text-center px-4 border-r border-slate-200">
                            <span className="block text-2xl font-bold text-indigo-600">15</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Aug</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">1st Cutoff Disbursement</h4>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Completed</span>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center p-4 bg-white rounded-xl border-2 border-indigo-100 shadow-sm">
                        <div className="text-center px-4 border-r border-slate-100">
                            <span className="block text-2xl font-bold text-slate-800">30</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Aug</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">2nd Cutoff Disbursement</h4>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Processing</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Pending Actions</h2>
                        {visibleWidgets.notifications && <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">3 Alerts</span>}
                    </div>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/manage/payroll')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <Wallet className="text-indigo-600" size={20} />
                                <div>
                                    <span className="block text-sm font-bold text-slate-800">Finalize Batch 2025-08-B</span>
                                    <span className="text-xs text-slate-500">Due in 3 days</span>
                                </div>
                            </div>
                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-rose-500" size={20} />
                                <div>
                                    <span className="block text-sm font-bold text-slate-800">Review 4 Disputes</span>
                                    <span className="text-xs text-slate-500">Overtime calculation errors reported</span>
                                </div>
                            </div>
                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  // --- 4. ATTENDANCE DASHBOARD ---
  const renderAttendance = () => {
    const stats = [
        { label: 'Present Today', value: '402', change: '94%', icon: <CheckCircle2 size={20} />, color: 'bg-emerald-500' },
        { label: 'Late / Tardy', value: '12', change: '+2 vs Avg', icon: <Clock size={20} />, color: 'bg-amber-500' },
        { label: 'Absent', value: '5', change: 'Unexcused', icon: <XCircle size={20} />, color: 'bg-rose-500' },
        { label: 'Overtime Req', value: '18', change: 'Pending', icon: <TrendingUp size={20} />, color: 'bg-indigo-500' },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Live Attendance Feed</h2>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Real-time</span>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'James Cordon', time: '08:01 AM', status: 'In', dept: 'IT' },
                            { name: 'Sarah Wilson', time: '08:05 AM', status: 'In', dept: 'HR' },
                            { name: 'Mike Brown', time: '08:15 AM', status: 'Late', dept: 'Finance' },
                            { name: 'Louis Panganiban', time: '--:--', status: 'Absent', dept: 'IT' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{log.name}</p>
                                    <p className="text-xs text-slate-500">{log.dept}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono font-bold text-slate-700">{log.time}</p>
                                    <span className={`text-[10px] font-bold uppercase ${log.status === 'Late' ? 'text-amber-500' : log.status === 'Absent' ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/monitor/attendance')} className="w-full mt-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">View All Logs</button>
                </div>
                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Pending Approvals</h2>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-amber-50 rounded-xl p-4 border border-amber-100 text-center cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => navigate('/monitor/approvals')}>
                                <span className="block text-2xl font-bold text-amber-700">18</span>
                                <span className="text-[10px] font-bold text-amber-600 uppercase">Overtime</span>
                            </div>
                            <div className="flex-1 bg-purple-50 rounded-xl p-4 border border-purple-100 text-center cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => navigate('/monitor/approvals')}>
                                <span className="block text-2xl font-bold text-purple-700">6</span>
                                <span className="text-[10px] font-bold text-purple-600 uppercase">Leave</span>
                            </div>
                            <div className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-100 text-center cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => navigate('/monitor/approvals')}>
                                <span className="block text-2xl font-bold text-blue-700">3</span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Off. Business</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 text-white rounded-2xl p-6">
                        <h3 className="font-bold mb-1">Shift Adherence</h3>
                        <p className="text-slate-400 text-xs mb-4">Weekly analytics report is ready.</p>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 w-[92%]"></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-emerald-400">92% On Time</span>
                            <span className="text-slate-400">Target: 95%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  // --- 5. RECRUITER DASHBOARD ---
  const renderRecruiter = () => {
    const stats = [
        { label: 'Open Positions', value: '12', change: '+2', icon: <Briefcase size={20} />, color: 'bg-indigo-500' },
        { label: 'Active Candidates', value: '45', change: 'Pipeline', icon: <Users size={20} />, color: 'bg-blue-500' },
        { label: 'Interviews Today', value: '6', change: 'Scheduled', icon: <CalendarCheck size={20} />, color: 'bg-emerald-500' },
        { label: 'Offers Sent', value: '3', change: 'Pending', icon: <FileText size={20} />, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Recent Applicants</h2>
                    {visibleWidgets.notifications && <button onClick={() => navigate('/monitor/notifications')} className="text-xs font-bold text-indigo-600 flex items-center gap-1"><Bell size={12}/> View Alerts</button>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-3 rounded-l-lg">Candidate</th>
                                <th className="px-6 py-3">Applied For</th>
                                <th className="px-6 py-3">Stage</th>
                                <th className="px-6 py-3 rounded-r-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { name: 'John Smith', role: 'Senior React Dev', stage: 'Technical Interview', date: 'Aug 24' },
                                { name: 'Maria Garcia', role: 'Product Manager', stage: 'Final HR', date: 'Aug 23' },
                                { name: 'Alex Jones', role: 'Data Analyst', stage: 'Screening', date: 'Aug 23' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-700">{row.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.role}</td>
                                    <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">{row.stage}</span></td>
                                    <td className="px-6 py-4 text-slate-500">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
  };

  // --- 6. APPROVER DASHBOARD ---
  const renderApprover = () => {
    const stats = [
        { label: 'Pending My Action', value: '8', change: 'Urgent', icon: <FileCheck size={20} />, color: 'bg-indigo-500' },
        { label: 'Approved (Wk)', value: '12', change: 'Processed', icon: <CheckCircle2 size={20} />, color: 'bg-emerald-500' },
        { label: 'Rejected (Wk)', value: '2', change: 'Returned', icon: <XCircle size={20} />, color: 'bg-rose-500' },
        { label: 'Avg. Response', value: '4h', change: 'Fast', icon: <Clock size={20} />, color: 'bg-blue-500' },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Your Task Queue</h2>
                        <p className="text-slate-500 text-sm">Requests waiting for your sign-off.</p>
                    </div>
                    <button onClick={() => navigate('/monitor/approvals')} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all">Go to Approval Desk</button>
                </div>
                <div className="space-y-4">
                    {[
                        { type: 'Leave Request', user: 'James Cordon', details: 'Vacation (3 Days)', date: 'Aug 24-26', priority: 'High' },
                        { type: 'Overtime', user: 'Louis Panganiban', details: 'Project Crunch (4 hrs)', date: 'Aug 23', priority: 'Normal' },
                        { type: 'Official Business', user: 'Sarah Wilson', details: 'Client Meeting', date: 'Aug 25', priority: 'Normal' },
                    ].map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate('/monitor/approvals')}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${task.type === 'Leave Request' ? 'bg-purple-50 text-purple-600' : task.type === 'Overtime' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {task.type === 'Leave Request' ? <CalendarCheck size={20} /> : task.type === 'Overtime' ? <Clock size={20} /> : <Briefcase size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.type} - {task.user}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{task.details} • {task.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {task.priority === 'High' && <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-rose-100">Urgent</span>}
                                <ArrowUpRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  // --- MAIN RENDER LOGIC ---
  const getDashboardContent = () => {
      switch (user?.role) {
          case 'Superadmin': return renderSuperAdmin();
          case 'HR Admin': return renderHRAdmin();
          case 'HR Payroll Personnel': return renderPayroll();
          case 'HR Attendance Personnel': return renderAttendance();
          case 'HR Recruiter': return renderRecruiter();
          case 'Approver': return renderApprover();
          case 'Employee': return <div className="p-10 text-center text-slate-500">Redirecting to profile...</div>; // Should be handled by router, but fallback
          default: return renderSuperAdmin(); // Fallback
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Morning, {user?.name.split(' ')[0] || 'Admin'}</h1>
          <p className="text-gray-500 mt-1 font-medium">Here's your {user?.role} dashboard overview.</p>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => setIsConfigOpen(true)}
             className="px-4 py-2 bg-white text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 flex items-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
             <Settings size={14} /> Configure View
          </button>
          <span className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Live
          </span>
        </div>
      </div>

      {getDashboardContent()}
      
      {/* Configuration Modal */}
      <Modal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} className="max-w-md">
          <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Customize Dashboard</h3>
              <p className="text-xs text-slate-500 mb-6">Select which panels you want to see in your overview.</p>
              
              <div className="space-y-3">
                  {[
                      { key: 'stats', label: 'Key Statistics Cards', icon: <Activity size={16} /> },
                      { key: 'attendanceTrend', label: 'Activity Trend Graph', icon: <TrendingUp size={16} /> },
                      { key: 'departmentDist', label: 'Resource Allocation Chart', icon: <PieChart size={16} /> },
                      { key: 'securityLogs', label: 'Security & Audit Logs', icon: <ShieldAlert size={16} /> },
                      { key: 'notifications', label: 'Recent Notifications', icon: <Bell size={16} /> },
                      { key: 'modules', label: 'Module Configuration', icon: <Layout size={16} /> }
                  ].map((option) => (
                      <label key={option.key} className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                                {option.icon}
                              </div>
                              {option.label}
                          </div>
                          <div className="relative">
                              <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={visibleWidgets[option.key as WidgetKey]}
                                  onChange={() => toggleWidget(option.key as WidgetKey)}
                              />
                              <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </div>
                      </label>
                  ))}
              </div>
              
              <button 
                onClick={() => setIsConfigOpen(false)}
                className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                  Done
              </button>
          </div>
      </Modal>
    </div>
  );
};

// --- REUSABLE COMPONENTS ---

const StatsGrid = ({ stats }: { stats: any[] }) => {
    const MotionDiv = motion.div as any;
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
            <MotionDiv 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-default"
            >
                <div className="flex items-start justify-between">
                    <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-indigo-500/20`}>
                        {stat.icon}
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
                        {stat.change}
                    </span>
                </div>
                <div className="mt-5">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
                    <p className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{stat.value}</p>
                </div>
            </MotionDiv>
        ))}
    </div>
    );
};

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 hover:bg-white hover:shadow-md hover:border-indigo-100 border border-transparent rounded-xl transition-all group"
    >
        <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</div>
        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
    </button>
);

export default Dashboard;
