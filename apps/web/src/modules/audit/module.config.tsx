import { lazy } from "react";
import { ModuleConfig } from "../registry";

const AuditDashboard = lazy(() => import("./pages/AuditDashboard"));

export const auditModuleConfig: ModuleConfig = {
  id: "audit",
  name: "Auditoria",
  description: "Gestão de auditorias",
  icon: "📋",
  version: "1.0.0",
  permissions: [],
  routes: [
    {
      path: "/audit",
      element: <AuditDashboard />,
      handle: { title: "Dashboard de Auditoria" },
    },
  ],
  navigation: [
    {
      label: "Dashboard",
      path: "/audit",
      icon: "LayoutDashboard",
    },
  ],
  settings: {},
};

export default auditModuleConfig;
