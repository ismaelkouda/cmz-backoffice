import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialEnterprisesComponent } from './ui/commercial-enterprises/commercial-enterprises.component';
import { PublicEnterprisesComponent } from './ui/public-enterprises/public-enterprises.component';
import { AssociationEnterprisesComponent } from './ui/association-enterprises/association-enterprises.component';
import { IndividualsComponent } from './ui/individuals/individuals.component';
import { CustomersComponent } from './ui/customers/customers.component';
import { DetailsManagedCustomersComponent } from './feature/managed-customers/details-managed-customers/details-managed-customers.component';

export const COMMERCIAL_ENTERPRISES = 'commercial-enterprises';
export const PUBLIC_ENTERPRISES = 'public-enterprises';
export const ASSOCIATION_ENTERPRISES = 'association-enterprises';
export const INDIVIDUALS = 'individuals';
export const CUSTOMERS = 'customers';

const routes: Routes = [
    {
        path: COMMERCIAL_ENTERPRISES,
        children: [
            {
                path: '',
                component: CommercialEnterprisesComponent,
            },
            {
                path: ':code_client',
                component: DetailsManagedCustomersComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${COMMERCIAL_ENTERPRISES}`],
        // },
    },
    {
        path: PUBLIC_ENTERPRISES,
        children: [
            {
                path: '',
                component: PublicEnterprisesComponent,
            },
            {
                path: ':code_client',
                component: DetailsManagedCustomersComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${COMMERCIAL_ENTERPRISES}`],
        // },
    },
    {
        path: ASSOCIATION_ENTERPRISES,
        children: [
            {
                path: '',
                component: AssociationEnterprisesComponent,
            },
            {
                path: ':code_client',
                component: DetailsManagedCustomersComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${COMMERCIAL_ENTERPRISES}`],
        // },
    },
    {
        path: INDIVIDUALS,
        children: [
            {
                path: '',
                component: IndividualsComponent,
            },
            {
                path: ':code_client',
                component: DetailsManagedCustomersComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${COMMERCIAL_ENTERPRISES}`],
        // },
    },
    {
        path: CUSTOMERS,
        children: [
            {
                path: '',
                component: CustomersComponent,
            },
            {
                path: ':code_client',
                component: DetailsManagedCustomersComponent,
            },
        ],
        // canActivate: [PagesGuard],
        // data: {
        //     allowedPaths: [`/${COMMERCIAL_ENTERPRISES}`],
        // },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManagedCustomersRoutingModule {}
