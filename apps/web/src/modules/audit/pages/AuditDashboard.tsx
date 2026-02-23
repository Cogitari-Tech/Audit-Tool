import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { useAudit } from "../hooks/useAudit";

export default function AuditDashboard() {
  const { programs, findings, stats, loading } = useAudit();

  const statCards = [
    {
      title: "Auditorias Ativas",
      value: stats.activePrograms.toString(),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Riscos Altos/Críticos",
      value: stats.highRiskFindings.toString(),
      icon: AlertTriangle,
      color: stats.highRiskFindings > 0 ? "text-red-600" : "text-slate-400",
      bg: stats.highRiskFindings > 0 ? "bg-red-50" : "bg-slate-100",
    },
    {
      title: "Conformidade",
      value: `${stats.complianceRate}%`,
      icon: ShieldCheck,
      color: stats.complianceRate >= 80 ? "text-emerald-600" : "text-amber-600",
      bg: stats.complianceRate >= 80 ? "bg-emerald-50" : "bg-amber-50",
    },
    {
      title: "Ações Pendentes",
      value: stats.pendingActionPlans.toString(),
      icon: Clock,
      color: stats.pendingActionPlans > 0 ? "text-amber-600" : "text-slate-400",
      bg: stats.pendingActionPlans > 0 ? "bg-amber-50" : "bg-slate-100",
    },
  ];

  const activePrograms = programs.filter(
    (p) => p.status === "in_progress" || p.status === "draft"
  );

  const recentFindings = findings
    .filter((f) => f.status !== "resolved")
    .slice(0, 5);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-700 bg-red-50";
      case "high":
        return "text-orange-700 bg-orange-50";
      case "medium":
        return "text-amber-700 bg-amber-50";
      case "low":
        return "text-green-700 bg-green-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: "Rascunho",
      in_progress: "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return map[status] ?? status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "draft":
        return "text-slate-600 bg-slate-50 border-slate-200";
      case "completed":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  if (loading && programs.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-64 text-slate-400">
        Carregando painel de auditoria...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Painel de Auditoria
          </h1>
          <p className="text-slate-600 mt-1">
            Gestão de riscos e acompanhamento de auditorias
          </p>
        </div>
        <a href="/audit/programs">
          <Button className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Nova Auditoria</span>
          </Button>
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Audits */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Auditorias em Andamento
            </h3>
            <a
              href="/audit/programs"
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {activePrograms.length > 0 ? (
            <div className="space-y-6">
              {activePrograms.slice(0, 5).map((program) => {
                const programFindings = findings.filter(
                  (f) => f.program_id === program.id
                );
                const resolved = programFindings.filter(
                  (f) => f.status === "resolved" || f.status === "accepted"
                ).length;
                const total = programFindings.length;
                const progress = total > 0 ? Math.round((resolved / total) * 100) : 0;

                return (
                  <div
                    key={program.id}
                    className="border-b border-slate-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-medium text-slate-900">
                          {program.name}
                        </h4>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          {program.framework && (
                            <>
                              <FileText className="w-3 h-3 mr-1" />
                              {program.framework.name}
                              <span className="mx-2">|</span>
                            </>
                          )}
                          <Users className="w-3 h-3 mr-1" />
                          {programFindings.length} achados
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          program.status
                        )}`}
                      >
                        {getStatusLabel(program.status)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                      <div
                        className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 text-right mt-1">
                      {progress}% resolvido
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <FileText className="w-12 h-12 mb-4 text-slate-300" />
              <p>Nenhuma auditoria em andamento.</p>
            </div>
          )}
        </div>

        {/* Recent Findings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Achados Recentes
            </h3>
            <a
              href="/audit/findings"
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {recentFindings.length > 0 ? (
            <div className="space-y-4">
              {recentFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                      {finding.title}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${getRiskColor(
                        finding.risk_level
                      )}`}
                    >
                      {finding.risk_level === "critical"
                        ? "Crítico"
                        : finding.risk_level === "high"
                          ? "Alto"
                          : finding.risk_level === "medium"
                            ? "Médio"
                            : "Baixo"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {finding.program?.name ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
              <p>Nenhum achado pendente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
