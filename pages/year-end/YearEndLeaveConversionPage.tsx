import React, { useState } from 'react';
import YearEndPrepLayout from '../../components/year-end/YearEndPrepLayout';
import LeaveConversionTab from '../payroll/LeaveConversionTab';

const YearEndLeaveConversionPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');

    return (
        <YearEndPrepLayout
            activeTab="leave-conversion"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
        >
            <div className="p-6">
                <LeaveConversionTab />
            </div>
        </YearEndPrepLayout>
    );
};

export default YearEndLeaveConversionPage;
