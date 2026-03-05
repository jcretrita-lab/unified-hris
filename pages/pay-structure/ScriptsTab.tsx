
import React from 'react';
import { Formula, LookupTable, VersionHistory } from '../../types';
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
} from 'lucide-react';

export interface ScriptsTabProps {
    formulas: Formula[];
    lookupTables: LookupTable[];
    isAddingFormula: boolean;
    setIsAddingFormula: (v: boolean) => void;
    formulaEditor: Partial<Formula>;
    setFormulaEditor: (v: Partial<Formula>) => void;
    testResult: string | null;
    setTestResult: (v: string | null) => void;
    testInputs: Record<string, number>;
    setTestInputs: (v: Record<string, number>) => void;
    showHistory: boolean;
    setShowHistory: (v: boolean) => void;
    handleStartAddFormula: () => void;
    handleEditFormula: (f: Formula) => void;
    handleDeleteFormula: (id: string) => void;
    handleExpressionChange: (val: string) => void;
    insertText: (text: string) => void;
    runTest: () => void;
    initiateSave: (type: 'formula' | 'table') => void;
    handleRestoreVersion: (historyItem: VersionHistory, type: 'formula' | 'table') => void;
    SYSTEM_VARS: string[];
    SYSTEM_VAR_INFO: Record<string, string>;
}

const ScriptsTab: React.FC<ScriptsTabProps> = ({
    formulas,
    lookupTables,
    isAddingFormula,
    setIsAddingFormula,
    formulaEditor,
    setFormulaEditor,
    testResult,
    testInputs,
    setTestInputs,
    showHistory,
    setShowHistory,
    handleStartAddFormula,
    handleEditFormula,
    handleDeleteFormula,
    handleExpressionChange,
    insertText,
    runTest,
    initiateSave,
    handleRestoreVersion,
    SYSTEM_VARS,
    SYSTEM_VAR_INFO,
}) => {
    return (
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
    );
};

export default ScriptsTab;
