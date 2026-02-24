import {
  Trash2,
  ChevronDown,
  Code2,
  Link,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type {
  ReportFinding,
  Finding5W2H,
  FindingRiskLevel,
  FindingStatus,
  TaskCategory,
  ImpactArea,
} from "../types/audit.types";

interface ReportFindingCardProps {
  finding: ReportFinding;
  index: number;
  onUpdate: (id: string, updates: Partial<ReportFinding>) => void;
  onUpdate5W2H: (id: string, field: keyof Finding5W2H, value: string) => void;
  onRemove: (id: string) => void;
}

const RISK_LEVELS: { value: FindingRiskLevel; label: string; color: string }[] =
  [
    {
      value: "critical",
      label: "Crítico",
      color:
        "peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600",
    },
    {
      value: "high",
      label: "Alto",
      color:
        "peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-500",
    },
    {
      value: "medium",
      label: "Médio",
      color:
        "peer-checked:bg-amber-500 peer-checked:text-white peer-checked:border-amber-500",
    },
    {
      value: "low",
      label: "Baixo",
      color:
        "peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-600",
    },
  ];

const STATUS_OPTIONS: { value: FindingStatus; label: string }[] = [
  { value: "open", label: "Pendente" },
  { value: "in_progress", label: "Andamento" },
  { value: "resolved", label: "Concluído" },
  { value: "accepted", label: "Bloqueado" },
];

const TASK_TYPES: TaskCategory[] = [
  "Frontend Bug",
  "Backend Logic",
  "Security Vuln",
  "Database",
  "DevOps/CI-CD",
  "Code Quality",
  "Performance",
  "Documentation",
  "Compliance",
  "Infrastructure",
  "Dependency",
  "Architecture",
];

const IMPACT_AREAS: ImpactArea[] = [
  "Segurança",
  "Operacional",
  "Jurídico",
  "Privacidade",
];

const W2H_FIELDS: {
  key: keyof Finding5W2H;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "what",
    label: "O QUÊ (What)",
    placeholder: "Descreva o problema encontrado...",
  },
  {
    key: "why",
    label: "POR QUÊ (Why)",
    placeholder: "Causa raiz ou justificativa...",
  },
  {
    key: "where",
    label: "ONDE (Where)",
    placeholder: "Módulo, arquivo, endpoint afetado...",
  },
  {
    key: "when",
    label: "QUANDO (When)",
    placeholder: "Data de identificação / prazo para correção...",
  },
  {
    key: "who",
    label: "QUEM (Who)",
    placeholder: "Responsável pela correção...",
  },
  {
    key: "how",
    label: "COMO (How)",
    placeholder: "Ação corretiva detalhada...",
  },
  {
    key: "howMuch",
    label: "QUANTO (How Much)",
    placeholder: "Impacto estimado (hrs, custo, risco)...",
  },
];

