import React, { useEffect, useState } from 'react';
import ScheduleOverview from './schedule/ScheduleOverview';
import ShiftInformation from './schedule/ShiftInformation';
import LeaveRequests from './schedule/LeaveRequests';
import { PaySchedule, Employee } from '../../types';

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

      {/* PAY SCHEDULE CARD */}
      <div className="p-6 border border-slate-200 rounded-2xl bg-white">

        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Pay Schedule
        </label>

        {/* EMPLOYEE VIEW (READ-ONLY) */}
        {isEmployeeView && selectedSchedule && (
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-800">
              {selectedSchedule.name}
            </div>

            <div className="text-[11px] text-slate-500">
              Cutoff 1: {selectedSchedule.firstCutoff} • Pay Date: {selectedSchedule.firstPayDate}
            </div>

            {selectedSchedule.secondCutoff && (
              <div className="text-[11px] text-slate-500">
                Cutoff 2: {selectedSchedule.secondCutoff} • Pay Date: {selectedSchedule.secondPayDate}
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-2">
              Your pay schedule is assigned by HR.
            </p>
          </div>
        )}

        {/* HR / ADMIN VIEW (EDITABLE) */}
        {!isEmployeeView && (
          <>
            <select
              className="w-full p-3 border border-slate-300 rounded-xl bg-white text-sm font-bold"
              value={empData.payScheduleId || ''}
              onChange={(e) =>
                setEmpData({ ...empData, payScheduleId: e.target.value })
              }
            >
              <option value="">Select Pay Schedule</option>
              {paySchedules.map((ps) => (
                <option key={ps.id} value={ps.id}>
                  {ps.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Save Changes
            </button>
          </>
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