import { useState } from 'react';
import { Employee } from '../types';
import { ExtendedProfile } from '../model/Profile';

export const useProfileViewModel = (employee: Employee) => {
  const [activeSubTab, setActiveSubTab] = useState('Personal Details');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with mock data + props
  // In a real app, this would fetch data from an API in useEffect
  const [formData, setFormData] = useState<ExtendedProfile>({
    avatar: employee.avatar,
    firstName: 'John',
    middleName: 'Quincy',
    lastName: 'Doe',
    nickname: 'Johnny',
    dob: '1990-08-15',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'American',
    bloodType: 'O+',
    religion: 'Roman Catholic',
    citizenship: 'American',
    birthPlace: 'Springfield',
    complexion: 'Medium',
    height: '175 cm',
    weight: '70 kg',
    email: 'johndoe.personal@gmail.com',
    mobile: '+1 (555) 987-6543',
    
    currentStreet: '456 Silicon Valley Blvd, Apt 4B',
    currentBarangay: 'SoMa',
    currentCity: 'San Francisco',
    currentProvince: 'California',
    
    permanentStreet: '123 Main St',
    permanentBarangay: 'Downtown',
    permanentCity: 'Springfield',
    permanentProvince: 'Illinois',

    // Company
    employeeId: employee.id,
    companyEmail: employee.email,
    companyName: 'Nexus Corp',
    subsidiary: 'Nexus Tech Solutions',
    department: employee.department,
    section: 'Core Development',
    position: employee.role,
    jobLevel: 'Level 4',
    employmentStatus: 'Regular',
    workSchedule: 'Mon-Fri, 9:00 AM - 6:00 PM',
    immediateSupervisor: 'Louis Panganiban',
    departmentHead: 'Sarah Wilson',
    proximityId: '100245',

    // Dates
    dateHired: '2022-05-16',
    dateApprentice: '',
    dateProbationary: '2022-05-16',
    dateOfContract: '2022-05-16',
    dateRegularization: '2022-11-16',
    dateTransferred: '',
    contractEndDate: '',
    dateResigned: '',

    // Financial
    bankName: 'Chase Bank',
    accountNumber: '**** **** **** 1234',
    accountHolder: 'John Quincy Doe',
    
    sss: '00-1234567-8',
    tin: '123-456-789-000',
    philhealth: '12-123456789-1',
    pagibig: '1234-5678-9012',
    taxStatus: 'Taxable',
    taxExempted: false,
    tax10: false,
  });

  const handleSave = () => {
    // In a real app, API call here to save formData
    console.log("Saving Profile Data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // In a real app, revert formData to original state
    setIsEditing(false);
  };

  const updateField = (field: keyof ExtendedProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    activeSubTab,
    setActiveSubTab,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    updateField,
    handleSave,
    handleCancel
  };
};
