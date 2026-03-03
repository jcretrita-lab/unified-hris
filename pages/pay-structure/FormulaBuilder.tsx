
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
    Upload,
    Download,
    Search,
    FileText,
    ChevronRight,
    Image as ImageIcon,
    ShoppingBag,
    CreditCard,
    Package,
    Clock,
    Percent
} from 'lucide-react';
import Modal from '../../components/Modal';

interface FormulaBuilderProps {
    formulas: Formula[];
    setFormulas: (f: Formula[]) => void;
    lookupTables: LookupTable[];
    setLookupTables: (t: LookupTable[]) => void;
}

const MOCK_FORMULA_TEMPLATES = [
    {
        id: 'sss',
        name: 'SSS Contribution Table (2024)',
        description: 'Standard Social Security System contribution rates for 2024. Includes employee and employer shares.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['4250', '4749.99', '0', '0', '202.50', '427.50'],
            ['4750', '5249.99', '0', '0', '225.00', '475.00'],
            ['5250', '5749.99', '0', '0', '247.50', '522.50'],
            ['5750', '6249.99', '0', '0', '270.00', '570.00'],
            ['6250', '6749.99', '0', '0', '292.50', '617.50'],
            ['6750', '7249.99', '0', '0', '315.00', '665.00'],
            ['7250', '7749.99', '0', '0', '337.50', '712.50']
        ]
    },
    {
        id: 'philhealth',
        name: 'PhilHealth Premium (2025)',
        description: 'PhilHealth contribution rates revised for 2025. Based on monthly basic salary.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['10000', '10000', '0', '0', '250.00', '250.00'],
            ['10000.01', '99999.99', '0', '0.025', 'varies', 'varies'],
            ['100000', '100000', '0', '0', '2500.00', '2500.00'],
        ]
    },
    {
        id: 'pagibig',
        name: 'Pag-IBIG HDMF (New)',
        description: 'Revised Pag-IBIG HDMF contribution rates for 2024-2025 with up to ₱5,000 ceiling.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['1', '1500', '0', '0', '15.00', '30.00'],
            ['1501', '5000', '0', '0', '100.00', '100.00'],
            ['5001', 'null', '0', '0', '200.00', '200.00'],
        ]
    },
    {
        id: 'tax',
        name: 'TRAIN Withholding Tax',
        description: 'Monthly withholding tax rates under the TRAIN Law (Republic Act No. 10963).',
        type: 'standard',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['0', '20833', '0', '0', '0', '0'],
            ['20833', '33332', '0', '15', '0', '0'],
            ['33333', '66666', '1875', '20', '0', '0'],
            ['66667', '166666', '8541.67', '25', '0', '0'],
            ['166667', '666666', '33541.67', '30', '0', '0'],
            ['666667', 'null', '183541.67', '35', '0', '0'],
        ]
    },
    {
        id: 'hmo',
        name: 'HMO Benefit Tiers',
        description: 'Standard HMO premium sharing tiers based on employee salary brackets or position grade levels.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Total Premium', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['0', '30000', '1500.00', '0', '300.00', '1200.00'],
            ['30001', '60000', '2500.00', '0', '500.00', '2000.00'],
            ['60001', '120000', '4500.00', '0', '900.00', '3600.00'],
            ['120001', 'null', '8000.00', '0', '1600.00', '6400.00'],
        ]
    },
    {
        id: 'insurance',
        name: 'Group Life & Credit Insurance',
        description: 'Deduction logic for declining balance insurance (Credit Life) where premiums are calculated based on the employee\'s remaining loan balance or sum assured.',
        type: 'standard',
        columns: ['Min Balance', 'Max Balance', 'Base Premium', 'Premium Rate (%)', 'Admin Fee', 'Remaining Balance (Basis)'],
        rows: [
            ['0', '50000', '150.00', '0.25', '25.00', 'Declining'],
            ['50001', '250000', '300.00', '0.20', '50.00', 'Declining'],
            ['250001', '1000000', '600.00', '0.15', '100.00', 'Declining'],
            ['1000001', 'null', '1200.00', '0.10', '250.00', 'Declining'],
        ]
    }
];

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

    // Template Download Modal State
    const [isTemplateDownloadOpen, setIsTemplateDownloadOpen] = useState(false);
    const [selectedTemplateForDownload, setSelectedTemplateForDownload] = useState<any>(MOCK_FORMULA_TEMPLATES[0]);
    const [customTemplates, setCustomTemplates] = useState<any[]>([]);
    const [templateSearch, setTemplateSearch] = useState('');
    const customTemplateInputRef = useRef<HTMLInputElement>(null);

    // --- Installments State ---
    const [installmentProducts, setInstallmentProducts] = useState<any[]>([
        {
            id: 'p1',
            name: 'Lenovo ThinkPad X1 Carbon',
            category: 'Equipment',
            totalPrice: 24000,
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

    const downloadTemplateAsCSV = (template: any) => {
        const rows = template.rows.map((row: any) => Array.isArray(row) ? row.join(',') : Object.values(row).join(',')).join('\n');
        const csvContent = template.columns.join(',') + '\n' + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${template.name.replace(/\s+/g, '_')}_Template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadCustomTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csv = event.target?.result as string;
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                const rows = lines.slice(1).filter(l => l.trim()).map(l => l.split(','));

                const newTemplate = {
                    id: `custom-${Date.now()}`,
                    name: file.name,
                    description: 'Locally uploaded template for preview and modification.',
                    type: headers.length > 4 ? 'contribution' : 'standard',
                    columns: headers,
                    rows: rows,
                    isCustom: true
                };
                setCustomTemplates([newTemplate, ...customTemplates]);
                setSelectedTemplateForDownload(newTemplate);
            };
            reader.readAsText(file);
        }
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
                                                <Upload size={12} /> Upload
                                            </button>
                                            <button
                                                onClick={() => setIsTemplateDownloadOpen(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 border border-indigo-700 rounded-lg text-[10px] font-bold text-white hover:bg-indigo-700 transition-all shadow-sm"
                                                title="Download Reference Templates"
                                            >
                                                <Download size={12} /> Download Templates
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-white shadow-sm">
                                        <table className="w-full text-sm text-left min-w-[900px]">
                                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 sticky top-0 z-10">
                                                <tr className="divide-x divide-slate-100">
                                                    <th className="px-6 py-4 w-12 text-center bg-slate-50">#</th>
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
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group divide-x divide-slate-50">
                                                        <td className="px-6 py-2 text-slate-400 text-[10px] font-black italic text-center bg-slate-50/50">{idx + 1}</td>
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

                {/* --- VIEW: INSTALLMENTS --- */}
                {view === 'installments' && (
                    <>
                        {/* Product Sidebar */}
                        <div className={`w-1/3 border-r border-slate-100 overflow-y-auto bg-slate-50/30 ${isAddingInstallment ? 'hidden md:block' : 'w-full md:w-1/3'}`}>
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/50 sticky top-0 backdrop-blur-sm z-10">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Catalog</h3>
                                <button
                                    onClick={() => {
                                        setProductEditor({ name: '', category: 'Equipment', totalPrice: 0, description: '', options: [{ months: 1, interestEnabled: false, interestRate: 0, monthlyPayment: 0 }] });
                                        setIsAddingInstallment(true);
                                    }}
                                    className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {installmentProducts.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => { setProductEditor({ ...p }); setIsAddingInstallment(true); }}
                                        className={`p-5 hover:bg-white cursor-pointer transition-all border-l-4 ${productEditor.id === p.id ? 'bg-white border-orange-500 shadow-sm' : 'border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${p.category === 'HMO' ? 'bg-indigo-50 text-indigo-600' : p.category === 'Insurance' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {p.category === 'HMO' ? <Building2 size={14} /> : p.category === 'Insurance' ? <Package size={14} /> : <ShoppingBag size={14} />}
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{p.name}</h4>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setInstallmentProducts(installmentProducts.filter(item => item.id !== p.id)); }}
                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded italic">{p.category}</div>
                                            <div className="text-sm font-mono font-bold text-slate-700">₱{p.totalPrice.toLocaleString()}</div>
                                        </div>
                                        <div className="mt-3 flex gap-1 flex-wrap">
                                            {p.options.map((opt: any, i: number) => (
                                                <span key={i} className="text-[9px] font-black bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{opt.months}mo</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Editor Area */}
                        {isAddingInstallment && (
                            <div className="flex-1 flex flex-col h-full bg-white relative">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center z-10 bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">Plan Configuration</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Configure installments and financing options for this product.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsAddingInstallment(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
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
                                                    onChange={e => setProductEditor({ ...productEditor, totalPrice: parseFloat(e.target.value) || 0 })}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Note / Program Description</label>
                                            <input
                                                className="w-full bg-white border border-slate-200 p-3 rounded-xl text-sm font-medium focus:ring-2 ring-orange-100 focus:border-orange-500 outline-none text-slate-600 transition-all"
                                                value={productEditor.description}
                                                onChange={e => setProductEditor({ ...productEditor, description: e.target.value })}
                                                placeholder="Describe the benefit or purchase program..."
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {productEditor.options.map((opt: any, idx: number) => {
                                            const updateOpt = (field: string, val: any) => {
                                                const options = [...productEditor.options];
                                                options[idx] = { ...options[idx], [field]: val };

                                                // Re-calculate monthly payment if base or months changed
                                                if (field === 'months' || field === 'interestRate' || field === 'interestEnabled') {
                                                    const base = productEditor.totalPrice;
                                                    const months = field === 'months' ? val : options[idx].months;
                                                    const rate = (options[idx].interestEnabled ? (field === 'interestRate' ? val : options[idx].interestRate) : 0) / 100;
                                                    const totalInterst = base * rate;
                                                    options[idx].monthlyPayment = (base + totalInterst) / months;
                                                }

                                                setProductEditor({ ...productEditor, options });
                                            };

                                            return (
                                                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 relative group/card hover:bg-white hover:border-orange-100 hover:shadow-md transition-all">
                                                    <button
                                                        onClick={() => {
                                                            const options = productEditor.options.filter((_: any, i: number) => i !== idx);
                                                            setProductEditor({ ...productEditor, options });
                                                        }}
                                                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>

                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="flex-1">
                                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1.5">Tenure (Months)</label>
                                                            <select
                                                                className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold outline-none focus:ring-1 ring-orange-500"
                                                                value={opt.months}
                                                                onChange={e => updateOpt('months', parseInt(e.target.value))}
                                                            >
                                                                {[1, 3, 6, 12, 18, 24, 36, 48].map(m => <option key={m} value={m}>{m} Months</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1.5">Monthly Amort.</label>
                                                            <div className="text-sm font-mono font-bold text-slate-800 bg-white border border-slate-200 p-2 rounded-xl text-center">
                                                                ₱{opt.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="w-3.5 h-3.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                                                checked={opt.interestEnabled}
                                                                onChange={e => updateOpt('interestEnabled', e.target.checked)}
                                                            />
                                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add Interest</span>
                                                        </label>

                                                        {opt.interestEnabled && (
                                                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                                                <input
                                                                    type="number"
                                                                    className="w-16 bg-white border border-slate-200 p-1 rounded-lg text-right text-xs font-bold text-orange-600 outline-none focus:border-orange-400"
                                                                    value={opt.interestRate}
                                                                    onChange={e => updateOpt('interestRate', parseFloat(e.target.value) || 0)}
                                                                />
                                                                <span className="text-xs font-bold text-slate-400">%</span>
                                                            </div>
                                                        )}
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

            {/* Template Download Modal */}
            <Modal isOpen={isTemplateDownloadOpen} onClose={() => setIsTemplateDownloadOpen(false)} className="max-w-7xl w-[95vw]">
                <div className="flex flex-col h-[85vh] overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <FileSpreadsheet size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Reference Templates</h3>
                                <p className="text-xs text-slate-500 font-medium">Preview and download standardized lookup tables</p>
                            </div>
                        </div>
                        <button onClick={() => setIsTemplateDownloadOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-80 border-r border-slate-100 bg-slate-50 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search templates..."
                                        className="w-full bg-slate-100 border-none rounded-lg py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 ring-indigo-100 transition-all"
                                        value={templateSearch}
                                        onChange={e => setTemplateSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Standard Templates</div>
                                {MOCK_FORMULA_TEMPLATES.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplateForDownload(t)}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${selectedTemplateForDownload?.id === t.id ? 'bg-white border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${t.type === 'contribution' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {t.type === 'contribution' ? <Building2 size={14} /> : <Calculator size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-bold truncate ${selectedTemplateForDownload?.id === t.id ? 'text-indigo-900' : 'text-slate-700'}`}>{t.name}</div>
                                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.type === 'contribution' ? 'Contribution Type' : 'Standard Type'}</div>
                                            </div>
                                            {selectedTemplateForDownload?.id === t.id && <ChevronRight size={14} className="text-indigo-400" />}
                                        </div>
                                    </button>
                                ))}

                                {customTemplates.length > 0 && (
                                    <>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mt-6 mb-2">Recently Previewed</div>
                                        {customTemplates.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTemplateForDownload(t)}
                                                className={`w-full text-left p-3 rounded-xl transition-all border ${selectedTemplateForDownload?.id === t.id ? 'bg-white border-indigo-200 shadow-sm' : 'border-transparent hover:bg-white/50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                                                        <FileText size={14} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-xs font-bold truncate ${selectedTemplateForDownload?.id === t.id ? 'text-indigo-900' : 'text-slate-700'}`}>{t.name}</div>
                                                        <div className="text-[10px] text-slate-400 truncate mt-0.5">Local File</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="p-4 bg-white border-t border-slate-100">
                                <input
                                    type="file"
                                    ref={customTemplateInputRef}
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleUploadCustomTemplate}
                                />
                                <button
                                    onClick={() => customTemplateInputRef.current?.click()}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border-dashed"
                                >
                                    <Plus size={14} /> Add from Local Files
                                </button>
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="flex-1 bg-white flex flex-col overflow-hidden">
                            {selectedTemplateForDownload ? (
                                <>
                                    <div className="p-8 border-b border-slate-50 shrink-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-2xl font-extrabold text-slate-900">{selectedTemplateForDownload.name}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedTemplateForDownload.type === 'contribution' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {selectedTemplateForDownload.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{selectedTemplateForDownload.description}</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-8 pt-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Structure Preview</div>
                                        <div className="border border-slate-100 rounded-2xl overflow-x-auto shadow-sm bg-slate-50/20">
                                            <table className="w-full text-xs text-left min-w-[1000px]">
                                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-widest border-b border-slate-100">
                                                    <tr>
                                                        {selectedTemplateForDownload.columns.map((col: string, i: number) => (
                                                            <th key={i} className="px-6 py-4">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {selectedTemplateForDownload.rows.slice(0, 8).map((row: any, i: number) => (
                                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                            {(Array.isArray(row) ? row : Object.values(row)).map((val: any, j: number) => (
                                                                <td key={j} className="px-6 py-3 font-mono text-slate-700">{val === null ? '∞' : val}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    {selectedTemplateForDownload.rows.length > 8 && (
                                                        <tr>
                                                            <td colSpan={selectedTemplateForDownload.columns.length} className="px-6 py-4 bg-slate-50/50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                                ...and {selectedTemplateForDownload.rows.length - 8} more rows
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                            <div className="shrink-0 p-2 bg-white rounded-xl text-amber-600 shadow-sm h-fit">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-amber-900 mb-1">Quick Implementation Tip</h5>
                                                <p className="text-xs text-amber-700 leading-relaxed">
                                                    This template matches the system's CSV parser. Download it, fill in your specific values, and use the <strong>Upload</strong> feature to populate your lookup table instantly.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 border-t border-slate-100 bg-white shrink-0 flex gap-4">
                                        <button
                                            onClick={() => downloadTemplateAsCSV(selectedTemplateForDownload)}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                                        >
                                            <Download size={18} /> Download CSV Template
                                        </button>
                                        {selectedTemplateForDownload.isCustom && (
                                            <button
                                                onClick={() => {
                                                    setCustomTemplates(customTemplates.filter(t => t.id !== selectedTemplateForDownload.id));
                                                    setSelectedTemplateForDownload(MOCK_FORMULA_TEMPLATES[0]);
                                                }}
                                                className="px-6 py-4 bg-white border border-slate-200 text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-all"
                                            >
                                                Discard Preview
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                                    <FileSpreadsheet size={64} className="mb-4 opacity-10" />
                                    <p className="text-lg font-bold text-slate-500">Select a template to preview</p>
                                    <p className="text-sm max-w-xs mt-1">Choose from our standardized Philippine government templates or upload your own.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FormulaBuilder;
