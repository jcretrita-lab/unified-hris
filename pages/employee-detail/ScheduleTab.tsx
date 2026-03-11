import React, { useEffect, useState } from 'react';
import ScheduleOverview from './schedule/ScheduleOverview';
import ShiftInformation from './schedule/ShiftInformation';
import LeaveRequests from './schedule/LeaveRequests';
import { PaySchedule, Employee } from '../../types';
import { CalendarRange, Clock, AlertCircle } from 'lucide-react';

interface ScheduleTabProps {
  employee: Employee;
  isEmployeeView: boolean;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ employee, isEmployeeView }) => {
  const [scheduleSubTab, setScheduleSubTab] = useState('Schedule Overview');
  const scheduleSubTabs = ['Schedule Overview', 'Shift Information', 'Leave Requests'];

const [paySchedules, setPaySchedules] = useState<PaySchedule[]>([]);
const [empData, setEmpData] = useState<Employee>(employee);

// Load pay schedules from localStorage.
// if none exist, create a mock schedule so the dropdown has options.
useEffect(() => {
  // Temporary mock schedule — simulates real dates
  const mock: PaySchedule[] = [
    {
      id: "ps1",
      name: "Semi-Monthly",          // Most common PH payroll frequency
      frequency: "Semi-Monthly",     // Required by PaySchedule type
      targetType: "Global",          // Applies to all employees (as of now)
      targetId: null,                // No department/position targeting
      firstCutoff: 15,               // 1–15 cutoff
      firstPayDate: 25,              // Paid on the 25th
      secondCutoff: 30,              // 16–30 cutoff
      secondPayDate: 10,             // Paid on the 10th of next month
      divisorId: "div1"              // Salary divisor (e.g., 314 days)
    },
    {
      id: "ps2",
      name: "Monthly",
      frequency: "Monthly",
      targetType: "Global",
      targetId: null,
      firstCutoff: 30,
      firstPayDate: 30,
      divisorId: "div1"
    },
    {
      id: "ps3",
      name: "Weekly",
      frequency: "Weekly",
      targetType: "Global",
      targetId: null,
      firstCutoff: 5,
      firstPayDate: "Every Friday",
      divisorId: "div1"
    }
  ];

  // Save mock schedules to localStorage
  localStorage.setItem("paySchedules", JSON.stringify(mock));

  // Load the mock schedules into React state.
  setPaySchedules(mock);

  // Automatically assign the employee to Semi-Monthly (ps1).
  // This ensures the employee always has a valid schedule.
  setEmpData(prev => ({ ...prev, payScheduleId: "ps1" }));
}, []);

  const selectedSchedule = paySchedules.find(ps => ps.id === empData.payScheduleId);

  const handleSave = () => {
    localStorage.setItem(`employee-${empData.id}`, JSON.stringify(empData));
  };

  return (
    <div className="space-y-8">

      {/* PAY SCHEDULE CARD - REDESIGNED */}
      <div className="p-6 border border-slate-200 rounded-3xl bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <CalendarRange size={16} className="text-indigo-600" />
              Pay Schedule Configuration
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Dictates the payroll generation cycle and attendance cutoff periods.</p>
          </div>
          
          {/* HR / ADMIN VIEW (EDITABLE) */}
          {!isEmployeeView && (
             <div className="flex items-center gap-3">
                <select
                  className="w-full md:w-64 p-2 border border-slate-200 rounded-xl bg-slate-50 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={empData.payScheduleId || ''}
                  onChange={(e) => setEmpData({ ...empData, payScheduleId: e.target.value })}
                >
                  <option value="" disabled>Select Pay Schedule</option>
                  {paySchedules.map((ps) => (
                    <option key={ps.id} value={ps.id}>{ps.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shrink-0"
                >
                  Save
                </button>
             </div>
          )}
        </div>

        {/* Visual Information Box */}
        {selectedSchedule && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all">
            <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-sm shrink-0 border border-indigo-50">
                <Clock size={32} />
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-indigo-950">
                      {selectedSchedule.name}
                  </h4>
                  {/* Hardcoded 'ps1' logic based on your original mock design indicating it's the default */}
                  {selectedSchedule.id === 'ps1' && (
                      <span className="text-[9px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold">
                        Company Default
                      </span>
                  )}
                  <span className="text-[9px] bg-white border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold">
                    {selectedSchedule.frequency}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-3">
                  {/* Cutoff 1 Display */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">1st Cutoff Period</span>
                    <div className="text-sm font-bold text-slate-800">
                      Day 1 — Day {selectedSchedule.firstCutoff}
                      <span className="ml-2 text-indigo-600 text-xs font-black bg-white px-2 py-1 rounded-lg shadow-sm border border-indigo-50">
                        Pay: Day {selectedSchedule.firstPayDate}
                      </span>
                    </div>
                  </div>

                  {/* Cutoff 2 Display (If Applicable) */}
                  {selectedSchedule.secondCutoff && (
                    <>
                      <div className="w-px h-8 bg-indigo-200 hidden md:block"></div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">2nd Cutoff Period</span>
                        <div className="text-sm font-bold text-slate-800">
                          Day 16 — Day {selectedSchedule.secondCutoff}
                          <span className="ml-2 text-indigo-600 text-xs font-black bg-white px-2 py-1 rounded-lg shadow-sm border border-indigo-50">
                            Pay: Day {selectedSchedule.secondPayDate}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
            </div>
          </div>
        )}
        
        {/* EMPLOYEE VIEW (READ-ONLY WARNING) */}
        {isEmployeeView && (
           <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-fit">
              <AlertCircle size={14} />
              Your pay schedule is managed by HR. Contact your administrator for discrepancies.
           </div>
        )}
      </div>

      {/* SUB TABS */}
      <div className="flex border-b border-slate-200">
        {scheduleSubTabs.map((sub) => (
          <button
            key={sub}
            onClick={() => setScheduleSubTab(sub)}
            className={`px-8 py-4 text-sm font-bold transition-all relative
              ${scheduleSubTab === sub 
                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            {sub}
          </button>
        ))}
      </div>

      {scheduleSubTab === 'Schedule Overview' && <ScheduleOverview />}
      {scheduleSubTab === 'Shift Information' && <ShiftInformation />}
      {scheduleSubTab === 'Leave Requests' && <LeaveRequests />}
    </div>
  );
};

export default ScheduleTab;