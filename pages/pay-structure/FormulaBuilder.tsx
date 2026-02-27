
import React, { useState, useRef } from 'react';
import { Formula, LookupTable, LookupTableRow, VersionHistory } from '../../types';
import {
    Plus,
    Trash2,
    Calculator,
    Play,
    Save,
    X,
    Zap,
    Table2,
    Edit3,
    Coins,
    History,
    GitBranch,
    RotateCcw,
    Check,
    Building2,
    User,
    FileSpreadsheet,
    Upload
} from 'lucide-react';
import Modal from '../../components/Modal';

interface FormulaBuilderProps {
    formulas: Formula[];
    setFormulas: (f: Formula[]) => void;
    lookupTables: LookupTable[];
    setLookupTables: (t: LookupTable[]) => void;
}

const FormulaBuilder: React.FC<FormulaBuilderProps> = ({ formulas, setFormulas, lookupTables, setLookupTables }) => {
    // Mode: 'script' (Standard formulas) or 'tables' (Lookup tables)
    const [view, setView] = useState<'script' | 'tables'>('script');

    // --- Formula Script State ---
    const [isAddingFormula, setIsAddingFormula] = useState(false);
    const [formulaEditor, setFormulaEditor] = useState<Partial<Formula>>({ variables: ['base_pay'], currentVersion: '1.0.0', versions: [] });
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testInputs, setTestInputs] = useState<Record<string, number>>({ base_pay: 25000 });

    // History View State
    const [showHistory, setShowHistory] = useState(false);

    // Version Save State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveType, setSaveType] = useState<'formula' | 'table'>('formula');
    const [versionInput, setVersionInput] = useState('');

    // --- Table Editor State ---
    const [isAddingTable, setIsAddingTable] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tableEditor, setTableEditor] = useState<Partial<LookupTable>>({
        rows: [],
        type: 'standard',
        currentVersion: '1.0.0',
        versions: []
    });
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const SYSTEM_VARS = ['base_pay'];
    const SYSTEM_VAR_INFO: Record<string, string> = {
        base_pay: "Employee's Monthly Basic Salary"
    };

    // --- FORMULA ACTIONS ---

    const handleStartAddFormula = () => {
        setFormulaEditor({ name: '', expression: '', description: '', variables: ['base_pay'], currentVersion: '1.0.0', versions: [] });
        setIsAddingFormula(true);
        setShowHistory(false);
        setTestResult(null);
        setTestInputs({ base_pay: 25000 });
    };

    const extractVariables = (expr: string) => {
        const potentialVars = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
        const unique = Array.from(new Set(potentialVars));
        return unique.filter(v => !SYSTEM_VARS.includes(v) && v !== 'LOOKUP');
    };

    const handleExpressionChange = (val: string) => {
        const customVars = extractVariables(val);
        const mergedVars = [...SYSTEM_VARS, ...customVars];
        setFormulaEditor({ ...formulaEditor, expression: val, variables: mergedVars });

        const newTestInputs = { ...testInputs };
        mergedVars.forEach(v => {
            if (newTestInputs[v] === undefined) newTestInputs[v] = 0;
        });
        setTestInputs(newTestInputs);
    };

    const insertText = (text: string) => {
        const currentExp = formulaEditor.expression || '';
        const newExp = currentExp + (currentExp.length > 0 && !currentExp.endsWith(' ') ? ' ' : '') + text + ' ';
        handleExpressionChange(newExp);
    };

    // --- LOOKUP FUNCTION LOGIC ---
    const executeLookup = (tableId: string, value: number) => {
        const table = lookupTables.find(t => t.id === tableId);
        if (!table) return 0;
        const rows = [...table.rows].sort((a, b) => a.min - b.min);
        for (const row of rows) {
            if (value >= row.min && (row.max === null || value <= row.max)) {
                // If Contribution type, return Employee Share by default for formula calls
                // (In a real engine, we might expose separate functions like LOOKUP_EE and LOOKUP_ER)
                if (table.type === 'contribution') {
                    return row.employeeShare || 0;
                }
                const excess = Math.max(0, value - row.min);
                return row.baseAmount + (excess * row.rate);
            }
        }
        return 0;
    };

    const runTest = () => {
        try {
            if (!formulaEditor.expression) return;
            const vars = Object.keys(testInputs);
            const values = Object.values(testInputs);
            if (formulaEditor.expression.includes('window') || formulaEditor.expression.includes('document') || formulaEditor.expression.includes('eval')) throw new Error("Unsafe expression");
            const funcBody = `return ${formulaEditor.expression};`;
            const lookup = (tableId: string, val: number) => executeLookup(tableId, val);
            const func = new Function('LOOKUP', ...vars, funcBody);
            const result = func(lookup, ...values);
            if (isNaN(result) && typeof result !== 'string') throw new Error("Result is NaN");
            setTestResult(typeof result === 'number' ? result.toFixed(2) : result.toString());
        } catch (err) {
            console.error(err);
            setTestResult("Error: Invalid Syntax");
        }
    };

    // --- VERSION SAVING ---
    const initiateSave = (type: 'formula' | 'table') => {
        setSaveType(type);
        if (type === 'formula') {
            if (!formulaEditor.name || !formulaEditor.expression) return;
            const nextVer = formulaEditor.id ? 'v' + (parseInt(formulaEditor.currentVersion?.split('.')[0] || '1') + 1) + '.0.0' : 'v1.0.0';
            setVersionInput(nextVer);
        } else {
            if (!tableEditor.name) return;
            const nextVer = tableEditor.id ? 'v' + (parseInt(tableEditor.currentVersion?.split('.')[0] || '1') + 1) + '.0.0' : 'v1.0.0';
            setVersionInput(nextVer);
        }
        setIsSaveModalOpen(true);
    };

    const confirmVersionSave = () => {
        if (!versionInput) return;

        if (saveType === 'formula') {
            let updatedVersions = formulaEditor.versions || [];
            if (formulaEditor.id) {
                const newHistoryItem: VersionHistory = {
                    version: versionInput,
                    date: new Date().toLocaleString(),
                    author: 'Current User',
                    dataSnapshot: { ...formulaEditor }
                };
                updatedVersions = [newHistoryItem, ...updatedVersions];
            } else {
                updatedVersions = [{
                    version: versionInput,
                    date: new Date().toLocaleString(),
                    author: 'Current User',
                    dataSnapshot: { ...formulaEditor }
                }];
            }

            const newFormula: Formula = {
                id: formulaEditor.id || Math.random().toString(36).substr(2, 9),
                name: formulaEditor.name!,
                description: formulaEditor.description || '',
                expression: formulaEditor.expression!,
                variables: formulaEditor.variables || [],
                currentVersion: versionInput,
                versions: updatedVersions
            };

            if (formulaEditor.id) {
                setFormulas(formulas.map(f => f.id === formulaEditor.id ? newFormula : f));
            } else {
                setFormulas([...formulas, newFormula]);
            }
            setIsAddingFormula(false);

        } else {
            // TABLE SAVE LOGIC
            let updatedVersions = tableEditor.versions || [];
            if (tableEditor.id) {
                const newHistoryItem: VersionHistory = {
                    version: versionInput,
                    date: new Date().toLocaleString(),
                    author: 'Current User',
                    dataSnapshot: { ...tableEditor }
                };
                updatedVersions = [newHistoryItem, ...updatedVersions];
            } else {
                updatedVersions = [{
                    version: versionInput,
                    date: new Date().toLocaleString(),
                    author: 'Current User',
                    dataSnapshot: { ...tableEditor }
                }];
            }

            const newTable: LookupTable = {
                id: tableEditor.id || Math.random().toString(36).substr(2, 9),
                name: tableEditor.name!,
                description: tableEditor.description || '',
                type: tableEditor.type || 'standard',
                rows: tableEditor.rows || [],
                currentVersion: versionInput,
                versions: updatedVersions
            };

            if (tableEditor.id) {
                setLookupTables(lookupTables.map(t => t.id === tableEditor.id ? newTable : t));
            } else {
                setLookupTables([...lookupTables, newTable]);
            }
            setIsAddingTable(false);
        }

        setIsSaveModalOpen(false);
    };

    const handleRestoreVersion = (historyItem: VersionHistory, type: 'formula' | 'table') => {
        if (confirm(`Revert editor to version ${historyItem.version}?`)) {
            if (type === 'formula') {
                setFormulaEditor({
                    ...formulaEditor,
                    ...historyItem.dataSnapshot,
                    id: formulaEditor.id, // Keep ID
                    versions: formulaEditor.versions // Keep history
                });
            } else {
                setTableEditor({
                    ...tableEditor,
                    ...historyItem.dataSnapshot,
                    id: tableEditor.id, // Keep ID
                    versions: tableEditor.versions // Keep history
                });
            }
            setShowHistory(false);
        }
    };

    const handleEditFormula = (f: Formula) => {
        setFormulaEditor(f);
        const inputs: Record<string, number> = {};
        const vars = f.variables || ['base_pay'];
        vars.forEach(v => inputs[v] = (v === 'base_pay' ? 25000 : 0));
        setTestInputs(inputs);
        setTestResult(null);
        setIsAddingFormula(true);
        setShowHistory(false);
        setView('script');
    };

    const handleDeleteFormula = (id: string) => {
        if (confirm("Delete this formula?")) {
            setFormulas(formulas.filter(f => f.id !== id));
        }
    };


    // --- TABLE ACTIONS ---

    const handleStartAddTable = () => {
        setTableEditor({ name: '', description: '', type: 'standard', rows: [], currentVersion: '1.0.0', versions: [] });
        setIsAddingTable(true);
        setSelectedTableId(null);
        setShowHistory(false);
    };

    const handleEditTable = (t: LookupTable) => {
        setTableEditor(JSON.parse(JSON.stringify(t))); // Deep copy
        setSelectedTableId(t.id);
        setIsAddingTable(true);
        setShowHistory(false);
    };

    const handleDeleteTable = (id: string) => {
        if (confirm("Delete this lookup table?")) {
            setLookupTables(lookupTables.filter(t => t.id !== id));
            if (selectedTableId === id) {
                setSelectedTableId(null);
                setIsAddingTable(false);
            }
        }
    };

    const addTableRow = () => {
        const rows = tableEditor.rows || [];
        const lastRow = rows[rows.length - 1];
        const newMin = lastRow ? (lastRow.max ? lastRow.max + 0.01 : 0) : 0;

        const newRow: LookupTableRow = {
            id: Math.random().toString(36).substr(2, 9),
            min: newMin,
            max: null,
            baseAmount: 0,
            rate: 0,
            employeeShare: 0,
            employerShare: 0
        };
        setTableEditor({ ...tableEditor, rows: [...rows, newRow] });
    };

    const updateTableRow = (index: number, field: keyof LookupTableRow, value: any) => {
        const rows = [...(tableEditor.rows || [])];
        rows[index] = { ...rows[index], [field]: value };
        setTableEditor({ ...tableEditor, rows });
    };

    const removeTableRow = (index: number) => {
        const rows = [...(tableEditor.rows || [])];
        rows.splice(index, 1);
        setTableEditor({ ...tableEditor, rows });
    };

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) return;

            const lines = text.split('\n');
            const newRows: LookupTableRow[] = [];

            // Skip header if it exists (check if first line contains non-numeric characters)
            let startIndex = 0;
            if (lines.length > 0 && isNaN(Number(lines[0].split(',')[0]))) {
                startIndex = 1;
            }

            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const cols = line.split(',');
                if (cols.length < 4) continue;

                newRows.push({
                    id: Math.random().toString(36).substr(2, 9),
                    min: parseFloat(cols[0]) || 0,
                    max: cols[1].toLowerCase() === 'null' || !cols[1] ? null : parseFloat(cols[1]),
                    baseAmount: parseFloat(cols[2]) || 0,
                    rate: parseFloat(cols[3]) || 0,
                    employeeShare: cols[4] ? parseFloat(cols[4]) : 0,
                    employerShare: cols[5] ? parseFloat(cols[5]) : 0
                });
            }

            if (newRows.length > 0) {
                setTableEditor(prev => ({ ...prev, rows: [...(prev.rows || []), ...newRows] }));
            }

            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };


    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[700px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="text-amber-500" size={20} /> Formula & Table Engine
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Manage logic for calculations and graduated tax tables.</p>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl">
                    <button
                        onClick={() => { setView('script'); setIsAddingFormula(false); setIsAddingTable(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'script' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calculator size={14} /> Scripts
                    </button>
                    <button
                        onClick={() => { setView('tables'); setIsAddingFormula(false); setIsAddingTable(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'tables' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Table2 size={14} /> Lookup Tables
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">

                {/* --- VIEW: SCRIPT --- */}
                {view === 'script' && (
                    <>
                        {/* List Sidebar */}
                        <div className={`w-1/3 border-r border-slate-100 overflow-y-auto bg-slate-50/30 ${isAddingFormula ? 'hidden md:block' : 'w-full md:w-1/3'}`}>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 sticky top-0 backdrop-blur-sm z-10">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Existing Scripts</h3>
                                <button onClick={handleStartAddFormula} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors"><Plus size={18} /></button>
                            </div>
                            {formulas.length === 0 && (
                                <div className="p-10 text-center text-slate-400">
                                    <Calculator size={32} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No formulas defined.</p>
                                </div>
                            )}
                            <div className="divide-y divide-slate-100">
                                {formulas.map(f => (
                                    <div
                                        key={f.id}
                                        onClick={() => handleEditFormula(f)}
                                        className={`p-5 hover:bg-white cursor-pointer transition-all border-l-4 ${formulaEditor.id === f.id && isAddingFormula ? 'bg-white border-indigo-500 shadow-sm' : 'border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-sm">{f.name}</h4>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteFormula(f.id); }} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 font-bold"><GitBranch size={10} /> {f.currentVersion || 'v1.0.0'}</span>
                                            <p className="text-xs text-slate-500 line-clamp-1">{f.description}</p>
                                        </div>
                                        <code className="block bg-slate-100 p-2 rounded-lg text-[10px] font-mono text-slate-600 truncate border border-slate-200">
                                            {f.expression}
                                        </code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Editor Area */}
                        {isAddingFormula && (
                            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-white">

                                <div className="flex-1 flex flex-col overflow-hidden relative">
                                    {/* Editor Header */}
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <Edit3 size={20} className="text-indigo-600" />
                                            <h3 className="font-bold text-slate-800 text-lg">Script Editor</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {formulaEditor.id && (
                                                <button
                                                    onClick={() => setShowHistory(!showHistory)}
                                                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${showHistory ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                                >
                                                    <History size={16} /> History
                                                </button>
                                            )}
                                            <button onClick={() => setIsAddingFormula(false)} className="md:hidden text-slate-500"><X /></button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8 relative">
                                        {/* History Overlay */}
                                        {showHistory && (
                                            <div className="absolute top-0 right-0 bottom-0 w-72 bg-white border-l border-slate-200 shadow-2xl z-20 overflow-y-auto animate-in slide-in-from-right duration-300">
                                                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Version Log</h4>
                                                    <button onClick={() => setShowHistory(false)}><X size={14} className="text-slate-400" /></button>
                                                </div>
                                                <div className="p-2 space-y-2">
                                                    {!formulaEditor.versions || formulaEditor.versions.length === 0 ? (
                                                        <p className="text-center text-slate-400 text-xs py-8 italic">No history available.</p>
                                                    ) : (
                                                        formulaEditor.versions.map((v, i) => (
                                                            <div key={i} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span className="font-bold text-sm text-slate-700">{v.version}</span>
                                                                    <button onClick={() => handleRestoreVersion(v, 'formula')} className="opacity-0 group-hover:opacity-100 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold hover:bg-indigo-200 transition-all">Restore</button>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400">{v.date}</div>
                                                                <div className="text-[10px] text-slate-400">By {v.author}</div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Formula Name</label>
                                                    <input
                                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all placeholder:font-medium"
                                                        placeholder="e.g. Overtime Calculation"
                                                        value={formulaEditor.name}
                                                        onChange={e => setFormulaEditor({ ...formulaEditor, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                                    <input
                                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900 transition-all"
                                                        placeholder="Brief description..."
                                                        value={formulaEditor.description}
                                                        onChange={e => setFormulaEditor({ ...formulaEditor, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Expression Logic</label>
                                                <div className="relative">
                                                    <textarea
                                                        className="w-full h-60 border border-slate-200 p-4 rounded-xl font-mono text-sm bg-slate-900 text-indigo-300 focus:ring-2 ring-indigo-500 outline-none resize-none leading-relaxed"
                                                        placeholder="e.g. (base_pay / 21.75) * 1.25"
                                                        value={formulaEditor.expression}
                                                        onChange={e => handleExpressionChange(e.target.value)}
                                                    />
                                                </div>

                                                <div className="mt-3 flex flex-col gap-3">
                                                    <div className="flex gap-2 flex-wrap items-center">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Variables:</span>
                                                        {SYSTEM_VARS.map(v => (
                                                            <button key={v} onClick={() => insertText(v)} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs hover:bg-indigo-100 transition-colors font-mono font-bold flex items-center gap-1" title={SYSTEM_VAR_INFO[v]}>
                                                                <Coins size={12} /> {v}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap items-center">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Tables:</span>
                                                        {lookupTables.map(t => (
                                                            <button
                                                                key={t.id}
                                                                onClick={() => insertText(`LOOKUP('${t.id}', base_pay)`)}
                                                                className="bg-blue-50 border border-blue-100 text-blue-700 px-2 py-1 rounded-lg text-[10px] hover:bg-blue-100 transition-colors font-mono font-bold flex items-center gap-1"
                                                                title={t.description}
                                                            >
                                                                <Table2 size={12} /> {t.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
                                        <button onClick={() => initiateSave('formula')} disabled={!formulaEditor.name || !formulaEditor.expression} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 text-sm font-bold shadow-lg shadow-slate-200 transition-all w-full justify-center">
                                            <Save size={18} /> Save Formula
                                        </button>
                                    </div>
                                </div>

                                {/* Test Bench */}
                                <div className="w-full md:w-80 bg-slate-50 border-l border-slate-200 p-8 flex flex-col shrink-0">
                                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        <Zap size={16} className="text-amber-500" /> Test Console
                                    </h3>

                                    <div className="flex-1 space-y-4 overflow-y-auto">
                                        {/* System Vars Section */}
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Input Variables</h4>
                                            {SYSTEM_VARS.map(v => (
                                                <div key={v} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 ring-indigo-100 transition-all">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-mono font-bold text-slate-600">{v}</label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="w-full text-right font-mono text-sm font-bold text-slate-900 outline-none bg-transparent placeholder-slate-300"
                                                        placeholder="0.00"
                                                        value={testInputs[v] || ''}
                                                        onChange={e => setTestInputs({ ...testInputs, [v]: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-200">
                                        <button onClick={runTest} className="w-full mb-4 flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 text-sm font-bold shadow-md shadow-indigo-200 active:scale-95 transition-all">
                                            <Play size={16} fill="currentColor" /> Run Simulation
                                        </button>

                                        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Calculated Result</label>
                                            <div className={`font-mono font-bold text-2xl ${testResult?.startsWith('Error') ? 'text-rose-500 text-base' : 'text-emerald-600'}`}>
                                                {testResult !== null ? testResult : '--'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                    </>
                )}

                {/* --- VIEW: TABLES --- */}
                {view === 'tables' && (
                    <>
                        {/* Table List Sidebar */}
                        <div className={`w-1/3 border-r border-slate-100 overflow-y-auto bg-slate-50/30 ${isAddingTable ? 'hidden md:block' : 'w-full md:w-1/3'}`}>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 sticky top-0 backdrop-blur-sm z-10">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lookup Tables</h3>
                                <button onClick={handleStartAddTable} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Plus size={18} /></button>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {lookupTables.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => handleEditTable(t)}
                                        className={`p-5 hover:bg-white cursor-pointer transition-all border-l-4 ${selectedTableId === t.id ? 'bg-white border-blue-500 shadow-sm' : 'border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteTable(t.id); }} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1 font-bold"><GitBranch size={10} /> {t.currentVersion || 'v1.0.0'}</span>
                                            <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200">{t.rows.length} Tiers</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.type === 'contribution' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                {t.type === 'contribution' ? 'SSS/PhilHealth' : 'Standard'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table Editor */}
                        {isAddingTable && (
                            <div className="flex-1 flex flex-col h-full bg-white relative">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center z-10 bg-white">
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                            <Table2 size={20} className="text-blue-600" /> Table Configuration
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Logic: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">Base + ((Value - Min) * Rate)</span> or Contribution Tier</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {tableEditor.id && (
                                            <button
                                                onClick={() => setShowHistory(!showHistory)}
                                                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${showHistory ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                            >
                                                <History size={16} /> History
                                            </button>
                                        )}
                                        <button onClick={() => setIsAddingTable(false)} className="md:hidden text-slate-500"><X /></button>
                                    </div>
                                </div>

                                <div className="p-8 overflow-y-auto flex-1 relative">
                                    {/* History Overlay for Table */}
                                    {showHistory && (
                                        <div className="absolute top-0 right-0 bottom-0 w-72 bg-white border-l border-slate-200 shadow-2xl z-20 overflow-y-auto animate-in slide-in-from-right duration-300">
                                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Version Log</h4>
                                                <button onClick={() => setShowHistory(false)}><X size={14} className="text-slate-400" /></button>
                                            </div>
                                            <div className="p-2 space-y-2">
                                                {!tableEditor.versions || tableEditor.versions.length === 0 ? (
                                                    <p className="text-center text-slate-400 text-xs py-8 italic">No history available.</p>
                                                ) : (
                                                    tableEditor.versions.map((v, i) => (
                                                        <div key={i} className="p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-bold text-sm text-slate-700">{v.version}</span>
                                                                <button onClick={() => handleRestoreVersion(v, 'table')} className="opacity-0 group-hover:opacity-100 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold hover:bg-blue-200 transition-all">Restore</button>
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">{v.date}</div>
                                                            <div className="text-[10px] text-slate-400">By {v.author}</div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Table Name</label>
                                            <input
                                                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-bold focus:ring-2 ring-blue-100 focus:border-blue-500 outline-none text-slate-900 placeholder:text-slate-400 transition-all"
                                                value={tableEditor.name}
                                                onChange={e => setTableEditor({ ...tableEditor, name: e.target.value })}
                                                placeholder="e.g. PH Tax 2024"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                            <input
                                                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 ring-blue-100 focus:border-blue-500 outline-none text-slate-900 placeholder:text-slate-400 transition-all"
                                                value={tableEditor.description}
                                                onChange={e => setTableEditor({ ...tableEditor, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Table Type Selector */}
                                    <div className="mb-6">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Table Structure Type</label>
                                        <div className="flex gap-4">
                                            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer w-full transition-all ${tableEditor.type === 'standard' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                    checked={tableEditor.type !== 'contribution'}
                                                    onChange={() => setTableEditor({ ...tableEditor, type: 'standard' })}
                                                />
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2"><Calculator size={14} className="text-blue-500" /> Standard Calculation</div>
                                                    <div className="text-[10px] text-slate-500">Base Amount + (Excess * Rate)</div>
                                                </div>
                                            </label>
                                            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer w-full transition-all ${tableEditor.type === 'contribution' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                    checked={tableEditor.type === 'contribution'}
                                                    onChange={() => setTableEditor({ ...tableEditor, type: 'contribution' })}
                                                />
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 flex items-center gap-2"><Building2 size={14} className="text-indigo-500" /> Contribution Table</div>
                                                    <div className="text-[10px] text-slate-500">Employer / Employee Share (SSS, PhilHealth)</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Rows Editor */}
                                    <div className="flex items-center justify-between mb-3 px-2">
                                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Tiers</h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleCSVUpload}
                                                accept=".csv"
                                                className="hidden"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                                title="Upload CSV Template"
                                            >
                                                <Upload size={12} /> Upload Template (CSV)
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 w-12 text-center">#</th>
                                                    <th className="px-4 py-4">Min Salary</th>
                                                    <th className="px-4 py-4">Max Salary</th>
                                                    {tableEditor.type === 'contribution' ? (
                                                        <>
                                                            <th className="px-4 py-4">Employee Share</th>
                                                            <th className="px-4 py-4">Employer Share</th>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <th className="px-4 py-4">Base Amount</th>
                                                            <th className="px-4 py-4">Excess Rate (%)</th>
                                                        </>
                                                    )}
                                                    <th className="px-4 py-4 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 bg-white">
                                                {tableEditor.rows?.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-2 text-slate-300 text-xs font-bold text-center">{idx + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <input
                                                                type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white font-mono text-slate-900 font-bold text-xs"
                                                                value={row.min}
                                                                onChange={e => updateTableRow(idx, 'min', parseFloat(e.target.value))}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white font-mono text-slate-900 font-bold text-xs"
                                                                    value={row.max ?? ''}
                                                                    placeholder="∞"
                                                                    onChange={e => updateTableRow(idx, 'max', e.target.value ? parseFloat(e.target.value) : null)}
                                                                />
                                                            </div>
                                                        </td>

                                                        {tableEditor.type === 'contribution' ? (
                                                            <>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-slate-400"><User size={10} /></span>
                                                                        <input
                                                                            type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white font-mono text-indigo-600 font-bold text-xs"
                                                                            value={row.employeeShare || 0}
                                                                            onChange={e => updateTableRow(idx, 'employeeShare', parseFloat(e.target.value))}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] text-slate-400"><Building2 size={10} /></span>
                                                                        <input
                                                                            type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white font-mono text-slate-600 font-bold text-xs"
                                                                            value={row.employerShare || 0}
                                                                            onChange={e => updateTableRow(idx, 'employerShare', parseFloat(e.target.value))}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white font-mono text-blue-600 font-bold text-xs"
                                                                        value={row.baseAmount}
                                                                        onChange={e => updateTableRow(idx, 'baseAmount', parseFloat(e.target.value))}
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="number" className="w-24 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white font-mono text-amber-600 font-bold text-xs"
                                                                            value={row.rate}
                                                                            onChange={e => updateTableRow(idx, 'rate', parseFloat(e.target.value))}
                                                                            step="0.01"
                                                                        />
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">excess</span>
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}

                                                        <td className="px-4 py-3 text-right">
                                                            <button onClick={() => removeTableRow(idx)} className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {(!tableEditor.rows || tableEditor.rows.length === 0) && (
                                                    <tr><td colSpan={tableEditor.type === 'contribution' ? 6 : 6} className="px-4 py-12 text-center text-slate-400 italic text-sm">No tiers defined. Add a row to start.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <button onClick={addTableRow} className="w-full py-3 bg-slate-50 text-blue-600 font-bold text-xs hover:bg-slate-100 border-t border-slate-100 transition-colors flex items-center justify-center gap-2">
                                            <Plus size={14} /> Add Tier Row
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-slate-100 bg-white z-10">
                                    <button onClick={() => initiateSave('table')} disabled={!tableEditor.name} className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                                        <Save size={18} /> Save Table Configuration
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Version Save Modal */}
            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Save size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Commit {saveType === 'formula' ? 'Formula' : 'Table'} Version</h3>
                    <p className="text-sm text-slate-500 mb-6">You are about to save changes to this {saveType}. Please assign a version identifier for tracking.</p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left mb-6">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Version Name / Number</label>
                        <input
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white text-sm font-bold text-slate-900"
                            value={versionInput}
                            onChange={(e) => setVersionInput(e.target.value)}
                            placeholder={saveType === 'formula' ? "e.g. v1.1.0 - Updated Tax Logic" : "e.g. v1.2.0 - 2025 Revised Rates"}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setIsSaveModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">Back</button>
                        <button onClick={confirmVersionSave} disabled={!versionInput} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50">Confirm & Save</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FormulaBuilder;
