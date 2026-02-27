
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(async () => {
      await login(email);
      // Navigation logic based on role
      if (email.includes('jane')) {
        navigate('/my-profile');
      } else if (email === 'approver@company.com') {
        navigate('/monitor/approvals');
      } else {
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 800);
  };

  const demoAccounts = [
    { label: 'Superadmin', email: 'admin@company.com' },
    { label: 'HR Admin', email: 'hradmin@company.com' },
    { label: 'Payroll', email: 'payroll@company.com' },
    { label: 'Attendance', email: 'attendance@company.com' },
    { label: 'Recruiter', email: 'recruiter@company.com' },
    { label: 'Approver', email: 'approver@company.com' },
    { label: 'Employee', email: 'jane@company.com' },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Hero/Brand */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12 text-white">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-slate-900 z-0"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 border border-white/10">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Modern HR for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Forward Thinking</span> Teams.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Streamline your workforce management with our comprehensive HRIS platform.
            Handle payroll, attendance, and organizational structure in one unified interface.
          </p>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                  {/* Avatar placeholders */}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-white">Trusted by Industry Leaders</span>
              <span className="text-xs text-slate-500">Join 4,000+ companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Quick Switcher Grid for Demo Purposes */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Select Role Demo</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {demoAccounts.map(acc => (
                <button
                  key={acc.label}
                  onClick={() => setEmail(acc.email)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border ${email === acc.email ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 opacity-0 absolute z-10 cursor-pointer" />
                  <div className="w-4 h-4 border border-slate-300 rounded bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 flex items-center justify-center transition-all">
                    <svg className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember for 30 days</span>
              </label>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
            <p className="text-xs text-slate-500 font-medium">
              Organization not enrolled?
              <button
                onClick={() => navigate('/new-organization')}
                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors ml-1"
              >
                Contact Us to Enroll
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
