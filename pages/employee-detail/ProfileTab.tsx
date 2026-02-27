import React from 'react';
import { Employee } from '../../types';
import { Edit2, Save, X } from 'lucide-react';
import { useProfileViewModel } from '../../viewmodel/useProfileViewModel';
import PersonalDetails from './profile/PersonalDetails';
import CompanyDetails from './profile/CompanyDetails';
import OtherDetails from './profile/OtherDetails';

interface ProfileTabProps {
  employee: Employee;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ employee }) => {
  const {
    activeSubTab,
    setActiveSubTab,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleSave,
    handleCancel
  } = useProfileViewModel(employee);

  const profileSubTabs = ['Personal Details', 'Company Details', 'Other Details'];

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex p-1 gap-1 w-full md:w-auto overflow-x-auto">
          {profileSubTabs.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubTab(sub)}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap
                ${activeSubTab === sub 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pr-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                <X size={14} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Save size={14} /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
            >
              <Edit2 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 lg:p-10 shadow-sm min-h-[600px]">
         {activeSubTab === 'Personal Details' && (
            <PersonalDetails 
              formData={formData} 
              setFormData={setFormData} 
              isEditing={isEditing} 
            />
         )}

         {activeSubTab === 'Company Details' && (
            <CompanyDetails 
              formData={formData} 
              setFormData={setFormData} 
              isEditing={isEditing} 
            />
         )}

         {activeSubTab === 'Other Details' && (
            <OtherDetails isEditing={isEditing} />
         )}
      </div>
    </div>
  );
};

export default ProfileTab;
