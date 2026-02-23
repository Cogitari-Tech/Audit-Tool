import { useState } from "react";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Modal } from "@/shared/components/ui/Modal";
import { useAudit } from "../hooks/useAudit";
import type {
  FindingRiskLevel,
  FindingStatus,
  CreateFindingInput,
} from "../types/audit.types";

const RISK_CONFIG: Record<FindingRiskLevel, { label: string; color: string }> = {
  critical: { label: "Crítico", color: "text-red-700 bg-red-50 border-red-200" },
  high: { label: "Alto", color: "text-orange-700 bg-orange-50 border-orange-200" },
  medium: { label: "Médio", color: "text-amber-700 bg-amber-50 border-amber-200" },
  low: { label: "Baixo", color: "text-green-700 bg-green-50 border-green-200" },
};

const STATUS_LABELS: Record<FindingStatus, string> = {
  open: "Aberto",
  in_progress: "Em Tratamento",
  resolved: "Resolvido",
  accepted: "Aceito",
};

export default function AuditFindings() {
  const { findings, programs, loading, createFinding, updateFinding } =
    useAudit();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [form, setForm] = useState<CreateFindingInput>({
    program_id: "",
    title: "",
    description: "",
    risk_level: "medium",
  });

  const filtered = findings.filter((f) => {
    const matchSearch =
      !search ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase());
    const matchRisk = !filterRisk || f.risk_level === filterRisk;
    const matchStatus = !filterStatus || f.status === filterStatus;
    return matchSearch && matchRisk && matchStatus;
  });

  const handleCreate = async () => {
    try {
      await createFinding(form);
      setShowModal(false);
      setForm({ program_id: "", title: "", description: "", risk_level: "medium" });
    } catch {
      // error shown via hook
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Achados de Auditoria
          </h1>
          <p className="text-slate-600 mt-1">
            Não conformidades e pontos de atenção identificados
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Achado</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar achados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="">Todos os riscos</option>
            {Object.entries(RISK_CONFIG).map(([val, cfg]) => (
              <option key={val} value={val}>
                {cfg.label}
              </option>
            ))}
          </Select>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Findings List */}
      {loading && findings.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-slate-400">
          Carregando achados...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm">
          <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            Nenhum achado encontrado
          </p>
          <p className="text-slate-400 mt-1">
            {search || filterRisk || filterStatus
              ? "Tente ajustar os filtros"
              : 'Registre o primeiro achado clicando em "Novo Achado"'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">Achado</th>
                <th className="px-6 py-4 font-medium">Programa</th>
                <th className="px-6 py-4 font-medium">Risco</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((finding) => (
                <tr
                  key={finding.id}
                  className="border-b border-slate-50 hover:bg-slate-25"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {finding.title}
                    </p>
                    {finding.description && (
                      <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">
                        {finding.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {finding.program?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        RISK_CONFIG[finding.risk_level].color
                      }`}
                    >
                      {RISK_CONFIG[finding.risk_level].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {STATUS_LABELS[finding.status]}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(finding.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    {finding.status === "open" && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          updateFinding(finding.id, { status: "in_progress" })
                        }
                      >
                        <span className="text-xs">Iniciar Tratamento</span>
                      </Button>
                    )}
                    {finding.status === "in_progress" && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          updateFinding(finding.id, {
                            status: "resolved",
                            resolved_at: new Date().toISOString(),
                          })
                        }
                      >
                        <span className="text-xs">Resolver</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Achado"
      >
        <div className="space-y-4">
          <Select
            label="Programa de Auditoria"
            value={form.program_id}
            onChange={(e) =>
              setForm((f) => ({ ...f, program_id: e.target.value }))
            }
          >
            <option value="">Selecione...</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Input
            label="Título"
            placeholder="Resumo do achado"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
          />
          <Input
            label="Descrição"
            placeholder="Detalhes do achado"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
          <Select
            label="Nível de Risco"
            value={form.risk_level}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                risk_level: e.target.value as FindingRiskLevel,
              }))
            }
          >
            {Object.entries(RISK_CONFIG).map(([val, cfg]) => (
              <option key={val} value={val}>
                {cfg.label}
              </option>
            ))}
          </Select>
          <Input
            label="Prazo para Resolução"
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
              disabled={!form.program_id || !form.title || loading}
            >
              <span>{loading ? "Registrando..." : "Registrar"}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
