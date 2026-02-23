import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/shared/components/ui/Button";

export default function FinanceDashboard() {
  // Mock Data
  const kpis = [
    {
      title: "Receita Mensal",
      value: "R$ 0,00",
      trend: "0%",
      icon: TrendingUp,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Despesas",
      value: "R$ 0,00",
      trend: "0%",
      icon: TrendingDown,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Lucro Líquido",
      value: "R$ 0,00",
      trend: "0%",
      icon: DollarSign,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
    {
      title: "Saldo em Caixa",
      value: "R$ 0,00",
      trend: "0%",
      icon: Wallet,
      color: "text-slate-400",
      bg: "bg-slate-100",
    },
  ];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const cashFlowData: any[] = [];
  const expenseData: any[] = [];
  const recentTransactions: any[] = [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Visão Geral Financeira
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Acompanhamento em tempo real do desempenho financeiro
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Relatório
          </Button>
          <Button className="flex items-center gap-2">Nova Transação</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200"
          >
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {kpi.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {kpi.value}
              </h3>
              <p
                className={`text-xs mt-1 font-medium ${kpi.trend.startsWith("+") ? "text-green-600 dark:text-green-400" : kpi.trend.startsWith("-") ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}
              >
                {kpi.trend} vs mês anterior
              </p>
            </div>
            <div
              className={`p-3 rounded-xl clay dark:bg-slate-800 ${kpi.bg.replace("bg-", "bg-opacity-50 ")}`}
            >
              <kpi.icon
                className={`w-6 h-6 ${kpi.color.replace("text-slate-400", "text-brand-500")}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Fluxo de Caixa (Últimos 6 Meses)
          </h3>
          {cashFlowData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="Receitas"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Despesas"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
              <p>Sem dados de fluxo de caixa para exibir.</p>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Despesas por Categoria
          </h3>
          {expenseData.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(255,255,255,0.1)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <PieChartIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
              <p>Sem dados de despesas.</p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {expenseData.length > 0 ? (
              expenseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    R$ {item.value.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400">
                Nenhuma categoria registrada
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/20 dark:border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Transações Recentes
          </h3>
          <Button variant="ghost" className="text-sm">
            Ver Todas
          </Button>
        </div>
        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 hover:bg-white/50 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${tx.type === "credit" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                      {tx.description}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${tx.type === "credit" ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {tx.type === "credit" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <Wallet className="w-12 h-12 mb-4 mx-auto text-slate-300 dark:text-slate-600" />
            <p>Nenhuma transação recente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
