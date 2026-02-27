import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Award, Briefcase, Users, Heart, Phone } from 'lucide-react';
import { SectionHeader } from './ProfileShared';
import { Education, Exam, Employment, Reference, Family, EmergencyContact } from '../../../model/Profile';

interface OtherDetailsProps {
  isEditing: boolean;
}

const OtherDetails: React.FC<OtherDetailsProps> = ({ isEditing }) => {
  const MotionDiv = motion.div as any;

  // State for each section
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [employmentList, setEmploymentList] = useState<Employment[]>([]);
  const [referenceList, setReferenceList] = useState<Reference[]>([]);
  const [familyList, setFamilyList] = useState<Family[]>([]);
  const [emergencyList, setEmergencyList] = useState<EmergencyContact[]>([]);

  // Helper generic render table
  const RenderTable = ({ 
    columns, 
    data, 
    onAdd, 
    onRemove, 
    fields 
  }: { 
    columns: string[], 
    data: any[], 
    onAdd: () => void, 
    onRemove: (id: string) => void,
    fields: string[]
  }) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">{col}</th>
              ))}
              {isEditing && <th className="px-6 py-4 w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {fields.map((field, idx) => (
                    <td key={idx} className="px-6 py-4 font-medium text-slate-700">
                      {isEditing ? (
                         <input 
                            className="w-full bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none py-1"
                            defaultValue={item[field as keyof typeof item]} 
                            placeholder={columns[idx]}
                         />
                      ) : (
                        item[field as keyof typeof item] || '-------'
                      )}
                    </td>
                  ))}
                  {isEditing && (
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (isEditing ? 1 : 0)} className="px-6 py-8 text-center text-slate-400 font-mono text-xs tracking-widest">
                   --------------------------------------------------
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <button 
          onClick={onAdd}
          className="w-full py-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border-t border-slate-100 transition-all"
        >
          <Plus size={14} /> Add Item
        </button>
      )}
    </div>
  );

  // Handlers for adding empty rows
  const addEducation = () => setEducationList([...educationList, { id: Date.now().toString(), attainment: '', course: '', school: '', dateGraduated: '' }]);
  const addExam = () => setExamList([...examList, { id: Date.now().toString(), dateTaken: '', name: '', rating: '', description: '' }]);
  const addEmployment = () => setEmploymentList([...employmentList, { id: Date.now().toString(), company: '', address: '', position: '', department: '', startDate: '', endDate: '' }]);
  const addReference = () => setReferenceList([...referenceList, { id: Date.now().toString(), lastName: '', firstName: '', position: '', contactNo: '', business: '', address: '' }]);
  const addFamily = () => setFamilyList([...familyList, { id: Date.now().toString(), relationship: '', lastName: '', firstName: '', birthday: '', occupation: '', address: '' }]);
  const addEmergency = () => setEmergencyList([...emergencyList, { id: Date.now().toString(), relationship: '', lastName: '', firstName: '', contactNo: '', email: '' }]);

  return (
    <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      
      {/* Educational Background */}
      <div>
        <SectionHeader icon={GraduationCap} title="Educational Background" color="indigo" />
        <RenderTable 
          columns={['Educational Attainment', 'Course', 'School', 'Date Graduated']}
          fields={['attainment', 'course', 'school', 'dateGraduated']}
          data={educationList}
          onAdd={addEducation}
          onRemove={(id) => setEducationList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

      {/* Exam / Seminars */}
      <div>
        <SectionHeader icon={Award} title="Exam / Seminars" color="amber" />
        <RenderTable 
          columns={['Date Taken', 'Exam / Seminar', 'Rating', 'Description']}
          fields={['dateTaken', 'name', 'rating', 'description']}
          data={examList}
          onAdd={addExam}
          onRemove={(id) => setExamList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

      {/* Previous Employment */}
      <div>
        <SectionHeader icon={Briefcase} title="Previous Employment" color="blue" />
        <RenderTable 
          columns={['Company', 'Company Address', 'Position', 'Department', 'Date Started', 'Date Resigned']}
          fields={['company', 'address', 'position', 'department', 'startDate', 'endDate']}
          data={employmentList}
          onAdd={addEmployment}
          onRemove={(id) => setEmploymentList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

      {/* References */}
      <div>
        <SectionHeader icon={Users} title="References" color="emerald" />
        <RenderTable 
          columns={['Last Name', 'First Name', 'Position', 'Contact No.', 'Business / Industry', 'Address']}
          fields={['lastName', 'firstName', 'position', 'contactNo', 'business', 'address']}
          data={referenceList}
          onAdd={addReference}
          onRemove={(id) => setReferenceList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

      {/* Family Information */}
      <div>
        <SectionHeader icon={Heart} title="Family Information" color="rose" />
        <RenderTable 
          columns={['Relationship', 'Last Name', 'First Name', 'Birthday', 'Occupation', 'Address']}
          fields={['relationship', 'lastName', 'firstName', 'birthday', 'occupation', 'address']}
          data={familyList}
          onAdd={addFamily}
          onRemove={(id) => setFamilyList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

      {/* Emergency Contact */}
      <div>
        <SectionHeader icon={Phone} title="Emergency Contact" color="slate" />
        <RenderTable 
          columns={['Relationship', 'Last Name', 'First Name', 'Contact Number', 'Email']}
          fields={['relationship', 'lastName', 'firstName', 'contactNo', 'email']}
          data={emergencyList}
          onAdd={addEmergency}
          onRemove={(id) => setEmergencyList(prev => prev.filter(i => i.id !== id))}
        />
      </div>

    </MotionDiv>
  );
};

export default OtherDetails;
