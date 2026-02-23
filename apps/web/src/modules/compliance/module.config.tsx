import { lazy } from "react";
import { ModuleConfig } from "../registry";

const ComplianceDashboard = lazy(() => import("./pages/ComplianceDashboard"));

export const complianceModuleConfig: ModuleConfig = {
  id: "compliance",
  name: "Compliance",
  description: "Gestão de compliance e SWOT",
  icon: "⚖️",
  version: "1.0.0",
  permissions: [],
  routes: [
    {
      path: "/compliance",
      element: <ComplianceDashboard />,
      handle: { title: "Dashboard de Compliance" },
    },
  ],
  navigation: [
    {
      label: "Dashboard",
      path: "/compliance",
      icon: "LayoutDashboard",
    },
  ],
  settings: {},
};

export default complianceModuleConfig;
