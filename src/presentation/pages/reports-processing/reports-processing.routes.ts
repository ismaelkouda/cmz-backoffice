import { Routes } from '@angular/router';
import { FinalizeComponent } from './ui/finalize/finalize.component';
import { QueueComponent } from './ui/queue/queue.component';
import { TreatmentComponent } from './ui/treatment/treatment.component';

export const TREATMENT_ROUTE = 'processing';
export const QUEUE_ROUTE = 'queues';
export const FINALIZE_ROUTE = 'finalization';
export const REPORT_TREATMENT_ROUTE = 'treatment';

export const NOTIFICATIONS = 'notifications';
export const SIM_DEMAND_ROUTE = 'subscriptions';
export const INVOICE_FORM_ROUTE = 'invoice-form';
export const REPORT_FINALIZE_ROUTE = 'finalization';

export const routes: Routes = [
    {
        path: TREATMENT_ROUTE,
        children: [
            {
                path: '',
                component: TreatmentComponent,
                data: {
                    title: 'REPORT_PROCESSING.TREATMENT.TITLE',
                    module: 'REPORT_PROCESSING.LABEL',
                    subModule: 'REPORT_PROCESSING.TREATMENT.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${TREATMENT_ROUTE}`],
        // },
    },
    {
        path: QUEUE_ROUTE,
        children: [
            {
                path: '',
                component: QueueComponent,
                data: {
                    title: 'REPORT_PROCESSING.QUEUE.TITLE',
                    module: 'REPORT_PROCESSING.LABEL',
                    subModule: 'REPORT_PROCESSING.QUEUE.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${QUEUE_ROUTE}`],
        // },
    },
    {
        path: FINALIZE_ROUTE,
        children: [
            {
                path: '',
                component: FinalizeComponent,
                data: {
                    title: 'REPORT_PROCESSING.FINALIZE.TITLE',
                    module: 'REPORT_PROCESSING.LABEL',
                    subModule: 'REPORT_PROCESSING.FINALIZE.LABEL',
                },
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${FINALIZE_ROUTE}`],
        // },
    },
];
