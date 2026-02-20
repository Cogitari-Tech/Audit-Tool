// apps/web/src/modules/finance/pages/CashFlow.tsx

import React, { useState } from "react";
import { useFinance } from "../hooks/useFinance";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Modal } from "@/shared/components/ui/Modal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

/**
 * Página de Fluxo de Caixa
 *
 * Exibe gráfico de entradas/saídas e lista de transações.
 * Permite adicionar novas transações via modal.
 */
export default function CashFlow() {
  const {
    transactions,
    accounts,
    loading,
    error,
    createTransaction,
    getMonthSummary,
    formatCurrency,
    formatDate,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    accountDebitId: "",
    accountCreditId: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const summary = getMonthSummary();

  // Prepara dados para o gráfico
  const chartData = transactions.reduce(
    (acc, transaction) => {
      const dateKey = formatDate(transaction.date);

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, inflow: 0, outflow: 0 };
      }

      const creditAccount = accounts.find(
        (a) => a.id === transaction.accountCreditId,
      );
      const debitAccount = accounts.find(
        (a) => a.id === transaction.accountDebitId,
      );

      if (creditAccount?.type === "Receita") {
        acc[dateKey].inflow += transaction.amount;
      }
      if (debitAccount?.type === "Despesa") {
        acc[dateKey].outflow += transaction.amount;
      }

      return acc;
    },
    {} as Record<string, { date: string; inflow: number; outflow: number }>,
  );

  const chartDataArray = Object.values(chartData);

  // Handler do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createTransaction({
        date: new Date(formData.date),
        description: formData.description,
        accountDebitId: formData.accountDebitId,
        accountCreditId: formData.accountCreditId,
        amount: parseFloat(formData.amount),
      });

      // Reseta formulário e fecha modal
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        accountDebitId: "",
        accountCreditId: "",
        amount: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create transaction:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtra apenas contas analíticas (folhas)
  const analyticalAccounts = accounts.filter((a) => a.isAnalytical);

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Fluxo de Caixa
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Controle de entradas e saídas do mês vigente
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Entradas
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(summary.revenue)}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-3">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Saídas
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {formatCurrency(summary.expenses)}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-3">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Resultado
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  summary.netIncome >= 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCurrency(summary.netIncome)}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Evolução do Fluxo de Caixa
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartDataArray}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis dataKey="date" tick={{ fill: "#94a3b8" }} />
            <YAxis tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="inflow"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="outflow"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              name="Saídas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/20 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Transações Recentes ({summary.transactionCount})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Débito
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Crédito
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20 dark:divide-white/5">
              {transactions.map((transaction) => {
                const debitAccount = accounts.find(
                  (a) => a.id === transaction.accountDebitId,
                );
                const creditAccount = accounts.find(
                  (a) => a.id === transaction.accountCreditId,
                );

                return (
                  <tr
                    key={transaction.id}
                    className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {debitAccount?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {creditAccount?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-slate-900 dark:text-slate-200">
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Transação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Transação"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Data"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <Input
            label="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Ex: Pagamento fornecedor XYZ"
            required
          />

          <Select
            label="Conta Débito"
            value={formData.accountDebitId}
            onChange={(e) =>
              setFormData({ ...formData, accountDebitId: e.target.value })
            }
            required
          >
            <option value="">Selecione...</option>
            {analyticalAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </option>
            ))}
          </Select>

          <Select
            label="Conta Crédito"
            value={formData.accountCreditId}
            onChange={(e) =>
              setFormData({ ...formData, accountCreditId: e.target.value })
            }
            required
          >
            <option value="">Selecione...</option>
            {analyticalAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </option>
            ))}
          </Select>

          <Input
            label="Valor"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0,00"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
