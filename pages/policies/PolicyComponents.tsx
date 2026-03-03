
import React from 'react';
import {
    Info,
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    BookMarked,
    Gavel,
} from 'lucide-react';

export const ComplianceBadge = ({ status, msg, citation }: { status: string, msg: string, citation?: string }) => {
    if (!msg) return null;

    let color = 'bg-slate-100 text-slate-500 border-slate-200';
    let icon = <Info size={12} />;

    if (status === 'risk') {
        color = 'bg-rose-50 text-rose-600 border-rose-100';
        icon = <AlertTriangle size={12} />;
    } else if (status === 'compliant') {
        color = 'bg-emerald-50 text-emerald-600 border-emerald-100';
        icon = <CheckCircle2 size={12} />;
    } else if (status === 'generous') {
        color = 'bg-blue-50 text-blue-600 border-blue-100';
        icon = <ShieldCheck size={12} />;
    }

    return (
        <div className={`flex items-center justify-between p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide w-full mt-2 ${color}`}>
            <div className="flex items-center gap-2">
                {icon}
                <span>{msg}</span>
            </div>

            {citation && (
                <div className="relative group cursor-help">
                    <Info size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] hidden group-hover:block z-10">
                        <div className="bg-slate-800 text-white text-[10px] rounded-lg py-2 px-3 shadow-xl font-medium normal-case border border-slate-700">
                            <div className="flex items-center gap-1.5 mb-0.5 opacity-70">
                                <BookMarked size={10} />
                                <span className="uppercase tracking-wider text-[9px] font-bold">Legal Reference</span>
                            </div>
                            <span className="font-mono text-xs">{citation}</span>
                            {/* Arrow */}
                            <div className="absolute top-full right-1.5 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const LegalNote = ({ text }: { text: string }) => (
    <div className="flex gap-2 items-start text-[10px] text-slate-400 italic mt-2">
        <Gavel size={12} className="mt-0.5 shrink-0" />
        <span>{text}</span>
    </div>
);

export const SectionTitle = ({ icon: Icon, title, description, citation }: any) => (
    <div className="mb-6">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Icon size={20} /></div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            {citation && (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200" title="Legal Basis">
                    {citation}
                </span>
            )}
        </div>
        <p className="text-xs text-slate-500 ml-12 max-w-2xl">{description}</p>
    </div>
);

export const getComplianceStatus = (
    value: number,
    standard: number,
    type: 'min' | 'max' | 'exact' = 'min'
) => {
    if (type === 'min') {
        if (value < standard) return { status: 'risk', msg: `Below Legal Min (${standard})` };
        if (value === standard) return { status: 'compliant', msg: 'Compliant' };
        return { status: 'generous', msg: 'Above Standard' };
    }
    if (type === 'exact') {
        if (value === standard) return { status: 'compliant', msg: 'Compliant' };
        if (value < standard) return { status: 'risk', msg: `Non-Compliant (Legal: ${standard})` };
        return { status: 'generous', msg: 'Above Standard' };
    }
    if (type === 'max') {
        if (value > standard) return { status: 'risk', msg: `Exceeds Legal Max (${standard})` };
        return { status: 'compliant', msg: 'Compliant' };
    }
    return { status: 'neutral', msg: '' };
};
