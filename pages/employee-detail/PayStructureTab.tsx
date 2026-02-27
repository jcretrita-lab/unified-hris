
import React from 'react';
import { 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Banknote,
  MinusCircle,
  PlusCircle
} from 'lucide-react';

const MOCK_COMPARISON = {
  templateName: "Senior Developer - Standard",
  basePay: 45000.00,
  items: [
    { name: 'Basic Salary', type: 'Earning', templateVal: 45000.00, actualVal: 45000.00, isFixed: true },
    { name: 'Rice Subsidy', type: 'Earning', templateVal: 2000.00, actualVal: 2000.00, isFixed: true },
    { name: 'Transport Allowance', type: 'Earning', templateVal: 1500.00, actualVal: 1500.00, isFixed: true },
    { name: 'Overtime Pay', type: 'Earning', templateVal: 'Formula', actualVal: 1250.50, isFixed: false },
    { name: 'SSS Contribution', type: 'Deduction', templateVal: 1350.00, actualVal: 1350.00, isFixed: true },
    { name: 'PhilHealth', type: 'Deduction', templateVal: 450.00, actualVal: 450.00, isFixed: true },
    { name: 'Late Deductions', type: 'Deduction', templateVal: 'Formula', actualVal: 200.00, isFixed: false },
  ]
};

const PayStructureTab: React.FC = () => {
  const data = MOCK_COMPARISON;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-indigo-600" />
              Implemented Pay Structure
            </h3>
            <p className="text-sm text-slate-500 mt-1">Comparing <span className="font-bold text-slate-700">{data.templateName}</span> against latest payroll run.</p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Base Monthly Pay</div>
             <div className="text-2xl font-mono font-bold text-slate-800">₱ {data.basePay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Info size={16} /> Structure Status
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed mb-4">
                This employee is currently assigned to the standard Senior Developer pay template. 
                Any discrepancies below indicate variable pay (like OT) or manual adjustments.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 bg-white px-3 py-2 rounded-xl border border-indigo-200 w-fit shadow-sm">
                 <CheckCircle2 size={14} className="text-emerald-500" />
                 Template Active
              </div>
           </div>

           <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legend</h4>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-600 font-medium">Match / Fixed Amount</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-slate-600 font-medium">Variable / Formula Based</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-xs text-slate-600 font-medium">Template Value</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Comparison Table */}
        <div className="lg:col-span-2">
           <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                 <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-4 text-left">Component</th>
                       <th className="px-6 py-4 text-left">Type</th>
                       <th className="px-6 py-4 text-right text-indigo-600">Template Value</th>
                       <th className="px-6 py-4 text-right text-slate-800">Previous Pay</th>
                       <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {data.items.map((item, idx) => {
                       const isMatch = item.templateVal === item.actualVal;
                       return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                             <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 text-xs font-bold ${item.type === 'Earning' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                   {item.type === 'Earning' ? <PlusCircle size={12} /> : <MinusCircle size={12} />}
                                   {item.type}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right font-mono text-indigo-600 font-medium">
                                {typeof item.templateVal === 'number' 
                                   ? `₱ ${item.templateVal.toLocaleString(undefined, {minimumFractionDigits: 2})}` 
                                   : <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-indigo-100">Calc: {item.templateVal}</span>
                                }
                             </td>
                             <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                                ₱ {item.actualVal.toLocaleString(undefined, {minimumFractionDigits: 2})}
                             </td>
                             <td className="px-6 py-4 text-right">
                                {item.isFixed ? (
                                   isMatch ? (
                                      <span className="text-emerald-500"><CheckCircle2 size={16} className="ml-auto" /></span>
                                   ) : (
                                      <span className="text-amber-500 flex items-center justify-end gap-1 text-[10px] font-bold uppercase"><AlertTriangle size={14} /> Diff</span>
                                   )
                                ) : (
                                   <span className="text-slate-400 text-[10px] font-bold uppercase">Variable</span>
                                )}
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PayStructureTab;
