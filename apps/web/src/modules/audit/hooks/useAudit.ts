import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuditStore } from "../../../store/auditStore";
import { supabase } from "../../../config/supabase";
import type {
  AuditProgram,
  AuditFinding,
  AuditActionPlan,
  AuditDashboardStats,
  CreateProgramInput,
  CreateFindingInput,
  CreateActionPlanInput,
  AuditProgramChecklist,
} from "../types/audit.types";

/**
 * Facade hook for the Audit module.
 * Encapsulates all Supabase queries and state updates.
 */
export function useAudit() {
  const store = useAuditStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Tenant helper ─────────────────────────────────────
  const getTenantId = useCallback(async (): Promise<string> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data } = await supabase
      .from("tenant_members")
      .select("tenant_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!data?.tenant_id)
      throw new Error("Usuário não associado a nenhuma empresa");
    return data.tenant_id;
  }, []);

  // ─── Frameworks ────────────────────────────────────────
  const loadFrameworks = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("audit_frameworks")
      .select("*")
      .order("name");

    if (err) throw err;
    store.setFrameworks(data ?? []);
  }, [store]);

  // ─── Programs ──────────────────────────────────────────
  const loadPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("audit_programs")
        .select("*, framework:audit_frameworks(id, name)")
        .order("created_at", { ascending: false });

      if (err) throw err;
      store.setPrograms(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar programas",
      );
    } finally {
      setLoading(false);
    }
  }, [store]);

  const createProgram = useCallback(
    async (input: CreateProgramInput) => {
      setLoading(true);
      setError(null);
      try {
        const tenantId = await getTenantId();
        const { data, error: err } = await supabase
          .from("audit_programs")
          .insert({ ...input, tenant_id: tenantId })
          .select("*, framework:audit_frameworks(id, name)")
          .single();

        if (err) throw err;
        store.addProgram(data as AuditProgram);
        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Erro ao criar programa";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, getTenantId],
  );

  const updateProgram = useCallback(
    async (id: string, updates: Partial<AuditProgram>) => {
      setLoading(true);
      try {
        const { error: err } = await supabase
          .from("audit_programs")
          .update(updates)
          .eq("id", id);

        if (err) throw err;
        store.updateProgram(id, updates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao atualizar");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const deleteProgram = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const { error: err } = await supabase
          .from("audit_programs")
          .delete()
          .eq("id", id);

        if (err) throw err;
        store.removeProgram(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao excluir");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  // ─── Checklists ────────────────────────────────────────
  const getChecklists = useCallback(async (programId: string) => {
    const { data, error: err } = await supabase
      .from("audit_program_checklists")
      .select("*, control:audit_framework_controls(id, code, title)")
      .eq("program_id", programId)
      .order("sort_order");

    if (err) throw err;
    return (data ?? []) as AuditProgramChecklist[];
  }, []);

  const updateChecklistItem = useCallback(
    async (id: string, updates: Partial<AuditProgramChecklist>) => {
      const { error: err } = await supabase
        .from("audit_program_checklists")
        .update(updates)
        .eq("id", id);

      if (err) throw err;
    },
    [],
  );

  const populateChecklistFromFramework = useCallback(
    async (programId: string, frameworkId: string) => {
      setLoading(true);
      try {
        const { data: controls } = await supabase
          .from("audit_framework_controls")
          .select("id, code, title, description, sort_order")
          .eq("framework_id", frameworkId)
          .order("sort_order");

        if (!controls?.length) return;

        const items = controls.map((c) => ({
          program_id: programId,
          control_id: c.id,
          title: `${c.code} — ${c.title}`,
          description: c.description,
          sort_order: c.sort_order,
        }));

        const { error: err } = await supabase
          .from("audit_program_checklists")
          .insert(items);

        if (err) throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ─── Findings ──────────────────────────────────────────
  const loadFindings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("audit_findings")
        .select("*, program:audit_programs(id, name)")
        .order("created_at", { ascending: false });

      if (err) throw err;
      store.setFindings(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar achados");
    } finally {
      setLoading(false);
    }
  }, [store]);

  const createFinding = useCallback(
    async (input: CreateFindingInput) => {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("audit_findings")
          .insert(input)
          .select("*, program:audit_programs(id, name)")
          .single();

        if (err) throw err;
        store.addFinding(data as AuditFinding);
        return data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar achado");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const updateFinding = useCallback(
    async (id: string, updates: Partial<AuditFinding>) => {
      const { error: err } = await supabase
        .from("audit_findings")
        .update(updates)
        .eq("id", id);

      if (err) throw err;
      store.updateFinding(id, updates);
    },
    [store],
  );

  // ─── Action Plans ──────────────────────────────────────
  const loadActionPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("audit_action_plans")
        .select(
          "*, finding:audit_findings(id, title, source_type, source_ref, program:audit_programs(id, name))",
        )
        .order("created_at", { ascending: false });

      if (err) throw err;
      store.setActionPlans(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar planos de ação",
      );
    } finally {
      setLoading(false);
    }
  }, [store]);

  const createActionPlan = useCallback(
    async (input: CreateActionPlanInput) => {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("audit_action_plans")
          .insert(input)
          .select("*, finding:audit_findings(id, title)")
          .single();

        if (err) throw err;
        store.addActionPlan(data as AuditActionPlan);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao criar plano de ação",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store],
  );

  const updateActionPlan = useCallback(
    async (id: string, updates: Partial<AuditActionPlan>) => {
      const { error: err } = await supabase
        .from("audit_action_plans")
        .update(updates)
        .eq("id", id);

      if (err) throw err;
      store.updateActionPlan(id, updates);
    },
    [store],
  );

  // ─── Dashboard stats ──────────────────────────────────
  const getDashboardStats = useMemo((): AuditDashboardStats => {
    const activePrograms = store.programs.filter(
      (p) => p.status === "in_progress" || p.status === "draft",
    ).length;

    const highRiskFindings = store.findings.filter(
      (f) =>
        (f.risk_level === "critical" || f.risk_level === "high") &&
        f.status !== "resolved",
    ).length;

    const totalFindings = store.findings.length;
    const resolvedFindings = store.findings.filter(
      (f) => f.status === "resolved" || f.status === "accepted",
    ).length;
    const complianceRate =
      totalFindings > 0
        ? Math.round((resolvedFindings / totalFindings) * 100)
        : 100;

    const pendingActionPlans = store.actionPlans.filter(
      (ap) => ap.status === "pending" || ap.status === "in_progress",
    ).length;

    return {
      activePrograms,
      highRiskFindings,
      complianceRate,
      pendingActionPlans,
    };
  }, [store.programs, store.findings, store.actionPlans]);

  // ─── Bootstrap ─────────────────────────────────────────
  useEffect(() => {
    loadFrameworks();
    loadPrograms();
    loadFindings();
    loadActionPlans();
  }, [loadFrameworks, loadPrograms, loadFindings, loadActionPlans]);

  return {
    // State
    programs: store.programs,
    frameworks: store.frameworks,
    findings: store.findings,
    actionPlans: store.actionPlans,
    loading,
    error,
    stats: getDashboardStats,

    // Programs
    loadPrograms,
    createProgram,
    updateProgram,
    deleteProgram,

    // Checklists
    getChecklists,
    updateChecklistItem,
    populateChecklistFromFramework,

    // Findings
    loadFindings,
    createFinding,
    updateFinding,

    // Action Plans
    loadActionPlans,
    createActionPlan,
    updateActionPlan,

    // Frameworks
    loadFrameworks,
  };
}