export default function ReportFindingCard({
  finding,
  index,
  onUpdate,
  onUpdate5W2H,
  onRemove,
}: ReportFindingCardProps) {
  const riskColor =
    finding.risk_level === "critical"
      ? "border-l-red-600"
      : finding.risk_level === "high"
        ? "border-l-orange-500"
        : finding.risk_level === "medium"
          ? "border-l-amber-500"
          : "border-l-green-600";

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 ${riskColor} transition-all duration-200 hover:shadow-md`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 pb-0">
        <div className="flex items-center gap-3">
          <span className="bg-slate-800 dark:bg-slate-700 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Achado #{String(index + 1).padStart(2, "0")}
          </span>
          {finding.risk_level === "critical" && (
            <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
          )}
        </div>
        <Button variant="ghost" onClick={() => onRemove(finding.id)}>
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </div>

      <div className="p-4 space-y-5">
        {/* 5W2H Fields */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" /> Análise 5W2H
          </p>
          {W2H_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                {field.label}
              </label>
              <textarea
                rows={2}
                className="text-sm p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 w-full focus:bg-white dark:focus:bg-slate-800 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800 transition-colors resize-none dark:text-slate-200 dark:placeholder-slate-500"
                placeholder={field.placeholder}
                value={finding.analysis[field.key]}
                onChange={(e) =>
                  onUpdate5W2H(finding.id, field.key, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* Risk + Status + Task Type row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Task Type */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
              Tipo de Task
            </label>
            <select
              className="w-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800"
              value={finding.task_type}
              onChange={(e) =>
                onUpdate(finding.id, {
                  task_type: e.target.value as TaskCategory | "",
                })
              }
            >
              <option value="">Selecione...</option>
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
              Risco
            </label>
            <div className="flex gap-1.5">
              {RISK_LEVELS.map((r) => (
                <label key={r.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`risk-${finding.id}`}
                    className="peer sr-only"
                    checked={finding.risk_level === r.value}
                    onChange={() =>
                      onUpdate(finding.id, { risk_level: r.value })
                    }
                  />
                  <span
                    className={`block text-center text-[10px] font-bold py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:text-slate-300 transition-all ${r.color}`}
                  >
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
              Status
            </label>
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <label key={s.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`status-${finding.id}`}
                    className="peer sr-only"
                    checked={finding.status === s.value}
                    onChange={() => onUpdate(finding.id, { status: s.value })}
                  />
                  <span className="block text-center text-[10px] font-bold py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:text-slate-300 transition-all peer-checked:bg-slate-800 dark:peer-checked:bg-slate-700 peer-checked:text-white peer-checked:border-slate-800 dark:peer-checked:border-slate-700">
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Areas */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
            Áreas Impactadas
          </label>
          <div className="flex flex-wrap gap-2">
            {IMPACT_AREAS.map((area) => (
              <label key={area} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={finding.impacted_areas.includes(area)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...finding.impacted_areas, area]
                      : finding.impacted_areas.filter((a) => a !== area);
                    onUpdate(finding.id, { impacted_areas: next });
                  }}
                />
                <span className="block text-[10px] font-bold py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:text-slate-300 transition-all peer-checked:bg-brand-600 peer-checked:text-white peer-checked:border-brand-600">
                  {area}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Code Snippet */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 flex items-center gap-1">
            <Code2 className="w-3 h-3" /> Trecho de Código / Log
          </label>
          <textarea
            rows={3}
            className="text-xs font-mono p-3 border border-slate-800 dark:border-slate-900 rounded-lg bg-slate-900 dark:bg-slate-950 text-emerald-400 w-full resize-none placeholder:text-slate-600 focus:ring-1 focus:ring-brand-500"
            placeholder="// Cole seu código ou log aqui..."
            value={finding.code_snippet ?? ""}
            onChange={(e) =>
              onUpdate(finding.id, { code_snippet: e.target.value })
            }
          />
        </div>

        {/* Evidence Links */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 flex items-center gap-1">
            <Link className="w-3 h-3" /> Evidências (Links)
          </label>
          <div className="space-y-1.5">
            {finding.evidence_links.map((link, li) => (
              <div key={li} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  className="text-xs flex-1 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-800/50 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800"
                  placeholder="URL da evidência"
                  value={link}
                  onChange={(e) => {
                    const links = [...finding.evidence_links];
                    links[li] = e.target.value;
                    onUpdate(finding.id, { evidence_links: links });
                  }}
                />
                <button
                  onClick={() => {
                    const links = finding.evidence_links.filter(
                      (_, idx) => idx !== li,
                    );
                    onUpdate(finding.id, { evidence_links: links });
                  }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                onUpdate(finding.id, {
                  evidence_links: [...finding.evidence_links, ""],
                })
              }
              className="text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase hover:underline"
            >
              + Adicionar Link
            </button>
          </div>
        </div>

        {/* Email Notification */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              className="accent-brand-600"
              checked={finding.should_notify}
              onChange={(e) =>
                onUpdate(finding.id, {
                  should_notify: e.target.checked,
                  notify_email: e.target.checked ? finding.notify_email : "",
                })
              }
            />
            <Mail className="w-3 h-3" /> Automação de E-mail
          </label>
          {finding.should_notify && (
            <input
              type="email"
              className="mt-2 text-sm p-2 border border-slate-200 dark:border-slate-700 rounded w-full bg-white dark:bg-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-brand-300 dark:focus:border-brand-500 focus:ring-1 focus:ring-brand-200 dark:focus:ring-brand-800"
              placeholder="E-mail do responsável"
              value={finding.notify_email ?? ""}
              onChange={(e) =>
                onUpdate(finding.id, { notify_email: e.target.value })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
