import { REPORTING_ALARME, REPORTING_SLA } from './../presentation/pages/reporting/reporting-routing.module';
import { PERFORMANCE_SLA } from './../presentation/pages/supervision-operations/supervision-operations-routing.module';
import { COURBE_MESSAGE, PERFORMANCE_COLLECTE } from 'src/presentation/pages/analyse-alerte/analyse-alerte-routing.module';
import { COMMANDE_SIM, STOCK_PRODUITS, LIGNE_CREDIT } from './../presentation/pages/provisionning/provisionning-routing.module';
import { CARTES_SIM, DOTATION_SERVICES, GROUPE_SIM, TRANSACTION_SIM } from "src/presentation/pages/patrimoine/patrimoine-routing.module";
import { OBJECTIFS_SLA, PROFIL_SUPERVISION, SEUIL_ALARMES } from "src/presentation/pages/ref-telemetrie/ref-telemetrie-routing.module";
import { SUPERSION_STATUTS, SUPERVISION_SUIVIE_TRAITEMENT } from 'src/presentation/pages/supervision-operations/supervision-operations-routing.module';
import { OPERATION_PROVISIONNING, PARAMETRE_SECURITE, PATRIMOINE, REFERENTIEL_TELEMETRIE, REPORTING, SUPERVISION_OPERATIONS, SUPERVISION_SIM } from "src/shared/routes/routes";
import { VUE_GEOGRAPHIQUE } from 'src/presentation/pages/zone-trafic/zone-trafic-routing.module';
import { PROFILS_HABILITATIONS, UTILISATEURS } from 'src/presentation/pages/parametre-securite/parametre-securite-routing.module';
import { REPORTING_SOLDE } from 'src/presentation/pages/reporting/reporting-routing.module';

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
        children: [
            {
                path: `/${PATRIMOINE}/${CARTES_SIM}`,
                title: "Cartes SIM",
                label: "Cartes SIM",
                data: "1-1-0-cartes-sim",
                type: "link"
            },
            {
                path: `/${PATRIMOINE}/${GROUPE_SIM}`,
                title: "Groupes de SIM",
                label: "Groupes de SIM",
                data: "1-2-0-groupe-sim",
                type: "link"
            },
            {
                path: `/${PATRIMOINE}/${DOTATION_SERVICES}`,
                title: "Dotations de Services",
                label: "Dotations de Services",
                data: "1-3-0-dotation-service",
                type: "link"
            },
            {
                path: `/${PATRIMOINE}/${TRANSACTION_SIM}`,
                title: "Transactions sur SIM",
                label: "Transactions sur SIM",
                data: "1-4-0-transaction-sur-sim",
                type: "link"
            }
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
        children: [
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${SEUIL_ALARMES}`,
                title: "Métriques & Alarmes",
                label: "Métriques & Alarmes",
                data: "2-1-0-seuil-alarmes",
                type: "link"
            },
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${PROFIL_SUPERVISION}`,
                title: "Profils de supervision",
                label: "Profils de supervision",
                data: "2-2-0-profil-supervision",
                type: "link"
            },
            {
                path: `/${REFERENTIEL_TELEMETRIE}/${OBJECTIFS_SLA}`,
                title: "Objectifs SLA",
                label: "Objectifs SLA",
                data: "2-2-0-profil-supervision",
                type: "link"
            },
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
        path: `/${SUPERVISION_OPERATIONS}/${SUPERSION_STATUTS}`,
        routerLink: `/${SUPERVISION_OPERATIONS}/${SUPERSION_STATUTS}`,
        type: "sub",
        children: [
            {
                path: `/${SUPERVISION_OPERATIONS}/${SUPERSION_STATUTS}`,
                title: "File d'attente",
                label: "File d'attente",
                data: "4-1-0-statuts",
                type: "link"
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${SUPERVISION_SUIVIE_TRAITEMENT}`,
                title: "Suivi et traitement",
                label: "Suivi et traitement",
                data: "4-3-0-suivi-traitement",
                type: "link"
            },
            {
                path: `/${SUPERVISION_OPERATIONS}/${PERFORMANCE_SLA}`,
                title: "Performance SLA",
                label: "Performance SLA",
                data: "4-4-0-performance-sla",
                type: "link"
            }
        ]
    },
    /*
    {
        title: "Supervision des SIM",
        label: "Supervision des SIM",
        data: "5-0-0-supervision-sim",
        statut: false,
        icon: "activity",
        url: "assets/images/portail/graph.png",
        type: "sub",
        path: `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`,
        routerLink: `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`,
        children: [
            {
                path: `/zone-trafic/${VUE_GEOGRAPHIQUE}`,
                title: "Zones de Trafic",
                label: "Zones- de Trafic",
                data: "5-2-0-zone-trafic",
                type: "link"
            },
            {
                path: `/${SUPERVISION_SIM}/${COURBE_MESSAGE}`,
                title: "Analyse des Alarmes",
                label: "Analyse des Alarmes",
                data: "5-2-0-analyse-alarmes",
                type: "link"
            },
            {
                path: `/${SUPERVISION_SIM}/${PERFORMANCE_COLLECTE}`,
                title: "Approvisionnements Data",
                label: "Approvisionnements Data",
                data: "5-1-0-analyse-trafic",
                type: "link"
            }
        ]
    },
    */
    {
        title: "Reporting",
        label: "Reporting",
        data: "5-0-0-supervision-sim",
        statut: false,
        icon: "activity",
        url: "assets/images/portail/graph.png",
        type: "sub",
        path: `/${REPORTING}/${REPORTING_SOLDE}`,
        routerLink: `/${REPORTING}/${REPORTING_SOLDE}`,
        children: [
            {
                path: `/${REPORTING}/${REPORTING_SOLDE}`,
                title: "Solde",
                label: "Solde",
                data: "5-2-0-zone-trafic",
                type: "link"
            },
            {
                path: `/${REPORTING}/${REPORTING_ALARME}`,
                title: "Alarme",
                label: "Alarme",
                data: "5-2-0-analyse-alarmes",
                type: "link"
            },
            {
                path: `/${REPORTING}/${REPORTING_SLA}`,
                title: "SLA",
                label: "SLA",
                data: "5-1-0-analyse-trafic",
                type: "link"
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
        children: [
            {
                path: `/${PARAMETRE_SECURITE}/${PROFILS_HABILITATIONS}`,
                title: "Profils Habilitations",
                label: "Profils Habilitations",
                data: "6-1-0-profils-habilitations",
                type: "link"
            },
            {
                path: `/${PARAMETRE_SECURITE}/${UTILISATEURS}`,
                title: "Utilisateurs",
                label: "Utilisateurs",
                data: "6-2-0-utilisateurs",
                type: "link"
            },
            {
                path: "/parametre-securite/activation-collecte",
                title: "Activation de collecte",
                label: "Activation de collecte",
                data: "6-3-0-activation-collecte",
                type: "link"
            }
        ]
    },
]
