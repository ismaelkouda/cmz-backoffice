import { Routes } from "@angular/router";


export const DASHBOARD = 'dashboard';
export const PATRIMOINE = 'patrimoine';
export const DEMANDE_SERVICE = 'demandes';
export const REFERENTIEL_TELEMETRIE = 'ref-supervision';
export const SUPERVISION_SIM = 'supervision-sim';
export const SUPERVISION_OPERATIONS = 'operations';
export const OPERATION_PROVISIONNING = 'provisionning';
export const ZONE_TRAFIC = 'zone-trafic';
export const REPORTING = 'reporting';
export const SLA_DEMANDE_SERVICE = 'sla-demande-service';
export const INTERCONNEXION_ECHANGE = 'interconnexion';
export const SUPERVISION_SYSTEME = 'supervision-systeme';
export const PARAMETRE_SECURITE = 'parametre-securite'
export const OPERATIONS_SIM = 'operations-sim';
export const STRUCTURE_ORGANISATIONNELLE = 'structure-organisationnelle'
export const ADMIN_USER = 'user'


export const content: Routes = [
  {
    path: DASHBOARD,
    loadChildren: () => import("../../presentation/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
    data: { title: 'Tableau de bord' }
  },
  {
    path: PATRIMOINE,
    loadChildren: () => import("../../presentation/pages/patrimoine/patrimoine.module").then((m) => m.PatrimoineModule),
    data: {
      module: 'Patrimoine',
      subModule: [
        'Cartes SIM',
        'Groupe de SIM',
        'Dotation Data',
        'Etat des Soldes Data',
        'Téléchargements'
      ]
    }
  },
  {
    path: DEMANDE_SERVICE,
    loadChildren: () => import("../../presentation/pages/demandes/demandes.module").then((m) => m.DemandesModule),
    data: {
      module: 'Demandes',
      subModule: [
        'Activations',
        'Suspensions',
        'Résiliations'
      ]
    }
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
    path: REPORTING,
    loadChildren: () => import("../../presentation/pages/reporting/reporting.module").then((m) => m.ReportingModule),
    data: { title: ZONE_TRAFIC }
  },
  {
    path: SUPERVISION_SIM,
    loadChildren: () => import("../../presentation/pages/analyse-alerte/analyse-alerte.module").then((m) => m.AnalyseAlerteModule),
    data: { title: SUPERVISION_SIM }
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
    path: SLA_DEMANDE_SERVICE,
    loadChildren: () => import("../../presentation/pages/sla-demande-service/sla-demande-service.module").then((m) => m.SlaDemandeServiceModule),
    data: {
      module: 'SLA demandes Service',
      subModule: [
        'Tableau SLA',
        'Rapport Conformité des demandes'
      ]
    }
  },
  {
    path: PARAMETRE_SECURITE,
    loadChildren: () => import("../../presentation/pages/parametre-securite/parametre-securite.module").then((m) => m.ParametreSecuriteModule),
    data: { title: PARAMETRE_SECURITE }
  },
  {
    path: OPERATIONS_SIM,
    loadChildren: () => import("../../presentation/pages/operation-sim/operation-sim.module").then((m) => m.OperationSimModule),
  },
  {
    path: ADMIN_USER,
    loadChildren: () => import("../../presentation/pages/administration/administration.module").then((m) => m.AdministrationModule),
    data: {
      module: 'User',
      subModule: [
        'Ventes',
        'Stock',
        'Produits',
        'Achats',
        'Clients',
        'Historique des activations',
        'Groupes',
        'Point de Ventes'
      ]
    }
  },
  {
    path: STRUCTURE_ORGANISATIONNELLE,
    loadChildren: () => import("../../presentation/pages/structure-niveau/structure-niveau.module").then((m) => m.StructureNiveauModule),
    data: {
      module: 'Structure Organisationnelle',
    }
  }

];
