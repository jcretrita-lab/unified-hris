
import React, { useState, useMemo } from 'react';
import { PayComponent, Formula, VersionHistory, AdjustmentType } from '../../types';
import Modal from '../../components/Modal';
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
  Archive,
  RotateCcw,
  ArchiveRestore,
  LayoutGrid,
  GitBranch,
  Save,
  Gift,
  Lock,
  Building2,
  Sliders
} from 'lucide-react';
import { MOCK_ADJUSTMENT_TYPES } from '../settings/AdjustmentSetup';

interface PayComponentsProps {
  components: PayComponent[];
  setComponents: (c: PayComponent[]) => void;
  formulas: Formula[];
}

const PayComponents: React.FC<PayComponentsProps> = ({
  components,
  setComponents,
  formulas,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Editor State
  const [editor, setEditor] = useState<Partial<PayComponent>>({
    type: "earning",
    isTaxable: false,
    includeIn13thMonth: false,
    valueType: "fixed",
    archiveAfterDays: 0,
    currentVersion: '1.0.0',
    versions: []
  });

  // Adjustment Mode State
  const [isAdjustmentMode, setIsAdjustmentMode] = useState(false);
  const [selectedAdjustmentType, setSelectedAdjustmentType] = useState<string>('');

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
    setIsAdjustmentMode(false);
    setEditor({
      type: "earning",
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

  const handleOpenAddAdjustment = () => {
    setIsAdjustmentMode(true);
    setSelectedAdjustmentType('');
    setEditor({
      valueType: "fixed",
      fixedValue: 0,
      archiveAfterDays: 0,
      currentVersion: '1.0.0',
      versions: []
    });
    setModalTab('config');
    setIsModalOpen(true);
  };

  const handleAdjustmentTypeSelect = (id: string) => {
      setSelectedAdjustmentType(id);
      const adj = MOCK_ADJUSTMENT_TYPES.find(a => a.id === id);
      if (adj) {
          setEditor({
              ...editor,
              name: adj.name,
              type: adj.category === 'Earning' ? 'earning' : 'deduction',
              isTaxable: adj.isTaxable
          });
      }
  };

  const handleEdit = (c: PayComponent) => {
    if (c.isArchived || c.isSystem) return; 
    setIsAdjustmentMode(false); // Edit is standard mode
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
      type: editor.type || "earning",
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
      if(confirm(`Restore configuration from version ${historyItem.version}? unsaved changes will be lost.`)) {
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

      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });
    
    return filtered;
  }, [components, searchTerm, sortOrder, viewMode]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
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
                className={`p-2 rounded-xl transition-all ${
                  showAllValues
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
                    onClick={handleOpenAddAdjustment}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-xs font-bold shadow-sm active:scale-95"
                  >
                    <Sliders size={16} /> Add Adjustment
                  </button>
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
            {filteredAndSortedComponents.map((comp) => (
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
                  <div className={`p-2.5 rounded-xl ${comp.type === "earning" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    {comp.type === "earning" ? <Plus size={20} /> : <Banknote size={20} />}
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
                        <span>{comp.type === "earning" ? "Earnings" : "Deduction"}</span>
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
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setIsSavingVersion(false); }}>
        <div className="p-8">
            {!isSavingVersion ? (
                <>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                        {editor.id ? "Edit Component" : isAdjustmentMode ? "Add Adjustment" : "Create Component"}
                    </h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setModalTab('config')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${modalTab === 'config' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Configuration
                        </button>
                        {editor.id && (
                             <button 
                                onClick={() => setModalTab('history')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${modalTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Version History
                            </button>
                        )}
                    </div>
                </div>

                {modalTab === 'config' && (
                    <>
                    <p className="text-sm text-slate-500 font-medium mb-6">Configure how this item is calculated.</p>
                    <div className="space-y-5">
                        
                        {isAdjustmentMode && !editor.id && (
                             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-4">
                                <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Sliders size={12} /> Select Adjustment Type
                                </label>
                                <select 
                                    className="w-full border border-indigo-200 p-2 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100 text-sm font-bold text-indigo-900 cursor-pointer"
                                    value={selectedAdjustmentType}
                                    onChange={(e) => handleAdjustmentTypeSelect(e.target.value)}
                                >
                                    <option value="">-- Choose Adjustment --</option>
                                    {MOCK_ADJUSTMENT_TYPES.map(adj => (
                                        <option key={adj.id} value={adj.id}>
                                            [{adj.code}] {adj.name} ({adj.category})
                                        </option>
                                    ))}
                                </select>
                             </div>
                        )}

                        <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Component Name</label>
                        <input
                            className={`w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm font-bold text-slate-900 transition-all ${isAdjustmentMode ? 'bg-slate-100' : 'bg-slate-50'}`}
                            value={editor.name || ""}
                            onChange={(e) => setEditor({ ...editor, name: e.target.value })}
                            placeholder="e.g. Rice Subsidy"
                            readOnly={isAdjustmentMode} // Read-only in adjustment mode if selected from list
                        />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button 
                                        disabled={isAdjustmentMode}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${editor.type === "earning" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`} onClick={() => setEditor({ ...editor, type: "earning" })}>Earnings</button>
                                    <button 
                                        disabled={isAdjustmentMode}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${editor.type === "deduction" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`} onClick={() => setEditor({ ...editor, type: "deduction" })}>Deductions</button>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-2">
                                <label className={`flex items-center gap-3 p-3 border border-slate-200 rounded-xl w-full cursor-pointer transition-colors bg-white h-[42px] ${isAdjustmentMode ? 'opacity-70' : 'hover:bg-slate-50'}`}>
                                    <input type="checkbox" disabled={isAdjustmentMode} checked={editor.isTaxable} onChange={(e) => setEditor({ ...editor, isTaxable: e.target.checked })} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300" />
                                    <span className="text-xs font-bold text-slate-700">Taxable Income</span>
                                </label>
                            </div>
                        </div>
                        
                        {/* 13th Month Option - Only for Earnings */}
                        {editor.type === 'earning' && (
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-50 transition-colors bg-white">
                                <input type="checkbox" checked={editor.includeIn13thMonth} onChange={(e) => setEditor({ ...editor, includeIn13thMonth: e.target.checked })} className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-700">Include in 13th Month Computation</span>
                                </div>
                            </label>
                        )}

                        <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Value Calculation</label>
                        <select className="w-full border border-slate-200 p-3 rounded-xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 mb-3" value={editor.valueType} onChange={(e) => setEditor({ ...editor, valueType: e.target.value as any })}>
                            <option value="fixed">Fixed Amount</option>
                            <option value="formula">Custom Formula</option>
                        </select>
                        {editor.valueType === "fixed" ? (
                            <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400 font-bold">₱</span>
                            <input type="number" className="w-full border border-slate-200 p-3 pl-8 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none font-mono text-sm font-bold bg-white text-slate-900" placeholder="0.00" value={editor.fixedValue || ""} onChange={(e) => setEditor({ ...editor, fixedValue: parseFloat(e.target.value) })} />
                            </div>
                        ) : (
                            <select className="w-full border border-slate-200 p-3 rounded-xl bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500" value={editor.formulaId || ""} onChange={(e) => setEditor({ ...editor, formulaId: e.target.value })}>
                            <option value="">Select a Formula...</option>
                            {formulas.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                            </select>
                        )}
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500"><Archive size={18} /></div>
                                <div><h4 className="text-sm font-bold text-slate-900">Auto-Archive Policy</h4><p className="text-[10px] text-slate-500 font-medium">Archive if unused for days (0 to disable).</p></div>
                            </div>
                            <input type="number" min="0" className="w-16 p-2 text-center text-sm font-bold border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white text-slate-900" value={editor.archiveAfterDays || 0} onChange={(e) => setEditor({...editor, archiveAfterDays: Number(e.target.value)})} />
                        </div>
                        <button onClick={initiateSave} disabled={!editor.name} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold mt-4 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50">
                        {editor.id ? 'Save Changes' : isAdjustmentMode ? 'Create Adjustment' : 'Create Component'}
                        </button>
                    </div>
                    </>
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

export default PayComponents;
