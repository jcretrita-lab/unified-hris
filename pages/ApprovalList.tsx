
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../context/RequestContext';
import {
  Search,
  Filter,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Building2,
  User,
  Briefcase,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

// MOCK_APPROVALS removed as we are using RequestContext seed data

const ApprovalList: React.FC = () => {
  const navigate = useNavigate();
  const { requests } = useRequest();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter Handling
  const filteredApprovals = requests.filter(item =>
    item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500 text-white';
      case 'Rejected': return 'bg-rose-500 text-white';
      case 'Submitted': return 'bg-amber-400 text-white'; // Wireframe uses orange-ish for Submitted
      case 'Pending': return 'bg-amber-400 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Approval Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor, verify, and manage pending requests across the organization.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/settings/approvals')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Settings size={18} />
            Manage Approvals
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-50 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {['Role', 'Shift', 'Department', 'Status', 'Approval Type'].map(filter => (
              <button key={filter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
                {filter === 'Role' && <User size={14} />}
                {filter === 'Shift' && <Clock size={14} />}
                {filter === 'Department' && <Building2 size={14} />}
                {filter === 'Status' && <Filter size={14} />}
                {filter === 'Approval Type' && <FileCheck size={14} />}
                {filter}
                <ChevronLeft className="-rotate-90 ml-1 text-slate-300" size={12} />
              </button>
            ))}
          </div>

          {/* Search */}
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

        {/* Action Bar (Contextual) */}
        <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-500 h-14">
          <span className="uppercase tracking-widest mr-2">Action Buttons:</span>
          <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors disabled:opacity-50">
            <CheckCircle2 size={16} /> Verify
          </button>
          <button className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors disabled:opacity-50">
            <Check size={16} strokeWidth={3} /> HR Approve
          </button>
          <button className="flex items-center gap-1.5 hover:text-rose-600 transition-colors disabled:opacity-50">
            <X size={16} strokeWidth={3} /> Reject
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/20 text-left">
              <tr>
                <th className="w-12 px-6 py-4">
                  <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-slate-400"></div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 group">
                  Employee Name <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">↓</span>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approval Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Modified By</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Modified</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approval Setup</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApprovals.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/monitor/approvals/${item.id}`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4" onClick={(e) => { e.stopPropagation(); toggleSelection(item.id); }}>
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${selectedIds.has(item.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-slate-400'}`}>
                      {selectedIds.has(item.id) && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {item.employeeAvatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.employeeName}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.employeeRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-700">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-600">{item.lastModifiedBy}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-500 font-mono">{item.dateModified}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">
                      {item.setupName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Showing {filteredApprovals.length} Requests</span>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-all"><ChevronLeft size={16} /></button>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-100">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-500 text-xs font-bold transition-all">3</button>
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalList;
