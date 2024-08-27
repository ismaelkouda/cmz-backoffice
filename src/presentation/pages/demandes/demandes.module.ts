import { TableDossierDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/table-dossier-demande-identification/table-dossier-demande-identification.component';
import { FilterDossierDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/filter-dossier-demande-identification/filter-dossier-demande-identification.component';
import { FilterDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/filter-demande-identification/filter-demande-identification.component';
import { TableDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/table-demande-identification/table-demande-identification.component';
import { FilterDossierDemandeIntegrationComponent } from './feature/demande-integration/filter-dossier-demande-integration/filter-dossier-demande-integration.component';
import { FormDemandeIntegrationComponent } from './feature/demande-integration/form-demande-integration/form-demande-integration.component';
import { DemandeIntegrationComponent } from './ui/demande-integration/demande-integration.component';
import { TableDemandeIntegrationComponent } from './feature/demande-integration/table-demande-integration/table-demande-integration.component';
import { FilterDemandeIntegrationComponent } from './feature/demande-integration/filter-demande-integration/filter-demande-integration.component';

import { DemandeSwappingComponent } from './ui/demande-swapping/demande-swapping.component';
import { StatutDemandeComponent } from './feature/statut-demande/statut-demande.component';
import { DemandeWrapperShowComponent } from './feature/demande-wrapper-show/demande-wrapper-show.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';

//Modules Primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DemandesRoutingModule } from './demandes-routing.module';
import { SharedModule } from 'src/shared/shared.module';

//Components

import { DemandeWrapperComponent } from './feature/demande-wrapper/demande-wrapper.component';
import { DemandeSuspensionComponent } from './ui/demande-suspension/demande-suspension.component';
import { DemandeActivationComponent } from './ui/demande-activation/demande-activation.component';
import { DemandeResiliationComponent } from './ui/demande-resiliation/demande-resiliation.component';
import { TransactionFormComponent } from './feature/transaction-form/transaction-form.component';
import { DemandeFormuleChangeComponent } from './ui/demande-formule-change/demande-formule-change.component';


//services
import { DemandesFilterStateService } from './data-access/demandes-filter-state.service';
import { DemandeIntegrationStateService } from './data-access/demande-integration/demande-integration-state.service';
import { DossierDemandeIntegrationComponent } from "./feature/demande-integration/dossier-demande-integration/dossier-demande-integration.component";
import { TableDossierDemandeIntegration } from "./feature/demande-integration/table-dossier-demande-integration/table-dossier-demande-integration.component";
import { DemandeIdentificationComponent } from './ui/demande-identification/demande-identification/demande-identification.component';
import { FormDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/form-demande-identification/form-demande-identification.component';
import { ManagementDemandeIdentificationComponent } from './feature/demande-identification/demande-identification/management-demande-identification/management-demande-identification.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        DemandesRoutingModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        DialogModule,
        TooltipModule,
        NgxPaginationModule,
        InputMaskModule,
        PasswordModule,
        RadioButtonModule,
        NgxCaptchaModule,
        CalendarModule,
        CheckboxModule,
    ],
    declarations: [
        DemandeActivationComponent,
        DemandeSuspensionComponent,
        DemandeResiliationComponent,
        DemandeFormuleChangeComponent,
        DemandeSwappingComponent,
        DemandeWrapperComponent,
        DemandeWrapperShowComponent,
        StatutDemandeComponent,
        TransactionFormComponent,
        DemandeIdentificationComponent,
        FormDemandeIdentificationComponent,
        FilterDossierDemandeIdentificationComponent,
        FilterDemandeIdentificationComponent,
        TableDossierDemandeIdentificationComponent,
        ManagementDemandeIdentificationComponent,
        TableDemandeIdentificationComponent,
        DemandeIntegrationComponent,FilterDemandeIntegrationComponent,TableDemandeIntegrationComponent,FormDemandeIntegrationComponent, DossierDemandeIntegrationComponent, FilterDossierDemandeIntegrationComponent, TableDossierDemandeIntegration
    ],
    providers: [DemandesFilterStateService, DemandeIntegrationStateService]
})
export class DemandesModule { }
