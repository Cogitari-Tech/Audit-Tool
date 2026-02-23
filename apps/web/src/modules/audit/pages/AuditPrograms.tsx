import { useState } from "react";
import {
  FileText,
  Plus,
  Calendar,
  ChevronRight,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Modal } from "@/shared/components/ui/Modal";
import { useAudit } from "../hooks/useAudit";
import type {
  AuditProgramFrequency,
  AuditProgramStatus,
} from "../types/audit.types";

const FREQUENCY_LABELS: Record<AuditProgramFrequency, string> = {
  annual: "Anual",
  semi_annual: "Semestral",
  quarterly: "Trimestral",
  monthly: "Mensal",
  biweekly: "Quinzenal",
  weekly: "Semanal",
};

const STATUS_CONFIG: Record<
  AuditProgramStatus,
  { label: string; color: string }
> = {
  draft: { label: "Rascunho", color: "text-slate-600 bg-slate-50 border-slate-200" },
  in_progress: {
    label: "Em Andamento",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  completed: {
    label: "Concluído",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-600 bg-red-50 border-red-200",
  },
};

export default function AuditPrograms() {
  const {
    programs,
    frameworks,
    loading,
    createProgram,
    updateProgram,
    deleteProgram,
    populateChecklistFromFramework,
  } = useAudit();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    framework_id: "",
    frequency: "quarterly" as AuditProgramFrequency,
    start_date: "",
    end_date: "",
  });

  const handleCreate = async () => {
    try {
      const program = await createProgram({
        name: form.name,
        description: form.description || undefined,
        framework_id: form.framework_id || undefined,
        frequency: form.frequency,
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
      });

      // Auto-populate checklist from framework controls
      if (program && form.framework_id) {
        await populateChecklistFromFramework(program.id, form.framework_id);
      }

      setShowModal(false);
      setForm({
        name: "",
        description: "",
        framework_id: "",
        frequency: "quarterly",
        start_date: "",
        end_date: "",
      });
    } catch {
      // error shown via hook
    }
  };

  const handleStatusChange = async (
    id: string,
    status: AuditProgramStatus
  ) => {
    await updateProgram(id, { status });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Programas de Auditoria
          </h1>
          <p className="text-slate-600 mt-1">
            Gerencie ciclos de auditoria e acompanhe o progresso
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Programa</span>
        </Button>
      </div>

      {/* Programs List */}
      {loading && programs.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          Carregando programas...
        </div>
      ) : programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            Nenhum programa de auditoria
          </p>
          <p className="text-slate-400 mt-1">
            Clique em &quot;Novo Programa&quot; para criar o primeiro
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {program.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        STATUS_CONFIG[program.status].color
                      }`}
                    >
                      {STATUS_CONFIG[program.status].label}
                    </span>
                  </div>

                  {program.description && (
                    <p className="text-sm text-slate-600 mb-3">
                      {program.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {program.framework && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {program.framework.name}
                      </span>
                    )}
                    <span>{FREQUENCY_LABELS[program.frequency]}</span>
                    {program.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(program.start_date).toLocaleDateString("pt-BR")}
                        {program.end_date &&
                          ` — ${new Date(program.end_date).toLocaleDateString("pt-BR")}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {program.status === "draft" && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleStatusChange(program.id, "in_progress")
                      }
                      title="Iniciar"
                    >
                      <Play className="w-4 h-4 text-blue-500" />
                    </Button>
                  )}
                  {program.status === "in_progress" && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleStatusChange(program.id, "completed")
                      }
                      title="Concluir"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => handleStatusChange(program.id, "cancelled")}
                    title="Cancelar"
                  >
                    <XCircle className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => deleteProgram(program.id)}
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                  <a
                    href={`/audit/programs/${program.id}`}
                    className="flex items-center text-slate-400 hover:text-slate-700 ml-2"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Programa de Auditoria"
      >
        <div className="space-y-4">
          <Input
            label="Nome do Programa"
            placeholder="Ex: Ciclo LGPD 2026 Q1"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Descrição"
            placeholder="Objetivo e escopo da auditoria"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <Select
            label="Framework de Referência"
            value={form.framework_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, framework_id: e.target.value }))
            }
          >
            <option value="">Nenhum (personalizado)</option>
            {frameworks.map((fw) => (
              <option key={fw.id} value={fw.id}>
                {fw.name} ({fw.version})
              </option>
            ))}
          </Select>
          <Select
            label="Frequência"
            value={form.frequency}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                frequency: e.target.value as AuditProgramFrequency,
              }))
            }
          >
            {Object.entries(FREQUENCY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, start_date: e.target.value }))
              }
            />
            <Input
              label="Data Fim"
              type="date"
              value={form.end_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, end_date: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              <span>Cancelar</span>
            </Button>
            <Button onClick={handleCreate} disabled={!form.name || loading}>
              <span>{loading ? "Criando..." : "Criar Programa"}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
