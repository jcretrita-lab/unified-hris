
import React, { useState, useMemo } from 'react';
import { PayComponent, PayTemplate, OrgUnit, Rank, Position, Employee, EmployeeStatus } from '../../types';
import Modal from '../../components/Modal';
import {
    Plus,
    Trash2,
    Play,
    Check,
    FileSpreadsheet,
    Filter,
    User,
    ArrowUpCircle,
    ArrowDownCircle,
    Layers,
    Settings2,
    Sliders,
    Banknote,
    Eye,
    EyeOff,
    X,
    ArrowRight,
    UserCog,
    RefreshCcw,
    AlertCircle,
    ToggleLeft,
    ToggleRight,
    CheckCircle2
} from 'lucide-react';

// --- MOCK DATA FOR SIMULATION & INSTANCES ---
const MOCK_ORG_UNITS: OrgUnit[] = [
    { id: 'dept-1', name: 'IT Department', type: 'Department', children: [] },
    { id: 'dept-2', name: 'HR Department', type: 'Department', children: [] }
];

const MOCK_RANKS: Rank[] = [
    { id: 'rank-1', name: 'Junior', level: 1 },
    { id: 'rank-2', name: 'Senior', level: 2 },
    { id: 'rank-3', name: 'Manager', level: 3 }
];

const MOCK_POSITIONS: Position[] = [
    { id: 'pos-1', title: 'Junior Developer', orgUnitId: 'dept-1', rankId: 'rank-1', defaultBasePay: 25000 },
    { id: 'pos-2', title: 'Senior Developer', orgUnitId: 'dept-1', rankId: 'rank-2', defaultBasePay: 45000 },
    { id: 'pos-3', title: 'HR Manager', orgUnitId: 'dept-2', rankId: 'rank-3', defaultBasePay: 55000 }
];

