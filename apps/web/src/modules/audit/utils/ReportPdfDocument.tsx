import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { AuditReport } from "../types/audit.types";

const BRAND = "#EA580C";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10 },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  docId: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
    position: "absolute",
    right: 0,
    top: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: BRAND,
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  infoLabel: {
    width: "30%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  infoValue: { width: "70%", fontSize: 10, color: "#0f172a" },
  bodyText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  findingCard: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#0f172a",
  },
  findingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  findingNum: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor: "#0f172a",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  riskBadge: {
    fontSize: 8,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  w2hLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: BRAND,
    marginTop: 4,
    textTransform: "uppercase",
  },
  w2hValue: { fontSize: 9, color: "#334155", marginBottom: 2 },
  codeBlock: {
    fontFamily: "Courier",
    fontSize: 8,
    color: "#22c55e",
    backgroundColor: "#0f172a",
    padding: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  sigBlock: {
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#0f172a",
    paddingTop: 6,
  },
  sigName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  sigRole: { fontSize: 8, color: "#64748b" },
  sigDate: { fontSize: 7, color: "#94a3b8", marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#cbd5e1",
  },
});

function getRiskStyle(risk: string) {
  switch (risk) {
    case "critical":
      return { color: "#991b1b", backgroundColor: "#fef2f2" };
    case "high":
      return { color: "#9a3412", backgroundColor: "#fff7ed" };
    case "medium":
      return { color: "#854d0e", backgroundColor: "#fefce8" };
    default:
      return { color: "#166534", backgroundColor: "#f0fdf4" };
  }
}

function getRiskLabel(risk: string) {
  const map: Record<string, string> = {
    critical: "Crítico",
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
  };
  return map[risk] ?? risk;
}

function ReportPdfDocument({ report }: { report: AuditReport }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Auditoria</Text>
          <Text style={styles.subtitle}>Cogitari Tech</Text>
          <Text style={styles.docId}>{report.doc_id}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Empresa Cliente</Text>
          <Text style={styles.infoValue}>{report.client_name || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Projeto / Módulo</Text>
          <Text style={styles.infoValue}>{report.project_name || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ambiente</Text>
          <Text style={styles.infoValue}>{report.environment || "—"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Período</Text>
          <Text style={styles.infoValue}>
            {report.start_date} a {report.end_date}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Auditor Líder</Text>
          <Text style={styles.infoValue}>{report.lead_auditor || "—"}</Text>
        </View>

        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>1. Sumário Executivo</Text>
        <Text style={styles.bodyText}>
          {report.executive_summary || "Não informado."}
        </Text>

        {/* Findings */}
        <Text style={styles.sectionTitle}>
          2. Registro de Ocorrências (5W2H)
        </Text>
        {report.findings.map((f, i) => (
          <View key={f.id} style={styles.findingCard} wrap={false}>
            <View style={styles.findingHeader}>
              <Text style={styles.findingNum}>
                Achado #{String(i + 1).padStart(2, "0")}
              </Text>
              <Text style={[styles.riskBadge, getRiskStyle(f.risk_level)]}>
                {getRiskLabel(f.risk_level)}
              </Text>
            </View>
            <Text style={styles.w2hLabel}>O QUÊ (What)</Text>
            <Text style={styles.w2hValue}>{f.analysis.what || "—"}</Text>
            <Text style={styles.w2hLabel}>POR QUÊ (Why)</Text>
            <Text style={styles.w2hValue}>{f.analysis.why || "—"}</Text>
            <Text style={styles.w2hLabel}>ONDE (Where)</Text>
            <Text style={styles.w2hValue}>{f.analysis.where || "—"}</Text>
            <Text style={styles.w2hLabel}>QUANDO (When)</Text>
            <Text style={styles.w2hValue}>{f.analysis.when || "—"}</Text>
            <Text style={styles.w2hLabel}>QUEM (Who)</Text>
            <Text style={styles.w2hValue}>{f.analysis.who || "—"}</Text>
            <Text style={styles.w2hLabel}>COMO (How)</Text>
            <Text style={styles.w2hValue}>{f.analysis.how || "—"}</Text>
            <Text style={styles.w2hLabel}>QUANTO (How Much)</Text>
            <Text style={styles.w2hValue}>{f.analysis.howMuch || "—"}</Text>
            {f.code_snippet ? (
              <Text style={styles.codeBlock}>{f.code_snippet}</Text>
            ) : null}
          </View>
        ))}

        {/* Final Opinion */}
        <Text style={styles.sectionTitle}>3. Parecer Final</Text>
        <Text style={styles.bodyText}>
          {report.final_opinion || "Não informado."}
        </Text>

        {/* Signatures */}
        <Text style={styles.sectionTitle}>4. Assinaturas</Text>
        {report.signatures.map((s, i) => (
          <View key={i} style={styles.sigBlock}>
            <Text style={styles.sigName}>{s.name}</Text>
            <Text style={styles.sigRole}>{s.role}</Text>
            <Text style={styles.sigDate}>Última Ação: {s.signed_at}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Cogitari Tech — Documento gerado automaticamente
        </Text>
      </Page>
    </Document>
  );
}

export async function exportPdf(report: AuditReport): Promise<void> {
  const blob = await pdf(<ReportPdfDocument report={report} />).toBlob();
  const clientSlug = (report.client_name || "Cliente").replace(/\s+/g, "_");
  const dateStr = new Date().toISOString().split("T")[0];
  saveAs(blob, `Auditoria_${clientSlug}_${dateStr}.pdf`);
}

export default ReportPdfDocument;
