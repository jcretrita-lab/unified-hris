import React, { useState } from 'react';
import {
    Calculator,
    ShieldCheck,
    Eye,
    TrendingDown,
    X as CloseIcon,
    Download,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MOCK_YEAR_END_DATA, generate13thMonthHistory } from '../payroll/mockData';
import Modal from '../../components/Modal';
import YearEndPrepLayout from '../../components/year-end/YearEndPrepLayout';

const YearEndTaxPrepPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);

    const [itrModalEmpId, setItrModalEmpId] = useState<string | null>(null);
    const itrEmployeeData = MOCK_YEAR_END_DATA.find(d => d.id === itrModalEmpId);

    const filteredData = MOCK_YEAR_END_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedEmployeeData = MOCK_YEAR_END_DATA.find(d => d.id === selectedEmpId);
    const monthlyHistory = selectedEmployeeData ? generate13thMonthHistory(selectedEmployeeData.ytdGross, selectedEmployeeData.id, false) : [];

    const formatCurrency = (amount: number) => {
        const val = amount || 0;
        return `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatVal = (v: any, isDeduction?: boolean) => {
        if (!v || v === 0) return '-';
        return `${isDeduction ? '-' : ''}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const taxRowGroups = [
        {
            name: 'Taxable Income Details',
            rows: [
                { label: 'Basic Salary', key: 'basicPay', color: 'text-slate-900', isDeduction: false },
                { label: 'Other Taxable Income', key: 'otherTaxable', color: 'text-slate-600', isDeduction: false },
                { label: 'Salary Differential', key: 'salaryDifferential', color: 'text-indigo-600', isDeduction: false },
            ]
        },
        {
            name: 'Tax Payments & Deductions',
            rows: [
                { label: 'SSS (Employee Share)', key: 'sss', color: 'text-slate-500', isDeduction: true },
                { label: 'PhilHealth (Employee Share)', key: 'philhealth', color: 'text-slate-500', isDeduction: true },
                { label: 'Pag-IBIG (Employee Share)', key: 'pagibig', color: 'text-slate-500', isDeduction: true },
                { label: 'Withholding Tax Paid', key: 'tax', color: 'text-rose-600', isDeduction: true },
            ]
        }
    ];

    const monthsLong = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <YearEndPrepLayout
            activeTab="tax"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
        >
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col flex-1"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 border-b border-slate-100 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] shadow-inner">
                            <Calculator size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tax Annualization</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Year-End Tax Reconciliation (1604-C)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right px-6 border-r border-slate-100 hidden lg:block">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Actual Tax Remittance</div>
                            <div className="text-xl font-black text-emerald-600">₱ 1,450,000.00</div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/manage/year-end-batch-tax?stage=actual')}
                                className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200"
                            >
                                <ShieldCheck size={16} /> Batch Process Tax (Jan)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden flex-1 flex flex-col">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th rowSpan={2} className="pl-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee Information</th>
                                <th colSpan={3} className="px-6 py-4 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100 bg-indigo-50/20">Tax Assumed (Dec)</th>
                                <th colSpan={3} className="px-6 py-4 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100 bg-emerald-50/20">Tax Actual (Jan)</th>
                                <th rowSpan={2} className="px-6 py-6 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100">Adjustment</th>
                                <th rowSpan={2} className="px-6 py-6 text-[11px] font-black text-center text-slate-400 uppercase tracking-widest border-l border-slate-100">ITR Document</th>
                            </tr>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right border-l border-slate-100">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right border-l border-slate-100">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="pl-10 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-xs font-black text-white shadow-xl">
                                                {item.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.role}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-right font-mono text-sm font-black text-slate-600 border-l border-slate-50 bg-slate-50/30">
                                        {formatCurrency(item.assumedTax)}
                                    </td>
                                    <td className="px-6 py-5 text-center border-l border-slate-50 bg-slate-50/30">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-100 text-slate-500 border-slate-200">
                                            Projected
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center border-l border-slate-50 bg-slate-50/30">
                                        <button 
                                            onClick={() => { setSelectedEmpId(item.id); }} 
                                            className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all border border-transparent shadow-sm" 
                                            title="View Projection Logic"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-5 text-right font-mono text-sm font-black text-indigo-600 border-l border-slate-50 bg-indigo-50/5">
                                        {formatCurrency(item.actualTax)}
                                    </td>
                                    <td className="px-6 py-5 text-center border-l border-slate-50">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.actualTaxStatus === 'Finalized'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                            {item.actualTaxStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center border-l border-slate-50 bg-indigo-50/5">
                                        <button
                                            onClick={() => { setSelectedEmpId(item.id); }}
                                            className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-emerald-100 shadow-sm"
                                            title="View Final Ledger"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                    <td className={`px-6 py-5 text-right font-mono text-sm font-black border-l border-slate-50 ${(item.actualTax - item.assumedTax) > 0 ? 'text-rose-600 bg-rose-50/30' :
                                        (item.actualTax - item.assumedTax) < 0 ? 'text-emerald-600 bg-emerald-50/30' : 'text-slate-400'
                                        }`}>
                                        {formatCurrency(item.actualTax - item.assumedTax)}
                                    </td>
                                    <td className="px-6 py-5 text-center border-l border-slate-50">
                                        <button
                                            onClick={() => setItrModalEmpId(item.id)}
                                            className="px-4 py-2 text-[10px] font-black text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto whitespace-nowrap"
                                        >
                                            <FileText size={14} /> View ITR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal for Details */}
            <Modal isOpen={!!selectedEmpId} onClose={() => setSelectedEmpId(null)} className="max-w-[95vw]">
                {selectedEmployeeData && (
                    <div className="flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-start shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-700 shadow-sm">
                                    {selectedEmployeeData?.avatar}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{selectedEmployeeData?.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{selectedEmployeeData?.role} • {selectedEmployeeData?.department}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedEmpId(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Calculator className="text-indigo-600" size={20} />
                                        Tax Annualization Ledger (Final Statement)
                                    </h4>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference: Fiscal Year {selectedYear}</div>
                                </div>

                                <div className="border-2 border-slate-300 overflow-hidden bg-white shadow-xl">
                                    <div className="overflow-x-auto custom-scrollbar-horizontal pb-4">
                                        <table className="w-full text-left border-collapse min-w-[2200px]">
                                            <thead className="bg-white">
                                                <tr className="border-b-2 border-slate-900 bg-white">
                                                    <th rowSpan={2} className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest sticky left-0 top-0 bg-white z-20 border-r-2 border-slate-200 min-w-[250px]">Description</th>
                                                    {monthsLong.map(m => (
                                                        <th key={m} colSpan={2} className="px-2 py-2 text-[11px] font-black text-slate-900 text-center bg-white">{m}</th>
                                                    ))}
                                                    <th rowSpan={2} className="px-8 py-4 text-[11px] font-black text-slate-900 uppercase tracking-widest text-right bg-slate-50 border-l border-slate-200 sticky right-0 z-10">Total</th>
                                                </tr>
                                                <tr className="border-b-[3px] border-slate-900 border-dashed bg-white">
                                                    {monthsLong.map(m => (
                                                        <React.Fragment key={`${m}-periods`}>
                                                            <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r border-slate-100 bg-white">1st</th>
                                                            <th className="px-2 py-2 text-[9px] font-black text-slate-400 text-center border-r-2 border-slate-200 bg-white">2nd</th>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-[11px]">
                                                {taxRowGroups.map((group, gIdx) => (
                                                    <React.Fragment key={gIdx}>
                                                        <tr className="bg-slate-50 group hover:bg-slate-100 transition-colors">
                                                            <td className="px-8 py-3 text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] border-y border-slate-200 sticky left-0 z-10 bg-slate-50 shadow-sm">
                                                                {group.name}
                                                            </td>
                                                            <td colSpan={25} className="bg-slate-50/50 border-y border-slate-200"></td>
                                                        </tr>
                                                        {group.rows.map((row, rIdx) => {
                                                            let rowTotal = 0;
                                                            monthlyHistory.forEach((m: any) => {
                                                                rowTotal += (m.p1[row.key] || 0) + (m.p2[row.key] || 0);
                                                            });

                                                            return (
                                                                <tr key={rIdx} className="group hover:bg-slate-50 transition-colors">
                                                                    <td className="px-8 py-3 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r-2 border-slate-200">
                                                                        <span className="font-bold text-slate-800 tracking-tight">{row.label}</span>
                                                                    </td>
                                                                    {monthlyHistory.map((m: any, mIdx) => (
                                                                        <React.Fragment key={`${mIdx}-${rIdx}`}>
                                                                            <td className="px-2 py-3 text-right font-mono border-r border-slate-50">
                                                                                <span className={m.p1[row.key] === 0 ? 'text-slate-300' : (row as any).color}>{formatVal(m.p1[row.key] || 0, row.isDeduction)}</span>
                                                                            </td>
                                                                            <td className="px-2 py-3 text-right font-mono border-r-2 border-slate-200">
                                                                                <span className={m.p2[row.key] === 0 ? 'text-slate-300' : (row as any).color}>{formatVal(m.p2[row.key] || 0, row.isDeduction)}</span>
                                                                            </td>
                                                                        </React.Fragment>
                                                                    ))}
                                                                    <td className="px-8 py-3 text-right font-mono font-black text-slate-900 bg-slate-50 border-l border-slate-200">
                                                                        {formatVal(rowTotal, row.isDeduction)}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl">
                                        <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Total Taxable Income (YTD)</div>
                                        <div className="text-4xl font-black">{formatCurrency(selectedEmployeeData?.ytdGross || 0)}</div>
                                        <div className="text-[10px] text-indigo-400 font-bold mt-2 uppercase tracking-tight italic">Consolidated Annual Salary</div>
                                    </div>
                                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Total Annual Tax Liability</div>
                                        <div className="text-4xl font-black">{formatCurrency(selectedEmployeeData?.actualTax || 0)}</div>
                                        <div className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight italic">Final Reconciliation Result</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setSelectedEmpId(null)} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Close</button>
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2">
                                <Download size={16} /> Export Detailed Ledger
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* --- ADD THIS NEW ITR PREVIEW MODAL --- */}
            <Modal isOpen={!!itrModalEmpId} onClose={() => setItrModalEmpId(null)} className="max-w-3xl">
                {itrEmployeeData && (
                    <div className="flex flex-col max-h-[85vh] overflow-hidden bg-white">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">BIR Form 2316 (ITR)</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                        {itrEmployeeData.name} • {itrEmployeeData.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setItrModalEmpId(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                <CloseIcon size={20} />
                            </button>
                        </div>

                        {/* Content Body - Authentic BIR Form 2316 Layout */}
                        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-200">
                            <div className="bg-white border-2 border-slate-900 w-full max-w-4xl shadow-2xl text-slate-900 font-sans tracking-tight">
                                
                                {/* HEADER SECTION */}
                                <div className="flex border-b-2 border-slate-900">
                                    <div className="w-1/4 border-r-2 border-slate-900 p-4 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 border-2 border-slate-900 rounded-full flex items-center justify-center mb-2">
                                            <span className="text-xs font-black">BIR</span>
                                        </div>
                                        <span className="text-[9px] text-center font-bold leading-tight">Republika ng Pilipinas<br/>Kawanihan ng Rentas Internas</span>
                                    </div>
                                    <div className="w-2/4 p-4 text-center flex flex-col justify-center bg-slate-50">
                                        <h1 className="text-sm font-black uppercase leading-tight">Certificate of Compensation Payment / Tax Withheld</h1>
                                        <p className="text-[10px] mt-1 font-bold">For Compensation Payment With or Without Tax Withheld</p>
                                    </div>
                                    <div className="w-1/4 border-l-2 border-slate-900 p-4 flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-bold">BIR Form No.</span>
                                        <span className="text-4xl font-black tracking-tighter">2316</span>
                                        <span className="text-[9px] font-bold">January 2018 (ENCS)</span>
                                    </div>
                                </div>

                                <div className="border-b-2 border-slate-900 p-2 flex justify-center items-center gap-3 bg-slate-100">
                                    <span className="text-xs font-black uppercase">For the Year</span>
                                    <span className="px-6 py-1 bg-white border-2 border-slate-900 font-mono font-black text-sm tracking-widest">{selectedYear}</span>
                                </div>

                                <div className="bg-slate-300 border-b-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase text-center tracking-widest">
                                    Employee Information
                                </div>
                                <div className="grid grid-cols-4 border-b-2 border-slate-900 text-[10px]">
                                    <div className="col-span-1 border-r border-slate-900 p-2 font-bold">1 Taxpayer Identification No.</div>
                                    <div className="col-span-3 p-2 font-mono font-black text-sm tracking-widest">{itrEmployeeData.tin || '___ - ___ - ___ - ___'}</div>
                                    
                                    <div className="col-span-4 border-t border-slate-900 p-1 px-2 font-bold">2 Employee's Name (Last Name, First Name, Middle Name)</div>
                                    <div className="col-span-4 border-t border-slate-900 p-2 font-black text-sm uppercase bg-slate-50">{itrEmployeeData.name}</div>
                                </div>

                                <div className="bg-slate-300 border-b-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase text-center tracking-widest">
                                    Part II - Employer Information (Present)
                                </div>
                                <div className="grid grid-cols-4 border-b-2 border-slate-900 text-[10px]">
                                    <div className="col-span-1 border-r border-slate-900 p-2 font-bold">4 Employer's TIN</div>
                                    <div className="col-span-3 p-2 font-mono font-black text-sm tracking-widest">{itrEmployeeData.employerTIN || '000 - 111 - 222 - 333'}</div>
                                    
                                    <div className="col-span-4 border-t border-slate-900 p-1 px-2 font-bold">5 Employer's Name</div>
                                    <div className="col-span-4 border-t border-slate-900 p-2 font-black text-xs uppercase bg-slate-50">{itrEmployeeData.employerName || 'YOUR COMPANY NAME INC.'}</div>
                                    
                                    <div className="col-span-4 border-t border-slate-900 p-1 px-2 font-bold">6 Registered Address</div>
                                    <div className="col-span-4 border-t border-slate-900 p-2 font-bold text-xs uppercase bg-slate-50">{itrEmployeeData.employerAddress || '123 BUSINESS PARK, MAKATI CITY'}</div>
                                </div>

                                <div className="bg-slate-800 text-white border-b-2 border-slate-900 px-2 py-1 text-[10px] font-black uppercase text-center tracking-widest">
                                    Summary of Record of Employee's Compensation and Tax Withheld
                                </div>
                                
                                <div className="grid grid-cols-2 text-[10px] divide-x-2 divide-slate-900 bg-white">
                                    <div className="flex flex-col">
                                        <div className="bg-slate-200 border-b-2 border-slate-900 px-2 py-1.5 text-[10px] font-black text-center uppercase tracking-tight">
                                            A. Non-Taxable / Exempt Compensation Income
                                        </div>
                                        <div className="flex justify-between border-b border-slate-300 p-2 hover:bg-slate-50">
                                            <span>30 Basic Salary/ Statutory Minimum Wage</span>
                                            <span className="font-mono font-bold">-</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-300 p-2 hover:bg-slate-50">
                                            <span>32 De Minimis Benefits</span>
                                            <span className="font-mono font-bold">-</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-300 p-2 hover:bg-slate-50">
                                            <span>33 SSS, GSIS, PHIC, & PAG-IBIG Contributions</span>
                                            <span className="font-mono font-bold">{formatCurrency((itrEmployeeData.govContributions?.sss || 0) + (itrEmployeeData.govContributions?.philhealth || 0) + (itrEmployeeData.govContributions?.pagibig || 0))}</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 border-slate-900 p-2 hover:bg-slate-50">
                                            <span>36 13th Month Pay and Other Benefits</span>
                                            <span className="font-mono font-bold">{formatCurrency(itrEmployeeData.exemptIncome || 0)}</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-slate-100 font-black">
                                            <span>38 TOTAL NON-TAXABLE/EXEMPT COMP. INCOME</span>
                                            <span className="font-mono">{formatCurrency((itrEmployeeData.exemptIncome || 0) + (itrEmployeeData.govContributions?.sss || 0) + (itrEmployeeData.govContributions?.philhealth || 0) + (itrEmployeeData.govContributions?.pagibig || 0))}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="bg-slate-200 border-b-2 border-slate-900 px-2 py-1.5 text-[10px] font-black text-center uppercase tracking-tight">
                                            B. Taxable Compensation Income (Regular & Supplementary)
                                        </div>
                                        <div className="flex justify-between border-b border-slate-300 p-2 hover:bg-slate-50">
                                            <span>39 Basic Salary</span>
                                            <span className="font-mono font-bold">{formatCurrency(itrEmployeeData.ytdGross - (itrEmployeeData.exemptIncome || 0))}</span>
                                        </div>
                                        <div className="flex justify-between border-b-2 border-slate-900 p-2 hover:bg-slate-50">
                                            <span>41 13th Month Pay and Other Benefits</span>
                                            <span className="font-mono font-bold">-</span>
                                        </div>
                                        <div className="flex justify-between p-2 bg-indigo-50 font-black border-b-2 border-slate-900">
                                            <span>43 TOTAL TAXABLE COMPENSATION INCOME</span>
                                            <span className="font-mono text-indigo-700">{formatCurrency(itrEmployeeData.ytdTaxable)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-300 p-2 hover:bg-slate-50">
                                            <span>44 Tax Due</span>
                                            <span className="font-mono font-bold">{formatCurrency(itrEmployeeData.taxDue)}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-rose-50 font-black text-sm border-t-2 border-slate-900">
                                            <span className="uppercase">50 Total Taxes Withheld</span>
                                            <span className="font-mono text-rose-600">{formatCurrency(itrEmployeeData.actualTax || itrEmployeeData.taxWithheld)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={() => setItrModalEmpId(null)} 
                                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Close Preview
                            </button>
                            <button 
                                onClick={() => alert(`Downloading official ITR file for ${itrEmployeeData.name}...`)}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                            >
                                <Download size={16} /> Download Official ITR
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            <style>{`
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 12px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 6px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 6px;
                    border: 3px solid #f1f5f9;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </YearEndPrepLayout>
    );
};

export default YearEndTaxPrepPage;
