
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowDown, 
  Check, 
  Plus,
  AlertCircle,
  Building2,
  Briefcase
} from 'lucide-react';
import Modal from '../../components/Modal';

// Updated to accept component list
const PayTemplateCard = ({ data, type }: { data: any, type: 'current' | 'proposed' }) => {
  const isProposed = type === 'proposed';
  const headerColor = isProposed ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100';
  const borderColor = isProposed ? 'border-emerald-200' : 'border-blue-100';
  const ringColor = isProposed ? 'ring-emerald-50' : 'ring-blue-50';

  return (
    <div className={`border rounded-2xl overflow-hidden ${borderColor} ${ringColor} ring-4 bg-white transition-all hover:shadow-lg h-full`}>
      <div className={`px-5 py-4 border-b ${headerColor} flex justify-between items-center`}>
        <span className="text-xs font-bold uppercase tracking-widest">{isProposed ? 'Proposal' : 'Current'}</span>
        {isProposed && <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded text-emerald-800 backdrop-blur-sm">+8.5% Increase</span>}
      </div>
      <table className="w-full text-sm mb-0">
        <tbody className="divide-y divide-slate-50">
          <tr>
            <td className="px-5 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Monthly Basic</td>
            <td className={`px-5 py-3 text-right font-bold tabular-nums ${isProposed ? 'text-emerald-600' : 'text-slate-900'}`}>₱{data.basic}</td>
          </tr>
          <tr>
             <td colSpan={2} className="px-5 py-2 bg-slate-50/50">
                <div className="flex flex-col gap-1">
                   {data.components?.map((comp: any, i: number) => (
                       <div key={i} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                             <span className="text-slate-600">{comp.name}</span>
                             {comp.needsPAF && (
                                 <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 rounded flex items-center gap-0.5" title="Requires Personnel Action Form to change">
                                     <AlertCircle size={8} /> PAF Req.
                                 </span>
                             )}
                          </div>
                          <span className="font-mono text-slate-500">₱{comp.amount}</span>
                       </div>
                   ))}
                </div>
             </td>
          </tr>
          <tr className="bg-slate-50/50 border-t border-slate-100">
            <td className="px-5 py-4 font-bold text-slate-900 text-xs uppercase tracking-wider">Net Pay (Est)</td>
            <td className={`px-5 py-4 text-right font-black tabular-nums ${isProposed ? 'text-emerald-600' : 'text-slate-900'}`}>₱{data.net}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const JobHistoryTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('Career Milestones');
  const jobHistorySubTabs = ['Career Milestones', 'Personnel Action Form'];
  const MotionDiv = motion.div as any;
  
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(0);
  const [expandedPAF, setExpandedPAF] = useState<string | null>('PAF-001');
  const [isPAFModalOpen, setIsPAFModalOpen] = useState(false);

  // PAF Form State
  const [pafForm, setPafForm] = useState({
      type: 'Promotion',
      effectiveDate: '',
      reason: '',
      // Change Details
      newRank: 'L4',
      newStatus: 'Regular',
      newPosition: 'Senior System Developer',
      newDepartment: 'IT Department',
      // Pay Template
      newTemplateId: 'tpl-2'
  });

  const currentDetails = {
      rank: 'L3',
      status: 'Probationary',
      position: 'System Developer',
      department: 'IT Department'
  };

  const milestones = [
    { 
      date: 'Current', 
      title: 'Senior Developer', 
      type: 'Promotion', 
      color: 'bg-emerald-500', 
      company: 'Nexus Tech', 
      approvedBy: 'John Smith',
      changes: [
        { label: 'Basic Salary', from: '25,000.00', to: '27,000.00' },
        { label: 'Rank', from: 'L3', to: 'L4' },
      ]
    },
    { 
      date: '15 Mar, 2024', 
      title: 'Junior Developer', 
      type: 'Promotion', 
      color: 'bg-emerald-500', 
      company: 'Nexus Tech', 
      approvedBy: 'John Smith',
      changes: [
        { label: 'Basic Salary', from: '20,000.00', to: '25,000.00' },
        { label: 'Position', from: 'Associate', to: 'Junior Dev' },
      ]
    },
    { 
      date: '10 Sep, 2023', 
      title: 'Regularization', 
      type: 'Regularization', 
      color: 'bg-blue-600', 
      company: 'Nexus Tech', 
      approvedBy: 'John Smith',
      changes: [
        { label: 'Status', from: 'Probationary', to: 'Regular' },
        { label: 'Benefits', from: 'None', to: 'Full' },
      ]
    },
    { 
      date: '21 Mar, 2023', 
      title: 'Contractualization', 
      type: 'Contract', 
      color: 'bg-rose-500', 
      company: 'Nexus Tech', 
      approvedBy: 'John Smith',
      changes: null
    },
    { 
      date: '16 May, 2022', 
      title: 'Internship', 
      type: 'Intern', 
      color: 'bg-slate-400', 
      company: 'Nexus Tech', 
      approvedBy: 'John Smith',
      changes: null
    },
  ];

  const pafHistory = [
    { id: 'PAF-001', type: 'Promotion', status: 'Pending', date: 'July 25, 2025' },
    { id: 'PAF-002', type: 'Internship', status: 'Approved', date: 'April 2, 2025' },
    { id: 'PAF-003', type: 'Internship', status: 'Approved', date: 'May 16, 2022' },
  ];

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
        {jobHistorySubTabs.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSubTab(sub)}
            className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all
              ${activeSubTab === sub 
                ? 'bg-white text-indigo-600 shadow-md shadow-slate-200 border border-slate-50' 
                : 'text-slate-500 hover:text-slate-900'}`}
          >
            {sub}
          </button>
        ))}
      </div>

      {activeSubTab === 'Career Milestones' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm relative overflow-hidden">
          <div className="space-y-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-[84px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

            {milestones.map((m, idx) => (
              <div key={idx} className="relative z-10 group">
                <div className="flex gap-12 cursor-pointer" onClick={() => setExpandedMilestone(expandedMilestone === idx ? null : idx)}>
                  <div className="w-24 text-right pt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">
                      {m.date}
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0 relative">
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center relative z-20 
                      ${expandedMilestone === idx 
                        ? 'border-indigo-600 bg-indigo-600 ring-4 ring-indigo-50' 
                        : 'border-slate-900 bg-white group-hover:border-indigo-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${expandedMilestone === idx ? 'bg-white' : 'bg-slate-900 group-hover:bg-indigo-500'}`}></div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${m.color}`}></div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-500`}>
                        {m.type}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h3>
                      {expandedMilestone === idx ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-500">{m.company}</p>
                      <p className="text-xs text-slate-400 font-medium italic">Approved by {m.approvedBy}</p>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedMilestone === idx && m.changes && (
                        <MotionDiv 
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <FileText size={14} /> Signed Pay Structure
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {m.changes.map((change, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                  <span className="text-xs font-bold text-slate-500 uppercase">{change.label}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-400 strike-through decoration-slate-300">{change.from}</span>
                                    <ArrowRight size={14} className="text-slate-300" />
                                    <span className="text-sm font-bold text-emerald-600">{change.to}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'Personnel Action Form' && (
        <div className="space-y-10">
          {/* Current PAF Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-amber-500 rounded-r-full"></div>
                <div>
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pending Approval</h2>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">PAF Reference: #PAF-2025-001</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPAFModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <Plus size={16} />
                New Request
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              {/* Status Tracker */}
              <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-center relative max-w-3xl mx-auto">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-[38%] shadow-sm shadow-emerald-200"></div>
                  
                  {[
                    { label: 'Submission', status: 'completed', date: 'Jul 24' },
                    { label: 'Review', status: 'current', date: 'Jul 25' },
                    { label: 'Approval', status: 'upcoming', date: 'Est. Jul 28' },
                    { label: 'Implementation', status: 'upcoming', date: 'Aug 01' },
                  ].map((step, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative z-10 group cursor-default">
                      <div className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300
                        ${step.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 
                          step.status === 'current' ? 'border-emerald-500 bg-white text-emerald-600 shadow-xl shadow-emerald-100 scale-110' : 
                          'border-slate-200 bg-white text-slate-300'}`}>
                        {step.status === 'completed' ? <Check size={16} strokeWidth={3} /> : 
                         step.status === 'current' ? <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div> : 
                         <div className="w-2 h-2 rounded-full bg-slate-200"></div>}
                      </div>
                      <div className="text-center mt-3">
                        <span className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-900'}`}>
                          {step.label}
                        </span>
                        <span className={`block text-[10px] font-medium mt-0.5 ${step.status === 'upcoming' ? 'text-slate-300' : 'text-slate-500'}`}>
                          {step.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Content */}
              <div className="p-10 bg-slate-50/20">
                <div className="flex flex-col lg:flex-row items-stretch gap-8 relative">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div> Current Pay Template
                        </h3>
                        <span className="text-[10px] font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-400 shadow-sm">Signed PAF</span>
                     </div>
                     <PayTemplateCard 
                       data={{ 
                           basic: '25,000.00', daily: '955.41', hourly: '119.43', net: '25,000.00',
                           components: [
                               { name: 'Rice Subsidy', amount: '2,000.00', needsPAF: false },
                               { name: 'Clothing Allowance', amount: '1,000.00', needsPAF: false },
                               { name: 'Uniform Allowance', amount: '500.00', needsPAF: true }
                           ]
                       }} 
                       type="current"
                     />
                  </div>

                  <div className="flex items-center justify-center py-4 lg:py-0 relative">
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
                       <div className="h-full w-px border-r-2 border-dashed border-slate-200"></div>
                     </div>
                     <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 shadow-lg shadow-slate-100 flex items-center justify-center text-slate-400 z-10">
                        <ArrowRight className="hidden lg:block" strokeWidth={2.5} size={20} />
                        <ArrowDown className="block lg:hidden" strokeWidth={2.5} size={20} />
                     </div>
                  </div>

                  <div className="flex-1 space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div> Applied Pay Template
                        </h3>
                        <span className="text-[10px] font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-600 shadow-sm">Unsigned PAF</span>
                     </div>
                     <PayTemplateCard 
                       data={{ 
                           basic: '27,000.00', daily: '1,072.85', hourly: '134.11', net: '25,050.00',
                           components: [
                               { name: 'Rice Subsidy', amount: '2,000.00', needsPAF: false },
                               { name: 'Clothing Allowance', amount: '1,000.00', needsPAF: false },
                               { name: 'Uniform Allowance', amount: '1,000.00', needsPAF: true }
                           ]
                        }} 
                       type="proposed"
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAF History Accordion */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-slate-200 rounded-full"></div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Personnel Action History</h2>
            </div>
            
            <div className="space-y-4">
              {pafHistory.map((paf) => (
                <div key={paf.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <button 
                    onClick={() => setExpandedPAF(expandedPAF === paf.id ? null : paf.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paf.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'}`}>
                        {paf.status === 'Pending' ? <Clock size={22} /> : <FileText size={22} />}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{paf.type}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${paf.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            {paf.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{paf.id} • {paf.date}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-600 transition-all">
                      {expandedPAF === paf.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedPAF === paf.id && (
                      <MotionDiv
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50"
                      >
                        <div className="p-8 space-y-10 bg-slate-50/30">
                          {/* Position / Salary Change */}
                          <div className="space-y-6">
                            <h5 className="text-[11px] font-bold text-slate-900 border-l-[3px] border-indigo-600 pl-3 uppercase tracking-widest">Position / Salary Change Details</h5>
                            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left">
                                  <tr className="text-left">
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Title Detail</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">From</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">To</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {[
                                    { label: 'Rank', from: 'L3', to: 'L4' },
                                    { label: 'Employee Status', from: 'Probationary', to: 'Regular' },
                                    { label: 'Position', from: 'System Developer', to: 'Senior System Developer' },
                                    { label: 'Department', from: 'IT Department', to: 'IT Department' },
                                    { label: 'Company', from: 'HRIS Corp', to: 'HRIS Corp' },
                                  ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700">{row.label}</td>
                                      <td className="px-6 py-4 text-slate-500 font-medium">{row.from}</td>
                                      <td className="px-6 py-4 font-bold text-indigo-600 flex items-center gap-2">
                                        {row.to}
                                        {row.from !== row.to && <TrendingUp size={14} />}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Reason for Adjustment */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[11px] font-bold text-slate-900 border-l-[3px] border-indigo-600 pl-3 uppercase tracking-widest">Reason for Adjustment</h5>
                              <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">Effectivity: 4/1/2025</div>
                            </div>
                            
                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left">
                                  <tr>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Description</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">Tax Exempt</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">From</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">To</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {[
                                    { label: 'Basic Salary', exempt: false, from: '520.00', to: '540.00' },
                                    { label: 'Cost of Living Allowance', exempt: true, from: '0.00', to: '0.00' },
                                    { label: 'Transport Allowance', exempt: true, from: '-', to: '-' },
                                  ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                      <td className="px-6 py-4 font-bold text-slate-700">{row.label}</td>
                                      <td className="px-6 py-4 text-center">
                                        <div className={`w-4 h-4 mx-auto border-2 rounded ${row.exempt ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
                                          {row.exempt && <Check size={12} className="text-white" />}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-slate-500 font-medium text-right tabular-nums">{row.from}</td>
                                      <td className="px-6 py-4 font-bold text-indigo-600 text-right tabular-nums bg-indigo-50/10">{row.to}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-slate-900 text-white font-bold">
                                    <td className="px-6 py-4 uppercase text-[10px] tracking-widest">Total Adjustment</td>
                                    <td></td>
                                    <td className="px-6 py-4 text-right text-slate-300 tabular-nums">520.00</td>
                                    <td className="px-6 py-4 text-right text-white tabular-nums">540.00</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Notes & Signatures */}
                          <div className="grid grid-cols-2 gap-8 pt-4">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                               <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow Notes</h6>
                               <div className="flex gap-3">
                                  <div className="mt-1"><Info size={16} className="text-indigo-400" /></div>
                                  <p className="text-sm text-slate-600 italic leading-relaxed">"Adjustment based on annual performance review score of 4.5/5. Recommended for immediate implementation pending HR final sign-off."</p>
                               </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                               <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approvals</h6>
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shadow-sm">LM</div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">Louis Manager</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                       <CheckCircle2 size={10} className="text-emerald-500" />
                                       <p className="text-[10px] text-slate-500 font-medium">Approved • Apr 2, 2025</p>
                                    </div>
                                  </div>
                               </div>
                            </div>
                          </div>

                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      <Modal isOpen={isPAFModalOpen} onClose={() => setIsPAFModalOpen(false)} className="max-w-5xl">
          <div className="flex flex-col h-[85vh] bg-white">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
                          <FileText className="text-indigo-600" size={24} /> Create New PAF Request
                      </h3>
                      <p className="text-slate-500 font-medium text-sm mt-1">Initiate a promotion, transfer, or salary adjustment.</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setIsPAFModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                          Cancel
                      </button>
                      <button 
                        onClick={() => {
                            alert("Request Submitted!");
                            setIsPAFModalOpen(false);
                            setPafForm({ type: 'Promotion', effectiveDate: '', reason: '', newRank: 'L4', newStatus: 'Regular', newPosition: 'Senior System Developer', newDepartment: 'IT Department', newTemplateId: 'tpl-2' });
                        }}
                        className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all text-sm"
                      >
                          Submit Request
                      </button>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  
                  {/* Top Configuration */}
                  <div className="grid grid-cols-2 gap-8">
                      <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Action Type</label>
                          <select 
                              className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-slate-900 shadow-sm"
                              value={pafForm.type}
                              onChange={(e) => setPafForm({...pafForm, type: e.target.value})}
                          >
                              <option value="Promotion">Promotion</option>
                              <option value="Salary Adjustment">Salary Adjustment</option>
                              <option value="Regularization">Regularization</option>
                              <option value="Transfer">Transfer</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Effective Date</label>
                          <input 
                              type="date"
                              className="w-full border border-slate-200 p-3.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 shadow-sm"
                              value={pafForm.effectiveDate}
                              onChange={(e) => setPafForm({...pafForm, effectiveDate: e.target.value})}
                          />
                      </div>
                  </div>

                  {/* Position Change Table */}
                  <div className="space-y-4">
                      <h5 className="text-[11px] font-bold text-slate-900 border-l-[3px] border-indigo-600 pl-3 uppercase tracking-widest">Position & Org Changes</h5>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                          <table className="w-full text-sm">
                              <thead className="bg-slate-50/50 text-left">
                                  <tr>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest w-1/3">Detail</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest w-1/3">From (Current)</th>
                                    <th className="px-6 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest w-1/3">To (New)</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  <tr className="hover:bg-slate-50/30 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700">Rank Level</td>
                                      <td className="px-6 py-4 text-slate-500 font-medium">{currentDetails.rank}</td>
                                      <td className="px-6 py-3">
                                          <input 
                                            className="w-full border border-indigo-100 bg-indigo-50/30 p-2 rounded-lg text-indigo-700 font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                                            value={pafForm.newRank}
                                            onChange={(e) => setPafForm({...pafForm, newRank: e.target.value})}
                                          />
                                      </td>
                                  </tr>
                                  <tr className="hover:bg-slate-50/30 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700">Employment Status</td>
                                      <td className="px-6 py-4 text-slate-500 font-medium">{currentDetails.status}</td>
                                      <td className="px-6 py-3">
                                          <select 
                                            className="w-full border border-indigo-100 bg-indigo-50/30 p-2 rounded-lg text-indigo-700 font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-sm cursor-pointer"
                                            value={pafForm.newStatus}
                                            onChange={(e) => setPafForm({...pafForm, newStatus: e.target.value})}
                                          >
                                              <option value="Probationary">Probationary</option>
                                              <option value="Regular">Regular</option>
                                              <option value="Contractual">Contractual</option>
                                          </select>
                                      </td>
                                  </tr>
                                  <tr className="hover:bg-slate-50/30 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700">Position Title</td>
                                      <td className="px-6 py-4 text-slate-500 font-medium">{currentDetails.position}</td>
                                      <td className="px-6 py-3">
                                          <input 
                                            className="w-full border border-indigo-100 bg-indigo-50/30 p-2 rounded-lg text-indigo-700 font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                                            value={pafForm.newPosition}
                                            onChange={(e) => setPafForm({...pafForm, newPosition: e.target.value})}
                                          />
                                      </td>
                                  </tr>
                                  <tr className="hover:bg-slate-50/30 transition-colors">
                                      <td className="px-6 py-4 font-bold text-slate-700">Department</td>
                                      <td className="px-6 py-4 text-slate-500 font-medium">{currentDetails.department}</td>
                                      <td className="px-6 py-3">
                                          <select 
                                            className="w-full border border-indigo-100 bg-indigo-50/30 p-2 rounded-lg text-indigo-700 font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-sm cursor-pointer"
                                            value={pafForm.newDepartment}
                                            onChange={(e) => setPafForm({...pafForm, newDepartment: e.target.value})}
                                          >
                                              <option value="IT Department">IT Department</option>
                                              <option value="HR Department">HR Department</option>
                                              <option value="Finance">Finance</option>
                                              <option value="Marketing">Marketing</option>
                                          </select>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Pay Template Section */}
                  <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h5 className="text-[11px] font-bold text-slate-900 border-l-[3px] border-emerald-500 pl-3 uppercase tracking-widest">Pay Structure Adjustment</h5>
                          <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select New Pay Template:</span>
                              <select 
                                className="border border-slate-200 bg-white p-2 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer min-w-[200px]"
                                value={pafForm.newTemplateId}
                                onChange={(e) => setPafForm({...pafForm, newTemplateId: e.target.value})}
                              >
                                  <option value="tpl-1">Junior Dev - L1</option>
                                  <option value="tpl-2">Senior Dev - L4</option>
                                  <option value="tpl-3">Manager - L5</option>
                              </select>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 items-stretch relative">
                          <div className="flex-1 space-y-3">
                             <div className="flex items-center justify-between px-1">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div> Current Pay Template
                                </h3>
                             </div>
                             <PayTemplateCard 
                               data={{ 
                                   basic: '25,000.00', daily: '955.41', hourly: '119.43', net: '25,000.00',
                                   components: [
                                       { name: 'Rice Subsidy', amount: '2,000.00', needsPAF: false },
                                       { name: 'Clothing Allowance', amount: '1,000.00', needsPAF: false },
                                       { name: 'Uniform Allowance', amount: '500.00', needsPAF: true }
                                   ]
                               }} 
                               type="current"
                             />
                          </div>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 bg-white rounded-full border border-slate-200 shadow-sm text-slate-400">
                             <ArrowRight size={16} strokeWidth={2.5} />
                          </div>

                          <div className="flex-1 space-y-3">
                             <div className="flex items-center justify-between px-1">
                                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div> Proposed Pay Template
                                </h3>
                             </div>
                             <PayTemplateCard 
                               data={{ 
                                   basic: '27,000.00', daily: '1,072.85', hourly: '134.11', net: '25,050.00',
                                   components: [
                                       { name: 'Rice Subsidy', amount: '2,000.00', needsPAF: false },
                                       { name: 'Clothing Allowance', amount: '1,000.00', needsPAF: false },
                                       { name: 'Uniform Allowance', amount: '1,000.00', needsPAF: true }
                                   ]
                                }} 
                               type="proposed"
                             />
                          </div>
                      </div>
                  </div>

                  {/* Reason */}
                  <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reason / Justification</label>
                      <textarea 
                          className="w-full border border-slate-200 p-4 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 min-h-[120px] resize-none"
                          placeholder="Please describe the reason for this action in detail..."
                          value={pafForm.reason}
                          onChange={(e) => setPafForm({...pafForm, reason: e.target.value})}
                      />
                  </div>

              </div>
          </div>
      </Modal>
    </div>
  );
};

export default JobHistoryTab;
