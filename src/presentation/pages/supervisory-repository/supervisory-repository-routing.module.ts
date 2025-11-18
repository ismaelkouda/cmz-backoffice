import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesGuard } from '../../../core/guard/PagesGuard';
import { SlaAgreementsComponent } from './ui/sla-agreements/sla-agreements.component';
import { SlaContactsComponent } from './ui/sla-contacts/sla-contacts.component';

export const SLA_CONTACTS = 'sla-contact';
export const SLA_AGREEMENTS = 'sla-agreements';

const routes: Routes = [
    {
        path: SLA_AGREEMENTS,
        children: [
            {
                path: '',
                component: SlaAgreementsComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${SLA_AGREEMENTS}`],
        // },
    },
    {
        path: SLA_CONTACTS,
        children: [
            {
                path: '',
                component: SlaContactsComponent,
            },
            {
                path: '**',
                redirectTo: '',
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${SLA_AGREEMENTS}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SupervisoryRepositoryRoutingModule {}
