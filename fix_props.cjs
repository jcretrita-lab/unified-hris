const fs = require('fs');

const file = 'c:\\Users\\Ryuji\\Documents\\GitHub\\unified-hris\\pages\\payroll\\DeductionsTab.tsx';
let content = fs.readFileSync(file, 'utf8');

// The type was replaced like:
// interface DeductionsTabProps {
//     packages: PayTemplate[];
//     setTemplates: (t: PayTemplate[]) => void;
//     components: PayComponent[];
// }
// const DeductionsTab: React.FC<DeductionsTabProps> = ({ packages, setTemplates, components }) => {

// Let's replace the DeductionsTab definition:
const interfaceRegex = /interface DeductionsTabProps\s*\{[\s\S]*?\}\s*const DeductionsTab: React.FC(?:<DeductionsTabProps>)? = \(\{\s*.*?\s*\}\) => \{/gm;

const newComponentDef = `
// --- MOCK DEDUCTION PACKAGES ---
const MOCK_DEDUCTION_PACKAGES: PayTemplate[] = [
    {
        id: 'ded-pkg-1',
        name: 'Standard Govt & Loan Package',
        targetType: 'Global',
        components: ['comp-d1', 'comp-d2'],
    }
];

// --- MOCK DEDUCTION COMPONENTS ---
const MOCK_DEDUCTION_COMPONENTS: PayComponent[] = [
    { id: 'comp-d1', name: 'SSS Contribution', type: 'deduction', valueType: 'fixed', fixedValue: 500, isTaxable: false },
    { id: 'comp-d2', name: 'PhilHealth', type: 'deduction', valueType: 'fixed', fixedValue: 300, isTaxable: false }
];

const DeductionsTab: React.FC = () => {
    // Internal State for Mock Data
    const [packages, setTemplates] = useState<PayTemplate[]>(MOCK_DEDUCTION_PACKAGES);
    const components = MOCK_DEDUCTION_COMPONENTS;
`;

content = content.replace(interfaceRegex, newComponentDef);

// Also remove the formulas prop or any other missing props that were in the original component destructuring.
// Wait, the original was:
// const PayTemplates: React.FC<PayTemplatesProps> = ({ templates, setTemplates, components }) => {
// After our node script:
// const DeductionsTab: React.FC<DeductionsTabProps> = ({ packages, setTemplates, components }) => {
// Which perfectly matches my regex!

fs.writeFileSync(file, content);
console.log('Fixed props for DeductionsTab.tsx');
