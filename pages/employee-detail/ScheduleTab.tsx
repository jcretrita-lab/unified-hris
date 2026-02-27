
import React, { useState } from 'react';
import ScheduleOverview from './schedule/ScheduleOverview';
import ShiftInformation from './schedule/ShiftInformation';
import LeaveRequests from './schedule/LeaveRequests';

const ScheduleTab: React.FC = () => {
  const [scheduleSubTab, setScheduleSubTab] = useState('Schedule Overview');
  const scheduleSubTabs = ['Schedule Overview', 'Shift Information', 'Leave Requests'];

  return (
    <div className="space-y-8">
      {/* Schedule Sub Tabs */}
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
