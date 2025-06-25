import { PagesGuard } from './../../core/guard/PagesGuard';
import { Routes } from '@angular/router';
export const SEARCH = 'search';

export const DASHBOARD = 'dashboard';
export const PATRIMOINE = 'patrimoine';
export const PATRIMONY = 'patrimony';
export const DEMANDE_SERVICE = 'demandes';
export const REQUESTS_SERVICES = 'requests-services';
export const REQUESTS_PRODUCTS = 'requests-products';
export const SUPERVISORY_REPOSITORY = 'supervisory-repository';
export const DEMANDE_PRODUITS = 'demandes-produits';
export const REFERENTIEL_TELEMETRIE = 'ref-supervision';
export const SUPERVISION_SIM = 'supervision-sim';
export const SUPERVISION_OPERATIONS = 'operations';
export const OPERATION_PROVISIONNING = 'provisionning';
export const ZONE_TRAFIC = 'zone-trafic';
export const REPORTING = 'reporting';
export const SLA_DEMANDE_SERVICE = 'sla-demande-service';
export const INTERCONNEXION_ECHANGE = 'interconnexion';
export const SUPERVISION_SYSTEME = 'supervision-systeme';
export const PARAMETRE_SECURITE = 'parametre-securite';
export const OPERATIONS_SIM = 'operations-sim';
export const STRUCTURE_ORGANISATIONNELLE = 'structure-organisationnelle';
export const ADMIN_USER = 'user';
export const GESTION_IDENTIFICATIONS = 'gestion-identifications';
export const COMPTABILITE = 'comptabilite';
export const ACCOUNTING = 'accounting';
export const OVERSEEING_OPERATIONS = 'overseeing-operations';

