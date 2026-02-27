
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Settings, 
  ChevronDown,
  UserCircle,
  LayoutGrid,
  Bell,
  Search,
  ArrowLeft,
  ShieldAlert,
  History,
  Lock,
  LogOut,
  UserCog,
  BookOpen,
  FileBarChart,
  ClipboardList,
  BellRing,
  Building2,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

// Mock Search Data
const SEARCH_ITEMS = [
  { id: 'p1', title: 'Dashboard', type: 'Page', path: '/dashboard' },
  { id: 'p2', title: 'Employee Directory', type: 'Page', path: '/manage/employee' },
  { id: 'p3', title: 'Payroll Management', type: 'Page', path: '/manage/payroll' },
  { id: 'p4', title: 'Attendance Monitor', type: 'Page', path: '/monitor/attendance' },
  { id: 'e1', title: 'James Cordon', type: 'Employee', path: '/manage/employee/emp-1' },
  { id: 'e2', title: 'Sarah Wilson', type: 'Employee', path: '/manage/employee/emp-4' },
  { id: 'e3', title: 'Louis Panganiban', type: 'Employee', path: '/manage/employee/emp-2' },
  { id: 's1', title: 'Settings: Notifications', type: 'Setting', path: '/settings/notifications' },
  { id: 's2', title: 'Settings: Roles', type: 'Setting', path: '/settings/roles' },
  { id: 's3', title: 'Settings: Salary Grades', type: 'Setting', path: '/settings/salary-grade' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Search State
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  const isSettingsPath = location.pathname.startsWith('/settings');
  const isStandalonePage = location.pathname === '/login' || location.pathname === '/new-organization';
  const employeeBasePath = user?.employeeId ? `/manage/employee/${user.employeeId}` : '/my-profile';

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isStandalonePage) {
    return <>{children}</>;
  }

  // --- Dynamic Navigation Logic ---
  
  // 1. Superadmin (Everything)
  const superAdminNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Manage', 
      items: [
        { icon: <Users size={19} />, label: 'Employee', path: '/manage/employee' },
        { icon: <Calendar size={19} />, label: 'Schedule', path: '/manage/schedule' },
        { icon: <Wallet size={19} />, label: 'Payroll', path: '/manage/payroll' },
        { icon: <FileCheck size={19} />, label: 'Pay Schedule', path: '/manage/pay-schedule' },
        { icon: <LayoutGrid size={19} />, label: 'Pay Structure', path: '/manage/pay-structure' },
      ] 
    },
    { 
      section: 'Monitor', 
      items: [
        { icon: <Clock size={19} />, label: 'Attendance', path: '/monitor/attendance' },
        { icon: <ShieldCheck size={19} />, label: 'Audit Logs', path: '/monitor/audit-logs' },
        { icon: <FileCheck size={19} />, label: 'Approvals', path: '/monitor/approvals' },
        { icon: <FileBarChart size={19} />, label: 'Reports', path: '/monitor/reports' },
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ] 
    },
  ];

  // 2. HR Admin (Everything except deep system settings usually, but similar to admin in Manage/Monitor)
  const hrAdminNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Manage', 
      items: [
        { icon: <Users size={19} />, label: 'Employee', path: '/manage/employee' },
        { icon: <Calendar size={19} />, label: 'Schedule', path: '/manage/schedule' },
        { icon: <Wallet size={19} />, label: 'Payroll', path: '/manage/payroll' },
        { icon: <LayoutGrid size={19} />, label: 'Pay Structure', path: '/manage/pay-structure' },
      ] 
    },
    { 
      section: 'Monitor', 
      items: [
        { icon: <Clock size={19} />, label: 'Attendance', path: '/monitor/attendance' },
        { icon: <FileCheck size={19} />, label: 'Approvals', path: '/monitor/approvals' },
        { icon: <FileBarChart size={19} />, label: 'Reports', path: '/monitor/reports' },
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ] 
    },
  ];

  // 3. HR Payroll Personnel (Payroll Focused)
  const payrollNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Manage', 
      items: [
        { icon: <Wallet size={19} />, label: 'Payroll', path: '/manage/payroll' },
        { icon: <FileCheck size={19} />, label: 'Pay Schedule', path: '/manage/pay-schedule' },
        { icon: <LayoutGrid size={19} />, label: 'Pay Structure', path: '/manage/pay-structure' },
      ] 
    },
    { 
      section: 'Monitor', 
      items: [
        { icon: <Clock size={19} />, label: 'Attendance', path: '/monitor/attendance' }, // Need attendance to compute pay
        { icon: <FileBarChart size={19} />, label: 'Reports', path: '/monitor/reports' },
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ] 
    },
  ];

  // 4. HR Attendance Personnel (Time Focused)
  const attendanceNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Manage', 
      items: [
        { icon: <Calendar size={19} />, label: 'Schedule', path: '/manage/schedule' },
      ] 
    },
    { 
      section: 'Monitor', 
      items: [
        { icon: <Clock size={19} />, label: 'Attendance', path: '/monitor/attendance' },
        { icon: <FileCheck size={19} />, label: 'Approvals', path: '/monitor/approvals' }, // Approve OT/Leaves
        { icon: <FileBarChart size={19} />, label: 'Reports', path: '/monitor/reports' },
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ] 
    },
  ];

  // 5. Approver (Task Focused)
  const approverNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Monitor', 
      items: [
        { icon: <FileCheck size={19} />, label: 'Pending Approvals', path: '/monitor/approvals' },
        { icon: <Clock size={19} />, label: 'Team Attendance', path: '/monitor/attendance' },
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ] 
    },
  ];

  // 6. HR Recruiter (People Focused)
  const recruiterNav = [
    { section: 'Home', items: [{ icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: '/dashboard' }] },
    { 
      section: 'Manage', 
      items: [
        { icon: <Users size={19} />, label: 'Employee Directory', path: '/manage/employee' },
        { icon: <Calendar size={19} />, label: 'Schedule', path: '/manage/schedule' },
      ] 
    },
    { 
        section: 'Monitor', 
        items: [
          { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
        ] 
      },
  ];

  // 7. Employee (Self Service)
  const employeeNav = [
    {
      section: 'My Workspace',
      items: [
        { icon: <UserCircle size={19} />, label: 'Profile', path: `${employeeBasePath}?tab=Profile`, profileTab: 'Profile' },
        { icon: <Calendar size={19} />, label: 'Schedule', path: `${employeeBasePath}?tab=Schedule`, profileTab: 'Schedule' },
        { icon: <LayoutGrid size={19} />, label: 'Pay Structure', path: `${employeeBasePath}?tab=Pay%20Structure`, profileTab: 'Pay Structure' },
        { icon: <Wallet size={19} />, label: 'Payroll', path: `${employeeBasePath}?tab=Payroll`, profileTab: 'Payroll' },
        { icon: <Clock size={19} />, label: 'Attendance', path: `${employeeBasePath}?tab=Attendance`, profileTab: 'Attendance' },
        { icon: <History size={19} />, label: 'Job History', path: `${employeeBasePath}?tab=Job%20History`, profileTab: 'Job History' },
      ]
    },
    {
      section: 'Monitor',
      items: [
        { icon: <Bell size={19} />, label: 'Notifications', path: '/monitor/notifications' },
      ]
    }
  ];

  // --- Settings Navigation Variants ---
  
  const superAdminSettings = [
    {
      section: 'Personnel Information',
      items: [
        { icon: <ClipboardList size={19} />, label: 'Employee', path: '/settings/employee-fields' },
      ]
    },
    { 
      section: 'Timekeeping', 
      items: [
        { icon: <Clock size={19} />, label: 'Shift', path: '/settings/shift' },
        { icon: <Calendar size={19} />, label: 'Leave', path: '/settings/leave' },
        { icon: <Calendar size={19} />, label: 'Holiday', path: '/settings/holiday' },
      ] 
    },
    { 
      section: 'Pay Structure', 
      items: [
        { icon: <FileCheck size={19} />, label: 'Rank', path: '/settings/ranks' },
        { icon: <LayoutGrid size={19} />, label: 'Salary Grade', path: '/settings/salary-grade' },
        { icon: <Sliders size={19} />, label: 'Adjustments', path: '/settings/adjustments' },
      ] 
    },
    { 
      section: 'Organization', 
      items: [
        { icon: <Building2 size={19} />, label: 'Structure', path: '/settings/structure' },
        { icon: <BookOpen size={19} />, label: 'Policies & Rules', path: '/settings/policies' },
        { icon: <ShieldAlert size={19} />, label: 'Approvals', path: '/settings/approvals' },
      ] 
    },
    { 
      section: 'System', 
      items: [
        { icon: <UserCog size={19} />, label: 'User Management', path: '/settings/users' },
        { icon: <Lock size={19} />, label: 'Permissions', path: '/settings/permissions' },
        { icon: <ShieldCheck size={19} />, label: 'Role Overview', path: '/settings/roles' },
        { icon: <BellRing size={19} />, label: 'Notifications', path: '/settings/notifications' },
        { icon: <History size={19} />, label: 'Audit Logs', path: '/settings/audit' },
      ] 
    },
  ];

  const hrAdminSettings = [
    {
      section: 'Personnel Information',
      items: [
        { icon: <ClipboardList size={19} />, label: 'Employee', path: '/settings/employee-fields' },
      ]
    },
    { 
        section: 'Timekeeping', 
        items: [
          { icon: <Clock size={19} />, label: 'Shift', path: '/settings/shift' },
          { icon: <Calendar size={19} />, label: 'Leave', path: '/settings/leave' },
          { icon: <Calendar size={19} />, label: 'Holiday', path: '/settings/holiday' },
        ] 
      },
      { 
        section: 'Pay Structure', 
        items: [
          { icon: <FileCheck size={19} />, label: 'Rank', path: '/settings/ranks' },
          { icon: <LayoutGrid size={19} />, label: 'Salary Grade', path: '/settings/salary-grade' },
          { icon: <Sliders size={19} />, label: 'Adjustments', path: '/settings/adjustments' },
        ] 
      },
      { 
        section: 'Organization', 
        items: [
          { icon: <Building2 size={19} />, label: 'Structure', path: '/settings/structure' },
          { icon: <BookOpen size={19} />, label: 'Policies & Rules', path: '/settings/policies' },
          { icon: <ShieldAlert size={19} />, label: 'Approvals', path: '/settings/approvals' },
        ] 
      },
      { 
        section: 'System', 
        items: [
          { icon: <UserCog size={19} />, label: 'User Management', path: '/settings/users' },
          { icon: <BellRing size={19} />, label: 'Notifications', path: '/settings/notifications' },
        ] 
      },
  ];

  const payrollSettings = [
    { 
        section: 'Pay Structure', 
        items: [
          { icon: <FileCheck size={19} />, label: 'Rank', path: '/settings/ranks' },
          { icon: <LayoutGrid size={19} />, label: 'Salary Grade', path: '/settings/salary-grade' },
          { icon: <Sliders size={19} />, label: 'Adjustments', path: '/settings/adjustments' },
        ] 
    },
  ];

  const attendanceSettings = [
    { 
        section: 'Timekeeping', 
        items: [
          { icon: <Clock size={19} />, label: 'Shift', path: '/settings/shift' },
          { icon: <Calendar size={19} />, label: 'Leave', path: '/settings/leave' },
          { icon: <Calendar size={19} />, label: 'Holiday', path: '/settings/holiday' },
        ] 
    },
  ];

  const recruiterSettings = [
    { 
        section: 'Organization', 
        items: [
          { icon: <Building2 size={19} />, label: 'Structure', path: '/settings/structure' },
        ] 
    },
    { 
        section: 'Pay Structure', 
        items: [
          { icon: <FileCheck size={19} />, label: 'Rank', path: '/settings/ranks' },
          { icon: <LayoutGrid size={19} />, label: 'Salary Grade', path: '/settings/salary-grade' },
        ] 
    },
  ];

  // Determine active nav set
  let activeNavSet = superAdminNav; // Default fallback
  
  if (isSettingsPath) {
      switch (user?.role) {
          case 'Superadmin': activeNavSet = superAdminSettings; break;
          case 'HR Admin': activeNavSet = hrAdminSettings; break;
          case 'HR Payroll Personnel': activeNavSet = payrollSettings; break;
          case 'HR Attendance Personnel': activeNavSet = attendanceSettings; break;
          case 'HR Recruiter': activeNavSet = recruiterSettings; break;
          case 'Approver': activeNavSet = []; break; // No settings for Approver
          case 'Employee': activeNavSet = []; break; // No settings for Employee
          default: activeNavSet = superAdminSettings;
      }
  } else {
      switch (user?.role) {
          case 'Superadmin': activeNavSet = superAdminNav; break;
          case 'HR Admin': activeNavSet = hrAdminNav; break;
          case 'HR Payroll Personnel': activeNavSet = payrollNav; break;
          case 'HR Attendance Personnel': activeNavSet = attendanceNav; break;
          case 'Approver': activeNavSet = approverNav; break;
          case 'HR Recruiter': activeNavSet = recruiterNav; break;
          case 'Employee': activeNavSet = employeeNav; break;
          default: activeNavSet = employeeNav;
      }
  }

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const filteredSearchItems = SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Dynamic Sidebar */}
      <aside className={`w-64 border-r border-slate-200 flex flex-col fixed h-full z-20 overflow-hidden transition-colors duration-300 ${isSettingsPath ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        
        {/* Brand/Header Section */}
        <div className="p-7 flex items-center gap-3">
          <div className={`${isSettingsPath ? 'bg-indigo-500' : 'bg-indigo-600'} p-2 rounded-xl shadow-lg`}>
            <ShieldCheck className="text-white" size={22} />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isSettingsPath ? 'text-white' : 'text-slate-900'}`}>HRIS</span>
        </div>

        {/* Back Button for Settings (Admin Only) */}
        {isSettingsPath && user?.role !== 'Employee' && (
          <div className="px-4 pb-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
            >
              <ArrowLeft size={16} />
              Return to App
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-2 space-y-7 overflow-y-auto no-scrollbar">
          {activeNavSet.length > 0 ? activeNavSet.map((group) => (
            <div key={group.section}>
              <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-3 px-3 ${isSettingsPath ? 'text-slate-500' : 'text-slate-400'}`}>
                {group.section}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const profileTab = (item as { profileTab?: string }).profileTab;
                  const isEmployeeProfileItem = user?.role === 'Employee' && Boolean(profileTab);
                  const activeEmployeeTab = new URLSearchParams(location.search).get('tab') || 'Profile';
                  const isEmployeeProfileActive = isEmployeeProfileItem && location.pathname === employeeBasePath && activeEmployeeTab === profileTab;
                  const isItemActiveNow = isEmployeeProfileItem ? isEmployeeProfileActive : location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${(isEmployeeProfileItem ? isEmployeeProfileActive : isActive)
                          ? (isSettingsPath ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/50')
                          : (isSettingsPath ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')}
                      `}
                    >
                      <span className={isItemActiveNow ? (isSettingsPath ? 'text-white' : 'text-indigo-600') : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )) : (
             <div className="p-4 text-center text-slate-500 text-xs italic">
                No settings available for this role.
             </div>
          )}
        </nav>

        {/* Bottom Action Area (Admin Only) */}
        {user?.role !== 'Employee' && !isSettingsPath && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
            {/* Logic: Only show System Settings button if user has access to at least one settings page */}
            {user?.role !== 'Approver' && (
                <button 
                onClick={() => {
                    navigate('/settings/overview');
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all text-slate-600 hover:bg-white hover:shadow-sm"
                >
                <Settings size={19} className="text-slate-400" />
                System Settings
                </button>
            )}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen relative">
        {/* Universal Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {isSettingsPath && (
               <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200">
                System Mode
              </div>
            )}
            {/* Global Search / Command Palette */}
            <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search pages, employees, settings..." 
                className="w-full bg-slate-50 border-none rounded-xl pl-10 py-2 text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
                    >
                        {filteredSearchItems.length > 0 ? (
                            <div className="py-2">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</div>
                                {filteredSearchItems.map(item => (
                                    <button 
                                        key={item.id}
                                        onClick={() => { navigate(item.path); setIsSearchFocused(false); setSearchQuery(''); }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${item.type === 'Page' ? 'bg-indigo-50 text-indigo-600' : item.type === 'Employee' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.title}</span>
                                        </div>
                                        <ArrowLeft size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 rotate-180 transition-all" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-sm text-slate-400">No results found.</div>
                        )}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-5 ml-auto">
            <button 
              onClick={() => navigate('/monitor/notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-3 pl-2 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors text-left outline-none">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Guest'}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1">{user?.role || 'Visitor'}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md text-white font-bold text-xs">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('') : <UserCircle size={24} />}
                </div>
                <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                  </div>
                  <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                      <LogOut size={16} />
                      Log Out
                  </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1500px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
