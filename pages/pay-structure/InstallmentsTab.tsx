
import React from 'react';
import {
    Plus,
    Trash2,
    Save,
    X,
    ShoppingBag,
    CreditCard,
    Package,
    Clock,
    Percent,
    Building2,
    ChevronRight,
} from 'lucide-react';
import { RotateCcw } from 'lucide-react';

export interface InstallmentsTabProps {
    installmentProducts: any[];
    setInstallmentProducts: (v: any[]) => void;
    isAddingInstallment: boolean;
    setIsAddingInstallment: (v: boolean) => void;
    productEditor: any;
    setProductEditor: (v: any) => void;
}

const InstallmentsTab: React.FC<InstallmentsTabProps> = ({
    installmentProducts,
    setInstallmentProducts,
    isAddingInstallment,
    setIsAddingInstallment,
    productEditor,
    setProductEditor,
}) => {
    return (
        <>
            {/* Product Dashboard (Panel View) */}
            {!isAddingInstallment ? (
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <ShoppingBag size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Installment Programs</h3>
                                <p className="text-xs text-slate-500 font-medium font-inter">Select a product to configure plans or create a new offering.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setProductEditor({ name: '', category: 'Equipment', totalPrice: 0, payPeriod: 'Monthly', description: '', options: [{ months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 0 }] });
                                setIsAddingInstallment(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 font-bold text-sm active:scale-95"
                        >
                            <Plus size={18} /> New Product Panel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                        {installmentProducts.map(p => (
                            <div
                                key={p.id}
                                onClick={() => { setProductEditor({ ...p }); setIsAddingInstallment(true); }}
                                className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-orange-100/30 hover:border-orange-200 transition-all cursor-pointer group relative flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${p.category === 'HMO' ? 'bg-indigo-50 text-indigo-600' : p.category === 'Insurance' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {p.category === 'HMO' ? <Building2 size={24} /> : p.category === 'Insurance' ? <Package size={24} /> : <ShoppingBag size={24} />}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setInstallmentProducts(installmentProducts.filter(item => item.id !== p.id)); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-extrabold text-slate-800 text-lg mb-1 leading-tight">{p.name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded italic">{p.category}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-orange-500">{p.payPeriod} Cycle</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed font-inter">{p.description || "No description provided."}</p>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Value</div>
                                        <div className="text-xl font-mono font-black text-slate-800">₱{p.totalPrice.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Programs</div>
                                        <div className="flex gap-1 mt-1">
                                            {p.options.map((opt: any, i: number) => (
                                                <span key={i} className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded uppercase">{opt.months}m</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 group-hover:translate-x-1 transition-transform bg-orange-50 p-1.5 rounded-full text-orange-400 opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => {
                                setProductEditor({ name: '', category: 'Equipment', totalPrice: 0, payPeriod: 'Monthly', description: '', options: [{ months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 0 }] });
                                setIsAddingInstallment(true);
                            }}
                            className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 hover:bg-orange-50/30 hover:border-orange-200 transition-all text-slate-400 hover:text-orange-500 group min-h-[220px]"
                        >
                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center group-hover:border-orange-200 group-hover:shadow-sm">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold text-sm">Add New Product Panel</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center z-10 bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsAddingInstallment(false)}
                                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <RotateCcw size={18} />
                            </button>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-none">Program Panel: {productEditor.name || "Draft Program"}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Financing Tiers & Amortization Logic</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsAddingInstallment(false)} className="text-slate-400 hover:text-slate-600 p-2"><X /></button>
                    </div>


                    <div className="p-8 overflow-y-auto flex-1">
                        <div className="grid grid-cols-3 gap-6 mb-10">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                                <input
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-900 transition-all"
                                    value={productEditor.name}
                                    onChange={e => setProductEditor({ ...productEditor, name: e.target.value })}
                                    placeholder="e.g. MacBook Pro M3"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                <select
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-700 transition-all"
                                    value={productEditor.category}
                                    onChange={e => setProductEditor({ ...productEditor, category: e.target.value })}
                                >
                                    <option value="Equipment">Equipment / Asset</option>
                                    <option value="HMO">Health Insurance (HMO)</option>
                                    <option value="Insurance">Life Insurance</option>
                                    <option value="Loan">Cash Loan</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Price (Base)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₱</span>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-8 rounded-xl text-sm font-mono font-bold focus:bg-white focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-900 transition-all"
                                        value={productEditor.totalPrice || ''}
                                        onChange={e => {
                                            const val = parseFloat(e.target.value) || 0;
                                            const updatedOptions = productEditor.options.map((opt: any) => {
                                                const base = val;
                                                const freqMultiplier = productEditor.payPeriod === 'Semi-monthly' ? 2 : productEditor.payPeriod === 'Weekly' ? 4 : productEditor.payPeriod === 'Daily' ? 22 : 1;
                                                const totalDeductions = opt.months * freqMultiplier;
                                                const rate = (opt.interestEnabled ? opt.interestRate : 0) / 100;
                                                const totalInterest = base * rate;
                                                return { ...opt, monthlyPayment: (base + totalInterest) / totalDeductions };
                                            });
                                            setProductEditor({ ...productEditor, totalPrice: val, options: updatedOptions });
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deduction Frequency</label>
                                <select
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-700 transition-all"
                                    value={productEditor.payPeriod}
                                    onChange={e => {
                                        const freq = e.target.value;
                                        const updatedOptions = productEditor.options.map((opt: any) => {
                                            const base = productEditor.totalPrice;
                                            const freqMultiplier = freq === 'Semi-monthly' ? 2 : freq === 'Weekly' ? 4 : freq === 'Daily' ? 22 : 1;
                                            const totalDeductions = opt.months * freqMultiplier;
                                            const rate = (opt.interestEnabled ? opt.interestRate : 0) / 100;
                                            const totalInterest = base * rate;
                                            return { ...opt, monthlyPayment: (base + totalInterest) / totalDeductions };
                                        });
                                        setProductEditor({ ...productEditor, payPeriod: freq, options: updatedOptions });
                                    }}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Semi-monthly">Semi-monthly</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Daily">Daily</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Note</label>
                                <input
                                    className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-600 transition-all"
                                    value={productEditor.description}
                                    onChange={e => setProductEditor({ ...productEditor, description: e.target.value })}
                                    placeholder="Benefit details..."
                                />
                            </div>
                        </div>

                        <div className="mb-4 flex justify-between items-center px-1">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-orange-500" /> Installment Options
                            </h4>
                            <button
                                onClick={() => {
                                    const options = [...productEditor.options, { months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 0 }];
                                    setProductEditor({ ...productEditor, options });
                                }}
                                className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 border-dashed transition-all"
                            >
                                Add Plan Option
                            </button>
                        </div>

                        <div className="space-y-8">
                            {productEditor.options.map((opt: any, idx: number) => {
                                const updateOpt = (field: string, val: any) => {
                                    const options = [...productEditor.options];
                                    options[idx] = { ...options[idx], [field]: val };

                                    // Re-calculate monthly payment if base or months changed
                                    const base = productEditor.totalPrice;
                                    const months = field === 'months' ? val : options[idx].months;
                                    const freqMultiplier = productEditor.payPeriod === 'Semi-monthly' ? 2 : productEditor.payPeriod === 'Weekly' ? 4 : productEditor.payPeriod === 'Daily' ? 22 : 1;
                                    const totalDeductions = months * freqMultiplier;
                                    const rate = (options[idx].interestEnabled ? (field === 'interestRate' ? val : options[idx].interestRate) : 0) / 100;
                                    const totalInterest = base * rate;
                                    options[idx].monthlyPayment = (base + totalInterest) / totalDeductions;

                                    setProductEditor({ ...productEditor, options });
                                };

                                const baseBalance = productEditor.totalPrice;
                                const interestAmount = opt.interestEnabled ? (baseBalance * (opt.interestRate / 100)) : 0;
                                const totalFinanced = baseBalance + interestAmount;
                                const freqMultiplier = productEditor.payPeriod === 'Semi-monthly' ? 2 : productEditor.payPeriod === 'Weekly' ? 4 : productEditor.payPeriod === 'Daily' ? 22 : 1;
                                const totalSteps = opt.months * freqMultiplier;

                                // Generate Amortization Data
                                const schedule: { period: number; payment: number; balance: number }[] = [];
                                let currentRemaining = totalFinanced;
                                for (let i = 1; i <= totalSteps; i++) {
                                    currentRemaining -= opt.monthlyPayment;
                                    // Handle potential floating point errors for the final period
                                    if (i === totalSteps) currentRemaining = 0;
                                    schedule.push({
                                        period: i,
                                        payment: opt.monthlyPayment,
                                        balance: Math.max(0, currentRemaining)
                                    });
                                }

                                return (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card">
                                        {/* Row Header: Controls */}
                                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold text-lg shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Plan Option</div>
                                                        <div className="text-sm font-bold text-slate-800">{opt.months} Month Program</div>
                                                        <div className="text-[10px] font-bold text-orange-500 uppercase">{productEditor.payPeriod} Deductions</div>
                                                    </div>
                                                </div>

                                                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-32">
                                                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Tenure</label>
                                                        <select
                                                            className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold outline-none focus:ring-1 ring-orange-500"
                                                            value={opt.months}
                                                            onChange={e => updateOpt('months', parseInt(e.target.value))}
                                                        >
                                                            {[1, 3, 6, 12, 18, 24, 36, 48].map(m => <option key={m} value={m}>{m} Months</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                                                checked={opt.interestEnabled}
                                                                onChange={e => updateOpt('interestEnabled', e.target.checked)}
                                                            />
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Interest</span>
                                                        </label>
                                                        {opt.interestEnabled && (
                                                            <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                                                                <input
                                                                    type="number"
                                                                    className="w-14 bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-right text-xs font-bold text-orange-600 outline-none focus:border-orange-400"
                                                                    value={opt.interestRate}
                                                                    onChange={e => updateOpt('interestRate', parseFloat(e.target.value) || 0)}
                                                                />
                                                                <Percent size={10} className="text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase">{productEditor.payPeriod} Amort.</div>
                                                    <div className="text-lg font-mono font-bold text-orange-600">₱{opt.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const options = productEditor.options.filter((_: any, i: number) => i !== idx);
                                                        setProductEditor({ ...productEditor, options });
                                                    }}
                                                    className="p-2 border border-slate-200 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tabular Amortization Schedule (Hierarchical Headers) */}
                                        <div className="p-6 bg-white overflow-x-auto custom-scrollbar-horizontal">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-6 bg-orange-400 rounded-full"></div>
                                                    <div>
                                                        <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">Amortization Ledger</h5>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Structured Deduction Timeline</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 shadow-inner">
                                                    <div className="text-[10px] font-black text-slate-400 uppercase">Frequency: <span className="text-orange-600">{productEditor.payPeriod}</span></div>
                                                    <div className="w-px h-3 bg-slate-200"></div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase">Tenure: <span className="text-orange-600">{opt.months} Months</span></div>
                                                </div>
                                            </div>
                                            <table className="w-full border-separate border-spacing-x-1 border-spacing-y-1 min-w-[max-content]">
                                                <thead>
                                                    {/* First Row: Months */}
                                                    <tr>
                                                        <th className="sticky left-0 bg-white z-20 px-4 py-3 text-left w-36 border-b border-slate-100">
                                                            <span className="text-[9px] font-black text-slate-300 uppercase">Timeline</span>
                                                        </th>
                                                        {Array.from({ length: opt.months }).map((_, mIdx) => {
                                                            const multiplier = freqMultiplier;
                                                            const visibleStepsInThisMonth = schedule.slice(mIdx * multiplier, (mIdx + 1) * multiplier).filter((_, i) => (mIdx * multiplier + i) < 24);
                                                            if (visibleStepsInThisMonth.length === 0) return null;
                                                            return (
                                                                <th
                                                                    key={mIdx}
                                                                    colSpan={visibleStepsInThisMonth.length}
                                                                    className="px-5 py-2 text-center bg-slate-50/50 rounded-t-2xl border-b border-slate-200 border-x border-white shadow-sm"
                                                                >
                                                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Month {mIdx + 1}</div>
                                                                </th>
                                                            );
                                                        })}
                                                        {schedule.length > 24 && <th className="bg-slate-50/30 w-32 border-b border-slate-100"></th>}
                                                    </tr>
                                                    {/* Second Row: Pay Periods */}
                                                    <tr>
                                                        <th className="sticky left-0 bg-white z-20 px-4 py-2 text-left w-36 border-b-2 border-slate-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)]">
                                                            <span className="text-[9px] font-black text-slate-500 uppercase">Pay Cycles</span>
                                                        </th>
                                                        {schedule.slice(0, 24).map(s => (
                                                            <th key={s.period} className="px-5 py-3 text-center min-w-[130px] bg-white border-b-2 border-slate-100 group/th transition-all">
                                                                <div className="text-[9px] font-black text-orange-500 uppercase">Period {((s.period - 1) % freqMultiplier) + 1}</div>
                                                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Code: {productEditor.payPeriod.slice(0, 3)}-{s.period}</div>
                                                            </th>
                                                        ))}
                                                        {schedule.length > 24 && (
                                                            <th className="px-5 py-3 text-center min-w-[130px] bg-slate-50/50 rounded-tr-2xl border-b-2 border-slate-100 italic">
                                                                <div className="text-[10px] font-black text-slate-400 uppercase">+{schedule.length - 24} More</div>
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="group/row">
                                                        <td className="sticky left-0 bg-white z-10 px-4 py-4 font-bold text-[10px] text-slate-500 uppercase tracking-tighter border-r border-slate-50 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">Deduction Per Run</td>
                                                        {schedule.slice(0, 24).map(s => (
                                                            <td key={s.period} className="px-5 py-4 text-center font-mono font-bold text-[11px] text-blue-600 bg-blue-50/10 group-hover/row:bg-blue-50/30 transition-colors border-b border-white">
                                                                ₱{s.payment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </td>
                                                        ))}
                                                        {schedule.length > 24 && <td className="bg-slate-50/20"></td>}
                                                    </tr>
                                                    <tr className="group/row">
                                                        <td className="sticky left-0 bg-white z-10 px-4 py-4 font-bold text-xs text-slate-500 border-r border-slate-50 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">Remaining</td>
                                                        {schedule.slice(0, 24).map(s => (
                                                            <td key={s.period} className={`px-5 py-4 text-center font-mono font-medium text-[10px] bg-slate-50 transition-colors ${s.balance === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                ₱{s.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </td>
                                                        ))}
                                                        {schedule.length > 24 && <td className="bg-slate-50/30"></td>}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-white shadow-inner">
                        <button
                            onClick={() => {
                                if (!productEditor.name) return;
                                const newProduct = {
                                    id: productEditor.id || Math.random().toString(36).substr(2, 9),
                                    ...productEditor
                                };
                                if (productEditor.id) {
                                    setInstallmentProducts(installmentProducts.map(p => p.id === productEditor.id ? newProduct : p));
                                } else {
                                    setInstallmentProducts([newProduct, ...installmentProducts]);
                                }
                                setIsAddingInstallment(false);
                            }}
                            className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 disabled:opacity-50 text-sm font-bold shadow-xl shadow-orange-100 transition-all active:scale-[0.98]"
                            disabled={!productEditor.name || !productEditor.totalPrice}
                        >
                            <Save size={18} /> Save Plan Configuration
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default InstallmentsTab;
