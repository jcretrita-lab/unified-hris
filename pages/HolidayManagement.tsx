
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  CalendarDays, 
  Edit2, 
  Trash2, 
  Flag,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import Modal from '../components/Modal';

interface Holiday {
  id: string;
  name: string;
  frequency: 'Yearly' | 'One Time';
  date: string;
  type: 'Regular' | 'Special Non-Working' | 'Special Working';
  addedBy: string;
  dateAdded: string;
  assignedTo?: 'Nationwide' | 'Site';
  siteIds?: string[];
}

const MOCK_SITES = ['Makati Head Office', 'Cebu Branch', 'Davao Branch', 'Laguna Plant'];

const MOCK_HOLIDAYS: Holiday[] = [
  {
    id: '1',
    name: 'National Heroes Day',
    frequency: 'Yearly',
    date: '2026-08-25',
    type: 'Regular',
    addedBy: 'Louis Panganiban',
    dateAdded: 'Aug 8, 2025 23:56',
    assignedTo: 'Nationwide'
  },
  {
    id: '2',
    name: 'Manila Non-Working Day',
    frequency: 'One Time',
    date: '2026-08-21',
    type: 'Special Non-Working',
    addedBy: 'Juan Dela Cruz',
    dateAdded: 'Aug 8, 2025 12:05',
    assignedTo: 'Site',
    siteIds: ['Makati Head Office']
  },
  {
    id: '3',
    name: 'All Saints Day',
    frequency: 'Yearly',
    date: '2026-11-01',
    type: 'Special Non-Working',
    addedBy: 'Juan Dela Cruz',
    dateAdded: 'Aug 8, 2025 12:05',
    assignedTo: 'Nationwide'
  }
];

