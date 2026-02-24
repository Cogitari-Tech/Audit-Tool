import { useState } from "react";
import {
  FileOutput,
  Plus,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { useReportGenerator } from "../hooks/useReportGenerator";
import { useAudit } from "../hooks/useAudit";
import ReportFindingCard from "../components/ReportFindingCard";
import ReportSignatures from "../components/ReportSignatures";
import ExportModal from "../components/ExportModal";

export default function ReportBuilder() {
  const {
    report,
    unsavedChanges,
    updateField,
    addFinding,
    updateFinding,
    updateFinding5W2H,
    removeFinding,
    addSignature,
    removeSignature,
    validate,
    exportReport,
    resetReport,
  } = useReportGenerator();

  const { programs } = useAudit();
  const [showExport, setShowExport] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const validation = validate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <FileOutput className="w-5 h-5 text-brand-600 dark:text-brand-500" />
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white text-sm">
                Relatório de Auditoria
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                {report.doc_id}
              </p>
            </div>
            {unsavedChanges ? (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" /> Salvando...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-green-700 dark:text-green-400 font-medium bg-green-50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Salvo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowReset(true)}
              className="text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Resetar</span>
            </Button>
            <Button
              onClick={() => setShowExport(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* ─── Header Fields ─── */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Dados do Relatório
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Doc ID"
              value={report.doc_id}
              onChange={(e) => updateField("doc_id", e.target.value)}
              className="font-mono"
            />
            <Select
              label="Programa de Auditoria"
              value={report.program_id}
              onChange={(e) => updateField("program_id", e.target.value)}
            >
              <option value="">Selecione o Programa...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Empresa Cliente"
              placeholder="Nome da empresa auditada"
              value={report.client_name}
              onChange={(e) => updateField("client_name", e.target.value)}
            />
            <Input
              label="Projeto / Módulo"
              placeholder="Sistema ou módulo auditado"
              value={report.project_name}
              onChange={(e) => updateField("project_name", e.target.value)}
            />
            <Input
              label="Ambiente"
              placeholder="Produção, Staging, Dev..."
              value={report.environment}
              onChange={(e) => updateField("environment", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={report.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
            <div>
              <Input
                label="Data Fim"
                type="date"
                value={report.end_date}
                onChange={(e) => updateField("end_date", e.target.value)}
              />
            </div>
            <Input
              label="Auditor Líder"
              placeholder="Nome do auditor líder"
              value={report.lead_auditor}
              onChange={(e) => updateField("lead_auditor", e.target.value)}
            />
          </div>
        </section>

        {/* ─── Executive Summary ─── */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Sumário Executivo
          </h2>
          <textarea
            rows={4}
            className="w-full text-sm p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800 transition-colors resize-none dark:text-slate-200 dark:placeholder-slate-500"
            placeholder="Descreva o contexto, os objetivos e as principais conclusões da auditoria..."
            value={report.executive_summary}
            onChange={(e) => updateField("executive_summary", e.target.value)}
          />
        </section>

        {/* ─── Findings (5W2H) ─── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Registro de Ocorrências — 5W2H
            </h2>
            <Button
              variant="ghost"
              className="text-xs flex items-center gap-1"
              onClick={() => addFinding()}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Achado</span>
            </Button>
          </div>

          {report.findings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhum achado registrado
              </p>
              <Button
                variant="ghost"
                className="mt-3 text-xs"
                onClick={() => addFinding()}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Primeiro Achado
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {report.findings.map((finding, i) => (
                <ReportFindingCard
                  key={finding.id}
                  finding={finding}
                  index={i}
                  onUpdate={updateFinding}
                  onUpdate5W2H={updateFinding5W2H}
                  onRemove={removeFinding}
                />
              ))}
            </div>
          )}
        </section>

        {/* ─── Final Opinion ─── */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Parecer Final
          </h2>
          <textarea
            rows={4}
            className="w-full text-sm p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800 transition-colors resize-none dark:text-slate-200 dark:placeholder-slate-500"
            placeholder="Parecer final do auditor sobre o estado geral e as recomendações..."
            value={report.final_opinion}
            onChange={(e) => updateField("final_opinion", e.target.value)}
          />
        </section>

        {/* ─── Signatures ─── */}
        <ReportSignatures
          signatures={report.signatures}
          onAdd={addSignature}
          onRemove={removeSignature}
        />

        {/* Validation Summary */}
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Checklist de Compliance
            </h3>
            {validation.errors.map((e, i) => (
              <p
                key={i}
                className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3 h-3" /> {e}
              </p>
            ))}
            {validation.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-600 dark:text-amber-400">
                ⚠ {w}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        report={report}
        onExport={exportReport}
        validationErrors={validation.errors}
        validationWarnings={validation.warnings}
      />

      {/* Reset Confirmation */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Resetar Relatório?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Todos os dados do relatório atual serão perdidos. Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowReset(false)}>
                <span>Cancelar</span>
              </Button>
              <Button
                onClick={() => {
                  resetReport();
                  setShowReset(false);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                <span>Sim, Resetar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
