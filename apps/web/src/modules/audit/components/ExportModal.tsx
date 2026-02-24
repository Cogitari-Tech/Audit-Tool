import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import type { ExportFormat, AuditReport } from "../types/audit.types";
import { exportPdf } from "../utils/ReportPdfDocument";
import { exportDocx } from "../utils/exportDocx";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  onExport: (format: ExportFormat) => Promise<void>;
  validationErrors: string[];
  validationWarnings: string[];
}

const FORMAT_OPTIONS: {
  format: ExportFormat;
  label: string;
  desc: string;
  color: string;
  recommended?: boolean;
}[] = [
  {
    format: "pdf",
    label: "PDF",
    desc: "Recomendado",
    color: "bg-red-500",
    recommended: true,
  },
  { format: "docx", label: "DOCX", desc: "Editável", color: "bg-blue-600" },
  { format: "txt", label: "TXT", desc: "Texto Puro", color: "bg-slate-600" },
  { format: "json", label: "JSON", desc: "Dados", color: "bg-emerald-600" },
];

export default function ExportModal({
  isOpen,
  onClose,
  report,
  onExport,
  validationErrors,
  validationWarnings,
}: ExportModalProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    try {
      if (format === "pdf") {
        await exportPdf(report);
      } else if (format === "docx") {
        await exportDocx(report);
      } else {
        await onExport(format);
      }
      onClose();
    } catch (err) {
      console.error("Export error:", err);
      alert("Erro ao exportar. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const hasErrors = validationErrors.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exportar Relatório">
      <div className="space-y-4">
        {/* Validation */}
        {hasErrors && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">
              Bloqueios:
            </p>
            {validationErrors.map((e, i) => (
              <p
                key={i}
                className="text-xs text-red-600 dark:text-red-400 flex items-start gap-1.5"
              >
                <X className="w-3 h-3 mt-0.5 flex-shrink-0" /> {e}
              </p>
            ))}
          </div>
        )}

        {validationWarnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
              Avisos:
            </p>
            {validationWarnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-600 dark:text-amber-400">
                ⚠ {w}
              </p>
            ))}
          </div>
        )}

        {/* Compliance rule */}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <strong>Regra de Compliance:</strong> O relatório só pode ser
          exportado com todas as assinaturas coletadas.
        </p>

        {/* Format buttons */}
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.format}
            disabled={hasErrors || exporting}
            onClick={() => handleExport(opt.format)}
            className={`w-full flex items-center justify-between p-4 border rounded-xl transition-colors group
              ${opt.recommended ? "border-primary/20 bg-primary/5 hover:bg-primary/10" : "border-border bg-card hover:bg-muted/50"}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`${opt.color} text-white p-2 rounded-lg text-xs font-bold`}
              >
                {opt.label}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {opt.label} {opt.recommended && "(Recomendado)"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {opt.desc}
                </p>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </span>
          </button>
        ))}

        {exporting && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-slate-500">
            <FileText className="w-4 h-4 animate-pulse" /> Gerando...
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            <span>Cancelar</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
