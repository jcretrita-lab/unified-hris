// src/components/RankLabelsModal.tsx
import React, { useState } from 'react';
import Modal from './Modal'; 
import { Rank } from '../types';

interface RankLabelsModalProps {
  initialRanks: Rank[]; // Receive the current list of ranks
  onSave: (updatedRanks: Rank[]) => void; 
  onClose: () => void; // close the modal
}

const RankLabelsModal: React.FC<RankLabelsModalProps> = ({ initialRanks, onSave, onClose }) => {
  // Use state to hold the editable rank list within the modal
  const [editableRanks, setEditableRanks] = useState<Rank[]>(initialRanks);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (rankId: string, newName: string) => {
    setEditableRanks(prev =>
      prev.map(r => r.id === rankId ? { ...r, name: newName } : r)
    );
    if (error) setError(null); // Clear error if it exists
  };

  const handleSave = () => {
     const emptyNameExists = editableRanks.some(rank => !rank.name || rank.name.trim() === '');
    if (emptyNameExists) {
      setError("Rank names cannot be empty. Please enter a name for all ranks.");
      return; // Stop execution if validation fails
    }
    onSave(editableRanks); // Pass the modified list back
    onClose(); // Close modal after saving
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-1xl"> 
        <h2 className="text-lg font-semibold mb-4">Edit Rank Names (Bulk Rename)</h2>
        <p className="text-sm text-slate-500 mb-4">Quickly review and rename existing job rank titles.</p>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {editableRanks.map((rank) => (
            <div key={rank.id} className="flex items-center gap-3 py-1 border-b border-slate-100 last:border-b-0">
              <div className="flex-1 min-w-0">
                {/* UPDATED LABEL: Shows "Level Number: Rank Name" */}
                <label className="text-sm font-medium text-slate-600 truncate block">
                  {rank.level}: {rank.name}
                </label>
              </div>
              <input
                className="flex-[2] min-w-[150px] border rounded px-2 py-1 text-sm"
                value={rank.name}
                onChange={(e) => handleNameChange(rank.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3"> 
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RankLabelsModal;