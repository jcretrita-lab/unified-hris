import React, { useState } from 'react';
import {
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_YEAR_END_DATA } from '../payroll/mockData';
import YearEndPrepLayout from '../../components/year-end/YearEndPrepLayout';

const YearEndGovPrepPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('2026');

    const filteredData = MOCK_YEAR_END_DATA.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        const val = amount || 0;
        return `₱${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <YearEndPrepLayout
            activeTab="gov"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
        >
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
            >
                <table className="min-w-full divide-y divide-slate-50">
                    <thead className="bg-slate-50/50 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <tr>
                            <th className="px-8 py-5">Employee</th>
                            <th className="px-6 py-5 text-right">SSS (ER+EE)</th>
                            <th className="px-6 py-5 text-right">PhilHealth (ER+EE)</th>
                            <th className="px-6 py-5 text-right">Pag-IBIG (ER+EE)</th>
                            <th className="px-6 py-5 text-center">Annual Totals</th>
                            <th className="px-6 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredData.map((item) => {
                            // Mock gov numbers
                            const sssTotal = item.ytdGross * 0.045;
                            const phTotal = item.ytdGross * 0.015;
                            const piTotal = 2400 * 12; // Flat mock
                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                {item.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regular Full-time</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                        {formatCurrency(sssTotal)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                        {formatCurrency(phTotal)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-600">
                                        {formatCurrency(piTotal)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="font-bold text-slate-900 text-sm">
                                            {formatCurrency(sssTotal + phTotal + piTotal)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <FileText size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
        </YearEndPrepLayout>
    );
};

export default YearEndGovPrepPage;