const MOCK_EMPLOYEES_FULL: Employee[] = [
    { id: 'emp-1', name: 'John Doe', firstName: 'John', lastName: 'Doe', role: 'Senior Developer', positionId: 'pos-2', department: 'IT Department', email: 'john@test.com', status: EmployeeStatus.ACTIVE, avatar: '', phone: '', jobType: 'Full-Time' },
    { id: 'emp-2', name: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', role: 'Junior Developer', positionId: 'pos-1', department: 'IT Department', email: 'jane@test.com', status: EmployeeStatus.ACTIVE, avatar: '', phone: '', jobType: 'Full-Time' },
    { id: 'emp-3', name: 'Alex Thompson', firstName: 'Alex', lastName: 'Thompson', role: 'HR Manager', positionId: 'pos-3', department: 'HR Department', email: 'alex@test.com', status: EmployeeStatus.ACTIVE, avatar: '', phone: '', jobType: 'Full-Time' }
];

// Helper Component for Sensitive Values
const SensitiveValue = ({ showAll, value, currency = '', className = '' }: { showAll: boolean, value: number, currency?: string, className?: string }) => {
    if (showAll) return <span className={className}>{currency}{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
    return <span className={`blur-[4px] select-none text-slate-300 ${className}`}>XXXXXX</span>;
};

interface PayTemplatesProps {
    templates: PayTemplate[];
    setTemplates: (t: PayTemplate[]) => void;
    components: PayComponent[];
}

const PayTemplates: React.FC<PayTemplatesProps> = ({ templates, setTemplates, components }) => {
    // Local data usage for simulator
    const ranks = MOCK_RANKS;
    const orgUnits = MOCK_ORG_UNITS;
    const positions = MOCK_POSITIONS;
    const employees = MOCK_EMPLOYEES_FULL;

    const [mode, setMode] = useState<'edit' | 'simulate'>('edit');
    const [templateSubTab, setTemplateSubTab] = useState<'configuration' | 'instances'>('configuration');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Separate visibility toggles for earnings and deductions
    const [showEarnings, setShowEarnings] = useState(false);
    const [showDeductions, setShowDeductions] = useState(false);
    // Visibility toggle for simulator (hidden by default)
    const [showSimValues, setShowSimValues] = useState(false);

    // Instance Comparison State
    const [comparingEmployeeId, setComparingEmployeeId] = useState<string | null>(null);

    // Instance Filtering State
    const [instanceFilter, setInstanceFilter] = useState<'All' | 'Customized' | 'Default'>('All');

    const [simEmployeeId, setSimEmployeeId] = useState<string>('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [targetType, setTargetType] = useState<PayTemplate['targetType']>('Global');
    const [isTaxExempt, setIsTaxExempt] = useState(false);
    const [taxRate, setTaxRate] = useState<number | undefined>(10);

    const [filterDeptId, setFilterDeptId] = useState<string>('');
    const [filterRankId, setFilterRankId] = useState<string>('');
    const [filterSubRankId, setFilterSubRankId] = useState<string>('');
    const [finalTargetId, setFinalTargetId] = useState<string>('');

    const activeTemplate = templates.find(t => t.id === selectedTemplateId);

    const flattenUnits = (units: OrgUnit[]): OrgUnit[] => {
        let list: OrgUnit[] = [];
        units.forEach(u => {
            list.push(u);
            list = list.concat(flattenUnits(u.children));
        });
        return list;
    };

    const allUnits = useMemo(() => flattenUnits(orgUnits), [orgUnits]);

    const isUnitDescendant = (targetUnitId: string, unitToCheckId: string): boolean => {
        if (targetUnitId === unitToCheckId) return true;
        const unit = allUnits.find(u => u.id === unitToCheckId);
        if (!unit || !unit.parentId) return false;
        return isUnitDescendant(targetUnitId, unit.parentId);
    };

    const getScopeUnitIds = (rootId: string): string[] => {
        const root = allUnits.find(u => u.id === rootId);
        if (!root) return [];
        let ids = [root.id];
        const recurse = (children: OrgUnit[]) => {
            children.forEach(c => {
                ids.push(c.id);
                recurse(c.children);
            });
        };
        recurse(root.children);
        return ids;
    };

    const deptIdsInScope = useMemo(() => {
        return filterDeptId ? getScopeUnitIds(filterDeptId) : [];
    }, [filterDeptId, allUnits]);

    const availableRanksInDept = useMemo(() => {
        if (!filterDeptId) return [];
        const posInScope = positions.filter(p => deptIdsInScope.includes(p.orgUnitId));
        const rankIds = Array.from(new Set(posInScope.map(p => p.rankId).filter(Boolean)));
        return ranks.filter(r => rankIds.includes(r.id as string));
    }, [deptIdsInScope, positions, ranks]);

    const availableSubRanks = useMemo(() => {
        if (!filterRankId) return [];
        const rank = ranks.find(r => r.id === filterRankId);
        if (!rank?.subRanks) return [];
        return rank.subRanks;
    }, [filterRankId, ranks]);

    const availablePositions = useMemo(() => {
        if (!filterDeptId) return [];
        return positions.filter(p => {
            const matchDept = deptIdsInScope.includes(p.orgUnitId);
            const matchRank = filterRankId ? p.rankId === filterRankId : true;
            const matchSubRank = filterSubRankId ? p.subRankId === filterSubRankId : true;
            return matchDept && matchRank && matchSubRank;
        });
    }, [deptIdsInScope, filterRankId, filterSubRankId, positions]);

    const handleOpenCreate = () => {
        setEditingId(null);
        resetForm();
        setIsCreating(true);
    };

    const handleOpenEditSettings = () => {
        if (!activeTemplate) return;
        setEditingId(activeTemplate.id);
        setNewName(activeTemplate.name);
        setTargetType(activeTemplate.targetType);
        setFinalTargetId(activeTemplate.targetId || '');
        setFilterSubRankId(activeTemplate.targetSubRankId || '');
        setIsTaxExempt(activeTemplate.isTaxExempt || false);
        setTaxRate(activeTemplate.taxRate);
        setIsCreating(true);
    };

    const handleSaveTemplate = () => {
        if (!newName) return;

        const templateData: PayTemplate = {
            id: editingId || Math.random().toString(36).substr(2, 9),
            name: newName,
            targetType,
            targetId: targetType === 'Global' ? null : finalTargetId,
            targetSubRankId: (targetType === 'Rank' && filterSubRankId) ? filterSubRankId : undefined,
            components: editingId ? (templates.find(t => t.id === editingId)?.components || []) : [],
            isTaxExempt,
            taxRate: isTaxExempt ? undefined : taxRate
        };

        if (editingId) {
            setTemplates(templates.map(t => t.id === editingId ? templateData : t));
        } else {
            setTemplates([...templates, templateData]);
            setSelectedTemplateId(templateData.id);
        }

        setIsCreating(false);
        resetForm();
    };

    const resetForm = () => {
        setNewName('');
        setTargetType('Global');
        setFilterDeptId('');
        setFilterRankId('');
        setFilterSubRankId('');
        setFinalTargetId('');
        setEditingId(null);
        setIsTaxExempt(false);
        setTaxRate(10);
    };

    const toggleComponent = (componentId: string) => {
        if (!activeTemplate) return;
        const exists = activeTemplate.components.includes(componentId);
        const newComponents = exists
            ? activeTemplate.components.filter(id => id !== componentId)
            : [...activeTemplate.components, componentId];

        setTemplates(templates.map(t => t.id === activeTemplate.id ? { ...t, components: newComponents } : t));
    };

    const handleDeleteTemplate = (id: string) => {
        if (confirm("Delete this template?")) {
            setTemplates(templates.filter(t => t.id !== id));
            if (selectedTemplateId === id) setSelectedTemplateId(null);
        }
    };

    const getSimulatedStack = () => {
        if (!simEmployeeId) return null;

        const emp = employees.find(e => e.id === simEmployeeId);
        const pos = positions.find(p => p.id === emp?.positionId);
        if (!emp || !pos) return null;

        const matchingTemplates = templates.filter(t => {
            if (t.targetType === 'Global') return true;
            if (t.targetType === 'Employee') return t.targetId === emp.id;
            if (t.targetType === 'Position') return t.targetId === pos.id;

            if (t.targetType === 'Rank') {
                const rankMatch = t.targetId === pos.rankId;
                const subRankMatch = t.targetSubRankId ? t.targetSubRankId === pos.subRankId : true;
                return rankMatch && subRankMatch;
            }

            if (t.targetType === 'Department') {
                return t.targetId ? isUnitDescendant(t.targetId, pos.orgUnitId) : false;
            }

            return false;
        });

        // Simple mock base pay logic
        const basePay = pos.defaultBasePay;
        let totalEarnings = 0;
        let totalDeductions = 0;

        const stack = matchingTemplates.map(t => {
            const tComps = t.components.map(cId => {
                const c = components.find(comp => comp.id === cId);
                if (!c) return null;

                let val = 0;
                if (c.valueType === 'fixed') val = c.fixedValue || 0;
                if (c.valueType === 'formula') val = 0; // Mock 0 for formulas in this view

                if (c.type === 'earning') totalEarnings += val;
                if (c.type === 'deduction') totalDeductions += val;

                return c;
            }).filter(Boolean) as PayComponent[];

            return { template: t, components: tComps };
        });

        return { emp, pos, basePay, stack, totalEarnings, totalDeductions };
    };

    const simResult = getSimulatedStack();

    const getTargetLabel = (t: PayTemplate) => {
        if (t.targetType === 'Global') return 'All Employees';
        if (t.targetType === 'Department') {
            const u = allUnits.find(unit => unit.id === t.targetId);
            return `Dept: ${u ? u.name : 'Unknown'}`;
        }
        if (t.targetType === 'Rank') {
            const r = ranks.find(rk => rk.id === t.targetId);
            const sr = r?.subRanks?.find(s => s.id === t.targetSubRankId);
            return `Rank: ${r?.name || 'Unknown'} ${sr ? `(${sr.name})` : ''}`;
        }
        if (t.targetType === 'Position') {
            const p = positions.find(pos => pos.id === t.targetId);
            return `Pos: ${p?.title || 'Unknown'}`;
        }
        if (t.targetType === 'Employee') {
            const e = employees.find(emp => emp.id === t.targetId);
            return `Emp: ${e?.lastName}`;
        }
        return t.targetType;
    };

    const getBasePayContext = () => {
        if (!activeTemplate) return null;
        if (activeTemplate.targetType === 'Position' && activeTemplate.targetId) {
            const pos = positions.find(p => p.id === activeTemplate.targetId);
            if (pos) return { amount: pos.defaultBasePay, label: pos.title, source: 'Position Default' };
        }
        if (activeTemplate.targetType === 'Rank' && activeTemplate.targetId) {
            const rank = ranks.find(r => r.id === activeTemplate.targetId);
            return { amount: 0, label: rank?.name || 'Rank', source: 'Varies by Position' };
        }
        return { amount: 0, label: 'All Roles', source: 'Varies' };
    };

    // --- INSTANCE MOCK LOGIC ---
    // In a real app, this would query a 'PayTemplateInstance' table.
    // Here we generate mock instances based on the current employees.
    const getInstanceData = () => {
        if (!activeTemplate) return [];

        // Filter employees who match the target
        const applicableEmployees = employees.filter(emp => {
            const pos = positions.find(p => p.id === emp.positionId);
            if (!pos) return false;
            // Simplified matching logic for mock purposes
            if (activeTemplate.targetType === 'Global') return true;
            if (activeTemplate.id === 'pt1') return true; // Assume Standard applies to all
            if (activeTemplate.id === 'pt2' && emp.role.includes('Senior')) return true; // Senior Perks
            return false;
        });

        return applicableEmployees.map(emp => {
            // Mock customization: Senior Devs have customizations
            const isCustomized = emp.role.includes('Senior');
            return {
                employee: emp,
                isCustomized,
                netDiff: isCustomized ? 1500 : 0
            };
        });
    };

    const instanceList = useMemo(() => {
        const rawList = getInstanceData();
        if (instanceFilter === 'All') return rawList;
        if (instanceFilter === 'Customized') return rawList.filter(i => i.isCustomized);
        if (instanceFilter === 'Default') return rawList.filter(i => !i.isCustomized);
        return rawList;
    }, [activeTemplate, employees, positions, instanceFilter]);

    // --- INSTANCE COMPARISON GENERATOR ---
    const getComparisonData = () => {
        if (!activeTemplate || !comparingEmployeeId) return null;
        const employee = employees.find(e => e.id === comparingEmployeeId);
        if (!employee) return null;

        const standardComponents = activeTemplate.components.map(id => components.find(c => c.id === id)).filter(Boolean) as PayComponent[];

        // Mocking the employee's actual components
        // If customized, we change one value and add one component
        let actualComponents = [...standardComponents];
        if (employee.role.includes('Senior')) {
            // Modify first component value (mock)
            actualComponents = actualComponents.map((c, i) => i === 0 ? { ...c, fixedValue: (c.fixedValue || 0) + 500 } : c);
            // Add a component (mock)
            const extraComp: PayComponent = { id: 'pc_extra', name: 'Transport Allowance', type: 'earning', isTaxable: false, valueType: 'fixed', fixedValue: 1000 };
            actualComponents.push(extraComp);
        }

        // Merge for display
        const allCompIds = Array.from(new Set([...standardComponents.map(c => c.id), ...actualComponents.map(c => c.id)]));

        const rows = allCompIds.map(id => {
            const std = standardComponents.find(c => c.id === id);
            const act = actualComponents.find(c => c.id === id);

            const stdVal = std ? (std.fixedValue || 0) : null;
            const actVal = act ? (act.fixedValue || 0) : null;

            let status: 'match' | 'diff' | 'added' | 'removed' = 'match';
            if (stdVal !== actVal) {
                if (stdVal === null) status = 'added';
                else if (actVal === null) status = 'removed';
                else status = 'diff';
            }

            return {
                id,
                name: std?.name || act?.name || 'Unknown',
                type: std?.type || act?.type || 'earning',
                stdVal,
                actVal,
                status
            };
        });

        // Compute Summaries
        let defNet = 0, actNet = 0;
        rows.forEach(r => {
            if (r.type === 'earning') {
                defNet += (r.stdVal || 0);
                actNet += (r.actVal || 0);
            } else {
                defNet -= (r.stdVal || 0);
                actNet -= (r.actVal || 0);
            }
        });

        return { employee, rows, summary: { defNet, actNet, diff: actNet - defNet } };
    };

    const comparisonData = getComparisonData();

    const basePayInfo = getBasePayContext();
    const earningComponents = components.filter(c => c.type === 'earning');
    const deductionComponents = components.filter(c => c.type === 'deduction');

    const renderComponentItem = (comp: PayComponent, isSelected: boolean, showValue: boolean) => (
        <div
            key={comp.id}
            onClick={() => toggleComponent(comp.id)}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all mb-2 ${isSelected ? (comp.type === 'earning' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-rose-50 border-rose-200 shadow-sm') : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${isSelected ? (comp.type === 'earning' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-rose-600 border-rose-600 text-white') : 'border-slate-300 bg-white'}`}>
                    {isSelected && <Check size={12} />}
                </div>
                <div>
                    <div className="font-bold text-sm text-slate-700">{comp.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase flex items-center gap-2 font-bold tracking-wider">
                        {comp.isTaxable && <span className="text-orange-500">Taxable</span>}
                        {comp.isTaxable && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
                        <span>{comp.valueType === 'fixed' ? 'Fixed' : 'Formula'}</span>
                    </div>
                </div>
            </div>
            <div className={`text-sm font-mono font-bold ${comp.type === 'earning' ? 'text-emerald-600' : 'text-rose-600'}`}>
                <div className="flex items-center gap-1">
                    {comp.type === 'earning' ? '+' : '-'}
                    {comp.valueType === 'fixed' ? <SensitiveValue showAll={showValue} value={comp.fixedValue || 0} currency="₱" /> : 'Calc'}
                </div>
            </div>
        </div>
    );

    const ComparisonRow: React.FC<{ row: any }> = ({ row }) => (
        <div className="grid grid-cols-4 px-5 py-3 text-sm hover:bg-slate-50 transition-colors items-center group border-b border-slate-50 last:border-0">
            <div className="col-span-1 font-bold text-slate-700 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'match' ? 'bg-slate-300' : row.status === 'added' ? 'bg-emerald-500' : row.status === 'removed' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                <span className={row.status === 'removed' ? 'text-slate-400 line-through decoration-slate-300' : ''}>{row.name}</span>
            </div>

            <div className="col-span-1 text-right font-mono text-slate-400 text-xs">
                {row.stdVal !== null ? (
                    <span>{row.type === 'earning' ? '+' : '-'}₱{row.stdVal.toLocaleString()}</span>
                ) : <span className="text-slate-200">--</span>}
            </div>

            <div className="col-span-1 text-right font-mono font-bold text-xs flex justify-end">
                {row.actVal !== null ? (
                    <span className={`px-2 py-0.5 rounded transition-colors ${row.status === 'diff' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        row.status === 'added' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'text-slate-700'
                        }`}>
                        {row.type === 'earning' ? '+' : '-'}₱{row.actVal.toLocaleString()}
                    </span>
                ) : <span className="text-slate-300 italic text-[10px] px-2">Removed</span>}
            </div>

            <div className="col-span-1 flex justify-end">
                {row.status === 'match' && <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">Inherited</span>}
                {row.status === 'diff' && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">Overridden</span>}
                {row.status === 'added' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">Added</span>}
                {row.status === 'removed' && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase tracking-wide">Excluded</span>}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row h-auto md:h-[700px] overflow-hidden">
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0 h-[300px] md:h-auto">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileSpreadsheet className="text-amber-500" size={20} /> Pay Templates
                    </h2>
                    <p className="text-xs text-slate-500 mb-3 font-medium">Define earnings & deductions for groups.</p>
                    <div className="flex gap-2">
                        <button onClick={handleOpenCreate} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 active:scale-95"><Plus size={14} /> New</button>
                        <button onClick={() => setMode(mode === 'edit' ? 'simulate' : 'edit')} className={`px-3 py-2 rounded-xl transition-all border ${mode === 'simulate' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`} title="Stack Simulator"><Play size={16} fill="currentColor" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {templates.length === 0 && <div className="p-8 text-center text-slate-400"><p className="text-sm">No templates found.</p></div>}
                    <div className="divide-y divide-slate-200 space-y-2">
                        {templates.map(t => (
                            <div key={t.id} onClick={() => { setSelectedTemplateId(t.id); setMode('edit'); setTemplateSubTab('configuration'); }} className={`p-4 rounded-2xl cursor-pointer hover:bg-white hover:shadow-sm transition-all border ${selectedTemplateId === t.id && mode === 'edit' ? 'bg-white border-amber-500 shadow-md shadow-amber-100' : 'bg-transparent border-transparent text-slate-600'}`}>
                                <div className="flex justify-between items-start mb-1"><h3 className={`font-bold text-sm ${selectedTemplateId === t.id && mode === 'edit' ? 'text-slate-800' : 'text-slate-600'}`}>{t.name}</h3><button onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button></div>
                                <div className="flex items-center gap-2 text-xs mb-2"><span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg flex items-center gap-1 truncate max-w-[180px] font-bold text-[10px] uppercase tracking-wide"><Filter size={10} /> {getTargetLabel(t)}</span></div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.components.length} components assigned</div>
                                {(t.isTaxExempt || (t.taxRate !== undefined && t.taxRate > 0)) && (
                                    <div className="mt-2 flex gap-1">
                                        {t.isTaxExempt && <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-bold uppercase">Tax Exempt</span>}
                                        {t.taxRate !== undefined && t.taxRate > 0 && <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">Tax {t.taxRate}%</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {mode === 'edit' && activeTemplate && (
                    <>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <div className="flex items-center gap-2"><h2 className="text-xl font-bold text-slate-900">{activeTemplate.name}</h2><button onClick={handleOpenEditSettings} className="text-slate-400 hover:text-amber-600 p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Settings"><Settings2 size={16} /></button></div>
                                <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-500 uppercase tracking-wide"><span className="text-amber-600">Targeting:</span> {getTargetLabel(activeTemplate)}</div>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setTemplateSubTab('configuration')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${templateSubTab === 'configuration' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Configuration
                                </button>
                                <button
                                    onClick={() => setTemplateSubTab('instances')}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${templateSubTab === 'instances' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Assigned Instances
                                </button>
                            </div>
                        </div>

                        {/* CONFIGURATION TAB */}
                        {templateSubTab === 'configuration' && (
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 p-4 opacity-5"><User size={120} /></div>
                                    <div className="relative z-10">
                                        <h4 className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-2 uppercase tracking-widest"><User size={14} /> Base Pay (Context)</h4>
                                        <p className="text-xs text-slate-400 mb-6 max-w-md">This is the starting salary derived from the {basePayInfo?.source}. All components below are added/deducted from this amount.</p>
                                        <div className="flex items-end gap-3">
                                            <div className="text-3xl font-mono font-bold text-white">{basePayInfo && basePayInfo.amount > 0 ? `₱${basePayInfo.amount.toLocaleString()}` : <span className="text-white/50 text-xl">Varies by Role</span>}</div>
                                            {activeTemplate.targetType === 'Position' && (<div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-lg text-white">{basePayInfo?.label}</div>)}
                                        </div>

                                        {/* Tax Flags Display */}
                                        <div className="flex gap-2 mt-4">
                                            {activeTemplate.isTaxExempt && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wide">
                                                    <CheckCircle2 size={12} /> Tax Exempt
                                                </div>
                                            )}
                                            {activeTemplate.taxRate !== undefined && activeTemplate.taxRate > 0 && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wide">
                                                    <AlertCircle size={12} /> {activeTemplate.taxRate}% Tax Applied
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100/50">
                                            <div className="flex items-center gap-2">
                                                <ArrowUpCircle className="text-emerald-500" size={20} />
                                                <h4 className="font-bold text-emerald-900 text-sm">Earnings & Allowances</h4>
                                            </div>
                                            <button
                                                onClick={() => setShowEarnings(!showEarnings)}
                                                className={`p-1.5 rounded-lg transition-colors ${showEarnings ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                                                title={showEarnings ? "Hide earnings values" : "Show earnings values"}
                                            >
                                                {showEarnings ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {earningComponents.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No earning components defined.</p>}
                                            {earningComponents.map(comp => renderComponentItem(comp, activeTemplate.components.includes(comp.id), showEarnings))}
                                        </div>
                                    </div>
                                    <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100/50">
                                            <div className="flex items-center gap-2">
                                                <ArrowDownCircle className="text-rose-500" size={20} />
                                                <h4 className="font-bold text-rose-900 text-sm">Deductions & Contributions</h4>
                                            </div>
                                            <button
                                                onClick={() => setShowDeductions(!showDeductions)}
                                                className={`p-1.5 rounded-lg transition-colors ${showDeductions ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                                                title={showDeductions ? "Hide deductions values" : "Show deductions values"}
                                            >
                                                {showDeductions ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {deductionComponents.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No deduction components defined.</p>}
                                            {deductionComponents.map(comp => renderComponentItem(comp, activeTemplate.components.includes(comp.id), showDeductions))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* INSTANCES TAB (Updated for Neutral Terminology) */}
                        {templateSubTab === 'instances' && (
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-700">Assigned Employees</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                                                {['All', 'Customized', 'Default'].map((f) => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setInstanceFilter(f as any)}
                                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${instanceFilter === f
                                                            ? 'bg-slate-800 text-white shadow-sm'
                                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="w-px h-4 bg-slate-300"></div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold">{instanceList.length}</span> Total
                                            </div>
                                        </div>
                                    </div>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4">Employee</th>
                                                <th className="px-6 py-4">Configuration Status</th>
                                                <th className="px-6 py-4 text-right">Net Adjustment</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {instanceList.map((inst, i) => (
                                                <tr key={inst.employee.id} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800">{inst.employee.firstName} {inst.employee.lastName}</div>
                                                        <div className="text-xs text-slate-500">{inst.employee.role}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {inst.isCustomized ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold shadow-sm">
                                                                <Sliders size={12} /> Customized
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                                                                <Check size={12} /> Default
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-slate-600 font-bold">
                                                        {inst.isCustomized ? (
                                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">+ ₱{inst.netDiff.toLocaleString()}</span>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setComparingEmployeeId(inst.employee.id)}
                                                            className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            View Comparison
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {instanceList.length === 0 && (
                                                <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">No employees found matching filter.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {mode === 'edit' && !activeTemplate && <div className="flex-1 flex flex-col items-center justify-center text-slate-400"><FileSpreadsheet size={64} className="mb-4 opacity-20" /><p className="text-lg font-bold text-slate-500">Select a template to configure</p><p className="text-xs font-medium mt-1">Or use the <span className="text-indigo-500">Simulator</span> to check overlaps.</p></div>}
            </div>
            <Modal isOpen={isCreating} onClose={() => { setIsCreating(false); resetForm(); }} className="max-w-xl">
                <div className="p-8">
                    <h3 className="text-xl font-bold mb-6 text-slate-900">{editingId ? 'Edit Pay Template' : 'Create Pay Template'}</h3>
                    <div className="space-y-5">
                        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Template Name</label><input className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 ring-amber-500 bg-slate-50 text-sm font-bold text-slate-900" placeholder="e.g. Sales Commission Package" value={newName} onChange={e => setNewName(e.target.value)} autoFocus /></div>
                        <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Target Scope</label><select className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 ring-amber-500 text-sm font-bold text-slate-700" value={targetType} onChange={e => { setTargetType(e.target.value as any); setFilterDeptId(''); setFilterRankId(''); setFilterSubRankId(''); setFinalTargetId(''); }}>
                            <option value="Global">All Employees</option>
                            <option value="Department">Specific Department</option>
                            <option value="Rank">Specific Rank</option>
                            <option value="Position">Specific Position (Recommended)</option>
                            <option value="Employee">Specific Employee</option>
                        </select></div>
                        {targetType === 'Department' && (<div className="animate-in fade-in slide-in-from-top-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Department</label><p className="text-[10px] text-slate-400 mb-1 font-medium italic">Includes all sub-units automatically.</p><select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900" value={finalTargetId} onChange={e => setFinalTargetId(e.target.value)}><option value="">-- Choose Dept --</option>{allUnits.map(u => (<option key={u.id} value={u.id}>{u.type}: {u.name}</option>))}</select></div>)}

                        {targetType === 'Rank' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Department (Optional Filter)</label>
                                    <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none" value={filterDeptId} onChange={e => setFilterDeptId(e.target.value)}>
                                        <option value="">-- All Departments --</option>
                                        {allUnits.filter(u => u.type === 'Department').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Rank</label>
                                    <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none" value={finalTargetId} onChange={e => { setFinalTargetId(e.target.value); setFilterRankId(e.target.value); }}>
                                        <option value="">-- Choose Rank --</option>
                                        {availableRanksInDept.length > 0 ? availableRanksInDept.map(r => <option key={r.id} value={r.id}>{r.name} (L{r.level})</option>) : ranks.map(r => <option key={r.id} value={r.id}>{r.name} (L{r.level})</option>)}
                                    </select>
                                </div>
                                {availableSubRanks && availableSubRanks.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Sub-Rank (Optional)</label>
                                        <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none" value={filterSubRankId} onChange={e => setFilterSubRankId(e.target.value)}>
                                            <option value="">-- All Sub-Ranks --</option>
                                            {availableSubRanks.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                        {targetType === 'Position' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Filter by Department</label>
                                    <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none" value={filterDeptId} onChange={e => setFilterDeptId(e.target.value)}>
                                        <option value="">-- Select Department First --</option>
                                        {allUnits.filter(u => u.type === 'Department').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Position</label>
                                    <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none disabled:opacity-50" value={finalTargetId} onChange={e => setFinalTargetId(e.target.value)} disabled={!filterDeptId}>
                                        <option value="">-- Choose Position --</option>
                                        {availablePositions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                        {targetType === 'Employee' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Employee</label>
                                <select className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 text-sm font-bold text-slate-900 outline-none" value={finalTargetId} onChange={e => setFinalTargetId(e.target.value)}>
                                    <option value="">-- Search Employee --</option>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Tax Settings */}
                        <div className="pt-2 border-t border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Tax Configuration</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isTaxExempt ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${isTaxExempt ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                                        {isTaxExempt && <Check size={12} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isTaxExempt} onChange={e => setIsTaxExempt(e.target.checked)} />
                                    <div>
                                        <span className={`text-sm font-bold block ${isTaxExempt ? 'text-emerald-900' : 'text-slate-700'}`}>Tax Exempt</span>
                                        <span className="text-[10px] text-slate-500">Exclude from tax calculation</span>
                                    </div>
                                </label>

                                <div className={`flex flex-col gap-2 p-3 border rounded-xl transition-all ${taxRate !== undefined && taxRate > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-bold ${taxRate !== undefined && taxRate > 0 ? 'text-amber-900' : 'text-slate-700'}`}>Custom Tax Rate</span>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className="w-16 p-1 border-b border-slate-300 text-right font-bold text-amber-700 bg-transparent outline-none focus:border-amber-500"
                                                value={taxRate || ''}
                                                onChange={e => setTaxRate(e.target.value === '' ? undefined : Number(e.target.value))}
                                                placeholder="0"
                                            />
                                            <span className="text-xs font-bold text-slate-400">%</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500">Apply a fixed percentage tax to this template</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button onClick={handleSaveTemplate} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">{editingId ? 'Save Changes' : 'Create Template'}</button>
                            <button onClick={() => { setIsCreating(false); resetForm(); }} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* INSTANCE COMPARISON MODAL - POLISHED NEUTRAL STYLE */}
            <Modal isOpen={!!comparingEmployeeId} onClose={() => setComparingEmployeeId(null)} className="max-w-4xl">
                <div className="w-full flex flex-col h-[80vh] md:h-auto md:max-h-[85vh] overflow-hidden bg-white">
                    {comparisonData && (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white z-10 shrink-0">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900">Instance Configuration</h3>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wide border border-indigo-100">Live</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                            <UserCog size={16} className="text-indigo-500" />
                                            <span className="text-slate-700 font-bold">{comparisonData.employee.firstName} {comparisonData.employee.lastName}</span>
                                        </div>
                                        <span className="text-slate-400 mx-1">vs</span>
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                            <FileSpreadsheet size={16} className="text-slate-400" />
                                            <span className="text-slate-600">{activeTemplate?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Template Standard</div>
                                        <div className="text-lg font-mono font-bold text-slate-700">₱{comparisonData.summary.defNet.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 relative z-10">Employee Actual</div>
                                        <div className="text-lg font-mono font-bold text-indigo-900 relative z-10">₱{comparisonData.summary.actNet.toLocaleString()}</div>
                                    </div>
                                    <div className={`p-4 rounded-xl border shadow-sm ${comparisonData.summary.diff > 0 ? 'bg-emerald-50 border-emerald-100' : comparisonData.summary.diff < 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${comparisonData.summary.diff > 0 ? 'text-emerald-600' : comparisonData.summary.diff < 0 ? 'text-rose-600' : 'text-slate-400'}`}>Net Difference</div>
                                        <div className={`text-lg font-mono font-bold flex items-center gap-1 ${comparisonData.summary.diff > 0 ? 'text-emerald-700' : comparisonData.summary.diff < 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                                            {comparisonData.summary.diff > 0 ? '+' : ''}{comparisonData.summary.diff !== 0 ? `₱${comparisonData.summary.diff.toLocaleString()}` : '--'}
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Table */}
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 z-10">
                                        <div>Component Name</div>
                                        <div className="text-right text-slate-400">Default Value</div>
                                        <div className="text-right text-indigo-600">Actual Value</div>
                                        <div className="text-right">Status</div>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {/* Earnings Group */}
                                        {comparisonData.rows.filter(r => r.type === 'earning').length > 0 && (
                                            <>
                                                <div className="px-5 py-2 bg-emerald-50/30 text-xs font-bold text-emerald-700 flex items-center gap-2 border-b border-emerald-50">
                                                    <ArrowUpCircle size={14} /> Earnings
                                                </div>
                                                {comparisonData.rows.filter(r => r.type === 'earning').map((row) => (
                                                    <ComparisonRow key={row.id} row={row} />
                                                ))}
                                            </>
                                        )}

                                        {/* Deductions Group */}
                                        {comparisonData.rows.filter(r => r.type === 'deduction').length > 0 && (
                                            <>
                                                <div className="px-5 py-2 bg-rose-50/30 text-xs font-bold text-rose-700 flex items-center gap-2 border-b border-rose-50 mt-1">
                                                    <ArrowDownCircle size={14} /> Deductions
                                                </div>
                                                {comparisonData.rows.filter(r => r.type === 'deduction').map((row) => (
                                                    <ComparisonRow key={row.id} row={row} />
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <AlertCircle size={14} />
                                    <span>Changes are applied immediately</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <RefreshCcw size={14} /> Reset to Default
                                    </button>
                                    <button
                                        onClick={() => setComparingEmployeeId(null)}
                                        className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default PayTemplates;
