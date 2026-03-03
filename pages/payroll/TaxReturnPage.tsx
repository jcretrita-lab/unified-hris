import React, { useState } from "react";
import { FileText, Download, Eye } from "lucide-react";
import Modal from "../../components/Modal";

const TaxReturnPage = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sampleITR = "/sample-itr.png"; // place image in public folder

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = sampleITR;
    link.download = "ITR-Sample.png";
    link.click();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
        <FileText size={28} className="text-indigo-600" />
        Tax Return (ITR Autofill)
      </h1>

      <p className="text-slate-500 font-medium">
        Generate and preview your ITR for year-end processing.
      </p>

      <button
        onClick={() => setIsPreviewOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
      >
        <Eye size={18} />
        Generate ITR Autofill
      </button>

      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">ITR Preview</h2>

          <img
            src={sampleITR}
            alt="ITR Preview"
            className="w-full rounded-xl border border-slate-200"
          />

          <button
            onClick={handleDownload}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download ITR
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TaxReturnPage;