
import React from 'react';
import { LayoutGrid } from 'lucide-react';

const SalaryGradesTab: React.FC = () => {
    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-20 shadow-sm text-center">
            <LayoutGrid className="mx-auto text-slate-200 mb-6" size={64} />
            <h3 className="text-xl font-bold text-slate-900">Salary Grades</h3>
            <p className="text-slate-500 mt-2">This module is currently in development.</p>
        </div>
    );
};

export default SalaryGradesTab;
