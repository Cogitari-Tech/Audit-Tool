import {
  Shield,
  FileText,
  PieChart as PieChartIcon,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/shared/components/ui/Button";

export default function ComplianceDashboard() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const complianceData: any[] = [];
  const frameworks: any[] = [];
  const actionItems: any[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Otimizado":
        return "bg-green-100 text-green-700";
      case "Monitoramento":
        return "bg-blue-100 text-blue-700";
      case "Atenção":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "text-red-600 bg-red-50";
      case "Média":
        return "text-amber-600 bg-amber-50";
      case "Baixa":
        return "text-blue-600 bg-blue-50";
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
            Compliance e Governança
          </h1>
          <p className="text-slate-600 mt-1">
            Monitoramento de conformidade legislativa e regulatória
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileText className="w-4 h-4" /> Gerar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Score Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Índice Geral de Conformidade
          </h3>
          {complianceData.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <PieChartIcon className="w-12 h-12 mb-4 text-slate-300" />
              <p>Sem dados de conformidade.</p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {complianceData.length > 0 ? (
              complianceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {item.value}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400">
                Dados indisponíveis
              </p>
            )}
          </div>
        </div>

        {/* Frameworks Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Status dos Frameworks
          </h3>
          {frameworks.length > 0 ? (
            <div className="space-y-6">
              {frameworks.map((fw, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">
                        {fw.name}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fw.status)}`}
                    >
                      {fw.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${fw.color}`}
                        style={{ width: `${fw.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {fw.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Shield className="w-12 h-12 mb-4 text-slate-300" />
              <p>Nenhum framework monitorado no momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Ações Recomendadas
          </h3>
        </div>
        {actionItems.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-2 rounded-full ${item.status === "Concluído" ? "bg-green-100" : "bg-slate-100"}`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${item.status === "Concluído" ? "text-green-600" : "text-slate-400"}`}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Vencimento: {item.due}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle className="w-12 h-12 mb-4 mx-auto text-slate-300" />
            <p>Nenhuma ação recomendada pendente.</p>
          </div>
        )}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <Button
            variant="ghost"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Ver Todas as Ações <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
