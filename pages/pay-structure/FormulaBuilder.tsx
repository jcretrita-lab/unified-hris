
import React, { useState } from 'react';
import { Formula, VersionHistory } from '../../types';
import {
    Zap,
    Calculator,
    Save,
} from 'lucide-react';
import Modal from '../../components/Modal';

// Sub-tab components
import ScriptsTab from './ScriptsTab';

interface FormulaBuilderProps {
    formulas: Formula[];
    setFormulas: (f: Formula[]) => void;
    lookupTables: any[]; // Kept for formula testing compatibility if needed
}

const FormulaBuilder: React.FC<FormulaBuilderProps> = ({ formulas, setFormulas, lookupTables }) => {
    // --- Formula Script State ---
    const [isAddingFormula, setIsAddingFormula] = useState(false);
    const [formulaEditor, setFormulaEditor] = useState<Partial<Formula>>({ variables: ['base_pay'], currentVersion: '1.0.0', versions: [] });
    const [testResult, setTestResult] = useState<string | null>(null);
    const [testInputs, setTestInputs] = useState<Record<string, number>>({ base_pay: 25000 });

    // History View State
    const [showHistory, setShowHistory] = useState(false);

    // Version Save State
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [versionInput, setVersionInput] = useState('');

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
    const initiateSave = () => {
        if (!formulaEditor.name || !formulaEditor.expression) return;
        const nextVer = formulaEditor.id ? 'v' + (parseInt(formulaEditor.currentVersion?.split('.')[0] || '1') + 1) + '.0.0' : 'v1.0.0';
        setVersionInput(nextVer);
        setIsSaveModalOpen(true);
    };

    const confirmVersionSave = () => {
        if (!versionInput) return;

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
        setIsSaveModalOpen(false);
    };

    const handleRestoreVersion = (historyItem: VersionHistory) => {
        if (confirm(`Revert editor to version ${historyItem.version}?`)) {
            setFormulaEditor({
                ...formulaEditor,
                ...historyItem.dataSnapshot,
                id: formulaEditor.id,
                versions: formulaEditor.versions
            });
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
    };

    const handleDeleteFormula = (id: string) => {
        if (confirm("Delete this formula?")) {
            setFormulas(formulas.filter(f => f.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[700px] overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-white flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Zap className="text-amber-500" size={20} /> Formula Engine
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Configure logic for earnings and automated pay components.</p>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <ScriptsTab
                    formulas={formulas}
                    lookupTables={lookupTables}
                    isAddingFormula={isAddingFormula}
                    setIsAddingFormula={setIsAddingFormula}
                    formulaEditor={formulaEditor}
                    setFormulaEditor={setFormulaEditor}
                    testResult={testResult}
                    setTestResult={setTestResult}
                    testInputs={testInputs}
                    setTestInputs={setTestInputs}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                    handleStartAddFormula={handleStartAddFormula}
                    handleEditFormula={handleEditFormula}
                    handleDeleteFormula={handleDeleteFormula}
                    handleExpressionChange={handleExpressionChange}
                    insertText={insertText}
                    runTest={runTest}
                    initiateSave={initiateSave}
                    handleRestoreVersion={handleRestoreVersion}
                    SYSTEM_VARS={SYSTEM_VARS}
                    SYSTEM_VAR_INFO={SYSTEM_VAR_INFO}
                />
            </div>

            {/* Version Save Modal */}
            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Save size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Commit Formula Version</h3>
                    <p className="text-sm text-slate-500 mb-6">You are about to save changes to this formula. Please assign a version identifier for tracking.</p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left mb-6">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Version Name / Number</label>
                        <input
                            className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white text-sm font-bold text-slate-900"
                            value={versionInput}
                            onChange={(e) => setVersionInput(e.target.value)}
                            placeholder="e.g. v1.1.0 - Updated Earnings Logic"
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
