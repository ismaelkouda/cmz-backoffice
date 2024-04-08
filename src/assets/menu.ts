import { CONTACT_SLA } from './../presentation/pages/ref-telemetrie/ref-telemetrie-routing.module';
import { DEMANDE_ACTIVATION, DEMANDE_SUSPENSION, DEMANDE_RESILIATION } from '../presentation/pages/demandes/demandes-routing.module';
import { CARTOGRAPHIE, DOWNLOAD_FILE } from './../presentation/pages/patrimoine/patrimoine-routing.module';
import { DEMANDE_ROUTE, SUIVIE_TRAITEMENT_ROUTE,CONTENCIEUX_ROUTE, NOTIFY_ROUTE, JOURNAL_TRANSACTION_ROUTE, MESSAGERIE_ROUTE } from './../presentation/pages/supervision-operations/supervision-operations-routing.module';
import { COURBE_MESSAGE, DETECTION_APPRO, PERFORMANCE_COLLECTE } from 'src/presentation/pages/analyse-alerte/analyse-alerte-routing.module';
import { COMMANDE_SIM, STOCK_PRODUITS, LIGNE_CREDIT } from './../presentation/pages/provisionning/provisionning-routing.module';
import { CARTES_SIM, DOTATION_SERVICES, ETAT_SOLDE, GROUPE_SIM } from "src/presentation/pages/patrimoine/patrimoine-routing.module";
import { OBJECTIFS_SLA, PROFIL_SUPERVISION, SEUIL_ALARMES } from "src/presentation/pages/ref-telemetrie/ref-telemetrie-routing.module";
import { DEMANDE_SERVICE, OPERATION_PROVISIONNING, PARAMETRE_SECURITE, PATRIMOINE, REFERENTIEL_TELEMETRIE, SLA_DEMANDE_SERVICE, SUPERVISION_OPERATIONS, SUPERVISION_SIM } from "src/shared/routes/routes";
import { VUE_GEOGRAPHIQUE } from 'src/presentation/pages/zone-trafic/zone-trafic-routing.module';
import { JOURNAL_ATHENTICATION, PROFILS_HABILITATIONS, UTILISATEURS } from 'src/presentation/pages/parametre-securite/parametre-securite-routing.module';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { RAPPORT_CONFORMITE, SLA_DASHBORD } from 'src/presentation/pages/sla-demande-service/sla-demande-service-routing.module';

