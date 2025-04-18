import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WaitingQueueComponent } from './ui/waiting-queue/waiting-queue.component';
import { TreatmentMonitoringComponent } from './ui/treatment-monitoring/treatment-monitoring.component';
import { ClaimsComponent } from './ui/claims/claims.component';
import { SimDemandComponent } from '../../../shared/components/sim-demand/sim-demand.component';
import { NotificationsCenterComponent } from './ui/notifications-center/notifications-center.component';
import { MessagerieComponent } from '../supervision-operations/ui/messagerie/messagerie.component';
import { PagesGuard } from '../../../core/guard/PagesGuard';

export const WAITING = 'waiting';
export const TREATMENT_MONITORING = 'treatment-monitoring';
export const CLAIMS = 'claims';
export const NOTIFICATIONS = 'notifications';
export const MESSAGING = 'messaging';
export const FORM = 'form';
export const INVOICE = 'voice';

const routes: Routes = [
    {
        path: WAITING,
        children: [
            {
                path: '',
                component: WaitingQueueComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        canActivate: [PagesGuard],
        data: {
            allowedPaths: [`/${WAITING}`],
        },
    },
    {
        path: TREATMENT_MONITORING,
        children: [
            {
                path: '',
                component: TreatmentMonitoringComponent,
            },
            {
                path: ':number_demand',
                component: SimDemandComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        canActivate: [PagesGuard],
        data: {
            allowedPaths: [`/${TREATMENT_MONITORING}`],
        },
    },
    {
        path: CLAIMS,
        children: [
            {
                path: '',
                component: ClaimsComponent,
            },
            {
                path: ':number_demand',
                component: SimDemandComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        canActivate: [PagesGuard],
        data: {
            allowedPaths: [`/${CLAIMS}`],
        },
    },
    {
        path: NOTIFICATIONS,
        children: [
            {
                path: '',
                component: NotificationsCenterComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        canActivate: [PagesGuard],
        data: {
            allowedPaths: [`/${NOTIFICATIONS}`],
        },
    },
    {
        path: MESSAGING,
        children: [
            {
                path: '',
                component: MessagerieComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        canActivate: [PagesGuard],
        data: {
            allowedPaths: [`/${MESSAGING}`],
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OverseeingOperationsRoutingModule {}
