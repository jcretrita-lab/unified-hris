
import React, { useRef } from 'react';
import { LookupTable, LookupTableRow, VersionHistory } from '../../types';
import {
    Plus,
    Trash2,
    Calculator,
    Save,
    X,
    Table2,
    History,
    GitBranch,
    Building2,
    User,
    FileSpreadsheet,
    Upload,
    Download,
    Search,
    FileText,
    ChevronRight,
    Zap,
} from 'lucide-react';
import Modal from '../../components/Modal';

// --- Template Data ---
export const MOCK_FORMULA_TEMPLATES = [
    {
        id: 'sss',
        name: 'SSS Contribution Table',
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
        ],
        _initialVersion: '2024'
    },
    {
        id: 'philhealth',
        name: 'PhilHealth Premium',
        description: 'PhilHealth contribution rates revised for 2025. Based on monthly basic salary.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['10000', '10000', '0', '0', '250.00', '250.00'],
            ['10000.01', '99999.99', '0', '0.025', 'varies', 'varies'],
            ['100000', '100000', '0', '0', '2500.00', '2500.00'],
        ],
        _initialVersion: '2025'
    },
    {
        id: 'pagibig',
        name: 'Pag-IBIG HDMF',
        description: 'Revised Pag-IBIG HDMF contribution rates for 2024-2025 with up to ₱5,000 ceiling.',
        type: 'contribution',
        columns: ['Min Salary', 'Max Salary', 'Base Amount', 'Excess Rate', 'Employee Share', 'Employer Share'],
        rows: [
            ['1', '1500', '0', '0', '15.00', '30.00'],
            ['1501', '5000', '0', '0', '100.00', '100.00'],
            ['5001', 'null', '0', '0', '200.00', '200.00'],
        ],
        _initialVersion: '2024'
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
        ],
        _initialVersion: '2018'
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
        ],
        _initialVersion: '2024'
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
        ],
        _initialVersion: '2024'
    }
];

