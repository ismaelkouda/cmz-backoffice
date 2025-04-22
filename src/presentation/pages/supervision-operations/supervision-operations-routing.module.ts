import { DetailsSuivieTraitementComponent } from './ui/suivie-traitement/details-suivie-traitement/details-suivie-traitement.component';
import { MessagerieComponent } from './ui/messagerie/messagerie.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuivieTraitementComponent } from './ui/suivie-traitement/suivie-traitement.component';
import { AlarmesComponent } from './ui/alarmes/alarmes.component';
import { PerformancesComponent } from './ui/performances/performances.component';
import { PriseEnChargeComponent } from './ui/prise-en-charge/prise-en-charge.component';
import { ContentieuxComponent } from './ui/contentieux/contentieux.component';
import { NotificationComponent } from './ui/notification/notification.component';
import { JournalTransactionComponent } from './ui/journal-transaction/journal-transaction.component';
import { WaitingQueueComponent } from '../overseeing-operations/ui/waiting-queue/waiting-queue.component';
import { TreatmentMonitoringComponent } from '../overseeing-operations/ui/treatment-monitoring/treatment-monitoring.component';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';

export const DEMANDE_ROUTE = 'demandes';
export const PRISE_EN_CHARGE_ROUTE = 'prise-en-charge';
export const SUIVIE_TRAITEMENT_ROUTE = 'suivie-et-traitements';
export const PERFORMANCE_SLA_ROUTE = 'performances-sla';
export const CONTENCIEUX_ROUTE = 'reclamations';
export const NOTIFY_ROUTE = 'centre-notifications';
export const JOURNAL_TRANSACTION_ROUTE = 'journal-transaction';
export const MESSAGERIE_ROUTE = 'messagerie';

const routes: Routes = [
    {
        path: DEMANDE_ROUTE,
        children: [
            {
                path: '',
                component: AlarmesComponent,
                // component: WaitingQueueComponent
            },
        ],
    },
    {
        path: SUIVIE_TRAITEMENT_ROUTE,
        children: [
            {
                path: '',
                component: SuivieTraitementComponent,
                // component: TreatmentMonitoringComponent
            },
            {
                path: ':number_demand',
                component: SimDemandComponent,
            },
        ],
    },
    {
        path: PRISE_EN_CHARGE_ROUTE,
        children: [
            {
                path: '',
                component: PriseEnChargeComponent,
            },
        ],
    },
    {
        path: PERFORMANCE_SLA_ROUTE,
        children: [
            {
                path: '',
                component: PerformancesComponent,
            },
        ],
    },
    {
        path: CONTENCIEUX_ROUTE,
        children: [
            {
                path: '',
                component: ContentieuxComponent,
            },
        ],
    },
    {
        path: NOTIFY_ROUTE,
        children: [
            {
                path: '',
                component: NotificationComponent,
            },
        ],
    },
    {
        path: JOURNAL_TRANSACTION_ROUTE,
        children: [
            {
                path: '',
                component: JournalTransactionComponent,
            },
        ],
    },
    {
        path: MESSAGERIE_ROUTE,
        children: [
            {
                path: '',
                component: MessagerieComponent,
            },
        ],
    },
    // {
    //     path: '',
    //     children: [
    //         {
    //             path: SUIVIE_TRAITEMENT_ROUTE + "/:request",
    //             component: DetailsSuivieTraitementComponent,
    //         },
    //         // {
    //         //     path: PRISE_EN_CHARGE_ROUTE,
    //         //     component: PriseEnChargeComponent,
    //         // },
    //         // {
    //         //     path: PERFORMANCE_SLA_ROUTE,
    //         //     component: PerformancesComponent,
    //         // },
    //         // {
    //         //     path: CONTENCIEUX_ROUTE,
    //         //     component: ContentieuxComponent,
    //         // },
    //         // {
    //         //     path: NOTIFY_ROUTE,
    //         //     component: NotificationComponent,
    //         // },
    //         // {
    //         //     path: JOURNAL_TRANSACTION_ROUTE,
    //         //     component: JournalTransactionComponent,
    //         // },
    //         {
    //             path: MESSAGERIE_ROUTE,
    //             component: MessagerieComponent,
    //         }
    //     ]
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupervisionOperationsRoutingModule {}
