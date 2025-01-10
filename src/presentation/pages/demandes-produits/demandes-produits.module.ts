import { FilterAchatProduitsComponent } from './feature/filter-achat-produits/filter-achat-produits.component';
import { DemandesProduitsService } from './data-access/demandes-produits.service';

import { StateAchatProduitsService } from './data-access/achat-produits/state-achat-produits.service';
import { AchatProduitsComponent } from './ui/achat-produits/achat-produits.component';
// import { DetailsAchatProduitsComponent } from './features/achat-produits/details-achat-produits/details-achat-produits.component';
// import { FilterDetailsAchatProduitsComponent } from './features/achat-produits/details-achat-produits/features/filter-details-achat-produits/filter-details-achat-produits.component';
// import { TableDetailsAchatProduitsComponent } from './features/achat-produits/details-achat-produits/features/table-details-achat-produits/table-details-achat-produits.component';

import { NgModule } from '@angular/core';
import { DemandesProduitsRoutingModule } from './demandes-produits-routing.module';
import { SharedModule } from 'src/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableAchatProduitsComponent } from './feature/table-achat-produits/table-achat-produits.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormAchatProduitsComponent } from './feature/form-achat-produits/form-achat-produits.component';
import { CommonModule } from '@angular/common';
import { FilterDetailsAchatProduitsComponent } from './feature/details-achat-produits/feature/filter-details-achat-produits/filter-details-achat-produits.component';
import { TableDetailsAchatProduits } from './feature/details-achat-produits/feature/table-details-achat-produits/table-details-achat-produits.component';
import { DetailsAchatProduitsComponent } from './feature/details-achat-produits/details-achat-produits.component';

@NgModule({
    declarations: [
        AchatProduitsComponent, FilterAchatProduitsComponent, TableAchatProduitsComponent, FormAchatProduitsComponent,
        
    DetailsAchatProduitsComponent,
    FilterDetailsAchatProduitsComponent,
    TableDetailsAchatProduits,
    ],
    imports: [  CommonModule, DemandesProduitsRoutingModule, SharedModule, NgxPaginationModule, TableModule,
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
                DynamicDialogModule,
                FormsModule, ReactiveFormsModule
            ],
    providers: [DemandesProduitsService, 
        StateAchatProduitsService,
    ]
})

export class DemandesProduitsModule {}