export interface LookupTablesTabProps {
    lookupTables: LookupTable[];
    isAddingTable: boolean;
    setIsAddingTable: (v: boolean) => void;
    tableEditor: Partial<LookupTable>;
    setTableEditor: (v: Partial<LookupTable>) => void;
    selectedTableId: string | null;
    showHistory: boolean;
    setShowHistory: (v: boolean) => void;
    handleStartAddTable: () => void;
    handleEditTable: (t: LookupTable) => void;
    handleDeleteTable: (id: string) => void;
    addTableRow: () => void;
    updateTableRow: (index: number, field: keyof LookupTableRow, value: any) => void;
    removeTableRow: (index: number) => void;
    handleCSVUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    initiateSave: (type: 'formula' | 'table') => void;
    handleRestoreVersion: (historyItem: VersionHistory, type: 'formula' | 'table') => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const LookupTablesTab: React.FC<LookupTablesTabProps> = ({
    lookupTables,
    isAddingTable,
    setIsAddingTable,
    tableEditor,
    setTableEditor,
    selectedTableId,
    showHistory,
    setShowHistory,
    handleStartAddTable,
    handleEditTable,
    handleDeleteTable,
    addTableRow,
    updateTableRow,
    removeTableRow,
    handleCSVUpload,
    initiateSave,
    handleRestoreVersion,
    fileInputRef,
}) => {
    // Initialize system templates with a version history 
    const [systemTemplates, setSystemTemplates] = React.useState<any[]>(() =>
        MOCK_FORMULA_TEMPLATES.map(t => ({
            ...t,
            versions: [{ version: t._initialVersion, rows: t.rows }],
            currentVersion: t._initialVersion
        }))
    );

    // Template Download Modal State
    const [isTemplateDownloadOpen, setIsTemplateDownloadOpen] = React.useState(false);
    const [selectedTemplateForDownload, setSelectedTemplateForDownload] = React.useState<any>(() => {
        const t = MOCK_FORMULA_TEMPLATES[0];
        return { ...t, versions: [{ version: t._initialVersion, rows: t.rows }], currentVersion: t._initialVersion };
    });
    const [customTemplates, setCustomTemplates] = React.useState<any[]>([]);
    const [templateSearch, setTemplateSearch] = React.useState('');
    const customTemplateInputRef = useRef<HTMLInputElement>(null);

    // Template Editing State
    const [isEditingTemplate, setIsEditingTemplate] = React.useState(false);
    const [templateEditRows, setTemplateEditRows] = React.useState<any[]>([]);
    const [newVersionName, setNewVersionName] = React.useState('');

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

    // Upload Wizard Modal State
    const [isUploadWizardOpen, setIsUploadWizardOpen] = React.useState(false);
    const [uploadWizardTemplateId, setUploadWizardTemplateId] = React.useState<string>(MOCK_FORMULA_TEMPLATES[0].id);
    const [uploadWizardVersionName, setUploadWizardVersionName] = React.useState<string>(MOCK_FORMULA_TEMPLATES[0]._initialVersion || '2024');
    const [uploadWizardStatus, setUploadWizardStatus] = React.useState<'idle' | 'matching' | 'success' | 'error'>('idle');
    const [uploadWizardRows, setUploadWizardRows] = React.useState<any[] | null>(null);
    const [uploadWizardError, setUploadWizardError] = React.useState('');
    const uploadWizardInputRef = useRef<HTMLInputElement>(null);

    const handleWizardFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadWizardStatus('matching');
        setUploadWizardError('');

        const selectedTemplate = systemTemplates.find(t => t.id === uploadWizardTemplateId) || systemTemplates[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) {
                setUploadWizardStatus('error');
                setUploadWizardError('Empty or invalid file.');
                return;
            }

            const lines = text.split('\n');
            let startIndex = 0;
            const firstLine = lines[0].split(',').map(c => c.trim());

            if (lines.length > 0 && isNaN(Number(firstLine[0]))) {
                startIndex = 1;
                // Optional validation: check column count against template
                if (firstLine.length < selectedTemplate.columns.length) {
                    setUploadWizardStatus('error');
                    setUploadWizardError(`Header columns do not match the expected template count. Expected ${selectedTemplate.columns.length}, found ${firstLine.length}.`);
                    return;
                }
            }

            const newRows: any[] = [];
            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const cols = line.split(',');
                if (cols.length < 4) continue; // simplistic check

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
                setUploadWizardRows(newRows);
                setUploadWizardStatus('success');
            } else {
                setUploadWizardStatus('error');
                setUploadWizardError('No valid data rows found in the file.');
            }
            if (uploadWizardInputRef.current) uploadWizardInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const confirmWizardUpload = () => {
        if (uploadWizardRows && uploadWizardRows.length > 0) {
            const selectedTemplate = systemTemplates.find(t => t.id === uploadWizardTemplateId);
            const autoName = selectedTemplate ? `${selectedTemplate.name} (${uploadWizardVersionName})` : tableEditor.name;
            setTableEditor({
                ...tableEditor,
                name: tableEditor.name || autoName,
                rows: [...(tableEditor.rows || []), ...uploadWizardRows]
            });
            setIsUploadWizardOpen(false);
        }
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
                                <button
                                    onClick={() => {
                                        setIsUploadWizardOpen(true);
                                        setUploadWizardStatus('idle');
                                        setUploadWizardRows(null);
                                        setUploadWizardError('');
                                    }}
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
                                {systemTemplates.filter(t => t.name.toLowerCase().includes(templateSearch.toLowerCase())).map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setSelectedTemplateForDownload(t);
                                            setIsEditingTemplate(false);
                                        }}
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
                                                onClick={() => {
                                                    setSelectedTemplateForDownload(t);
                                                    setIsEditingTemplate(false);
                                                }}
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
                                            <div className="flex items-center gap-3">
                                                {!selectedTemplateForDownload.isCustom && (
                                                    <select
                                                        value={selectedTemplateForDownload.currentVersion}
                                                        onChange={(e) => {
                                                            const ver = selectedTemplateForDownload.versions.find((v: any) => v.version === e.target.value);
                                                            if (ver) {
                                                                setSelectedTemplateForDownload({ ...selectedTemplateForDownload, currentVersion: ver.version, rows: ver.rows });
                                                                setIsEditingTemplate(false);
                                                            }
                                                        }}
                                                        className="text-xs font-bold bg-white border border-slate-200 text-slate-700 py-1 pl-2 pr-6 rounded-lg outline-none cursor-pointer focus:ring-2 ring-indigo-100"
                                                    >
                                                        {selectedTemplateForDownload.versions?.map((v: any) => (
                                                            <option key={v.version} value={v.version}>{v.version}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedTemplateForDownload.type === 'contribution' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                    {selectedTemplateForDownload.type}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">{selectedTemplateForDownload.description}</p>
                                    </div>

                                    <div className="flex-1 overflow-auto p-8 pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structure Preview</div>
                                            {!selectedTemplateForDownload.isCustom && !isEditingTemplate && (
                                                <button
                                                    onClick={() => {
                                                        setIsEditingTemplate(true);
                                                        setTemplateEditRows(JSON.parse(JSON.stringify(selectedTemplateForDownload.rows)));
                                                        const currentYear = new Date().getFullYear();
                                                        setNewVersionName(`${currentYear + 1}`);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                                >
                                                    <Calculator size={12} /> Edit Template Rows
                                                </button>
                                            )}
                                        </div>
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
                                                                <td key={j} className="px-6 py-3 font-mono text-slate-700">
                                                                    {isEditingTemplate ? (
                                                                        <input
                                                                            type="text"
                                                                            value={templateEditRows[i]?.[j] ?? (val === null ? '' : val)}
                                                                            onChange={(e) => {
                                                                                const newRows = [...templateEditRows];
                                                                                newRows[i] = [...(newRows[i] || [])];
                                                                                newRows[i][j] = e.target.value === '' ? null : e.target.value;
                                                                                setTemplateEditRows(newRows);
                                                                            }}
                                                                            className="w-full border border-indigo-200 rounded px-2 py-1 outline-none text-xs focus:ring-1 focus:ring-indigo-500"
                                                                        />
                                                                    ) : (
                                                                        val === null ? '∞' : val
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    {!isEditingTemplate && selectedTemplateForDownload.rows.length > 8 && (
                                                        <tr>
                                                            <td colSpan={selectedTemplateForDownload.columns.length} className="px-6 py-4 bg-slate-50/50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                                                ...and {selectedTemplateForDownload.rows.length - 8} more rows
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {isEditingTemplate ? (
                                            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col gap-4">
                                                <div className="flex justify-between items-center w-full">
                                                    <div>
                                                        <h5 className="text-sm font-bold text-indigo-900 mb-1">Save New Version</h5>
                                                        <p className="text-xs text-indigo-700">Provide a version identifier to save these modifications.</p>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={newVersionName}
                                                        onChange={e => setNewVersionName(e.target.value)}
                                                        placeholder="e.g. 2026"
                                                        className="px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200 outline-none w-48 text-indigo-900"
                                                    />
                                                </div>
                                                <div className="flex gap-3 justify-end mt-2">
                                                    <button onClick={() => setIsEditingTemplate(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-indigo-100 rounded-xl transition-all">Cancel</button>
                                                    <button
                                                        onClick={() => {
                                                            if (!newVersionName) return;
                                                            const updatedTemplate = { ...selectedTemplateForDownload };
                                                            const newVersionObj = { version: newVersionName, rows: templateEditRows };
                                                            updatedTemplate.versions = [newVersionObj, ...(updatedTemplate.versions || [])];
                                                            updatedTemplate.currentVersion = newVersionName;
                                                            updatedTemplate.rows = templateEditRows;

                                                            setSystemTemplates(systemTemplates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
                                                            setSelectedTemplateForDownload(updatedTemplate);
                                                            setIsEditingTemplate(false);
                                                        }}
                                                        disabled={!newVersionName}
                                                        className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-all"
                                                    >
                                                        Save to Versions
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
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
                                        )}
                                    </div>

                                    <div className="p-8 border-t border-slate-100 bg-white shrink-0 flex gap-4">
                                        <button
                                            onClick={() => downloadTemplateAsCSV(selectedTemplateForDownload)}
                                            disabled={isEditingTemplate}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
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
            {/* Upload Wizard Modal */}
            <Modal isOpen={isUploadWizardOpen} onClose={() => setIsUploadWizardOpen(false)} className="max-w-4xl w-[90vw]">
                <div className="flex flex-col h-[70vh] overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Upload size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Upload Table Template</h3>
                                <p className="text-xs text-slate-500 font-medium">Select a format and upload your CSV data</p>
                            </div>
                        </div>
                        <button onClick={() => setIsUploadWizardOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><X size={18} className="text-slate-400" /></button>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar for Template Selection */}
                        <div className="w-1/3 border-r border-slate-100 bg-slate-50 overflow-y-auto p-4 space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">Select Template Format</div>
                            {systemTemplates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => { setUploadWizardTemplateId(t.id); setUploadWizardVersionName(t.currentVersion); setUploadWizardStatus('idle'); setUploadWizardRows(null); setUploadWizardError(''); }}
                                    className={`w-full text-left p-3 rounded-xl transition-all border ${uploadWizardTemplateId === t.id ? 'bg-white border-blue-500 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                >
                                    <div className={`text-xs font-bold mb-1 ${uploadWizardTemplateId === t.id ? 'text-blue-700' : 'text-slate-700'}`}>{t.name}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{t.columns.length} Expected Columns</div>
                                </button>
                            ))}
                        </div>

                        {/* Main Upload Area */}
                        <div className="flex-1 p-8 bg-white flex flex-col items-center justify-center">
                            {uploadWizardStatus === 'idle' || uploadWizardStatus === 'error' ? (
                                <>
                                    <div className="w-full max-w-md mb-6 flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <span className="text-xs font-bold text-slate-600">Target Template Version:</span>
                                        <select
                                            value={uploadWizardVersionName}
                                            onChange={e => setUploadWizardVersionName(e.target.value)}
                                            className="bg-white border text-xs font-bold text-slate-700 border-slate-200 rounded-lg outline-none px-2 py-1.5 focus:ring-2 ring-blue-100"
                                        >
                                            {systemTemplates.find(t => t.id === uploadWizardTemplateId)?.versions?.map((v: any) => (
                                                <option key={v.version} value={v.version}>{v.version}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        type="file"
                                        ref={uploadWizardInputRef}
                                        className="hidden"
                                        accept=".csv,.xlsx"
                                        onChange={handleWizardFileUpload}
                                    />
                                    <button
                                        onClick={() => uploadWizardInputRef.current?.click()}
                                        className="bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl w-full max-w-md p-10 flex flex-col items-center justify-center gap-4 transition-all"
                                    >
                                        <div className="p-4 bg-white rounded-full shadow-sm text-blue-500">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-slate-700 mb-1">Click to browse CSV file</h4>
                                            <p className="text-xs text-slate-500">Must match the selected template format.</p>
                                        </div>
                                    </button>
                                    {uploadWizardStatus === 'error' && (
                                        <div className="mt-4 text-xs font-bold text-rose-500 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
                                            Error: {uploadWizardError}
                                        </div>
                                    )}
                                </>
                            ) : uploadWizardStatus === 'matching' ? (
                                <div className="flex flex-col items-center text-slate-500">
                                    <div className="animate-spin mb-4"><Zap size={32} className="text-blue-500" /></div>
                                    <p className="font-bold text-sm">Validating Template...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-2">Template Match Successful!</h4>
                                    <p className="text-sm text-slate-500 mb-8">Successfully validated {uploadWizardRows?.length} rows against the template.</p>

                                    <div className="flex gap-3">
                                        <button onClick={() => { setUploadWizardStatus('idle'); setUploadWizardRows(null); }} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all">Cancel</button>
                                        <button onClick={confirmWizardUpload} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-emerald-200 shadow hover:bg-emerald-700 transition-all">Confirm & Add Rows</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LookupTablesTab;
