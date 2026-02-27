import React from 'react';
import { 
  Lock, 
  CheckSquare, 
  FileText, 
  Eye, 
  Upload, 
  ChevronDown 
} from 'lucide-react';
import { ExtendedProfile } from '../../../model/Profile';

// --- Constants ---

export const RELIGIONS = ['Roman Catholic', 'Islam', 'Iglesia ni Cristo', 'Christian', 'Buddhism', 'Hinduism', 'Other'];
export const CITIZENSHIPS = ['Filipino', 'American', 'Chinese', 'Japanese', 'Dual Citizen'];
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const COMPLEXIONS = ['Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark'];
export const CITIES = ['San Francisco', 'Los Angeles', 'New York', 'Manila', 'Cebu City', 'Quezon City', 'Makati', 'Davao'];
export const PROVINCES = ['California', 'Illinois', 'Metro Manila', 'Cebu', 'Davao del Sur', 'Cavite', 'Laguna'];
export const BARANGAYS = ['SoMa', 'Downtown', 'Bel-Air', 'San Lorenzo', 'Poblacion', 'Ugong', 'San Antonio'];
export const TAX_STATUSES = ['Taxable', 'Non-Taxable', 'M1', 'M2', 'S1', 'S2'];
export const BANKS = ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'Chinabank', 'Security Bank', 'PNB', 'Landbank'];

// --- Helper Functions ---

export const calculateAge = (dob: string) => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

// --- Components ---

interface EditableFieldProps {
  label: string;
  value: string;
  field: keyof ExtendedProfile;
  formData: ExtendedProfile;
  onUpdate: (field: keyof ExtendedProfile, value: any) => void;
  isEditing: boolean;
  fullWidth?: boolean;
  type?: string;
  options?: string[];
  disabled?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  field, 
  formData,
  onUpdate,
  isEditing,
  fullWidth = false, 
  type = 'text', 
  options = [],
  disabled = false
}) => {
  const isSelect = type === 'select';
  
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1">
          {label}
          {disabled && isEditing && <Lock size={10} className="text-slate-400" />}
      </label>
      {isEditing ? (
        isSelect && !disabled ? (
          <div className="relative">
              <select
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              value={value as string}
              onChange={(e) => onUpdate(field, e.target.value)}
              >
              <option value="">Select {label}</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
              </div>
          </div>
        ) : (
          <div className="relative">
              <input
              type={type}
              disabled={disabled}
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold border transition-all outline-none 
                  ${disabled 
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
                      : 'bg-white text-slate-800 border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500'}`}
              value={value as string}
              onChange={(e) => onUpdate(field, e.target.value)}
              />
          </div>
        )
      ) : (
        <div className="px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm min-h-[46px] flex items-center">
          {value || <span className="text-slate-300 italic">Not set</span>}
        </div>
      )}
    </div>
  );
};

interface EditableCheckboxProps {
  label: string;
  field: keyof ExtendedProfile;
  formData: ExtendedProfile;
  onUpdate: (field: keyof ExtendedProfile, value: any) => void;
  isEditing: boolean;
}

export const EditableCheckbox: React.FC<EditableCheckboxProps> = ({ label, field, formData, onUpdate, isEditing }) => (
  <div className={`flex items-center gap-3 p-3.5 border rounded-xl h-full transition-colors ${formData[field] ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-200'}`}>
      {isEditing ? (
          <div className="relative flex items-center">
              <input 
                  type="checkbox" 
                  className="peer w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  checked={!!formData[field]}
                  onChange={(e) => onUpdate(field, e.target.checked)}
              />
          </div>
      ) : (
          <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData[field] ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
              {formData[field] && <CheckSquare size={14} />}
          </div>
      )}
      <label className={`text-sm font-bold select-none ${formData[field] ? 'text-indigo-900' : 'text-slate-600'}`}>{label}</label>
  </div>
);

export const SectionHeader = ({ icon: Icon, title, color = "indigo" }: { icon: any, title: string, color?: string }) => {
    const colorClasses: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        blue: 'bg-blue-50 text-blue-600',
        rose: 'bg-rose-50 text-rose-600',
    };
    
    return (
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}>
                <Icon size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h4>
        </div>
    );
};

export const AttachmentCard = ({ title, filename, isEditing }: { title: string, filename: string, isEditing: boolean }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-colors shadow-sm group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <FileText size={20} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{filename}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View File">
        <Eye size={18} />
      </button>
      {isEditing && (
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Upload New">
          <Upload size={18} />
        </button>
      )}
    </div>
  </div>
);
