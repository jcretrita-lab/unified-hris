// Data Models for Employee Profile

// --- Personal & Company Details ---
export interface ExtendedProfile {
  // Personal
  avatar: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  bloodType: string;
  religion: string;
  citizenship: string;
  birthPlace: string;
  complexion: string;
  height: string;
  weight: string;
  email: string;
  mobile: string;
  
  // Addresses
  currentStreet: string;
  currentBarangay: string;
  currentCity: string;
  currentProvince: string;
  
  permanentStreet: string;
  permanentBarangay: string;
  permanentCity: string;
  permanentProvince: string;

  // Company - Employment
  employeeId: string;
  companyEmail: string;
  companyName: string;
  subsidiary: string;
  department: string;
  section: string;
  position: string;
  jobLevel: string;
  employmentStatus: string;
  workSchedule: string;
  immediateSupervisor: string;
  departmentHead: string;
  proximityId: string;

  // Company - Dates
  dateHired: string;
  dateApprentice: string;
  dateProbationary: string;
  dateOfContract: string;
  dateRegularization: string;
  dateTransferred: string;
  contractEndDate: string;
  dateResigned: string;

  // Financial - Bank
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  
  // Financial - Government
  sss: string;
  tin: string;
  philhealth: string;
  pagibig: string;
  taxStatus: string;
  taxExempted: boolean;
  tax10: boolean;
}

// --- Other Details Models ---

export interface Education {
  id: string;
  attainment: string;
  course: string;
  school: string;
  dateGraduated: string;
}

export interface Exam {
  id: string;
  dateTaken: string;
  name: string;
  rating: string;
  description: string;
}

export interface Employment {
  id: string;
  company: string;
  address: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
}

export interface Reference {
  id: string;
  lastName: string;
  firstName: string;
  position: string;
  contactNo: string;
  business: string;
  address: string;
}

export interface Family {
  id: string;
  relationship: string;
  lastName: string;
  firstName: string;
  birthday: string;
  occupation: string;
  address: string;
}

export interface EmergencyContact {
  id: string;
  relationship: string;
  lastName: string;
  firstName: string;
  contactNo: string;
  email: string;
}