const HolidayManagement: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(MOCK_HOLIDAYS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Dropdown states
  const [siteSearch, setSiteSearch] = useState('');
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Holiday>>({
    name: '',
    frequency: 'Yearly',
    date: '',
    type: 'Regular',
    assignedTo: 'Nationwide',
    siteIds: []
  });

  const handleOpenModal = (holiday?: Holiday) => {
    setSiteSearch('');
    setIsSiteDropdownOpen(false);
    
    if (holiday) {
      setEditingId(holiday.id);
      setFormData({ ...holiday });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        frequency: 'Yearly',
        date: new Date().toISOString().split('T')[0],
        type: 'Regular',
        assignedTo: 'Nationwide',
        siteIds: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.date) return;

    const payload: Holiday = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      frequency: formData.frequency || 'Yearly',
      date: formData.date,
      type: formData.type || 'Regular',
      addedBy: 'Current User',
      dateAdded: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
      assignedTo: formData.assignedTo || 'Nationwide',
      siteIds: formData.assignedTo === 'Site' ? formData.siteIds : undefined
    };

    if (editingId) {
      setHolidays(holidays.map(h => h.id === editingId ? payload : h));
    } else {
      setHolidays([...holidays, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this holiday?')) {
      setHolidays(holidays.filter(h => h.id !== id));
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getDayOfWeek = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  };

  const toggleSite = (site: string) => {
    const current = formData.siteIds || [];
    if (current.includes(site)) {
        setFormData({ ...formData, siteIds: current.filter(s => s !== site) });
    } else {
        setFormData({ ...formData, siteIds: [...current, site] });
    }
  };

  const filteredHolidays = holidays.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Available sites for dropdown (exclude selected)
  const availableSites = MOCK_SITES.filter(s => 
    !formData.siteIds?.includes(s) && 
    s.toLowerCase().includes(siteSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Holiday Management
            <Flag className="text-indigo-600" size={24} />
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage public holidays and special non-working days.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} />
          Add Holiday
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search holidays..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none text-slate-700" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-50">
            <thead className="bg-slate-50/40">
              <tr>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Holiday Name</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Frequency</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workday</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHolidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{holiday.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit mt-1 ${
                            holiday.type === 'Regular' ? 'bg-indigo-50 text-indigo-600' :
                            holiday.type === 'Special Non-Working' ? 'bg-rose-50 text-rose-600' :
                            'bg-amber-50 text-amber-600'
                        }`}>
                            {holiday.type}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        {holiday.frequency === 'Yearly' ? <RotateCcw size={14} className="text-slate-400" /> : <CalendarDays size={14} className="text-slate-400" />}
                        <span className="text-xs font-bold text-slate-600">
                            {holiday.frequency}
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-700">
                        {formatDateDisplay(holiday.date)}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {getDayOfWeek(holiday.date)}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    {holiday.assignedTo === 'Nationwide' ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Globe size={14} className="text-slate-400" /> Nationwide
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <MapPin size={14} className="text-slate-400" /> Site-Specific
                            </div>
                            {holiday.siteIds && holiday.siteIds.length > 0 && (
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                    {holiday.siteIds.length} Site{holiday.siteIds.length > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    )}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(holiday)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(holiday.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4">Showing {filteredHolidays.length} Holidays</span>
            <div className="flex gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50"><ChevronLeft size={16}/></button>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600"><ChevronRight size={16}/></button>
            </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-3xl">
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Holiday' : 'Create Holiday'}</h3>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Flag size={20} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Details */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Holiday Name</label>
                        <input 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                            placeholder="e.g. Independence Day"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                            <input 
                                type="date"
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Frequency</label>
                            <select 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold text-slate-900 transition-all cursor-pointer"
                                value={formData.frequency}
                                onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                            >
                                <option value="Yearly">Yearly (Recurring)</option>
                                <option value="One Time">One Time</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Holiday Type</label>
                        <div className="flex flex-col gap-2">
                            {['Regular', 'Special Non-Working', 'Special Working'].map(t => (
                                <label key={t} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.type === t ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input 
                                        type="radio"
                                        name="holidayType"
                                        checked={formData.type === t}
                                        onChange={() => setFormData({ ...formData, type: t as any })}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.type === t ? 'border-indigo-600 bg-indigo-600' : 'border-slate-400'}`}>
                                        {formData.type === t && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`text-xs font-bold ${formData.type === t ? 'text-indigo-900' : 'text-slate-600'}`}>{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Assignment */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col h-full">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Assignment Scope</h4>
                    
                    <div className="space-y-3 mb-6">
                        <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.assignedTo === 'Nationwide' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <input 
                                type="radio" 
                                name="assignedTo" 
                                checked={formData.assignedTo === 'Nationwide'} 
                                onChange={() => setFormData({...formData, assignedTo: 'Nationwide'})} 
                                className="hidden"
                            />
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.assignedTo === 'Nationwide' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                                <Globe size={20} />
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-bold block ${formData.assignedTo === 'Nationwide' ? 'text-emerald-900' : 'text-slate-700'}`}>Nationwide</span>
                                <span className="text-[10px] text-slate-500">Applies to all employees</span>
                            </div>
                            {formData.assignedTo === 'Nationwide' && <Check size={16} className="text-emerald-600" strokeWidth={3} />}
                        </label>

                        <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.assignedTo === 'Site' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                            <input 
                                type="radio" 
                                name="assignedTo" 
                                checked={formData.assignedTo === 'Site'} 
                                onChange={() => setFormData({...formData, assignedTo: 'Site'})} 
                                className="hidden"
                            />
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.assignedTo === 'Site' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-400'}`}>
                                <MapPin size={20} />
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm font-bold block ${formData.assignedTo === 'Site' ? 'text-indigo-900' : 'text-slate-700'}`}>Specific Sites</span>
                                <span className="text-[10px] text-slate-500">Only for selected locations</span>
                            </div>
                            {formData.assignedTo === 'Site' && <Check size={16} className="text-indigo-600" strokeWidth={3} />}
                        </label>
                    </div>

                    {formData.assignedTo === 'Site' && (
                        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-top-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Select Locations</label>
                            
                            <div className="relative mb-3">
                                <div 
                                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-sm font-medium flex justify-between items-center cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
                                    onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
                                >
                                    <span className="text-slate-500">Add a location...</span>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSiteDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isSiteDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 border-b border-slate-50">
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                                <Search size={14} className="text-slate-400" />
                                                <input 
                                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none w-full placeholder:text-slate-400"
                                                    placeholder="Search available sites..."
                                                    value={siteSearch}
                                                    onChange={e => setSiteSearch(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-40 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                                            {availableSites.length > 0 ? availableSites.map(site => (
                                                <div 
                                                    key={site} 
                                                    className="px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                                                    onClick={() => {
                                                        toggleSite(site);
                                                        setSiteSearch('');
                                                    }}
                                                >
                                                    {site}
                                                    <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )) : (
                                                <div className="p-4 text-xs text-slate-400 text-center italic">No matching sites found</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 overflow-y-auto max-h-32">
                                <div className="flex flex-wrap gap-2">
                                    {formData.siteIds?.map(site => (
                                        <div key={site} className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 pl-3 pr-1 py-1 rounded-lg shadow-sm group">
                                            <span className="text-xs font-bold text-indigo-700">{site}</span>
                                            <button onClick={() => toggleSite(site)} className="p-1 hover:bg-white hover:text-rose-500 rounded-md text-indigo-400 transition-colors">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.siteIds || formData.siteIds.length === 0) && (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 py-4">
                                            <MapPin size={24} className="mb-2 opacity-50" />
                                            <span className="text-xs italic">No locations selected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-8 flex gap-3 border-t border-slate-100 mt-2">
                <button onClick={handleSave} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 text-sm">
                    {editingId ? 'Save Changes' : 'Create Holiday'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                    Cancel
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default HolidayManagement;
