
import React from 'react';

interface PayslipTemplateProps {
  data: {
    id: string;
    name: string;
    role: string;
    department: string;
    netPay: number;
    payPeriod?: string;
  };
}

export const PayslipTemplate: React.FC<PayslipTemplateProps> = ({ data }) => {
  // Mock calculations for display purposes to match the visual density of the screenshot
  const basicMonthly = data.netPay * 1.5; // Approx gross
  const dailyRate = basicMonthly / 22;
  const semiMonthly = basicMonthly / 2;
  
  const deductions = {
    tax: basicMonthly * 0.1,
    sss: 1350,
    philhealth: 450,
    pagibig: 200,
    absences: 0
  };
  
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const grossPay = semiMonthly + 2500; // Adding mock allowances
  // Adjust net to match exactly if needed, or just display calculated
  const finalNet = grossPay - totalDeductions;

  return (
    <div className="bg-white text-slate-900 p-8 font-sans text-xs max-w-4xl mx-auto border border-gray-200 shadow-sm" id="printable-payslip">
      <h1 className="text-xl font-bold uppercase mb-6 border-b-2 border-black pb-2">Sample Payslip</h1>
      
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 border border-black p-4">
        <div className="grid grid-cols-[120px_1fr] gap-2">
           <span className="font-medium">Period:</span>
           <span className="font-bold uppercase">{data.payPeriod || 'September 1-15, 2025'}</span>
           
           <span className="font-medium">Employee's Name:</span>
           <span className="font-bold uppercase">{data.name}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-2">
           <span className="font-medium">Designation:</span>
           <span className="font-bold">{data.role}</span>
           
           <span className="font-medium">I.D. No.:</span>
           <span className="font-bold">{data.id.replace('emp-', '2023-01-')}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 border border-black">
         {/* Left Column: Earnings */}
         <div className="border-r border-black">
             {/* Attendance Summary Top Left (Merged in Earnings Table in Screenshot? No, looks separate in image description but layout puts Days worked in header in some formats, here it is in top of columns. The screenshot shows No of days worked in the attendance box actually... wait. The screenshot shows "No of days worked" on the LEFT? No, usually top right or separate. Let's look at screenshot again.
             Screenshot: 
             Left side: Earnings Table (Monthly, Daily, Semi-Monthly).
             Row 1: No. of days worked (10.00) spanning columns? No, it's above.
             Actually "No. of days worked" is on the Left Column Header area in the image provided.
             Right side: Absences/Leaves/Tardiness summary.
             */}
             
             <div className="flex justify-between items-center p-2 border-b border-black">
                <span className="font-medium">No. of days worked</span>
                <span className="font-bold">10.00</span>
             </div>
             
             {/* Earnings Table Header */}
             <div className="grid grid-cols-4 border-b border-black text-center font-bold bg-gray-100">
                 <div className="p-2 text-left border-r border-black col-span-2">EARNINGS</div>
                 <div className="p-2 border-r border-black">Monthly</div>
                 <div className="p-2">Semi-Monthly</div>
             </div>

             {/* Earnings Rows */}
             <div className="divide-y divide-gray-300">
                 <div className="grid grid-cols-4">
                     <div className="p-2 col-span-2 border-r border-gray-300">Basic Taxable Salary</div>
                     <div className="p-2 text-right border-r border-gray-300">{basicMonthly.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                     <div className="p-2 text-right font-bold">{semiMonthly.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div className="grid grid-cols-4">
                     <div className="p-2 col-span-2 border-r border-gray-300">De Minimis</div>
                     <div className="p-2 text-right border-r border-gray-300"></div>
                     <div className="p-2 text-right">-</div>
                 </div>
                 <div className="grid grid-cols-4">
                     <div className="p-2 col-span-2 border-r border-gray-300">Non-Taxable Benefit</div>
                     <div className="p-2 text-right border-r border-gray-300"></div>
                     <div className="p-2 text-right">2,500.00</div>
                 </div>
                 <div className="grid grid-cols-4">
                     <div className="p-2 col-span-2 border-r border-gray-300">OT - Regular Day</div>
                     <div className="p-2 text-right border-r border-gray-300"></div>
                     <div className="p-2 text-right">-</div>
                 </div>
                 <div className="grid grid-cols-4">
                     <div className="p-2 col-span-2 border-r border-gray-300">OT - Rest Day</div>
                     <div className="p-2 text-right border-r border-gray-300"></div>
                     <div className="p-2 text-right">-</div>
                 </div>
             </div>
             
             {/* Gross Pay */}
             <div className="grid grid-cols-4 border-t border-black mt-auto">
                 <div className="p-2 col-span-2 border-r border-black font-bold uppercase">Gross Pay</div>
                 <div className="p-2 border-r border-black bg-gray-100"></div>
                 <div className="p-2 text-right font-bold bg-gray-100">{grossPay.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
             </div>
         </div>

         {/* Right Column: Deductions */}
         <div>
             {/* Attendance Details */}
             <div className="p-2 border-b border-black text-[10px] space-y-1">
                 <div className="flex justify-between"><span>Absences/Leaves/SH without pay - no. of days</span><span>-</span></div>
                 <div className="flex justify-between"><span>Tardiness/Undertime - No. of hours and minutes</span><span>-</span></div>
                 <div className="flex justify-between"><span>Vacation Leave/Special Holiday with pay - no. of days</span><span>-</span></div>
                 <div className="flex justify-between"><span>Sick Leave with pay - no. of days</span><span>-</span></div>
                 <div className="italic text-center mt-2">(Based on attendance record)</div>
             </div>

             {/* Deductions Header */}
             <div className="grid grid-cols-3 border-b border-black font-bold bg-gray-100">
                 <div className="p-2 col-span-2 text-center border-r border-black">DEDUCTIONS</div>
                 <div className="p-2 text-center">Amount</div>
             </div>

             {/* Deductions Rows */}
             <div className="divide-y divide-gray-300">
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">Withholding Tax</div>
                     <div className="p-2 text-right">{deductions.tax.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">Pag-ibig Premium</div>
                     <div className="p-2 text-right">{deductions.pagibig.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">SSS Regular Contributions</div>
                     <div className="p-2 text-right">{deductions.sss.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">Philhealth</div>
                     <div className="p-2 text-right">{deductions.philhealth.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                 </div>
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">SSS Loan</div>
                     <div className="p-2 text-right">-</div>
                 </div>
                 <div className="grid grid-cols-3">
                     <div className="p-2 col-span-2 border-r border-gray-300">Pag-ibig Loan</div>
                     <div className="p-2 text-right">-</div>
                 </div>
             </div>

             {/* Total Deductions */}
             <div className="grid grid-cols-3 border-t border-black mt-auto">
                 <div className="p-2 col-span-2 border-r border-black font-bold uppercase">Total Deductions</div>
                 <div className="p-2 text-right font-bold bg-gray-100">{totalDeductions.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
             </div>
         </div>
      </div>

      {/* Net Pay */}
      <div className="border-x border-b border-black p-4 flex justify-between items-center bg-gray-50">
          <span className="text-lg font-bold uppercase tracking-widest">Net Pay</span>
          <span className="text-2xl font-extrabold underline decoration-double underline-offset-4">{finalNet.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
      </div>

      {/* Footer / Signatories */}
      <div className="border-x border-b border-black p-6">
          <p className="mb-12 text-[10px] uppercase tracking-wide">
              I hereby acknowledge receipt of my salaries as indicated in the Net Pay portion representing payment for my services rendered in the payroll period as specified in this payslip.
          </p>

          <div className="flex justify-between items-end mt-8 px-8">
              <div className="text-center">
                  <div className="font-bold uppercase border-b border-black px-4 pb-1 mb-1">{data.name}</div>
                  <div className="text-[10px] font-bold">Employee's Signature Over Printed Name</div>
              </div>
              <div className="text-center">
                  <div className="text-xs font-bold mb-8">Certified correct by:</div>
                  <div className="font-bold uppercase border-b border-black px-4 pb-1 mb-1">Maria Clara A. Garcia</div>
                  <div className="text-[10px] font-bold">Head, Human Resources Department</div>
              </div>
          </div>
      </div>
    </div>
  );
};
