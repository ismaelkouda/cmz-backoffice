import { Routes } from "@angular/router";

export const DASHBOARD = 'dashboard';
export const PATRIMOINE = 'patrimoine';
export const TRANSACTIONS_SIM = 'transactions-sim';
export const REFERENTIEL_TELEMETRIE = 'ref-telemetrie';
export const ANALYSE_ALERTE = 'analyse-alerte';
export const SUPERVISION_OPERATIONS = 'operations';
export const OPERATION_PROVISIONNING = 'provisionning';
export const ZONE_TRAFIC = 'zone-trafic';
export const INTERCONNEXION_ECHANGE = 'interconnexion';
export const SUPERVISION_SYSTEME = 'supervision-systeme';
export const PARAMETRE_SECURITE = 'parametre-securite'



export const content: Routes = [
  {
    path: DASHBOARD,
    loadChildren: () => import("../../presentation/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
    data: { title: 'Tableau de bord' }
  },
  {
    path: PATRIMOINE,
    loadChildren: () => import("../../presentation/pages/patrimoine/patrimoine.module").then((m) => m.PatrimoineModule),
    data: { title: PATRIMOINE }
  },
  {
    path: TRANSACTIONS_SIM,
    loadChildren: () => import("../../presentation/pages/transaction/transaction.module").then((m) => m.TransactionModule),
    data: { title: TRANSACTIONS_SIM }
  },
  {
    path: REFERENTIEL_TELEMETRIE,
    loadChildren: () => import("../../presentation/pages/ref-telemetrie/ref-telemetrie.module").then((m) => m.RefTelemetrieModule),
    data: { title: REFERENTIEL_TELEMETRIE }
  },
  {
    path: OPERATION_PROVISIONNING,
    loadChildren: () => import("../../presentation/pages/provisionning/provisionning.module").then((m) => m.ProvisionningModule),
    data: { title: OPERATION_PROVISIONNING }
  },
  {
    path: SUPERVISION_OPERATIONS,
    loadChildren: () => import('../../presentation/pages/supervision-operations/supervision-operations.module').then((m) => m.SupervisionOperationsModule),
  },
  {
    path: ZONE_TRAFIC,
    loadChildren: () => import("../../presentation/pages/zone-trafic/zone-trafic.module").then((m) => m.ZoneTraficModule),
    data: { title: ZONE_TRAFIC }
  },
  {
    path: ANALYSE_ALERTE,
    loadChildren: () => import("../../presentation/pages/analyse-alerte/analyse-alerte.module").then((m) => m.AnalyseAlerteModule),
    data: { title: ANALYSE_ALERTE }
  },
  {
    path: INTERCONNEXION_ECHANGE,
    loadChildren: () => import("../../presentation/pages/interconnexion/interconnexion.module").then((m) => m.InterconnexionModule),
    data: { title: INTERCONNEXION_ECHANGE }
  },
  {
    path: SUPERVISION_SYSTEME,
    loadChildren: () => import("../../presentation/pages/supervision-systeme/supervision-systeme.module").then((m) => m.SupervisionSystemeModule),
    data: { title: SUPERVISION_SYSTEME }
  },
  {
    path: PARAMETRE_SECURITE,
    loadChildren: () => import("../../presentation/pages/parametre-securite/parametre-securite.module").then((m) => m.ParametreSecuriteModule),
    data: { title: PARAMETRE_SECURITE }
  },
];
