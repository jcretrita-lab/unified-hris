import React, { useState } from 'react';
import { 
  Save, 
  Shield, 
  History, 
  AlertTriangle, 
  Check, 
  RefreshCcw, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  Info,
  Lock,
  Database,
  Users,
  CreditCard,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface AuditEventRule {
  id: string;
  module: string;
  event: string;
  description: string;
  enabled: boolean;
  severity: 'Critical' | 'Medium' | 'Low';
  isSystem?: boolean; // If true, cannot be disabled (optional logic)
}

// --- Mock Data ---
const INITIAL_RULES: AuditEventRule[] = [
  // Authentication
  { id: 'auth-1', module: 'Authentication', event: 'User Login', description: 'Log when a user successfully signs in.', enabled: true, severity: 'Low' },
  { id: 'auth-2', module: 'Authentication', event: 'Failed Login Attempt', description: 'Log invalid password entries or account lockouts.', enabled: true, severity: 'Medium' },
  { id: 'auth-3', module: 'Authentication', event: 'Password Change', description: 'Log when a user updates their password.', enabled: true, severity: 'Medium' },
  { id: 'auth-4', module: 'Authentication', event: 'Logout', description: 'Log user session termination.', enabled: false, severity: 'Low' },

  // Employee Management
  { id: 'emp-1', module: 'Employee Management', event: 'Create Employee', description: 'Log when a new employee profile is created.', enabled: true, severity: 'Critical' },
  { id: 'emp-2', module: 'Employee Management', event: 'Update Personal Info', description: 'Log changes to address, contact info, etc.', enabled: true, severity: 'Low' },
  { id: 'emp-3', module: 'Employee Management', event: 'Salary Adjustment', description: 'Log changes to base pay or benefits.', enabled: true, severity: 'Critical' },
  { id: 'emp-4', module: 'Employee Management', event: 'Terminate Employee', description: 'Log status changes to Inactive/Terminated.', enabled: true, severity: 'Critical' },

  // Payroll
  { id: 'pay-1', module: 'Payroll', event: 'Generate Payslip', description: 'Log when payslips are generated for a period.', enabled: true, severity: 'Medium' },
  { id: 'pay-2', module: 'Payroll', event: 'Finalize Payroll', description: 'Log when a payroll run is approved and closed.', enabled: true, severity: 'Critical' },

  // System
  { id: 'sys-1', module: 'System', event: 'Update Role Permissions', description: 'Log changes to permission protocols.', enabled: true, severity: 'Critical' },
  { id: 'sys-2', module: 'System', event: 'Configuration Change', description: 'Log updates to global system settings.', enabled: true, severity: 'Medium' },
];

const AuditLogSettings: React.FC = () => {
  const [rules, setRules] = useState<AuditEventRule[]>(INITIAL_RULES);
  const [retentionPeriod, setRetentionPeriod] = useState('90');
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const modules = Array.from(new Set(rules.map(r => r.module))) as string[];

  const handleToggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    setHasChanges(true);
  };

  const handleGlobalToggle = () => {
    setGlobalEnabled(!globalEnabled);
    setHasChanges(true);
  };

  const handleRetentionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRetentionPeriod(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    // API Call would go here
    setHasChanges(false);
    // Show success toast logic
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Authentication': return <Lock size={18} />;
      case 'Employee Management': return <Users size={18} />;
      case 'Payroll': return <CreditCard size={18} />;
      case 'System': return <Database size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const filteredRules = rules.filter(r => 
    r.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Audit Log Configuration
            <History className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Configure retention policies and visible events for system auditing.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => { setRules(INITIAL_RULES); setGlobalEnabled(true); setHasChanges(false); }}
                className="px-4 py-2.5 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-xl transition-all"
            >
                Reset Defaults
            </button>
            <button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Save size={18} />
                Save Changes
            </button>
        </div>
      </div>

      {/* Global Settings Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Shield size={20} className="text-emerald-600" />
                    Global Logging Status
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                    Master switch for the audit subsystem. Disabling this will stop ALL event recording.
                </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <button 
                    onClick={() => !globalEnabled && handleGlobalToggle()}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${globalEnabled ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Active
                </button>
                <button 
                    onClick={() => globalEnabled && handleGlobalToggle()}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${!globalEnabled ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Disabled
                </button>
            </div>
        </div>

        <div className="w-full h-px bg-slate-100 my-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Retention Policy</label>
                <div className="relative">
                    <select 
                        value={retentionPeriod}
                        onChange={handleRetentionChange}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days (Standard)</option>
                        <option value="180">6 Months</option>
                        <option value="365">1 Year</option>
                        <option value="forever">Indefinite (Forever)</option>
                    </select>
                    <RefreshCcw className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1">
                    <Info size={12} />
                    Logs older than this period will be automatically archived or deleted.
                </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-bold text-amber-800">Compliance Warning</h4>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Disabling "Critical" severity events may violate company compliance policies (SOC2/ISO). 
                        Changes to these settings are logged permanently.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Granular Controls */}
      <div className={`space-y-6 transition-opacity duration-300 ${!globalEnabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-900">Event Rules</h2>
            <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Filter events..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {modules.map(moduleName => {
                const moduleRules = filteredRules.filter(r => r.module === moduleName);
                if (moduleRules.length === 0) return null;

                return (
                    <div key={moduleName} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 shadow-sm">
                                {getModuleIcon(moduleName)}
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{moduleName}</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {moduleRules.map(rule => (
                                <div key={rule.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                    <div className="flex-1 pr-8">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-bold text-slate-900">{rule.event}</span>
                                            {rule.severity === 'Critical' && (
                                                <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded uppercase tracking-wide">
                                                    Critical
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">{rule.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <span className={`text-xs font-bold ${rule.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {rule.enabled ? 'Logging' : 'Disabled'}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleToggleRule(rule.id)}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${rule.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        >
                                            <span 
                                                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${rule.enabled ? 'translate-x-6' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            
            {filteredRules.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-sm font-bold text-slate-900">No events found</h3>
                    <p className="text-xs text-slate-500">Try adjusting your search criteria.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogSettings;