import { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Search,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Modal } from "@/shared/components/ui/Modal";
import { useAudit } from "../hooks/useAudit";
import type {
  ActionPlanPriority,
  ActionPlanStatus,
  CreateActionPlanInput,
} from "../types/audit.types";

const PRIORITY_CONFIG: Record<
  ActionPlanPriority,
  { label: string; color: string }
> = {
  critical: { label: "Crítica", color: "text-red-700 bg-red-50 border-red-200" },
  high: { label: "Alta", color: "text-orange-700 bg-orange-50 border-orange-200" },
  medium: { label: "Média", color: "text-amber-700 bg-amber-50 border-amber-200" },
  low: { label: "Baixa", color: "text-green-700 bg-green-50 border-green-200" },
};

const STATUS_LABELS: Record<ActionPlanStatus, string> = {
  pending: "Pendente",
  in_progress: "Em Andamento",
  completed: "Concluído",
  overdue: "Atrasado",
};

export default function AuditActionPlans() {
  const {
    actionPlans,
    findings,
    loading,
    createActionPlan,
    updateActionPlan,
  } = useAudit();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CreateActionPlanInput>({
    finding_id: "",
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  const filtered = actionPlans.filter(
    (ap) =>
      !search ||
      ap.title.toLowerCase().includes(search.toLowerCase()) ||
      ap.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createActionPlan(form);
      setShowModal(false);
      setForm({
        finding_id: "",
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
      });
    } catch {
      // error shown via hook
    }
  };

  const isOverdue = (ap: { due_date: string | null; status: string }) =>
    ap.due_date &&
    new Date(ap.due_date) < new Date() &&
    ap.status !== "completed";

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Planos de Ação
          </h1>
          <p className="text-slate-600 mt-1">
            Ações corretivas para achados de auditoria
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Plano</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar planos de ação..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {loading && actionPlans.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          Carregando planos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm">
          <ClipboardCheck className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            Nenhum plano de ação
          </p>
          <p className="text-slate-400 mt-1">
            Crie um plano para tratar os achados de auditoria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ap) => (
            <div
              key={ap.id}
              className={`bg-white p-5 rounded-xl border shadow-sm transition-shadow hover:shadow-md ${
                isOverdue(ap) ? "border-red-200" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-sm leading-tight flex-1">
                  {ap.title}
                </h3>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                    PRIORITY_CONFIG[ap.priority].color
                  }`}
                >
                  {PRIORITY_CONFIG[ap.priority].label}
                </span>
              </div>

              {ap.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {ap.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                {ap.due_date && (
                  <span
                    className={`flex items-center gap-1 ${
                      isOverdue(ap) ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    {isOverdue(ap) ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <Calendar className="w-3 h-3" />
                    )}
                    {new Date(ap.due_date).toLocaleDateString("pt-BR")}
                  </span>
                )}
                <span>• {STATUS_LABELS[ap.status]}</span>
              </div>

              <div className="flex gap-2">
                {ap.status === "pending" && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateActionPlan(ap.id, { status: "in_progress" })
                    }
                    className="text-xs flex-1"
                  >
                    <span>Iniciar</span>
                  </Button>
                )}
                {(ap.status === "in_progress" || ap.status === "overdue") && (
                  <Button
                    variant="ghost"
                    onClick={() =>
                      updateActionPlan(ap.id, {
                        status: "completed",
                        completed_at: new Date().toISOString(),
                      })
                    }
                    className="text-xs flex-1"
                  >
                    <span>Concluir</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Plano de Ação"
      >
        <div className="space-y-4">
          <Select
            label="Achado Relacionado"
            value={form.finding_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, finding_id: e.target.value }))
            }
          >
            <option value="">Selecione o achado...</option>
            {findings
              .filter((f) => f.status !== "resolved")
              .map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.risk_level.toUpperCase()}] {f.title}
                </option>
              ))}
          </Select>
          <Input
            label="Título da Ação"
            placeholder="Ação corretiva a ser tomada"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <Input
            label="Descrição"
            placeholder="Detalhes do plano de ação"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <Select
            label="Prioridade"
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                priority: e.target.value as ActionPlanPriority,
              }))
            }
          >
            {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
              <option key={val} value={val}>
                {cfg.label}
              </option>
            ))}
          </Select>
          <Input
            label="Data Limite"
            type="date"
            value={form.due_date ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, due_date: e.target.value }))
            }
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              <span>Cancelar</span>
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.finding_id || !form.title || loading}
            >
              <span>{loading ? "Criando..." : "Criar Plano"}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