export var menuJson = [
    {
        title: "Patrimoine",
        label: "Patrimoine",
        data: "1-0-0-patrimoine",
        statut: false,
        expanded: true,
        icon: "disc",
        url: "assets/images/portail/icone_ps.png",
        path: `/${PATRIMOINE}/${CARTES_SIM}`,
        routerLink: `/${PATRIMOINE}/${CARTES_SIM}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${PATRIMOINE}/${CARTES_SIM}`,
                title: "Cartes SIM",
                label: "Cartes SIM",
                data: "1-1-0-cartes-sim",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
            /*
            {
                path: `/${PATRIMOINE}/${CARTOGRAPHIE}`,
                title: "Cartographie",
                label: "Cartographie",
                data: "1-7-0-cartographie",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
            */
            {
                path: `/${PATRIMOINE}/${ETAT_SOLDE}`,
                title: "Etat des Soldes Data",
                label: "Etat des Soldes Data",
                data: "1-2-0-etat-solde",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
            {
                path: `/${PATRIMOINE}/${GROUPE_SIM}`,
                title: "Groupes de SIM",
                label: "Groupes de SIM",
                data: "1-3-0-groupe-sim",
                type: "link"
            },
            {
                path: `/${PATRIMOINE}/${DOTATION_SERVICES}`,
                title: "Dotations Data",
                label: "Dotations Data",
                data: "1-4-0-dotation-service",
                type: "link",
            },
            {
                path: `/${PATRIMOINE}/${DOWNLOAD_FILE}`,
                title: "Téléchargements",
                label: "Téléchargements",
                data: "1-6-0-telechargement",
                type: "link",
                pack: ApplicationType.MONITORING
            }
        ]
    },
    {
        title: "Demandes de service",
        label: "Demandes de service",
        data: "9-0-0-demandes-de-services",
        statut: false,
        expanded: true,
        icon: "disc",
        url: "assets/images/portail/icone_ps.png",
        path: `/${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
        routerLink: `/${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
                title: "Activations mobiles",
                label: "Activations mobiles",
                data: "9-1-0-activations-mobile",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
            {
                path: `/${DEMANDE_SERVICE}/${DEMANDE_SUSPENSION}`,
                title: "Suspensions",
                label: "Suspensions",
                data: "9-2-0-suspensions",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
            {
                path: `/${DEMANDE_SERVICE}/${DEMANDE_RESILIATION}`,
                title: "Résiliations",
                label: "Résiliations",
                data: "9-3-0-resiliations",
                pack: ApplicationType.MONITORING,
                type: "link"
            },
        ]
    },
    {
        title: "Réferentiel de supervision",
        label: "Réferentiel de supervision",
        data: "2-0-0-referentiel-telemetrie",
        statut: false,
        expanded: true,
        icon: "thermometer",
        url: "assets/images/portail/icone_operation.webp",
        path: `/${REFERENTIEL_TELEMETRIE}/${SEUIL_ALARMES}`,
        routerLink: `/${REFERENTIEL_TELEMETRIE}/${SEUIL_ALARMES}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${SEUIL_ALARMES}`,
                title: "Indicateurs & Alarmes",
                label: "Indicateurs & Alarmes",
                data: "2-1-0-seuil-alarmes",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${PROFIL_SUPERVISION}`,
                title: "Profils de supervision",
                label: "Profils de supervision",
                data: "2-2-0-profil-supervision",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${OBJECTIFS_SLA}`,
                title: "Accords SLA",
                label: "Accords SLA",
                data: "2-3-0-objectif-sla",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${CONTACT_SLA}`,
                title: "Contacts Gestion SLA",
                label: "Contacts Gestion SLA",
                data: "2-4-0-contact-sla",
                type: "link",
                pack: ApplicationType.MONITORING
            }
        ]
    },
    {
        title: "Gestion de Portefeuille",
        label: "Gestion de Portefeuille",
        data: "3-0-0-gestion-portefeuille",
        statut: false,
        icon: "shopping-bag",
        url: "assets/images/portail/bag.png",
        path: `/${OPERATION_PROVISIONNING}/${LIGNE_CREDIT}`,
        routerLink: `/${OPERATION_PROVISIONNING}/${LIGNE_CREDIT}`,
        type: "sub",
        children: [
            {
                path: `/${OPERATION_PROVISIONNING}/${LIGNE_CREDIT}`,
                title: "Lignes de Crédits",
                label: "Lignes de Crédits",
                data: "3-1-0-ligne-credits",
                type: "link"
            },
            {
                path: `/${OPERATION_PROVISIONNING}/${COMMANDE_SIM}`,
                title: "Achat de Produits & Services",
                label: "Achat de Produits & Services",
                data: "3-2-0-achats-produits",
                type: "link"
            },
            {
                path: `/${OPERATION_PROVISIONNING}/${STOCK_PRODUITS}`,
                title: "Stock de Produits & Services",
                label: "Stock de Produits & Services",
                data: "3-3-0-stock-produits",
                type: "link"
            }
        ]
    },
    {
        title: "Suivi des opérations",
        label: "Suivi des opérations",
        data: "4-0-0-suivi-operations",
        statut: false,
        icon: "airplay",
        url: "assets/images/portail/icone_recherche_multicritere.webp",
        path: `/${SUPERVISION_OPERATIONS}/${DEMANDE_ROUTE}`,
        routerLink: `/${SUPERVISION_OPERATIONS}/${DEMANDE_ROUTE}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${SUPERVISION_OPERATIONS}/${DEMANDE_ROUTE}`,
                title: "File d'attente",
                label: "File d'attente",
                data: "4-1-0-fil-attente",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${SUIVIE_TRAITEMENT_ROUTE}`,
                title: "Suivi et traitement",
                label: "Suivi et traitement",
                data: "4-2-0-suivi-traitement",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${CONTENCIEUX_ROUTE}`,
                title: "Réclamations",
                label: "Réclamations",
                data: "4-4-0-contentieux",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${NOTIFY_ROUTE}`,
                title: "Centre de Notifications",
                label: "Centre de Notifications",
                data: "4-5-0-notifications",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${JOURNAL_TRANSACTION_ROUTE}`,
                title: "Journal des Transactions",
                label: "Journal des Transactions",
                data: "4-6-0-journaux-transaction",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${MESSAGERIE_ROUTE}`,
                title: "Messagerie",
                label: "Messagerie",
                data: "4-7-0-messagerie",
                type: "link",
                pack: ApplicationType.MONITORING
            },
        ]
    },
    {
        title: "Supervision des SIM",
        label: "Supervision des SIM",
        data: "5-0-0-supervision-sim",
        statut: false,
        icon: "activity",
        url: "assets/images/portail/graph.png",
        type: "sub",
        pack: ApplicationType.MONITORING,
        path: `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`,
        routerLink: `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`,
        children: [
            {
                path: `/zone-trafic/${VUE_GEOGRAPHIQUE}`,
                title: "Zones de Trafic",
                label: "Zones- de Trafic",
                data: "5-1-0-zone-trafic",
                type: "link",
                pack: ApplicationType.MONITORING,
            },
            {
                path: `/${SUPERVISION_SIM}/${COURBE_MESSAGE}`,
                title: "Analyse des Alarmes",
                label: "Analyse des Alarmes",
                data: "5-2-0-analyse-alarmes",
                type: "link",
                pack: ApplicationType.MONITORING,
            },
            {
                path: `/${SUPERVISION_SIM}/${DETECTION_APPRO}`,
                title: "Détection Appro. Data",
                label: "Détection Appro. Data",
                data: "5-3-0-detection-appro",
                type: "link",
                pack: ApplicationType.MONITORING,
            }
        ]
    },
    {
        title: "SLA Demandes Service",
        label: "SLA Demandes Service",
        data: "8-0-0-sla-demandes-de-services",
        statut: false,
        icon: "clock",
        path: `/${SLA_DEMANDE_SERVICE}/${SLA_DASHBORD}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${SLA_DEMANDE_SERVICE}/${SLA_DASHBORD}`,
                title: "Tableau de bord SLA",
                label: "Tableau de bord SLA",
                data: "8-1-0-dashboard-sla",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${SLA_DEMANDE_SERVICE}/${RAPPORT_CONFORMITE}`,
                title: "Rapport Conformité",
                label: "Rapport Conformité",
                data: "8-2-0-rapport-de-conformite",
                type: "link",
                pack: ApplicationType.MONITORING
            }
        ]
    },
    {
        title: "Paramètres & Sécurité",
        label: "Paramètres & Sécurité",
        data: "6-0-0-parametres-securite",
        statut: false,
        icon: "settings",
        url: "assets/images/portail/icone_settings.webp",
        path: `/${PARAMETRE_SECURITE}/${PROFILS_HABILITATIONS}`,
        routerLink: `/${PARAMETRE_SECURITE}/${PROFILS_HABILITATIONS}`,
        type: "sub",
        pack: ApplicationType.MONITORING,
        children: [
            {
                path: `/${PARAMETRE_SECURITE}/${PROFILS_HABILITATIONS}`,
                title: "Profils Habilitations",
                label: "Profils Habilitations",
                data: "6-1-0-profils-habilitations",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${PARAMETRE_SECURITE}/${UTILISATEURS}`,
                title: "Utilisateurs",
                label: "Utilisateurs",
                data: "6-2-0-utilisateurs",
                type: "link",
                pack: ApplicationType.MONITORING
            },
            {
                path: `/${PARAMETRE_SECURITE}/${JOURNAL_ATHENTICATION}`,
                title: "Journal des accès",
                label: "Journal des accès",
                data: "6-3-0-journaux-auth",
                type: "link",
                pack: ApplicationType.MONITORING
            }
        ]
    }
]

//10.10.0.200:12200
//https://osim-monitoring.orange.ci:12200
