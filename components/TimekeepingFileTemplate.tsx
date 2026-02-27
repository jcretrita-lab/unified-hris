
import React from 'react';

interface TimekeepingFileTemplateProps {
  data: {
    employee: {
      name: string;
      role: string;
      department: string;
    };
    period: string;
  };
}

export const TimekeepingFileTemplate: React.FC<TimekeepingFileTemplateProps> = ({ data }) => {
  // Mock Data replicating the screenshot
  const records = [
    { dateIn: '16-Jan-25', day: 'Thu', shift: 1, timeIn: '7:00 am', dateOut: '16-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '17-Jan-25', day: 'Fri', shift: 1, timeIn: '7:00 am', dateOut: '17-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '18-Jan-25', day: 'Sat', shift: 1, timeIn: '-', dateOut: '-', timeOut: '-', hours: '-', actual: '-', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '19-Jan-25', day: 'Sun', shift: 1, timeIn: '-', dateOut: '-', timeOut: '-', hours: '-', actual: '-', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '20-Jan-25', day: 'Mon', shift: 1, timeIn: '7:00 am', dateOut: '20-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '21-Jan-25', day: 'Tue', shift: 1, timeIn: '7:00 am', dateOut: '21-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '22-Jan-25', day: 'Wed', shift: 1, timeIn: '7:00 am', dateOut: '22-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '23-Jan-25', day: 'Thu', shift: 1, timeIn: '7:00 am', dateOut: '23-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '24-Jan-25', day: 'Fri', shift: 1, timeIn: '7:00 am', dateOut: '24-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '25-Jan-25', day: 'Sat', shift: 1, timeIn: '-', dateOut: '-', timeOut: '-', hours: '-', actual: '-', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '26-Jan-25', day: 'Sun', shift: 1, timeIn: '-', dateOut: '-', timeOut: '-', hours: '-', actual: '-', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '27-Jan-25', day: 'Mon', shift: 1, timeIn: '7:00 am', dateOut: '27-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '28-Jan-25', day: 'Tue', shift: 1, timeIn: '7:00 am', dateOut: '28-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '29-Jan-25', day: 'Wed', shift: 1, timeIn: '-', dateOut: '-', timeOut: '-', hours: '-', actual: '-', late: '-', utime: '-', ot: '-', nd2: '-', rem: 'Sp. Hol' },
    { dateIn: '30-Jan-25', day: 'Thu', shift: 1, timeIn: '7:00 am', dateOut: '30-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
    { dateIn: '31-Jan-25', day: 'Fri', shift: 1, timeIn: '7:00 am', dateOut: '31-Jan-25', timeOut: '4:00 pm', hours: '8.00', actual: '9.00', late: '-', utime: '-', ot: '-', nd2: '-', rem: '-' },
  ];

  const summaryData = {
      ot: ['OT 0.30', 'OT 1.00', 'OT 1.25', 'OT 1.30', 'OT 1.69', 'OT 1.50', 'OT 1.95', 'OT 2.00', 'OT 2.69', 'OT 3.38']
  };

  return (
    <div className="w-[297mm] min-h-[210mm] bg-white text-black font-sans text-[10px] leading-tight p-10 mx-auto shadow-sm">
       {/* Top Header Row */}
       <div className="flex justify-between items-start mb-4">
           <div>
               <div className="mb-2">DatePrinted: &nbsp; 08/19/2025 3:47:08 pm</div>
               <h1 className="text-xl font-bold uppercase tracking-tight">SANDBOX - TimeSheet</h1>
               <div className="mt-4 flex gap-8">
                   <div>
                       <div className="flex gap-2">
                           <span className="w-16">Emp. ID:</span>
                           <span className="font-bold">SB250814-002</span>
                       </div>
                       <div className="flex gap-2">
                           <span className="w-16">Name:</span>
                           <span className="font-bold uppercase">{data.employee.name}</span>
                       </div>
                   </div>
               </div>
           </div>
           <div className="text-right">
               <div className="mb-1">Page 1 of 25</div>
               <div className="font-bold text-sm mb-2">{data.period || '01/16/2025-01/31/2025'}</div>
               <div className="grid grid-cols-[80px_1fr] gap-x-2 text-left">
                    <span>Shift:</span><span className="font-bold">1</span>
                    <span>Position:</span><span className="font-bold">{data.employee.role}</span>
                    <span>Section:</span><span className="font-bold">N/A</span>
                    <span>Group:</span><span className="font-bold">SANDBOX</span>
                    <span>Department:</span><span className="font-bold">{data.employee.department}</span>
                    <span>Imm.Superior:</span><span className="font-bold">ACGarcia</span>
               </div>
           </div>
       </div>

       {/* Timesheet Table */}
       <div className="border-t border-b border-black mb-1">
           <table className="w-full text-center border-collapse">
               <thead>
                   <tr className="border-b border-black">
                       <th className="py-1 w-[8%]">DateIn</th>
                       <th className="py-1 w-[4%]">Day</th>
                       <th className="py-1 w-[4%]">Shift</th>
                       <th className="py-1 w-[8%]">TimeIn</th>
                       <th className="py-1 w-[8%]">DateOut</th>
                       <th className="py-1 w-[8%]">TimeOut</th>
                       <th className="py-1 w-[6%]">Hours</th>
                       <th className="py-1 w-[6%]">Actual</th>
                       <th className="py-1 w-[5%]">Late</th>
                       <th className="py-1 w-[5%]">Utime</th>
                       <th className="py-1 w-[5%]">OT</th>
                       <th className="py-1 w-[5%]">ND2</th>
                       <th className="py-1 w-[5%]">Rem.</th>
                   </tr>
               </thead>
               <tbody>
                   {records.map((row, idx) => (
                       <tr key={idx} className="h-4">
                           <td>{row.dateIn}</td>
                           <td>{row.day}</td>
                           <td>{row.shift}</td>
                           <td>{row.timeIn}</td>
                           <td>{row.dateOut}</td>
                           <td>{row.timeOut}</td>
                           <td>{row.hours}</td>
                           <td>{row.actual}</td>
                           <td>{row.late}</td>
                           <td>{row.utime}</td>
                           <td>{row.ot}</td>
                           <td>{row.nd2}</td>
                           <td>{row.rem}</td>
                       </tr>
                   ))}
               </tbody>
               <tfoot>
                   <tr className="border-t border-black font-bold">
                       <td colSpan={6} className="text-left py-1 pl-2">Totals: &nbsp; ( 11 WorkDays )</td>
                       <td>88.00</td>
                       <td>99.00</td>
                       <td>0.00</td>
                       <td>0.00</td>
                       <td>0.00</td>
                       <td>0.00</td>
                       <td></td>
                   </tr>
               </tfoot>
           </table>
       </div>
       
       <div className="flex justify-end mb-8 font-bold text-[10px]">
           <div className="w-[100px] text-right">
              Employment Status:<br/>
              Regular<br/>
              Monthly<br/>
              Rest Day:<br/>
              Sunday
           </div>
       </div>

       {/* Certification */}
       <div className="text-center mb-16 px-12">
           <p className="mb-1">I hereby certify that the above records are true and correct. Any</p>
           <p>unauthorized overtime will not be paid by the management.</p>
       </div>

       {/* Signatures */}
       <div className="flex justify-between px-16 mb-12">
           <div className="text-center w-48">
               <div className="border-b border-black mb-1"></div>
               <div>Employee Signature</div>
           </div>
           <div className="text-center w-48">
               <div className="border-b border-black mb-1"></div>
               <div>Immediate Superior</div>
           </div>
       </div>

       {/* HRD Footer */}
       <div className="text-center mb-2">For HRD use only, please do not tamper with.</div>
       <div className="border-t border-black pt-2 flex justify-between items-start mb-8">
            {/* Left Stats */}
            <div className="grid grid-cols-[90px_60px] gap-y-0.5">
                <span>Days Worked:</span><span className="text-right">11.00</span>
                <span>Hours Worked:</span><span className="text-right">88.00</span>
                <span>Absences:</span><span className="text-right">1.00</span>
                <span className="h-2"></span><span></span>
                <span>Tardiness:</span><span className="text-right">0.00</span>
                <span>Reg. ND1</span><span className="text-right">0.00</span>
                <span>Reg. ND2</span><span className="text-right">0.00</span>
                <span>Holiday</span><span className="text-right">1.00</span>
                <span className="h-2"></span><span></span>
                <span>Undertime:</span><span className="text-right">0.00</span>
            </div>

            {/* Middle Summary */}
            <div className="w-1/3">
                 <div className="flex border-b border-black pb-0.5 mb-1">
                     <span className="underline mr-auto">Summary:</span>
                     <span className="w-10 text-center underline">10%</span>
                     <span className="w-10 text-center underline">15%</span>
                 </div>
                 <div className="grid grid-cols-1 gap-y-0.5 pl-2">
                     {summaryData.ot.map((ot, i) => (
                         <div key={i}>{ot}</div>
                     ))}
                 </div>
            </div>

            {/* Right Balances */}
            <div className="grid grid-cols-[90px_30px] gap-y-0.5 text-right">
                <span>VL Bal :</span><span>10</span>
                <span>SL Bal :</span><span>14</span>
                <span>VL w/ Pay :</span><span>0</span>
                <span>VL w/o Pay :</span><span>0</span>
                <span>Prev.VL w/ Pay :</span><span>0</span>
                <span>SL w/ Pay :</span><span>0</span>
                <span>SL w/o Pay :</span><span>0</span>
                <span>PL Taken :</span><span>0</span>
                <span>BL Taken :</span><span>0</span>
                <span>Meal Allow. :</span><span>0</span>
            </div>
       </div>

       <div className="border-t border-black/50 border-dashed pt-2"></div>
    </div>
  );
};