export const content: Routes = [
    {
        path: DASHBOARD,
        loadChildren: () =>
            import('../../presentation/pages/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
        data: {
            title: 'Tableau de bord',
        },
    },
    {
        path: GESTION_IDENTIFICATIONS,
        loadChildren: () =>
            import(
                '../../presentation/pages/gestion-identifications/gestion-identifications.module'
            ).then((m) => m.GestionIdentificationsModule),
        data: {
            module: "Gestion d'identifications",
            subModule: [
                "File d'attente",
                'Personnes physique',
                'Equipements connecté',
            ],
        },
    },
    // {
    //     path: PATRIMOINE,
    //     loadChildren: () => import('../../presentation/pages/patrimony/patrimony.module').then(
    //         (m) => m.PatrimonyModule
    //     ),
    //     data: {
    //         module: 'Patrimoine',
    //         subModule: [
    //             'Cartes SIM',
    //             'Cartes sim-blanches',
    //             // 'Dotation Data',
    //             'Etat des Soldes Data',
    //             'Etat des Soldes SMS',
    //             'Téléchargements',
    //             'Cartographie',
    //         ],
    //     },
    // },
    {
        path: PATRIMONY,
        loadChildren: () =>
            import('../../presentation/pages/patrimony/patrimony.module').then(
                (m) => m.PatrimonyModule
            ),
        data: {
            module: 'Patrimoine',
            subModule: [
                'MY_SIM_CARDS',
                'WHITE_SIM',
                // 'Dotation Data',
                'Etat des soldes Data',
                'Etat des soldes SMS',
                'Téléchargements',
                'MOBILE_IMPORTATION',
                // 'Cartographie',
            ],
        },
    },
    // {
    //     path: DEMANDE_SERVICE,
    //     loadChildren: () =>
    //         import('../../presentation/pages/demandes/demandes.module').then(
    //             (m) => m.DemandesModule
    //         ),
    //     data: {
    //         module: 'Demandes',
    //         subModule: [
    //             'Abonnements',
    //             'Suspensions',
    //             'Résiliations',
    //             'Changements de Formules',
    //         ],
    //     },
    // },
    {
        path: REQUESTS_SERVICES,
        loadChildren: () =>
            import(
                '../../presentation/pages/requests-services/requests-services.module'
            ).then((m) => m.RequestsServicesModule),
        data: {
            module: 'REQUESTS_SERVICES',
            subModule: [
                'MOBILE_SUBSCRIPTIONS',
                'MOBILE_IMPORTATION',
                'Suspensions',
                'Résiliations',
                'Changements de Formules',
            ],
        },
    },
    {
        path: DEMANDE_PRODUITS,
        loadChildren: () =>
            import(
                '../../presentation/pages/demandes-produits/demandes-produits.module'
            ).then((m) => m.DemandesProduitsModule),
        data: {
            module: 'Commande produits',
            subModule: ['SIM Blanches'],
        },
    },
    {
        path: REQUESTS_PRODUCTS,
        loadChildren: () =>
            import(
                '../../presentation/pages/requests-products/requests-products.module'
            ).then((m) => m.RequestsProductsModule),
        data: {
            module: 'REQUESTS_PRODUCTS',
            subModule: ['WHITE_SIM'],
        },
    },
    {
        path: OVERSEEING_OPERATIONS,
        loadChildren: () =>
            import(
                '../../presentation/pages/overseeing-operations/overseeing-operations.module'
            ).then((m) => m.OverseeingOperationsModule),
        data: {
            module: 'OVERSEEING_OPERATIONS',
            subModule: [
                'WAITING_QUEUE',
                'TREATMENT_MONITORING',
                'CLAIMS',
                'MY_NOTIFICATIONS',
                'MY_INBOX',
            ],
        },
    },
    {
        path: REFERENTIEL_TELEMETRIE,
        loadChildren: () =>
            import(
                '../../presentation/pages/ref-telemetrie/ref-telemetrie.module'
            ).then((m) => m.RefTelemetrieModule),
        data: {
            title: REFERENTIEL_TELEMETRIE,
            module: 'SUPERVISORY_REPOSITORY',
            subModule: [
                'INDICATORS_ALARMS',
                'SUPERVISORY_PROFILES',
                'SLA_AGREEMENTS',
                'SLA_MANAGEMENT_CONTRACT',
            ],
        },
    },
    // {
    //   path: SUPERVISORY_REPOSITORY,
    //   loadChildren: () => import("../../presentation/pages/supervisory-repository/supervisory-repository.module").then((m) => m.SupervisoryRepositoryModule),
    //   data: { title: SUPERVISORY_REPOSITORY }
    // },
    {
        path: OPERATION_PROVISIONNING,
        loadChildren: () =>
            import(
                '../../presentation/pages/provisionning/provisionning.module'
            ).then((m) => m.ProvisionningModule),
        data: {
            title: 'SUPERVISORY_REPOSITORY',
            module: 'SUPERVISORY_REPOSITORY',
            subModule: [
                'INDICATORS_ALARMS',
                'SUPERVISORY_PROFILES',
                'SLA_AGREEMENTS',
                'SLA_MANAGEMENT_CONTRACT',
            ],
        },
    },
    {
        path: SUPERVISION_OPERATIONS,
        loadChildren: () =>
            import(
                '../../presentation/pages/supervision-operations/supervision-operations.module'
            ).then((m) => m.SupervisionOperationsModule),
    },
    {
        path: COMPTABILITE,
        loadChildren: () =>
            import(
                '../../presentation/pages/comptabilite/comptabilite.module'
            ).then((m) => m.ComptabiliteModule),
        data: {
            module: 'Comptabilité',
            subModule: ['Facture'],
        },
    },
    {
        path: ACCOUNTING,
        loadChildren: () =>
            import(
                '../../presentation/pages/accounting/accounting.module'
            ).then((m) => m.AccountingModule),
        data: {
            module: 'ACCOUNTING',
            subModule: [
                'MY_ACCOUNT_CREDITS',
                'MY_INVOICES',
                'MY_PAYMENTS',
                'MY_ACCOUNT',
            ],
        },
    },
    {
        path: ZONE_TRAFIC,
        loadChildren: () =>
            import(
                '../../presentation/pages/zone-trafic/zone-trafic.module'
            ).then((m) => m.ZoneTraficModule),
        data: { title: ZONE_TRAFIC },
    },
    {
        path: REPORTING,
        loadChildren: () =>
            import('../../presentation/pages/reporting/reporting.module').then(
                (m) => m.ReportingModule
            ),
        data: { title: ZONE_TRAFIC },
    },
    {
        path: SUPERVISION_SIM,
        loadChildren: () =>
            import(
                '../../presentation/pages/analyse-alerte/analyse-alerte.module'
            ).then((m) => m.AnalyseAlerteModule),
        data: {
            title: SUPERVISION_SIM,
            module: 'SUPERVISION_SIM',
            subModule: [
                'ALARM_ANALYSIS_SMS',
                'ALARM_ANALYSIS_DATA',
                'DETECTION_SUPPLIES_DATA',
                'DETECTION_SUPPLIES_SMS',
            ],
        },
    },
    {
        path: INTERCONNEXION_ECHANGE,
        loadChildren: () =>
            import(
                '../../presentation/pages/interconnexion/interconnexion.module'
            ).then((m) => m.InterconnexionModule),
        data: { title: INTERCONNEXION_ECHANGE },
    },
    // {
    //   path: SUPERVISION_SYSTEME,
    //   loadChildren: () => import("../../presentation/pages/supervision-systeme/supervision-systeme.module").then((m) => m.SupervisionSystemeModule),
    //   data: { title: SUPERVISION_SYSTEME }
    // },
    {
        path: SLA_DEMANDE_SERVICE,
        loadChildren: () =>
            import(
                '../../presentation/pages/sla-demande-service/sla-demande-service.module'
            ).then((m) => m.SlaDemandeServiceModule),
        data: {
            module: 'Reporting SLA',
            subModule: [
                'Tableau de bord demandes',
                'Rapport Performances',
                'tableau de bord dossiers',
            ],
        },
    },
    {
        path: PARAMETRE_SECURITE,
        loadChildren: () =>
            import(
                '../../presentation/pages/parametre-securite/parametre-securite.module'
            ).then((m) => m.ParametreSecuriteModule),
        data: { title: PARAMETRE_SECURITE },
    },
    {
        path: OPERATIONS_SIM,
        loadChildren: () =>
            import(
                '../../presentation/pages/operation-sim/operation-sim.module'
            ).then((m) => m.OperationSimModule),
    },
    {
        path: ADMIN_USER,
        loadChildren: () =>
            import(
                '../../presentation/pages/administration/administration.module'
            ).then((m) => m.AdministrationModule),
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
                'Point de Ventes',
            ],
        },
    },
    {
        path: STRUCTURE_ORGANISATIONNELLE,
        loadChildren: () =>
            import(
                '../../presentation/pages/structure-niveau/structure-niveau.module'
            ).then((m) => m.StructureNiveauModule),
        data: {
            module: 'Structure Organisationnelle',
        },
    },
    {
        path: '',
        redirectTo: DASHBOARD,
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: DASHBOARD,
    },
];
