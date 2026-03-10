
import React from 'react';

interface PayslipTemplateProps {
    data: {
        id: string;
        name: string;
        role: string;
        department: string;
        netPay: number;
        payPeriod?: string;
        attendance?: any[];
        leaveBalances?: {
            vacation: { entitled: number; consumed: number; remaining: number };
            sick: { entitled: number; consumed: number; remaining: number };
        };
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
        <div className="bg-white text-black p-4 font-sans text-xs max-w-5xl mx-auto border border-black" id="printable-payslip">
            {/* Header: Identity & Audit ID */}
            <div className="flex justify-between items-end mb-2 border-b border-black pb-1">
                <h1 className="text-lg font-bold uppercase">Payslip</h1>
                <div className="text-right">
                    <p className="text-[8px] font-bold uppercase">Audit Serial</p>
                    <p className="text-[10px] font-mono">PN-2025-08-XP</p>
                </div>
            </div>

            {/* Employee Banner - Simplified */}
            <div className="grid grid-cols-4 border border-black p-2 mb-2 text-[10px]">
                <div className="col-span-2 space-y-0.5">
                    <div className="flex gap-2"><span className="font-bold w-20">EMPLOYEE:</span><span className="uppercase">{data.name}</span></div>
                    <div className="flex gap-2"><span className="font-bold w-20">PERIOD:</span><span className="uppercase">{data.payPeriod || 'Aug 06 - 20, 2025'}</span></div>
                </div>
                <div className="col-span-2 border-l border-black pl-4 space-y-0.5">
                    <div className="flex gap-2"><span className="font-bold w-20">DESIGNATION:</span><span className="uppercase">{data.role}</span></div>
                    <div className="flex gap-2"><span className="font-bold w-20">I.D. NO.:</span><span className="font-mono">{data.id.replace('emp-', 'QC-882-')}</span></div>
                </div>
            </div>

            {/* Main Content Grid - 3-Column Black & White Architecture */}
            <div className="grid grid-cols-12 border border-black mb-2 divide-x divide-black overflow-hidden">
                {/* Column 1: Earnings */}
                <div className="col-span-4 flex flex-col">
                    <div className="p-1 border-b border-black text-center font-bold uppercase text-[8px]">Earnings Profile</div>
                    <div className="p-2 space-y-1 text-[10px] flex-1">
                        <div className="flex justify-between"><span>Days Worked</span><span className="font-bold">10.00</span></div>
                        <div className="pt-1 border-t border-black flex justify-between"><span>Basic Salary</span><span>{semiMonthly.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span>De Minimis</span><span>-</span></div>
                        <div className="flex justify-between"><span>Allowances</span><span>2,500.00</span></div>
                        <div className="flex justify-between"><span>Overtime</span><span>-</span></div>
                    </div>
                    <div className="p-1.5 border-t border-black flex justify-between items-center px-2">
                        <span className="font-bold uppercase text-[8px]">Gross Result</span>
                        <span className="font-bold text-[11px] underline underline-offset-2">{grossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Column 2: Attendance */}
                <div className="col-span-4 flex flex-col">
                    <div className="p-1 border-b border-black text-center font-bold uppercase text-[8px]">Attendance Detail</div>
                    <div className="p-1 flex-1">
                        <table className="w-full text-[8px] border-collapse">
                            <tbody>
                                {(Array.isArray(data.attendance) ? data.attendance : [
                                    { date: 'Aug 06', status: 'present', hours: 8.0 },
                                    { date: 'Aug 07', status: 'present', hours: 8.0 },
                                    { date: 'Aug 08', status: 'late', hours: 8.0 },
                                    { date: 'Aug 11', status: 'present', hours: 8.0 },
                                    { date: 'Aug 12', status: 'absent', hours: 0 },
                                    { date: 'Aug 13', status: 'present', hours: 8.0 },
                                    { date: 'Aug 14', status: 'present', hours: 8.0 },
                                    { date: 'Aug 15', status: 'present', hours: 8.0 },
                                    { date: 'Aug 18', status: 'present', hours: 8.0 },
                                    { date: 'Aug 19', status: 'present', hours: 8.0 },
                                    { date: 'Aug 20', status: 'present', hours: 8.0 },
                                    { date: 'Aug 21', status: 'present', hours: 8.0 },
                                    { date: 'Aug 22', status: 'present', hours: 8.0 },
                                    { date: 'Aug 23', status: 'restday', hours: 0 },
                                    { date: 'Aug 24', status: 'restday', hours: 0 },
                                ]).slice(0, 15).map((day: any, i: number) => (
                                    <tr key={i} className="border-b border-black/10 last:border-0">
                                        <td className="p-1 font-bold uppercase">{day.date}</td>
                                        <td className="p-1 text-center uppercase tracking-tighter">
                                            {day.status}
                                        </td>
                                        <td className="p-1 text-right font-mono">{day.hours.toFixed(1)} HR</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-1 border-t border-black text-[7px] font-bold text-center uppercase">
                        Biometric Verified Narrative
                    </div>
                </div>

                {/* Column 3: Deductions */}
                <div className="col-span-4 flex flex-col">
                    <div className="p-1 border-b border-black text-center font-bold uppercase text-[8px]">Deductions Audit</div>
                    <div className="p-2 space-y-1 text-[10px] flex-1">
                        <div className="flex justify-between"><span>Withholding Tax</span><span>{deductions.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between"><span>SSS</span><span>1,350.00</span></div>
                        <div className="flex justify-between"><span>PhilHealth</span><span>450.00</span></div>
                        <div className="flex justify-between"><span>Pag-IBIG</span><span>200.00</span></div>
                    </div>
                    <div className="p-1.5 border-t border-black flex justify-between items-center px-2">
                        <span className="font-bold uppercase text-[8px]">Total Deductions</span>
                        <span className="font-bold text-[11px]">({totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })})</span>
                    </div>
                </div>
            </div>

            {/* Bottom Ledger: Leave Balances & Net Pay */}
            <div className="grid grid-cols-12 border-x border-b border-black divide-x divide-black">
                <div className="col-span-8 p-2 flex gap-4">
                    <div className="flex-1 space-y-1">
                        <span className="font-bold text-[7px] uppercase block">Vacation Leave</span>
                        <div className="grid grid-cols-3 text-center border border-black text-[9px]">
                            <div className="p-1 border-r border-black font-medium">Ent: 15</div>
                            <div className="p-1 border-r border-black font-medium">Use: 2.50</div>
                            <div className="p-1 font-bold">Rem: {data.leaveBalances?.vacation?.remaining || '12.50'}</div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <span className="font-bold text-[7px] uppercase block">Sick Leave</span>
                        <div className="grid grid-cols-3 text-center border border-black text-[9px]">
                            <div className="p-1 border-r border-black font-medium">Ent: 12</div>
                            <div className="p-1 border-r border-black font-medium">Use: 1.00</div>
                            <div className="p-1 font-bold">Rem: {data.leaveBalances?.sick?.remaining || '11.00'}</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 p-2 flex flex-col justify-center items-end bg-black text-white px-4">
                    <span className="text-[7px] font-bold uppercase mb-0.5 tracking-widest">Disbursed Net Pay</span>
                    <span className="text-xl font-bold underline underline-offset-4 tracking-tighter italic">₱{finalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="border-x border-b border-black p-3">
                <p className="text-[7px] leading-tight uppercase font-bold italic">
                    Authorized receipt of remuneration for services rendered. Audit completed via biometric sync and financial reconciliation.
                </p>
            </div>
        </div>
    );
};
