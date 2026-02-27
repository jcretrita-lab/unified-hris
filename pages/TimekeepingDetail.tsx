
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Edit2, 
  Calendar, 
  Clock, 
  Save, 
  FileText,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  PenTool,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

// Mock Data Types
interface DtrLog {
  id: string;
  date: string;
  day: string;
  timeIn: string;
  dateOut: string;
  timeOut: string;
  isRestDay: boolean;
  isWorkSchedule: boolean;
  isHoliday: boolean;
  hasFile: boolean;
}

interface DtrOvertime {
  id: string;
  dateIn: string;
  dateOut: string;
  timeIn: string;
  timeOut: string;
  isApproved: boolean;
  hasFile: boolean;
}

const MOCK_DTR_LOGS: DtrLog[] = [
  { id: '1', date: 'August 6, 2025', day: 'Wed', timeIn: '8:00:00 AM', dateOut: 'August 6, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true },
  { id: '2', date: 'August 7, 2025', day: 'Thu', timeIn: '8:00:00 AM', dateOut: 'August 7, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true },
  { id: '3', date: 'August 8, 2025', day: 'Fri', timeIn: '8:00:00 AM', dateOut: 'August 8, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: false, hasFile: true },
  { id: '4', date: 'August 9, 2025', day: 'Sat', timeIn: '8:00:00 AM', dateOut: 'August 9, 2025', timeOut: '7:00:00 PM', isRestDay: true, isWorkSchedule: false, isHoliday: false, hasFile: false }, // Wireframe specific
  { id: '5', date: 'August 21, 2025', day: 'Mon', timeIn: '8:00:00 AM', dateOut: 'August 21, 2025', timeOut: '5:00:00 PM', isRestDay: false, isWorkSchedule: true, isHoliday: true, hasFile: true },
];

const MOCK_OT_LOGS: DtrOvertime[] = [
  { id: 'ot-1', dateIn: 'August 6, 2025', dateOut: 'August 6, 2025', timeIn: '5:00:00 PM', timeOut: '7:00:00 PM', isApproved: true, hasFile: true },
  { id: 'ot-2', dateIn: 'August 7, 2025', dateOut: 'August 7, 2025', timeIn: '6:00:00 PM', timeOut: '10:00:00 PM', isApproved: true, hasFile: true },
  { id: 'ot-3', dateIn: 'August 8, 2025', dateOut: 'August 9, 2025', timeIn: '10:00:00 PM', timeOut: '6:00:00 AM', isApproved: true, hasFile: true },
];

const TimekeepingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  
  // Local state to manage edits
  const [logs, setLogs] = useState<DtrLog[]>(MOCK_DTR_LOGS);
  const [otLogs, setOtLogs] = useState<DtrOvertime[]>(MOCK_OT_LOGS);

  // Mock Employee Data
  const employee = {
    id: id || 'EMP1001',
    name: 'Louis Panganiban',
    shift: '3',
    timeRange: '8:00 AM - 5:00 PM'
  };

  const handleLogChange = (id: string, field: keyof DtrLog, value: any) => {
    if (!isEditMode) return;
    setLogs(logs.map(log => log.id === id ? { ...log, [field]: value } : log));
  };

  const handleOtChange = (id: string, field: keyof DtrOvertime, value: any) => {
    if (!isEditMode) return;
    setOtLogs(otLogs.map(ot => ot.id === id ? { ...ot, [field]: value } : ot));
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Back Header */}
      <div className={`text-white p-4 rounded-xl flex items-center justify-between shadow-lg transition-colors duration-500 ${isEditMode ? 'bg-amber-600' : 'bg-slate-900'}`}>
        <button 
          onClick={() => navigate('/monitor/attendance')}
          className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Timekeeping Summary
        </button>
        {isEditMode && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-sm font-bold animate-pulse">
                <AlertTriangle size={16} />
                Override Mode Active
            </div>
        )}
      </div>

      {/* Main Container */}
      <div className={`bg-white border rounded-3xl shadow-sm p-8 min-h-[800px] relative transition-all duration-300 ${isEditMode ? 'border-amber-400 ring-4 ring-amber-50' : 'border-slate-100'}`}>
        
        {/* Info Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 pb-8 border-b border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee ID</span>
              <span className="text-xl font-medium text-slate-600">{employee.id}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Employee Name</span>
              <span className="text-xl font-bold text-slate-900">{employee.name}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Shift</span>
              <span className="text-xl font-medium text-slate-600">{employee.shift}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time Range</span>
              <span className="text-xl font-medium text-slate-600">{employee.timeRange}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className={`flex items-center gap-3 cursor-pointer select-none transition-opacity ${isEditMode ? 'opacity-100' : 'opacity-60 cursor-not-allowed'}`}>
              <div 
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isOnHold ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white'}`}
                onClick={() => isEditMode && setIsOnHold(!isOnHold)}
              >
                {isOnHold && <CheckCircle2 size={14} className="text-white" />}
              </div>
              <span className="text-sm font-bold text-slate-700">On Hold</span>
            </label>

            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 ${isEditMode ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {isEditMode ? <Unlock size={16} /> : <Lock size={16} />}
              {isEditMode ? 'Exit Override' : 'Override Records'}
            </button>
          </div>
        </div>

        {/* Main DTR Table */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
             <h3 className="text-2xl font-bold text-slate-800">Daily Time Record</h3>
             {isEditMode && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Editable</span>}
          </div>
          <div className={`border rounded-2xl overflow-hidden transition-colors ${isEditMode ? 'border-amber-200' : 'border-slate-200'}`}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-800">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Day</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time In</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Date Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">RestDay</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Work Schedule</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Holiday</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className={`transition-colors ${isEditMode ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4 font-bold text-slate-700">{log.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{log.day}</td>
                    <td className="px-6 py-4">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={log.timeIn}
                                onChange={(e) => handleLogChange(log.id, 'timeIn', e.target.value)}
                            />
                        ) : (
                            <span className="font-bold text-slate-800 font-mono">{log.timeIn}</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={log.dateOut}
                                onChange={(e) => handleLogChange(log.id, 'dateOut', e.target.value)}
                            />
                        ) : (
                            <span className="font-bold text-slate-700">{log.dateOut}</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                         {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={log.timeOut}
                                onChange={(e) => handleLogChange(log.id, 'timeOut', e.target.value)}
                            />
                        ) : (
                            <span className="font-bold text-slate-800 font-mono">{log.timeOut}</span>
                        )}
                    </td>
                    
                    {/* Interactive Checkboxes */}
                    <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isRestDay ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                disabled={!isEditMode}
                                checked={log.isRestDay}
                                onChange={(e) => handleLogChange(log.id, 'isRestDay', e.target.checked)}
                            />
                            {log.isRestDay && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isWorkSchedule ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                disabled={!isEditMode}
                                checked={log.isWorkSchedule}
                                onChange={(e) => handleLogChange(log.id, 'isWorkSchedule', e.target.checked)}
                            />
                            {log.isWorkSchedule && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${log.isHoliday ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                disabled={!isEditMode}
                                checked={log.isHoliday}
                                onChange={(e) => handleLogChange(log.id, 'isHoliday', e.target.checked)}
                            />
                            {log.isHoliday && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                    </td>
                    
                    {/* Files */}
                    <td className="px-6 py-4 text-center">
                      {log.hasFile ? (
                        <button className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Eye size={16} />
                        </button>
                      ) : <span className="text-slate-200">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overtime Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
             <h3 className="text-2xl font-bold text-slate-800">Overtime</h3>
             {isEditMode && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Editable</span>}
          </div>
          <div className={`border rounded-2xl overflow-hidden transition-colors ${isEditMode ? 'border-amber-200' : 'border-slate-200'}`}>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-800">Date In</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Date Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time In</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Time Out</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Approved</th>
                  <th className="px-6 py-4 font-bold text-slate-800 text-center">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {otLogs.map((ot) => (
                  <tr key={ot.id} className={`transition-colors ${isEditMode ? 'hover:bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4 font-bold text-slate-700">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={ot.dateIn}
                                onChange={(e) => handleOtChange(ot.id, 'dateIn', e.target.value)}
                            />
                        ) : (
                            ot.dateIn
                        )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-700 w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={ot.dateOut}
                                onChange={(e) => handleOtChange(ot.id, 'dateOut', e.target.value)}
                            />
                        ) : (
                            ot.dateOut
                        )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={ot.timeIn}
                                onChange={(e) => handleOtChange(ot.id, 'timeIn', e.target.value)}
                            />
                        ) : (
                            ot.timeIn
                        )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 font-mono">
                        {isEditMode ? (
                            <input 
                                className="bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 font-mono w-full focus:ring-2 focus:ring-amber-500 outline-none"
                                value={ot.timeOut}
                                onChange={(e) => handleOtChange(ot.id, 'timeOut', e.target.value)}
                            />
                        ) : (
                            ot.timeOut
                        )}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <label className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${isEditMode ? 'cursor-pointer hover:border-amber-500' : 'cursor-default'} ${ot.isApproved ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                disabled={!isEditMode}
                                checked={ot.isApproved}
                                onChange={(e) => handleOtChange(ot.id, 'isApproved', e.target.checked)}
                            />
                            {ot.isApproved && <CheckCircle2 size={14} className="text-white" />}
                        </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {ot.hasFile ? (
                        <button className="p-1.5 bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Eye size={16} />
                        </button>
                      ) : <span className="text-slate-200">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-end gap-4">
          <button className="px-8 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all shadow-sm">
            Hold Payroll
          </button>
          <button className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            Process Record
          </button>
        </div>

      </div>
    </div>
  );
};

export default TimekeepingDetail;
