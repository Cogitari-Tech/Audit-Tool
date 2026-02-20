import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

export default function AuditDashboard() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const stats = [
    {
      title: "Auditorias Ativas",
      value: "0",
      icon: FileText,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Riscos Altos",
      value: "0",
      icon: AlertTriangle,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Conformidade",
      value: "0%",
      icon: ShieldCheck,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Horas Auditadas",
      value: "0h",
      icon: Clock,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
  ];

  const activeAudits: any[] = [];
  const risks: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Planejamento":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Revisão":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "Concluído":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Alto":
        return "text-red-600 bg-red-50";
      case "Médio":
        return "text-amber-600 bg-amber-50";
      case "Baixo":
        return "text-green-600 bg-green-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

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
        <Button className="flex items-center gap-2">
          <FileText className="w-4 h-4" /> Nova Auditoria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
        {/* Active Audits List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Auditorias em Andamento
          </h3>
          {activeAudits.length > 0 ? (
            <div className="space-y-6">
              {activeAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="border-b border-slate-100 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-base font-medium text-slate-900">
                        {audit.name}
                      </h4>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Users className="w-3 h-3 mr-1" /> Líder: {audit.leader}{" "}
                        |
                        <Clock className="w-3 h-3 mx-1" /> Prazo:{" "}
                        {audit.deadline}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(audit.status)}`}
                    >
                      {audit.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                    <div
                      className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${audit.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 text-right mt-1">
                    {audit.progress}% concluído
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <FileText className="w-12 h-12 mb-4 text-slate-300" />
              <p>Nenhuma auditoria em andamento.</p>
            </div>
          )}
        </div>

        {/* Risk Heatmap / Matrix List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Pontos de
            Atenção
          </h3>
          {risks.length > 0 ? (
            <>
              <div className="space-y-4">
                {risks.map((risk, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">
                        {risk.area}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${getRiskColor(risk.risk)}`}
                      >
                        {risk.risk}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{risk.description}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-sm font-normal text-slate-500"
              >
                Ver Mapa de Riscos Completo
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <ShieldCheck className="w-12 h-12 mb-4 text-slate-300" />
              <p>Nenhum ponto de atenção identificado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
