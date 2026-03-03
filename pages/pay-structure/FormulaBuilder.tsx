
import React, { useState, useRef } from 'react';
import { Formula, LookupTable, LookupTableRow, VersionHistory } from '../../types';
import {
    Zap,
    Calculator,
    Table2,
    CreditCard,
    Save,
} from 'lucide-react';
import Modal from '../../components/Modal';

// Sub-tab components
import ScriptsTab from './ScriptsTab';
import LookupTablesTab from './LookupTablesTab';
import InstallmentsTab from './InstallmentsTab';

interface FormulaBuilderProps {
    formulas: Formula[];
    setFormulas: (f: Formula[]) => void;
    lookupTables: LookupTable[];
    setLookupTables: (t: LookupTable[]) => void;
}

const FormulaBuilder: React.FC<FormulaBuilderProps> = ({ formulas, setFormulas, lookupTables, setLookupTables }) => {
    // Mode: 'script' (Standard formulas), 'tables' (Lookup tables), or 'installments' (Product plans)
    const [view, setView] = useState<'script' | 'tables' | 'installments'>('script');

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

    // --- Installments State ---
    const [installmentProducts, setInstallmentProducts] = useState<any[]>([
        {
            id: 'p1',
            name: 'Lenovo ThinkPad X1 Carbon',
            category: 'Equipment',
            totalPrice: 24000,
            payPeriod: 'Monthly',
            description: 'Employee workstation laptop purchase program.',
            options: [
                { months: 3, interestEnabled: false, interestRate: 0, monthlyPayment: 8000 },
                { months: 6, interestEnabled: false, interestRate: 0, monthlyPayment: 4000 },
                { months: 12, interestEnabled: true, interestRate: 5, monthlyPayment: 2100 }
            ]
        },
        {
            id: 'p2',
            name: 'MaxiCare Platinum HMO',
            category: 'HMO',
            totalPrice: 18000,
            payPeriod: 'Semi-monthly',
            description: 'Executive health coverage annual premium.',
            options: [
                { months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 18000 },
                { months: 6, interestEnabled: false, interestRate: 0, monthlyPayment: 3000 },
                { months: 12, interestEnabled: false, interestRate: 0, monthlyPayment: 1500 }
            ]
        }
    ]);
    const [isAddingInstallment, setIsAddingInstallment] = useState(false);
    const [productEditor, setProductEditor] = useState<any>({
        name: '',
        category: 'Equipment',
        totalPrice: 0,
        payPeriod: 'Monthly',
        description: '',
        options: [{ months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 0 }]
    });

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
                    id: formulaEditor.id,
                    versions: formulaEditor.versions
                });
            } else {
                setTableEditor({
                    ...tableEditor,
                    ...historyItem.dataSnapshot,
                    id: tableEditor.id,
                    versions: tableEditor.versions
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
                    <button
                        onClick={() => { setView('installments'); setIsAddingFormula(false); setIsAddingTable(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'installments' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <CreditCard size={14} /> Installments
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">

                {/* --- VIEW: SCRIPT --- */}
                {view === 'script' && (
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
                )}

                {/* --- VIEW: TABLES --- */}
                {view === 'tables' && (
                    <LookupTablesTab
                        lookupTables={lookupTables}
                        isAddingTable={isAddingTable}
                        setIsAddingTable={setIsAddingTable}
                        tableEditor={tableEditor}
                        setTableEditor={setTableEditor}
                        selectedTableId={selectedTableId}
                        showHistory={showHistory}
                        setShowHistory={setShowHistory}
                        handleStartAddTable={handleStartAddTable}
                        handleEditTable={handleEditTable}
                        handleDeleteTable={handleDeleteTable}
                        addTableRow={addTableRow}
                        updateTableRow={updateTableRow}
                        removeTableRow={removeTableRow}
                        handleCSVUpload={handleCSVUpload}
                        initiateSave={initiateSave}
                        handleRestoreVersion={handleRestoreVersion}
                        fileInputRef={fileInputRef}
                    />
                )}

                {/* --- VIEW: INSTALLMENTS --- */}
                {view === 'installments' && (
                    <InstallmentsTab
                        installmentProducts={installmentProducts}
                        setInstallmentProducts={setInstallmentProducts}
                        isAddingInstallment={isAddingInstallment}
                        setIsAddingInstallment={setIsAddingInstallment}
                        productEditor={productEditor}
                        setProductEditor={setProductEditor}
                    />
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
