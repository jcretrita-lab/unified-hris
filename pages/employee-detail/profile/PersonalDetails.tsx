import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Trash2, 
  MapPin, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { 
  EditableField, 
  RELIGIONS, 
  CITIZENSHIPS, 
  BLOOD_TYPES, 
  COMPLEXIONS, 
  CITIES, 
  PROVINCES, 
  BARANGAYS, 
  SectionHeader, 
  AttachmentCard,
  calculateAge 
} from './ProfileShared';
import { ExtendedProfile } from '../../../model/Profile';

interface PersonalDetailsProps {
  formData: ExtendedProfile;
  setFormData: (data: ExtendedProfile) => void;
  isEditing: boolean;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ 
  formData, 
  setFormData, 
  isEditing 
}) => {
  const MotionDiv = motion.div as any;
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const handleUpdate = (field: keyof ExtendedProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      handleUpdate('avatar', url);
    }
  };

  const handleDeletePhoto = () => {
    handleUpdate('avatar', 'https://via.placeholder.com/150');
  };

  const handleAddressCopy = () => {
    const newState = !sameAsCurrent;
    setSameAsCurrent(newState);
    if (newState) {
      setFormData({
        ...formData,
        permanentStreet: formData.currentStreet,
        permanentBarangay: formData.currentBarangay,
        permanentCity: formData.currentCity,
        permanentProvince: formData.currentProvince
      });
    }
  };

  return (
    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       
       {/* Photo Section */}
       <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="w-full md:w-auto flex flex-col items-center">
                <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full p-1 bg-white border-2 border-slate-100 shadow-lg">
                        <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                            <label className="cursor-pointer flex flex-col items-center text-white text-xs font-bold">
                                <Camera size={20} className="mb-1" />
                                Upload
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </label>
                        </div>
                    )}
                </div>
                {isEditing && (
                    <button onClick={handleDeletePhoto} className="text-xs text-rose-500 font-bold hover:underline">Remove Photo</button>
                )}
           </div>

           <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <EditableField label="First Name" value={formData.firstName} field="firstName" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                <EditableField label="Middle Name" value={formData.middleName} field="middleName" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                <EditableField label="Last Name" value={formData.lastName} field="lastName" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                
                <EditableField label="Nickname" value={formData.nickname} field="nickname" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                <EditableField label="Date of Birth" value={formData.dob} field="dob" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Age</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-500 shadow-sm flex items-center">
                        {calculateAge(formData.dob)} years old
                    </div>
                </div>
           </div>
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EditableField label="Gender" value={formData.gender} field="gender" type="select" options={['Male', 'Female', 'Other']} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Marital Status" value={formData.maritalStatus} field="maritalStatus" type="select" options={['Single', 'Married', 'Widowed', 'Separated']} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Nationality" value={formData.nationality} field="nationality" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Citizenship" value={formData.citizenship} field="citizenship" type="select" options={CITIZENSHIPS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          
          <EditableField label="Height" value={formData.height} field="height" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Weight" value={formData.weight} field="weight" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Blood Type" value={formData.bloodType} field="bloodType" type="select" options={BLOOD_TYPES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Complexion" value={formData.complexion} field="complexion" type="select" options={COMPLEXIONS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          
          <EditableField label="Religion" value={formData.religion} field="religion" type="select" options={RELIGIONS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Birth Place" value={formData.birthPlace} field="birthPlace" type="select" options={CITIES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Personal Email" value={formData.email} field="email" type="email" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
          <EditableField label="Mobile Number" value={formData.mobile} field="mobile" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       {/* Addresses */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SectionHeader icon={MapPin} title="Current Address" color="indigo" />
            <div className="grid grid-cols-1 gap-5">
                <EditableField label="Street / Unit / Building" value={formData.currentStreet} field="currentStreet" fullWidth formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                <div className="grid grid-cols-2 gap-5">
                    <EditableField label="Barangay" value={formData.currentBarangay} field="currentBarangay" type="select" options={BARANGAYS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                    <EditableField label="City / Municipality" value={formData.currentCity} field="currentCity" type="select" options={CITIES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                </div>
                <EditableField label="Province" value={formData.currentProvince} field="currentProvince" type="select" options={PROVINCES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><MapPin size={18} /></div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Permanent Address</h4>
                </div>
                {isEditing && (
                    <button 
                        onClick={handleAddressCopy}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg"
                    >
                        {sameAsCurrent ? <CheckSquare size={14} className="text-indigo-600"/> : <Square size={14} />}
                        Same as Current
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 gap-5">
                <EditableField label="Street / Unit / Building" value={formData.permanentStreet} field="permanentStreet" fullWidth formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                <div className="grid grid-cols-2 gap-5">
                    <EditableField label="Barangay" value={formData.permanentBarangay} field="permanentBarangay" type="select" options={BARANGAYS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                    <EditableField label="City / Municipality" value={formData.permanentCity} field="permanentCity" type="select" options={CITIES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
                </div>
                <EditableField label="Province" value={formData.permanentProvince} field="permanentProvince" type="select" options={PROVINCES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            </div>
          </div>
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       {/* Attachments */}
       <div className="space-y-6">
          <SectionHeader icon={CheckSquare} title="Documents & Attachments" color="amber" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttachmentCard title="Birth Certificate" filename="PSA_Birth_Cert_Scan.pdf" isEditing={isEditing} />
              <AttachmentCard title="Marriage Certificate" filename="Marriage_Cert_2022.pdf" isEditing={isEditing} />
          </div>
       </div>
    </MotionDiv>
  );
};

export default PersonalDetails;
