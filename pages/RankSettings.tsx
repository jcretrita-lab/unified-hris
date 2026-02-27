
import React, { useState } from "react";
import { Rank, SalaryGrade, SubRank } from "../types";
import {
  Plus,
  Trash2,
  Shield,
  Edit2,
  X,
  Tag,
  List,
  ChevronRight,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_SALARY_GRADES: SalaryGrade[] = [
  { id: 'sg-1', code: 'SG-1', name: 'Operational Support I', amount: 16000 },
  { id: 'sg-2', code: 'SG-2', name: 'Operational Support II', amount: 18000 },
  { id: 'sg-3', code: 'SG-3', name: 'Operational Support III', amount: 20000 },
  { id: 'sg-4', code: 'SG-4', name: 'Associate I', amount: 25000 },
  { id: 'sg-5', code: 'SG-5', name: 'Associate II', amount: 30000 },
  { id: 'sg-6', code: 'SG-6', name: 'Professional I', amount: 35000 },
  { id: 'sg-7', code: 'SG-7', name: 'Professional II', amount: 45000 },
  { id: 'sg-8', code: 'SG-8', name: 'Senior Professional I', amount: 55000 },
  { id: 'sg-9', code: 'SG-9', name: 'Senior Professional II', amount: 70000 },
  { id: 'sg-10', code: 'SG-10', name: 'Management I', amount: 90000 },
  { id: 'sg-11', code: 'SG-11', name: 'Management II', amount: 120000 },
  { id: 'sg-12', code: 'SG-12', name: 'Director I', amount: 160000 },
  { id: 'sg-13', code: 'SG-13', name: 'Director II', amount: 220000 },
  { id: 'sg-14', code: 'SG-14', name: 'Executive I', amount: 350000 },
  { id: 'sg-15', code: 'SG-15', name: 'Executive II', amount: 500000 },
];

const MOCK_RANKS: Rank[] = [
  { id: 'rank-1', name: 'Support Staff', level: 1, salaryGradeId: 'sg-1', color: 'bg-slate-500' },
  { id: 'rank-2', name: 'Entry Level', level: 2, salaryGradeId: 'sg-4', color: 'bg-blue-400' },
  {
    id: 'rank-3',
    name: 'Associate',
    level: 3,
    color: 'bg-blue-600',
    subRanks: [
      { id: 'sr-3-1', name: 'Associate I', salaryGradeId: 'sg-4' },
      { id: 'sr-3-2', name: 'Associate II', salaryGradeId: 'sg-5' }
    ]
  },
  {
    id: 'rank-4',
    name: 'Professional',
    level: 4,
    color: 'bg-emerald-500',
    subRanks: [
      { id: 'sr-4-1', name: 'Intermediate I', salaryGradeId: 'sg-6' },
      { id: 'sr-4-2', name: 'Intermediate II', salaryGradeId: 'sg-7' }
    ]
  },
  {
    id: 'rank-5',
    name: 'Senior Professional',
    level: 5,
    color: 'bg-emerald-700',
    subRanks: [
      { id: 'sr-5-1', name: 'Senior I', salaryGradeId: 'sg-8' },
      { id: 'sr-5-2', name: 'Senior II', salaryGradeId: 'sg-9' }
    ]
  },
  {
    id: 'rank-6',
    name: 'Supervisory / Lead',
    level: 6,
    color: 'bg-amber-500',
    subRanks: [
      { id: 'sr-6-1', name: 'Team Lead', salaryGradeId: 'sg-9' },
      { id: 'sr-6-2', name: 'Principal Specialist', salaryGradeId: 'sg-10' },
      { id: 'sr-6-3', name: 'Supervisor', salaryGradeId: 'sg-9' }
    ]
  },
  {
    id: 'rank-7',
    name: 'Management',
    level: 7,
    color: 'bg-orange-600',
    subRanks: [
      { id: 'sr-7-1', name: 'Manager', salaryGradeId: 'sg-11' },
      { id: 'sr-7-2', name: 'Assistant Manager', salaryGradeId: 'sg-10' }
    ]
  },
  {
    id: 'rank-8',
    name: 'Senior Management',
    level: 8,
    color: 'bg-rose-600',
    subRanks: [
      { id: 'sr-8-1', name: 'Senior Manager', salaryGradeId: 'sg-12' },
      { id: 'sr-8-2', name: 'Department Head', salaryGradeId: 'sg-13' }
    ]
  },
  {
    id: 'rank-9',
    name: 'Director Level',
    level: 9,
    color: 'bg-indigo-600',
    subRanks: [
      { id: 'sr-9-1', name: 'Director', salaryGradeId: 'sg-13' },
      { id: 'sr-9-2', name: 'Senior Director', salaryGradeId: 'sg-14' },
      { id: 'sr-9-3', name: 'Associate Director', salaryGradeId: 'sg-12' }
    ]
  },
  {
    id: 'rank-10',
    name: 'Executive Leadership',
    level: 10,
    color: 'bg-purple-700',
    subRanks: [
      { id: 'sr-10-1', name: 'Vice President (VP)', salaryGradeId: 'sg-14' },
      { id: 'sr-10-2', name: 'Senior Vice President (SVP)', salaryGradeId: 'sg-15' },
      { id: 'sr-10-3', name: 'C-Suite (CXO)', salaryGradeId: 'sg-15' }
    ]
  }
];

const RankSettingsPage: React.FC = () => {
  const [ranks, setRanks] = useState<Rank[]>(MOCK_RANKS);
  const [grades] = useState<SalaryGrade[]>(MOCK_SALARY_GRADES);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rank Configuration</h1>
        <p className="text-slate-500 font-medium mt-1">Define organizational hierarchy levels and structure.</p>
      </div>
      <GlobalRanks ranks={ranks} setRanks={setRanks} grades={grades} />
    </div>
  );
};

interface GlobalRanksProps {
  ranks: Rank[];
  setRanks: (ranks: Rank[]) => void;
  grades: SalaryGrade[];
}

const GlobalRanks: React.FC<GlobalRanksProps> = ({ ranks, setRanks, grades }) => {
  // Add Mode State
  const [isAdding, setIsAdding] = useState(false);
  const [newRank, setNewRank] = useState<Partial<Rank>>({ subRanks: [] });
  const [tempSubRanks, setTempSubRanks] = useState<SubRank[]>([]);

  // SubRank input state for adding
  const [subRankInput, setSubRankInput] = useState({ name: "", gradeId: "" });

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Rank>>({});

  const addTempSubRank = () => {
    if (!subRankInput.name || !subRankInput.gradeId) return;
    const sub: SubRank = {
      id: Math.random().toString(36).substr(2, 9),
      name: subRankInput.name,
      salaryGradeId: subRankInput.gradeId,
    };
    setTempSubRanks([...tempSubRanks, sub]);
    setSubRankInput({ name: "", gradeId: "" });
  };

  const removeTempSubRank = (id: string) => {
    setTempSubRanks(tempSubRanks.filter((s) => s.id !== id));
  };

  // --- Handlers for Create ---

  const handleAdd = () => {
    if (!newRank.name) return;

    // If no subranks, we need a default grade
    if (tempSubRanks.length === 0 && !newRank.salaryGradeId) return;

    const rank: Rank = {
      id: Math.random().toString(36).substr(2, 9),
      name: newRank.name!,
      level: newRank.level || ranks.length + 1,
      salaryGradeId: newRank.salaryGradeId, // Can be undefined if subRanks exist
      subRanks: tempSubRanks,
      color: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"][
        Math.floor(Math.random() * 4)
      ],
    };

    // Sort by level automatically
    const updated = [...ranks, rank].sort((a, b) => a.level - b.level);
    setRanks(updated);
    setIsAdding(false);
    setNewRank({ subRanks: [] });
    setTempSubRanks([]);
  };

  // --- Handlers for Edit ---

  const handleStartEdit = (rank: Rank) => {
    setEditingId(rank.id);
    setEditForm({ ...rank });
    setTempSubRanks(rank.subRanks || []);
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editingId) return;
    if (tempSubRanks.length === 0 && !editForm.salaryGradeId) return;

    const updatedRanks = ranks
      .map((r) => {
        if (r.id === editingId) {
          return {
            ...r,
            name: editForm.name!,
            level: Number(editForm.level),
            salaryGradeId: editForm.salaryGradeId,
            subRanks: tempSubRanks,
          };
        }
        return r;
      })
      .sort((a, b) => a.level - b.level);

    setRanks(updatedRanks);
    setEditingId(null);
    setEditForm({});
    setTempSubRanks([]);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure? This will affect all positions using this rank as a template."
      )
    ) {
      setRanks(ranks.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Shield size={20} className="text-indigo-600" /> Rank Definitions</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Define standard hierarchy levels. Supports single-grade ranks or
            multi-tiered ranks (e.g. Teacher I, II, III).
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setTempSubRanks([]);
            setNewRank({});
          }}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 text-xs font-bold shadow-lg shadow-indigo-200"
        >
          <Plus size={16} /> Add Rank
        </button>
      </div>

      <div className="p-8 flex-1 overflow-y-auto bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Creation / Edit Card */}
          {(isAdding || editingId) && (
            <div className="col-span-1 md:col-span-2 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-6 flex flex-col gap-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold">
                  {isAdding ? <Plus size={18} /> : <Edit2 size={18} />}
                  {isAdding ? "New Rank Definition" : "Editing Rank"}
                </div>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Rank Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Rank Name
                  </label>
                  <input
                    autoFocus
                    placeholder="e.g. Senior Associate"
                    className="w-full border border-indigo-100 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 text-sm font-bold shadow-sm"
                    value={isAdding ? newRank.name || "" : editForm.name || ""}
                    onChange={(e) =>
                      isAdding
                        ? setNewRank({ ...newRank, name: e.target.value })
                        : setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    Level #
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-full border border-indigo-100 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900 text-sm font-bold shadow-sm"
                    value={isAdding ? newRank.level || "" : editForm.level || 0}
                    onChange={(e) =>
                      isAdding
                        ? setNewRank({
                          ...newRank,
                          level: Number(e.target.value),
                        })
                        : setEditForm({
                          ...editForm,
                          level: Number(e.target.value),
                        })
                    }
                  />
                </div>
              </div>

              {/* Logic Split: Single vs SubRanks */}
              <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-bold text-slate-700">
                    Rank Structure Configuration
                  </span>
                </div>

                {tempSubRanks.length === 0 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                        Single Grade Assignment
                      </label>
                      <select
                        className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm font-medium"
                        value={
                          isAdding
                            ? newRank.salaryGradeId || ""
                            : editForm.salaryGradeId || ""
                        }
                        onChange={(e) =>
                          isAdding
                            ? setNewRank({
                              ...newRank,
                              salaryGradeId: e.target.value,
                            })
                            : setEditForm({
                              ...editForm,
                              salaryGradeId: e.target.value,
                            })
                        }
                      >
                        <option value="">Select Default Grade...</option>
                        {grades.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.code} ({g.name}) - ₱{(g.amount ?? 0).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-center text-xs text-slate-400 py-4 border-t border-dashed border-slate-200 mt-6 relative">
                      <span className="bg-white px-2 relative -top-7 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                        OR ADD SUB-RANKS BELOW
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-700 flex items-center gap-2">
                    <List size={14} /> This rank uses a tiered structure. The main
                    default grade is disabled.
                  </div>
                )}

                {/* Sub Rank Builder */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                    Sub-Ranks / Tiers
                  </label>

                  {/* Add Sub Rank Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      placeholder="Tier Name (e.g. 'I', 'Senior')"
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-indigo-500 bg-white text-slate-900"
                      value={subRankInput.name}
                      onChange={(e) =>
                        setSubRankInput({ ...subRankInput, name: e.target.value })
                      }
                    />
                    <select
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-indigo-500 bg-white text-slate-900"
                      value={subRankInput.gradeId}
                      onChange={(e) =>
                        setSubRankInput({
                          ...subRankInput,
                          gradeId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Grade...</option>
                      {grades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.code}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={addTempSubRank}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      disabled={!subRankInput.name || !subRankInput.gradeId}
                    >
                      Add
                    </button>
                  </div>

                  {/* List of Sub Ranks */}
                  <div className="space-y-2">
                    {tempSubRanks.map((sub, idx) => {
                      const g = grades.find((gr) => gr.id === sub.salaryGradeId);
                      return (
                        <div
                          key={sub.id || idx}
                          className="flex justify-between items-center bg-white border border-slate-200 px-4 py-3 rounded-xl text-sm shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                              {idx + 1}
                            </div>
                            <span className="font-bold text-slate-700">
                              {sub.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-mono font-bold border border-slate-200">
                              {g?.code}
                            </span>
                            <button
                              onClick={() => removeTempSubRank(sub.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {tempSubRanks.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4">
                        No sub-ranks defined. Add one above.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={isAdding ? handleAdd : handleSaveEdit}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all text-sm"
                >
                  {isAdding ? "Create Rank" : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                  className="px-6 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-700 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Ranks Display */}
          {!isAdding &&
            !editingId &&
            ranks.map((rank) => {
              const hasSubRanks = rank.subRanks && rank.subRanks.length > 0;
              const mainGrade = grades.find((g) => g.id === rank.salaryGradeId);

              return (
                <div
                  key={rank.id}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col h-full"
                >
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleStartEdit(rank)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Rank"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(rank.id)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Rank"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${rank.color || 'bg-slate-800'} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                        {rank.level}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                          {rank.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                          <Tag size={12} />{" "}
                          {hasSubRanks ? "Tiered Structure" : "Standard Structure"}
                        </div>
                      </div>
                    </div>

                    {/* SubRanks Section - Now unified for both cases */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                      <div className="text-[10px] font-bold text-slate-400 uppercase px-4 py-3 bg-slate-100/50 flex justify-between tracking-widest border-b border-slate-100">
                        <span>{hasSubRanks ? 'Tiers / Sub-Ranks' : 'Role Structure'}</span>
                        <span>Salary Grade</span>
                      </div>

                      {hasSubRanks ? (
                        <div className="divide-y divide-slate-100">
                          {rank.subRanks?.map((sub, i) => {
                            const sg = grades.find(
                              (g) => g.id === sub.salaryGradeId
                            );
                            return (
                              <div
                                key={i}
                                className="px-4 py-3 flex justify-between items-center text-sm hover:bg-white transition-colors"
                              >
                                <span className="text-slate-700 font-bold flex items-center gap-2">
                                  <ChevronRight
                                    size={14}
                                    className="text-slate-300"
                                  />{" "}
                                  {sub.name}
                                </span>
                                <span className="font-mono text-slate-500 text-[10px] bg-white px-2 py-1 rounded border border-slate-200 font-bold">
                                  {sg?.code}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Show unified format for ranks without subranks
                        <div className="divide-y divide-slate-100">
                          <div className="px-4 py-6 flex flex-col items-center justify-center text-center">

                            <div className="flex justify-between items-center w-full text-sm">
                              <span className="text-slate-700 font-bold flex items-center gap-2">
                                <ChevronRight
                                  size={14}
                                  className="text-slate-300"
                                />
                                Standard Level
                              </span>
                              <div className="flex flex-col items-end">
                                <span className="font-mono text-slate-500 text-[10px] bg-white px-2 py-1 rounded border border-slate-200 font-bold">
                                  {mainGrade?.code || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {!isAdding && ranks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl m-4">
            <Shield size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-slate-600 mb-1">No ranks defined.</p>
            <p className="text-sm font-medium">
              Create standard ranks or tiered ranks like "Specialist I, II,
              III".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankSettingsPage;
