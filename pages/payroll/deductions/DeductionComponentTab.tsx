
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayComponent, Formula, VersionHistory, AdjustmentType, LookupTable, LookupTableRow } from "../../../types";
import Modal from "../../../components/Modal";
import {
  Plus,
  Banknote,
  Eye,
  EyeOff,
  Search,
  X,
  SortAsc,
  SortDesc,
  Edit2,
  Trash2,
  DollarSign,
  Calculator,
  Table,
  CreditCard,
  Archive,
  RotateCcw,
  ArchiveRestore,
  LayoutGrid,
  GitBranch,
  Save,
  Gift,
  Lock,
  Building2,
  Tag,
  Layers,
  ChevronDown as ChevronDownIcon,
  Zap,
  AlertCircle,
  Check,
  RefreshCcw,
  ChevronRight,
  Clock
} from 'lucide-react';

interface DeductionComponentTabProps {
  components: PayComponent[];
  setComponents: (c: PayComponent[]) => void;
  formulas: Formula[];
  lookupTables: LookupTable[];
  installments: any[];
}

const DeductionComponentTab: React.FC<DeductionComponentTabProps> = ({
  components,
  setComponents,
  formulas,
  lookupTables,
  installments,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Editor State
  const [editor, setEditor] = useState<Partial<PayComponent>>({
    type: "deduction",
    isTaxable: false,
    includeIn13thMonth: false,
    valueType: "fixed",
    archiveAfterDays: 0,
    currentVersion: '1.0.0',
    versions: []
  });
  // Versioning Workflow State
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [modalTab, setModalTab] = useState<'config' | 'history'>('config');

  // View toggles
  const [showAllValues, setShowAllValues] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

  const handleOpenAdd = () => {
    setEditor({
      type: "deduction",
      isTaxable: false,
      includeIn13thMonth: false,
      valueType: "fixed",
      fixedValue: 0,
      archiveAfterDays: 0,
      currentVersion: '1.0.0',
      versions: []
    });
    setModalTab('config');
    setIsModalOpen(true);
  };

  const handleEdit = (c: PayComponent) => {
    if (c.isArchived || c.isSystem) return;
    setEditor({ ...c, archiveAfterDays: c.archiveAfterDays || 0 });
    setModalTab('config');
    setIsModalOpen(true);
  };

  const initiateSave = () => {
    if (!editor.name) return;
    setIsSavingVersion(true);
    // Suggest next version if possible, or just default
    setNewVersionName(editor.id ? 'v' + (parseInt(editor.currentVersion?.split('.')[0] || '1') + 1) + '.0.0' : 'v1.0.0');
  };

  const confirmSave = () => {
    if (!newVersionName) return;

    // Create history entry from CURRENT state (before overwrite) if editing
    let updatedVersions = editor.versions || [];

    // If we are editing an existing component, push the PREVIOUS state to history
    if (editor.id) {
      const newHistoryItem: VersionHistory = {
        version: newVersionName,
        date: new Date().toLocaleString(),
        author: 'Current User',
        dataSnapshot: { ...editor } // Snapshot of what we are saving
      };
      updatedVersions = [newHistoryItem, ...updatedVersions];
    } else {
      // New Component
      updatedVersions = [{
        version: newVersionName,
        date: new Date().toLocaleString(),
        author: 'Current User',
        dataSnapshot: { ...editor }
      }];
    }

    const newComp: PayComponent = {
      id: editor.id || Math.random().toString(36).substr(2, 9),
      name: editor.name!,
      type: editor.type || "deduction",
      isTaxable: editor.isTaxable || false,
      includeIn13thMonth: editor.includeIn13thMonth || false,
      valueType: editor.valueType || "fixed",
      fixedValue: editor.fixedValue,
      formulaId: editor.formulaId,
      archiveAfterDays: editor.archiveAfterDays,
      isArchived: editor.isArchived || false,
      isSystem: false, // User created components are never system
      currentVersion: newVersionName,
      versions: updatedVersions
    };

    if (editor.id) {
      setComponents(components.map((c) => (c.id === editor.id ? newComp : c)));
    } else {
      setComponents([...components, newComp]);
    }

    setIsSavingVersion(false);
    setIsModalOpen(false);
  };

  const handleRestoreVersion = (historyItem: VersionHistory) => {
    if (confirm(`Restore configuration from version ${historyItem.version}? unsaved changes will be lost.`)) {
      // Load data from snapshot into editor
      setEditor({
        ...editor,
        ...historyItem.dataSnapshot,
        // Keep the ID and Versions array intact, just update config fields
        id: editor.id,
        versions: editor.versions
      });
      setModalTab('config');
    }
  };

  const handleDelete = (id: string) => {
    const comp = components.find(c => c.id === id);
    if (comp?.isSystem) return;
    if (confirm("Permanently delete this component?")) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  const handleArchive = (id: string) => {
    const comp = components.find(c => c.id === id);
    if (comp?.isSystem) return;
    if (confirm("Archive this component? It will be moved to the Archived list.")) {
      setComponents(components.map(c => c.id === id ? { ...c, isArchived: true } : c));
    }
  };

  const handleRestore = (id: string) => {
    setComponents(components.map(c => c.id === id ? { ...c, isArchived: false } : c));
  };

  // Filter and sort components
  const filteredAndSortedComponents = useMemo(() => {
    let filtered = components.filter(c =>
      viewMode === 'active' ? !c.isArchived : c.isArchived
    );

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((comp) =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      // System components always on top
      if (a.isSystem && !b.isSystem) return -1;
      if (!a.isSystem && b.isSystem) return 1;
      // Group: deductions before deductions
      if (a.type !== b.type) return a.type === 'deduction' ? -1 : 1;

      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

    return filtered;
  }, [components, searchTerm, sortOrder, viewMode]);

  const firstDeductionIndex = filteredAndSortedComponents.findIndex(c => c.type === 'deduction' && !c.isSystem);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[700px] overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Banknote size={20} className="text-emerald-500" /> Pay Components
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Define allowances, bonuses, and deductions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden md:inline uppercase tracking-wider">
                {showAllValues ? "Hide Values" : "Show Values"}
              </span>
              <button
                onClick={() => setShowAllValues(!showAllValues)}
                className={`p-2 rounded-xl transition-all ${showAllValues
                  ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                title={showAllValues ? "Hide all monetary values" : "Show all monetary values"}
              >
                {showAllValues ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {viewMode === 'active' && (
              <div className="flex gap-2">
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold shadow-lg shadow-slate-200 active:scale-95"
                >
                  <Plus size={16} /> Add Component
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search, Sort, and Archive Toggle Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={viewMode === 'active' ? "Search active components..." : "Search archived components..."}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-slate-50 text-sm font-bold text-slate-900 transition-all placeholder:font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('active')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutGrid size={14} /> Active
              </button>
              <button
                onClick={() => setViewMode('archived')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'archived' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Archive size={14} /> View Archive
              </button>
            </div>

            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAsc size={16} /> A-Z
                </>
              ) : (
                <>
                  <SortDesc size={16} /> Z-A
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50/30">
        {viewMode === 'archived' && (
          <div className="mb-6 flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-fit mx-auto">
            <Archive size={16} />
            <span className="text-xs font-bold">Archived Components Repository</span>
          </div>
        )}

        {filteredAndSortedComponents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`mx-auto mb-4 ${viewMode === 'archived' ? 'text-slate-300' : 'text-slate-200'}`}>
              {viewMode === 'archived' ? <ArchiveRestore size={48} /> : <Banknote size={48} />}
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">
              {viewMode === 'archived' ? 'Archive is Empty' : 'No pay components defined'}
            </h3>
            <p className="text-slate-400 text-sm font-medium mb-6">
              {viewMode === 'archived' ? "Archived components will appear here." : "Start by creating pay components."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedComponents.map((comp, idx) => (<>
              {idx === firstDeductionIndex && firstDeductionIndex > 0 && (
                <div key="divider" className="col-span-full flex items-center gap-3 py-2">
                  <div className="flex-1 border-t border-dashed border-rose-200" />
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                    <Banknote size={11} /> Deductions
                  </span>
                  <div className="flex-1 border-t border-dashed border-rose-200" />
                </div>
              )}
              <div
                key={comp.id}
                className={`border rounded-2xl p-5 transition-all group relative flex flex-col justify-between
                    ${comp.isArchived
                    ? 'bg-slate-50 border-slate-200 border-dashed opacity-75 grayscale hover:opacity-100 hover:grayscale-0'
                    : comp.isSystem
                      ? 'bg-white border-slate-200 hover:border-indigo-200'
                      : 'bg-white border-slate-200 hover:shadow-md hover:border-indigo-100'
                  }`}
              >
                <div className="absolute top-4 right-4 flex gap-1 transition-opacity z-10">
                  {comp.isSystem ? (
                    <div className="p-1.5 text-slate-300" title="System Component (Cannot Edit)">
                      <Lock size={14} />
                    </div>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      {comp.isArchived ? (
                        <>
                          <button onClick={() => handleRestore(comp.id)} className="p-1.5 bg-white text-emerald-600 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors shadow-sm" title="Restore"><RotateCcw size={14} /></button>
                          <button onClick={() => handleDelete(comp.id)} className="p-1.5 bg-white text-rose-500 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors shadow-sm" title="Delete"><Trash2 size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(comp)} className="p-1.5 bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><Edit2 size={14} /></button>
                          <button onClick={() => handleArchive(comp.id)} className="p-1.5 bg-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Archive"><Archive size={14} /></button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${comp.type === "deduction" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {comp.type === "deduction" ? <Plus size={20} /> : <Banknote size={20} />}
                  </div>
                  {!comp.isSystem && (
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1">
                        <GitBranch size={10} /> {comp.currentVersion || 'v1.0.0'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`font-bold mb-1 flex items-center gap-2 ${comp.isArchived ? 'text-slate-500' : 'text-slate-900'}`}>
                    {comp.name}
                    {comp.isSystem && <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">System</span>}
                  </h3>
                  <div className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wide flex flex-wrap gap-2">
                    <span>{comp.type === "deduction" ? "Deductions" : "Deduction"}</span>
                    {comp.isTaxable && <span>• Taxable</span>}
                    {comp.includeIn13thMonth && (
                      <span className="text-amber-600 bg-amber-50 px-1.5 rounded border border-amber-100 normal-case flex items-center gap-1">
                        <Gift size={10} /> 13th
                      </span>
                    )}
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${comp.isArchived ? 'border-slate-200' : 'border-slate-50'}`}>
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {comp.isSystem ? <Building2 size={14} /> : comp.valueType === "fixed" ? <DollarSign size={14} /> : comp.valueType === "formula" ? <Calculator size={14} /> : <Table size={14} />}
                    {comp.isSystem ? "Org. Structure" : comp.valueType === "fixed" ? "Fixed Amount" : comp.valueType === "formula" ? "Formula" : "Table Ref"}
                  </div>
                  <div className={`font-mono font-bold truncate max-w-[120px] text-right text-sm ${comp.isArchived ? 'text-slate-500' : 'text-slate-800'}`}>
                    {comp.isSystem ? (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Position Based</span>
                    ) : comp.valueType === "fixed" ? (
                      <span className={showAllValues ? "" : "blur-[6px]"}>{formatCurrency(comp.fixedValue || 0)}</span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-xs ${comp.isArchived ? 'bg-slate-200 text-slate-500' : 'text-indigo-600 bg-indigo-50'}`}>
                        {formulas.find((f) => f.id === comp.formulaId)?.name || "Unknown Formula"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setIsSavingVersion(false); }} className="max-w-3xl">
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {!isSavingVersion ? (
            <>
              <div className="flex flex-col gap-1 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`p-2 rounded-xl ${editor.id ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {editor.id ? <Edit2 size={20} /> : <Plus size={20} />}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        {editor.id ? "Edit Component" : "Configure New Deduction"}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Define how this deduction is calculated and distributed.</p>
                  </div>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                    <button
                      onClick={() => setModalTab('config')}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${modalTab === 'config' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Settings
                    </button>
                    {editor.id && (
                      <button
                        onClick={() => setModalTab('history')}
                        className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${modalTab === 'history' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Version History
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {modalTab === 'config' && (
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 flex items-center gap-1.5">
                          <Tag size={12} className="text-slate-400" /> Component Name
                        </label>
                        <input
                          className="w-full border-2 border-slate-100 p-3.5 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-base font-bold text-slate-900 transition-all bg-slate-50/50 hover:bg-white placeholder:text-slate-300"
                          value={editor.name || ""}
                          onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                          placeholder="e.g. Health Insurance Premium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 flex items-center gap-1.5">
                          <Layers size={12} className="text-slate-400" /> Category
                        </label>
                        <select
                          className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50/50 hover:bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all appearance-none"
                          value={editor.category || ''}
                          onChange={(e) => setEditor({ ...editor, category: e.target.value as any })}
                        >
                          <option value="">Standard Deduction</option>
                          <option value="loan">Loan / Advance</option>
                          <option value="government">Statutory / Government</option>
                          <option value="other">Misc. Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1 flex items-center gap-1.5">
                          <RotateCcw size={12} className="text-slate-400" /> Payout Frequency
                        </label>
                        <select
                          className="w-full border-2 border-slate-100 p-3.5 rounded-2xl bg-slate-50/50 hover:bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all appearance-none"
                          value={editor.frequency || 'Monthly'}
                          onChange={(e) => setEditor({ ...editor, frequency: e.target.value as any })}
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Semi-Monthly">Semi-Monthly (Split)</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Daily">Daily</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* Calculation Logic Section */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculation Engine</h4>
                    </div>

                    <div className="bg-slate-50/50 border-2 border-slate-100 rounded-3xl p-6 space-y-6">
                      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit">
                        <button
                          onClick={() => setEditor({ ...editor, valueType: 'fixed' })}
                          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${editor.valueType === 'fixed' ? 'bg-white text-emerald-600 shadow-md ring-1 ring-slate-100' : 'text-slate-500'}`}
                        >
                          <DollarSign size={14} /> Fixed Amount
                        </button>
                        <button
                          onClick={() => setEditor({ ...editor, valueType: 'formula' })}
                          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${editor.valueType === 'formula' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-100' : 'text-slate-500'}`}
                        >
                          <Zap size={14} /> Dynamic Formula
                        </button>
                        <button
                          onClick={() => setEditor({ ...editor, valueType: 'table' })}
                          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${editor.valueType === 'table' ? 'bg-white text-amber-600 shadow-md ring-1 ring-slate-100' : 'text-slate-500'}`}
                        >
                          <Table size={14} /> Lookup Table
                        </button>
                        <button
                          onClick={() => setEditor({ ...editor, valueType: 'installment' })}
                          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${editor.valueType === 'installment' ? 'bg-white text-indigo-900 shadow-md ring-1 ring-slate-100' : 'text-slate-500'}`}
                        >
                          <CreditCard size={14} /> Installment
                        </button>
                      </div>

                      <div className="animate-in fade-in slide-in-from-top-4">
                        {editor.valueType === "fixed" && (
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 font-black group-focus-within:text-emerald-500 transition-colors">
                              <span>₱</span>
                            </div>
                            <input
                              type="number"
                              className="w-full border-2 border-slate-200 p-4 pl-10 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none font-mono text-lg font-black bg-white shadow-sm transition-all"
                              placeholder="0.00"
                              value={editor.fixedValue || ""}
                              onChange={(e) => setEditor({ ...editor, fixedValue: parseFloat(e.target.value) })}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest text-slate-300 uppercase">Input Value</div>
                          </div>
                        )}

                        {editor.valueType === "formula" && (
                          <div className="space-y-3">
                            <select
                              className="w-full border-2 border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 shadow-sm appearance-none"
                              value={editor.formulaId || ""}
                              onChange={(e) => setEditor({ ...editor, formulaId: e.target.value })}
                            >
                              <option value="">Select a calculation logic...</option>
                              {formulas.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                            </select>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-2">
                              <AlertCircle size={10} /> Formulas are managed in the Formula Builder tab.
                            </div>
                          </div>
                        )}

                        {editor.valueType === "table" && (
                          <div className="space-y-3">
                            <select
                              className="w-full border-2 border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-500 shadow-sm appearance-none"
                              value={editor.tableId || ""}
                              onChange={(e) => setEditor({ ...editor, tableId: e.target.value })}
                            >
                              <option value="">Select a lookup table...</option>
                              <option value="sss">SSS Contribution Table</option>
                              <option value="philhealth">PhilHealth Premium Table</option>
                              <option value="pagibig">Pag-IBIG Contribution Table</option>
                              <option value="tax">BIR Withholding Tax Table</option>
                            </select>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-2">
                              <Table size={10} /> Uses ranges and brackets to determine the deduction amount.
                            </div>
                          </div>
                        )}

                        {editor.valueType === "installment" && (
                          <div className="space-y-3">
                            <select
                              className="w-full border-2 border-slate-200 p-4 rounded-2xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 shadow-sm appearance-none"
                              value={editor.installmentId || ""}
                              onChange={(e) => setEditor({ ...editor, installmentId: e.target.value })}
                            >
                              <option value="">Link to an Installment Plan...</option>
                              <option value="SSS_LOAN">SSS Salary Loan</option>
                              <option value="PAGIBIG_LOAN">Pag-IBIG Multi-Purpose Loan</option>
                              <option value="LAPTOP_LOAN">Lenovo ThinkPad X1 Carbon (Laptop Loan)</option>
                              <option value="HMO_MAXICARE">MaxiCare Platinum HMO</option>
                              <option value="CASH_ADVANCE">Company Cash Advance</option>
                            </select>
                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-2">
                              <CreditCard size={10} /> Links this component to a systematic repayment schedule.
                            </div>
                          </div>
                        )}
                      </div>

                      {/* --- Calculation Logic Preview --- */}
                      <AnimatePresence mode="wait">
                        {editor.valueType === 'formula' && editor.formulaId && (
                          <motion.div
                            key="formula-preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                  <Zap size={14} />
                                </div>
                                <div>
                                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Active Formula</div>
                                  <div className="text-sm font-bold text-indigo-900">{formulas.find(f => f.id === editor.formulaId)?.name}</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-indigo-50 font-mono text-[11px] text-indigo-600 break-all leading-relaxed shadow-sm ring-1 ring-slate-100">
                              <span className="text-slate-400">VALUE =</span> {formulas.find(f => f.id === editor.formulaId)?.expression}
                            </div>
                          </motion.div>
                        )}

                        {editor.valueType === 'table' && editor.tableId && (
                          <motion.div
                            key="table-preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                                  <Table size={14} />
                                </div>
                                <div>
                                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none mb-1">Active Lookup Table</div>
                                  <div className="text-sm font-bold text-amber-900">{lookupTables.find(t => t.id === editor.tableId)?.name}</div>
                                </div>
                              </div>
                              <div className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                {lookupTables.find(t => t.id === editor.tableId)?.rows.length || 0} Levels
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {lookupTables.find(t => t.id === editor.tableId)?.rows.slice(0, 4).map((row: LookupTableRow, i: number) => (
                                <div key={i} className="bg-white p-2 rounded-lg border border-amber-50 flex justify-between items-center shadow-sm">
                                  <span className="text-[9px] font-bold text-slate-400">₱{row.min.toLocaleString()} - {row.max ? `₱${row.max.toLocaleString()}` : 'UP'}</span>
                                  <span className="text-[10px] font-black text-amber-700">₱{row.baseAmount || row.employeeShare}</span>
                                </div>
                              ))}
                              {(lookupTables.find(t => t.id === editor.tableId)?.rows.length || 0) > 4 && (
                                <div className="col-span-2 text-center text-[9px] font-bold text-amber-400 pt-1">+ More ranges in table definition</div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {editor.valueType === 'installment' && editor.installmentId && (
                          <motion.div
                            key="installment-preview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 text-white shadow-xl"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/10 text-white rounded-lg backdrop-blur-md border border-white/10">
                                  <CreditCard size={14} />
                                </div>
                                <div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Installment Product</div>
                                  <div className="text-sm font-bold">{installments.find(i => i.id === editor.installmentId)?.name}</div>
                                </div>
                              </div>
                              <div className="px-2 py-0.5 rounded-lg bg-orange-500 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                {installments.find(i => i.id === editor.installmentId)?.category}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 pb-2">
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Inventory Value</div>
                                <div className="text-lg font-black text-white">₱{installments.find(i => i.id === editor.installmentId)?.totalPrice.toLocaleString()}</div>
                              </div>
                              <div className="h-8 w-px bg-white/10"></div>
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Cycles</div>
                                <div className="text-xs font-black bg-white/10 px-2 py-0.5 rounded uppercase">{installments.find(i => i.id === editor.installmentId)?.payPeriod}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Clock size={10} /> Repayment Options
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {installments.find(i => i.id === editor.installmentId)?.options.map((opt: any, i: number) => (
                                  <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-2 flex items-center gap-3 hover:bg-white/10 transition-colors">
                                    <div className="text-[10px] font-black text-slate-400">{opt.months}mo</div>
                                    <div className="text-[11px] font-black text-orange-400">₱{opt.monthlyPayment.toLocaleString()} / Run</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>

                  {/* Loan Specifics Section */}
                  <AnimatePresence>
                    {editor.category === 'loan' && (
                      <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loan Tracking Details</h4>
                        </div>

                        <div className="bg-amber-50/30 border-2 border-amber-100 rounded-3xl p-6 space-y-6">
                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2.5 ml-1">Principal Amount</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">₱</span>
                                <input
                                  type="number"
                                  className="w-full border-2 border-amber-100 p-3 pl-8 rounded-2xl bg-white text-sm font-black text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                                  value={editor.loanPrincipalAmount ?? ''}
                                  onChange={(e) => setEditor({ ...editor, loanPrincipalAmount: Number(e.target.value) })}
                                  placeholder="Total loan val"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2.5 ml-1">Installment per cycle</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">₱</span>
                                <input
                                  type="number"
                                  className="w-full border-2 border-amber-100 p-3 pl-8 rounded-2xl bg-white text-sm font-black text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                                  value={editor.loanInstallmentAmount ?? editor.fixedValue ?? ''}
                                  onChange={(e) => setEditor({ ...editor, loanInstallmentAmount: Number(e.target.value) })}
                                  placeholder="Fixed ded"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2.5 ml-1">Start Deduction From</label>
                              <input
                                type="date"
                                className="w-full border-2 border-amber-100 p-3 rounded-2xl bg-white text-sm font-bold text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                                value={editor.loanStartDate || ''}
                                onChange={(e) => setEditor({ ...editor, loanStartDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2.5 ml-1 text-slate-400">Target End Date (Optional)</label>
                              <input
                                type="date"
                                className="w-full border-2 border-amber-100 p-3 rounded-2xl bg-white text-sm font-bold text-slate-800 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all"
                                value={editor.loanEndDate || ''}
                                onChange={(e) => setEditor({ ...editor, loanEndDate: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.section>
                    )}
                  </AnimatePresence>

                  {/* Compliance & Policy Section */}
                  <section className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance & Rules</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer group hover:shadow-md ${editor.isTaxable ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${editor.isTaxable ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200 group-hover:border-indigo-400'}`}>
                          {editor.isTaxable && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={editor.isTaxable} onChange={(e) => setEditor({ ...editor, isTaxable: e.target.checked })} />
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-sm mb-1">Pre-Tax Deduction</div>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">This amount is removed before personal income tax is calculated, reducing taxable base.</p>
                        </div>
                      </label>

                      <label className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer group hover:shadow-md ${editor.includeIn13thMonth ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${editor.includeIn13thMonth ? 'bg-amber-600 border-amber-600' : 'bg-white border-slate-200 group-hover:border-amber-400'}`}>
                          {editor.includeIn13thMonth && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={editor.includeIn13thMonth} onChange={(e) => setEditor({ ...editor, includeIn13thMonth: e.target.checked })} />
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-sm mb-1">13th Month Inclusion</div>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Deduct this component from the annual 13th-month bonus calculation pool.</p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-between text-white group overflow-hidden relative">
                      <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Archive size={80} />
                      </div>
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl group-hover:bg-white/20 transition-colors"><Archive size={20} className="text-white" /></div>
                        <div>
                          <h4 className="text-sm font-black tracking-tight mb-1">Auto-Archive Policy</h4>
                          <p className="text-[10px] text-slate-400 font-medium mb-1">Components unused for the set duration move to archive.</p>
                        </div>
                      </div>
                      <div className="relative z-10 flex items-center gap-3 bg-white/10 p-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <input
                          type="number"
                          min="0"
                          className="w-16 h-10 text-center text-sm font-black bg-slate-800 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-white"
                          value={editor.archiveAfterDays || 0}
                          onChange={(e) => setEditor({ ...editor, archiveAfterDays: Number(e.target.value) })}
                        />
                        <span className="text-[10px] font-black uppercase text-slate-400 pr-2">Days</span>
                      </div>
                    </div>
                  </section>

                  <div className="pt-4 pb-8 sticky bottom-0 bg-white/80 backdrop-blur-md -mx-8 px-8 border-t border-slate-100 z-20">
                    <button
                      onClick={initiateSave}
                      disabled={!editor.name}
                      className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-2xl active:scale-[0.98] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 ${editor.id ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'}`}
                    >
                      {editor.id ? (
                        <>
                          <RefreshCcw size={18} /> Push Revision & Sync
                        </>
                      ) : (
                        <>
                          <Check size={18} strokeWidth={3} /> Initialize Deductible Component
                        </>
                      )}
                    </button>
                    {!editor.id && (
                      <p className="text-center text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">Component will be created as v1.0.0 by default</p>
                    )}
                  </div>
                </div>
              )}

              {modalTab === 'history' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Version</span>
                        <div className="text-lg font-bold text-slate-900">{editor.currentVersion || 'v1.0.0'}</div>
                      </div>
                      <GitBranch size={24} className="text-indigo-200" />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Previous Versions</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {!editor.versions || editor.versions.length === 0 ? (
                      <p className="text-center text-slate-400 text-xs py-4 italic">No history available.</p>
                    ) : (
                      editor.versions.map((v, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors group">
                          <div>
                            <div className="font-bold text-sm text-slate-700">{v.version}</div>
                            <div className="text-[10px] text-slate-400">{v.date} • {v.author}</div>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(v)}
                            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Restore
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Save size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Commit Version</h3>
              <p className="text-sm text-slate-500 mb-6 px-4">You are about to save changes to this pay component. Please assign a version identifier.</p>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-6">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Version Name / Number</label>
                <input
                  className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white text-sm font-bold text-slate-900"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g. v1.2.0 - Fixed Tax Logic"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsSavingVersion(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">Back</button>
                <button onClick={confirmSave} disabled={!newVersionName} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50">Confirm & Save</button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DeductionComponentTab;
