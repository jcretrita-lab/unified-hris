
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  CalendarDays, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import { 
  EditableField, 
  SectionHeader, 
  TAX_STATUSES, 
  BANKS 
} from './ProfileShared';
import { ExtendedProfile } from '../../../model/Profile';

interface CompanyDetailsProps {
  formData: ExtendedProfile;
  setFormData: (data: ExtendedProfile) => void;
  isEditing: boolean;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ 
  formData, 
  setFormData, 
  isEditing 
}) => {
  const MotionDiv = motion.div as any;

  const handleUpdate = (field: keyof ExtendedProfile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
       
       {/* Employment Details */}
       <div>
         <SectionHeader icon={Building} title="Employment Information" color="indigo" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EditableField label="Employee ID" value={formData.employeeId} field="employeeId" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Company Email" value={formData.companyEmail} field="companyEmail" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Proximity ID" value={formData.proximityId} field="proximityId" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            
            <EditableField label="Company" value={formData.companyName} field="companyName" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Department" value={formData.department} field="department" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Section" value={formData.section} field="section" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            
            <EditableField label="Position" value={formData.position} field="position" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Job Level" value={formData.jobLevel} field="jobLevel" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Employment Status" value={formData.employmentStatus} field="employmentStatus" type="select" options={['Regular', 'Probationary', 'Contractual', 'Intern']} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            
            <EditableField label="Immediate Supervisor" value={formData.immediateSupervisor} field="immediateSupervisor" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Department Head" value={formData.departmentHead} field="departmentHead" disabled formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
         </div>
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       {/* Important Dates */}
       <div>
         <SectionHeader icon={CalendarDays} title="Important Dates" color="amber" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EditableField label="Date Hired" value={formData.dateHired} field="dateHired" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Date Apprentice" value={formData.dateApprentice} field="dateApprentice" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Date Probationary" value={formData.dateProbationary} field="dateProbationary" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Date of Contract" value={formData.dateOfContract} field="dateOfContract" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            
            <EditableField label="Date Regularization" value={formData.dateRegularization} field="dateRegularization" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Date Transferred" value={formData.dateTransferred} field="dateTransferred" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="End of Contract" value={formData.contractEndDate} field="contractEndDate" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
            <EditableField label="Date Resigned" value={formData.dateResigned} field="dateResigned" type="date" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
         </div>
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       {/* Government Account Details */}
       <div>
         <SectionHeader icon={FileText} title="Government & Tax" color="blue" />
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="lg:col-span-1">
                <EditableField label="Tax Status" value={formData.taxStatus} field="taxStatus" type="select" options={TAX_STATUSES} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           </div>
           <EditableField label="Tax Identification (TIN)" value={formData.tin} field="tin" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           <EditableField label="Social Security (SSS)" value={formData.sss} field="sss" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           <EditableField label="PhilHealth" value={formData.philhealth} field="philhealth" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           <EditableField label="Pag-IBIG / HDMF" value={formData.pagibig} field="pagibig" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
         </div>
       </div>

       <div className="w-full h-px bg-slate-100"></div>

       {/* Bank Account Details */}
       <div>
         <SectionHeader icon={CreditCard} title="Bank Details" color="emerald" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <EditableField label="Bank Name" value={formData.bankName} field="bankName" type="select" options={BANKS} formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           <EditableField label="Account Number" value={formData.accountNumber} field="accountNumber" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
           <EditableField label="Account Holder" value={formData.accountHolder} field="accountHolder" formData={formData} onUpdate={handleUpdate} isEditing={isEditing} />
         </div>
       </div>
    </MotionDiv>
  );
};

export default CompanyDetails;
