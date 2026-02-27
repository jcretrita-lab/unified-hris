
import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckSquare, 
  X, 
  Save, 
  Lock, 
  Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';

// Types
interface FieldConfig {
  id: string;
  label: string;
  type: 'Text' | 'Number' | 'Date' | 'Select' | 'Checkbox' | 'File' | 'Email';
  required: boolean;
  options?: string[]; // Comma separated for editing
  validation?: string;
  placeholder?: string;
  section: 'Personal Details' | 'Company Details' | 'Other Details';
  isSystem: boolean; // Cannot delete
}

const MOCK_FIELDS: FieldConfig[] = [
  // --- PERSONAL DETAILS ---
  // Identity
  { id: 'p1', label: 'First Name', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p2', label: 'Middle Name', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p3', label: 'Last Name', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p4', label: 'Nickname', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p5', label: 'Date of Birth', type: 'Date', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p6', label: 'Gender', type: 'Select', required: true, options: ['Male', 'Female', 'Other'], section: 'Personal Details', isSystem: true },
  { id: 'p7', label: 'Marital Status', type: 'Select', required: true, options: ['Single', 'Married', 'Widowed', 'Separated'], section: 'Personal Details', isSystem: true },
  
  // Physical & Demographic
  { id: 'p8', label: 'Blood Type', type: 'Select', required: false, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], section: 'Personal Details', isSystem: true },
  { id: 'p9', label: 'Nationality', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p10', label: 'Citizenship', type: 'Select', required: false, options: ['Filipino', 'American', 'Chinese', 'Japanese', 'Dual Citizen'], section: 'Personal Details', isSystem: true },
  { id: 'p11', label: 'Religion', type: 'Select', required: false, options: ['Roman Catholic', 'Islam', 'Iglesia ni Cristo', 'Christian', 'Buddhism', 'Hinduism', 'Other'], section: 'Personal Details', isSystem: true },
  { id: 'p12', label: 'Birth Place', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p13', label: 'Complexion', type: 'Select', required: false, options: ['Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark'], section: 'Personal Details', isSystem: true },
  { id: 'p14', label: 'Height (cm)', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p15', label: 'Weight (kg)', type: 'Text', required: false, section: 'Personal Details', isSystem: true },

  // Contact
  { id: 'p16', label: 'Personal Email', type: 'Email', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p17', label: 'Mobile Number', type: 'Text', required: true, section: 'Personal Details', isSystem: true },

  // Addresses
  { id: 'p18', label: 'Current Address (Street)', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p19', label: 'Current Barangay', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p20', label: 'Current City', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p21', label: 'Current Province', type: 'Text', required: true, section: 'Personal Details', isSystem: true },
  { id: 'p22', label: 'Permanent Address (Street)', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p23', label: 'Permanent Barangay', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p24', label: 'Permanent City', type: 'Text', required: false, section: 'Personal Details', isSystem: true },
  { id: 'p25', label: 'Permanent Province', type: 'Text', required: false, section: 'Personal Details', isSystem: true },

  // --- COMPANY DETAILS ---
  // Core Employment
  { id: 'c1', label: 'Employee ID', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c2', label: 'Company Email', type: 'Email', required: true, section: 'Company Details', isSystem: true },
  { id: 'c3', label: 'Proximity ID', type: 'Text', required: false, section: 'Company Details', isSystem: true },
  { id: 'c4', label: 'Company Name', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c5', label: 'Subsidiary', type: 'Text', required: false, section: 'Company Details', isSystem: true },
  { id: 'c6', label: 'Department', type: 'Select', required: true, section: 'Company Details', isSystem: true },
  { id: 'c7', label: 'Section', type: 'Text', required: false, section: 'Company Details', isSystem: true },
  { id: 'c8', label: 'Position', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c9', label: 'Job Level', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c10', label: 'Employment Status', type: 'Select', required: true, options: ['Regular', 'Probationary', 'Contractual', 'Intern'], section: 'Company Details', isSystem: true },
  { id: 'c11', label: 'Work Schedule', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c12', label: 'Immediate Supervisor', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c13', label: 'Department Head', type: 'Text', required: true, section: 'Company Details', isSystem: true },

  // Important Dates
  { id: 'c14', label: 'Date Hired', type: 'Date', required: true, section: 'Company Details', isSystem: true },
  { id: 'c15', label: 'Date Apprentice', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c16', label: 'Date Probationary', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c17', label: 'Date of Contract', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c18', label: 'Date Regularization', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c19', label: 'Date Transferred', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c20', label: 'Contract End Date', type: 'Date', required: false, section: 'Company Details', isSystem: true },
  { id: 'c21', label: 'Date Resigned', type: 'Date', required: false, section: 'Company Details', isSystem: true },

  // Gov & Tax
  { id: 'c22', label: 'TIN', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c23', label: 'SSS Number', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c24', label: 'PhilHealth', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c25', label: 'Pag-IBIG / HDMF', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c26', label: 'Tax Status', type: 'Select', required: true, options: ['Taxable', 'Non-Taxable', 'M1', 'M2', 'S1', 'S2'], section: 'Company Details', isSystem: true },
  { id: 'c27', label: 'Tax Exempted', type: 'Checkbox', required: false, section: 'Company Details', isSystem: true },
  { id: 'c28', label: 'Tax 10%', type: 'Checkbox', required: false, section: 'Company Details', isSystem: true },

  // Bank
  { id: 'c29', label: 'Bank Name', type: 'Select', required: true, options: ['BDO', 'BPI', 'Metrobank', 'UnionBank', 'Chinabank', 'Security Bank', 'PNB', 'Landbank'], section: 'Company Details', isSystem: true },
  { id: 'c30', label: 'Account Number', type: 'Text', required: true, section: 'Company Details', isSystem: true },
  { id: 'c31', label: 'Account Holder', type: 'Text', required: true, section: 'Company Details', isSystem: true },

  // --- OTHER DETAILS ---
  
  // Education (List Items)
  { id: 'ed1', label: 'Education - Attainment', type: 'Select', options: ['High School', 'Bachelor', 'Master', 'PhD', 'Vocational'], required: true, section: 'Other Details', isSystem: true },
  { id: 'ed2', label: 'Education - Course', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ed3', label: 'Education - School', type: 'Text', required: true, section: 'Other Details', isSystem: true },
  { id: 'ed4', label: 'Education - Date Graduated', type: 'Date', required: true, section: 'Other Details', isSystem: true },

  // Exam/Seminars (List Items)
  { id: 'ex1', label: 'Exam - Date Taken', type: 'Date', required: false, section: 'Other Details', isSystem: true },
  { id: 'ex2', label: 'Exam - Name', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ex3', label: 'Exam - Rating', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ex4', label: 'Exam - Description', type: 'Text', required: false, section: 'Other Details', isSystem: true },

  // Previous Employment (List Items)
  { id: 'em1', label: 'Employment - Company', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'em2', label: 'Employment - Address', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'em3', label: 'Employment - Position', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'em4', label: 'Employment - Department', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'em5', label: 'Employment - Date Started', type: 'Date', required: false, section: 'Other Details', isSystem: true },
  { id: 'em6', label: 'Employment - Date Resigned', type: 'Date', required: false, section: 'Other Details', isSystem: true },

  // References (List Items)
  { id: 'ref1', label: 'Reference - Last Name', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ref2', label: 'Reference - First Name', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ref3', label: 'Reference - Position', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ref4', label: 'Reference - Contact No', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ref5', label: 'Reference - Business', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'ref6', label: 'Reference - Address', type: 'Text', required: false, section: 'Other Details', isSystem: true },

  // Family (List Items)
  { id: 'fam1', label: 'Family - Relationship', type: 'Select', options: ['Spouse', 'Child', 'Parent', 'Sibling'], required: false, section: 'Other Details', isSystem: true },
  { id: 'fam2', label: 'Family - Last Name', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'fam3', label: 'Family - First Name', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'fam4', label: 'Family - Birthday', type: 'Date', required: false, section: 'Other Details', isSystem: true },
  { id: 'fam5', label: 'Family - Occupation', type: 'Text', required: false, section: 'Other Details', isSystem: true },
  { id: 'fam6', label: 'Family - Address', type: 'Text', required: false, section: 'Other Details', isSystem: true },

  // Emergency Contact (List Items)
  { id: 'ec1', label: 'Emergency - Relationship', type: 'Text', required: true, section: 'Other Details', isSystem: true },
  { id: 'ec2', label: 'Emergency - Last Name', type: 'Text', required: true, section: 'Other Details', isSystem: true },
  { id: 'ec3', label: 'Emergency - First Name', type: 'Text', required: true, section: 'Other Details', isSystem: true },
  { id: 'ec4', label: 'Emergency - Contact No', type: 'Text', required: true, section: 'Other Details', isSystem: true },
  { id: 'ec5', label: 'Emergency - Email', type: 'Email', required: false, section: 'Other Details', isSystem: true },

  // Custom Fields (Mock Examples)
  { id: 'o1', label: 'T-Shirt Size', type: 'Select', required: false, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], section: 'Other Details', isSystem: false },
  { id: 'o2', label: 'Allergies', type: 'Text', required: false, section: 'Other Details', isSystem: false },
  { id: 'o3', label: 'Parking Slot Required', type: 'Checkbox', required: false, section: 'Other Details', isSystem: false },
  { id: 'o4', label: 'Laptop Asset Tag', type: 'Text', required: false, section: 'Other Details', isSystem: false },
];

const EmployeeFieldsSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Personal Details' | 'Company Details' | 'Other Details'>('Personal Details');
  const [fields, setFields] = useState<FieldConfig[]>(MOCK_FIELDS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<FieldConfig>>({
    label: '',
    type: 'Text',
    required: false,
    options: [],
    validation: '',
    placeholder: ''
  });
  
  // Helper for Options string input
  const [optionsString, setOptionsString] = useState('');

  const activeFields = fields.filter(f => f.section === activeTab);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      label: '',
      type: 'Text',
      required: false,
      validation: '',
      placeholder: ''
    });
    setOptionsString('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (field: FieldConfig) => {
    setEditingId(field.id);
    setForm({ ...field });
    // Join with newlines for easier editing, fallback to commas if needed for legacy data
    setOptionsString(field.options ? field.options.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.label || !form.type) return;

    // Split options by newline OR comma to be flexible
    const parsedOptions = (form.type === 'Select') 
      ? optionsString.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) 
      : undefined;

    const payload: FieldConfig = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      label: form.label!,
      type: form.type as any,
      required: form.required || false,
      validation: form.validation || '',
      placeholder: form.placeholder || '',
      section: activeTab,
      isSystem: editingId ? (fields.find(f => f.id === editingId)?.isSystem || false) : false,
      options: parsedOptions
    };

    if (editingId) {
      setFields(fields.map(f => f.id === editingId ? payload : f));
    } else {
      setFields([...fields, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this field? Existing data for this field might be hidden.')) {
      setFields(fields.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Employee Profile Configuration
            <ClipboardList className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Customize the data fields captured for personnel records.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Add Custom Field
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {['Personal Details', 'Company Details', 'Other Details'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-4 text-sm font-bold transition-all relative ${
              activeTab === tab 
                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/40">
              <tr>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Field Label</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Data Type</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Validation & Constraints</th>
                <th className="px-8 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mandatory</th>
                <th className="px-8 py-5 text-right w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {activeFields.map((field) => (
                  <motion.tr 
                    key={field.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {field.isSystem && (
                            <div className="p-1.5 bg-slate-100 text-slate-500 rounded border border-slate-200" title="System Field">
                                <Lock size={12} />
                            </div>
                        )}
                        <span className="text-sm font-bold text-slate-900">{field.label}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded border border-slate-200">
                        {field.type}
                      </span>
                      {field.type === 'Select' && (
                          <span className="text-[10px] text-slate-400 ml-2 italic">
                              {field.options?.length} options
                          </span>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-xs text-slate-500 font-medium">
                            {field.validation || <span className="text-slate-300 italic">None</span>}
                        </span>
                    </td>
                    <td className="px-8 py-5 text-center whitespace-nowrap">
                        {field.required ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase tracking-wide">
                                <CheckSquare size={12} /> Yes
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Optional</span>
                        )}
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleOpenEdit(field)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                            <Edit2 size={16} />
                        </button>
                        {!field.isSystem && (
                            <button 
                                onClick={() => handleDelete(field.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {activeFields.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic text-sm">
                  No fields configured for this section.
              </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-xl">
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Field' : 'Add New Field'}</h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><ClipboardList size={20} /></div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Field Label</label>
                    <input 
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                        placeholder="e.g. Nickname"
                        value={form.label}
                        onChange={e => setForm({ ...form, label: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Input Type</label>
                        <select 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                            value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value as any })}
                            disabled={Boolean(editingId && fields.find(f => f.id === editingId)?.isSystem)} // Prevent changing type of system fields
                        >
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Date">Date</option>
                            <option value="Select">Dropdown (Select)</option>
                            <option value="Email">Email</option>
                            <option value="Checkbox">Checkbox</option>
                            <option value="File">File Upload</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Validation Rule / Criteria</label>
                        <input 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all"
                            placeholder="e.g. Max 50 chars"
                            value={form.validation}
                            onChange={e => setForm({ ...form, validation: e.target.value })}
                        />
                    </div>
                </div>

                {form.type === 'Select' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dropdown Options</label>
                        <textarea 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all resize-none h-24"
                            placeholder="Option 1, Option 2, Option 3 (Comma or Newline separated)"
                            value={optionsString}
                            onChange={e => setOptionsString(e.target.value)}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 italic">Separate options with commas or new lines.</p>
                    </div>
                )}

                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Placeholder Text</label>
                    <input 
                        className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-medium text-slate-900 transition-all"
                        placeholder="e.g. Enter value here..."
                        value={form.placeholder}
                        onChange={e => setForm({ ...form, placeholder: e.target.value })}
                    />
                </div>

                <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${form.required ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                        {form.required && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={Boolean(form.required)} 
                        onChange={e => setForm({...form, required: e.target.checked})} 
                    />
                    <div>
                        <span className="text-sm font-bold text-slate-800 block">Mark as Mandatory</span>
                        <span className="text-[10px] text-slate-400 font-medium block">Employees cannot save their profile if this field is empty.</span>
                    </div>
                </label>

                {editingId && fields.find(f => f.id === editingId)?.isSystem && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100">
                        <Info size={16} />
                        This is a system field. Some properties cannot be changed.
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                        {editingId ? 'Save Changes' : 'Create Field'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeFieldsSetup;
