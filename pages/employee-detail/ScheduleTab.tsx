import React, { useEffect, useState } from 'react';
import ScheduleOverview from './schedule/ScheduleOverview';
import ShiftInformation from './schedule/ShiftInformation';
import LeaveRequests from './schedule/LeaveRequests';
import { PaySchedule, Employee } from '../../types';
import PayScheduleConfig from './schedule/PayScheduleConfig';
import { INITIAL_SCHEDULES } from '../PaySchedule';

interface ScheduleTabProps {
  employee: Employee;
  isEmployeeView: boolean;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ employee, isEmployeeView }) => {
  const [scheduleSubTab, setScheduleSubTab] = useState('Schedule Overview');
  const scheduleSubTabs = ['Schedule Overview', 'Shift Information', 'Leave Requests', 'Pay Schedule'];

  const [paySchedules, setPaySchedules] = useState<PaySchedule[]>([]);
  const [empData, setEmpData] = useState<Employee>(employee);

  // Load pay schedules from localStorage.
  // if none exist, create a mock schedule so the dropdown has options.
  useEffect(() => {
    // Save the real schedules to localStorage
    localStorage.setItem("paySchedules", JSON.stringify(INITIAL_SCHEDULES));

    // Load the real schedules into React state.
    setPaySchedules(INITIAL_SCHEDULES);

    // Automatically assign the employee to Corporate Employees — Semi-Monthly (ps-001).
    // This ensures the employee always has a valid schedule matching the real data.
    setEmpData(prev => ({ ...prev, payScheduleId: "ps-001" }));
  }, []);

  const selectedSchedule = paySchedules.find(ps => ps.id === empData.payScheduleId);

  const handleSave = () => {
    localStorage.setItem(`employee-${empData.id}`, JSON.stringify(empData));
  };

  return (
    <div className="space-y-8">

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
      {scheduleSubTab === 'Pay Schedule' && (
        <PayScheduleConfig
          isEmployeeView={isEmployeeView}
          empData={empData}
          paySchedules={paySchedules}
          onScheduleChange={(val) => setEmpData({ ...empData, payScheduleId: val })}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ScheduleTab;