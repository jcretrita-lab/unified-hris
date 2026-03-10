const fs = require('fs');

const srcPath = 'c:\\Users\\Ryuji\\Documents\\GitHub\\unified-hris\\pages\\pay-structure\\PayTemplates.tsx';
const destPath = 'c:\\Users\\Ryuji\\Documents\\GitHub\\unified-hris\\pages\\payroll\\DeductionsTab.tsx';

let content = fs.readFileSync(srcPath, 'utf8');

// Basic replacements
content = content.replace(/PayTemplates/g, 'DeductionsTab');
content = content.replace(/PayTemplatesProps/g, 'DeductionsTabProps');
content = content.replace(/Pay Templates/g, 'Deduction Packages');
content = content.replace(/Pay Template/g, 'Deduction Package');
content = content.replace(/Pay template/g, 'Deduction package');
content = content.replace(/pay template/g, 'deduction package');
content = content.replace(/pay templates/g, 'deduction packages');

// Replace the entire 'grid-cols-1 ...' contents with only the deduction block
const blockToReplaceRegex = /<div className=\{`grid grid-cols-1 gap-6 \${showDeductionsPanel \? 'lg:grid-cols-2' : ''}`\}>[\s\S]*?<\/div>\s*<\/div>\s*\)\}\s*\{\/\* INSTANCES TAB/m;

const replacementBlock = `<div className="mt-6">
    <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-100/50">
            <div className="flex items-center gap-2">
                <ArrowDownCircle className="text-rose-500" size={20} />
                <h4 className="font-bold text-rose-900 text-sm">Deduction Components</h4>
            </div>
            <button
                onClick={() => setShowDeductions(!showDeductions)}
                className={\`p-1.5 rounded-lg transition-colors \${showDeductions ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400 hover:text-slate-600'}\`}
                title={showDeductions ? "Hide deductions values" : "Show deductions values"}
            >
                {showDeductions ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
        <div className="space-y-1">
            {deductionComponents.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No deduction components defined.</p>}
            {deductionComponents.map(comp => renderComponentItem(comp, activeTemplate.components.includes(comp.id), showDeductions))}
        </div>
    </div>
</div>
                        </div>
                    )}
                    {/* INSTANCES TAB`;

content = content.replace(blockToReplaceRegex, replacementBlock);

// Comparison table removals (Earnings block)
const comparisonEarningsBlockRegex = /\{comparisonData\.rows\.filter\(r => r\.type === 'earning'\)\.length > 0 && \([\s\S]*?<\/>\s*\)}/gm;
content = content.replace(comparisonEarningsBlockRegex, '');

fs.writeFileSync(destPath, content);
console.log('Script ran successfully');
