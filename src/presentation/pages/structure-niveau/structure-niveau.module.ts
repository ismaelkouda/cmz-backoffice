import { FormThirdLevelComponent } from './feature/form-third-level/form-third-level.component';
import { FormSecondLevelComponent } from './feature/form-second-level/form-second-level.component';
import { FormFirstLevelComponent } from './feature/form-first-level/form-first-level.component';
import { FormUsageComponent } from './feature/form-usage/form-usage.component';
import { UsageMetierComponent } from './ui/usage-metier/usage-metier.component';
import { StructureNiveauRoutingModule } from './structure-niveau-routing.module';
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
import { MultiSelectModule } from 'primeng/multiselect';

//Components
import { FirstLevelComponent } from './ui/first-level/first-level.component';
import { SecondLevelComponent } from './ui/second-level/second-level.component';
import { ThirdLevelComponent } from './ui/third-level/third-level.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        StructureNiveauRoutingModule,
        DropdownModule,
        SharedModule,
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
        MultiSelectModule
    ],
    declarations: [
        FirstLevelComponent,
        SecondLevelComponent,
        ThirdLevelComponent,
        UsageMetierComponent,
        FormUsageComponent,
        FormFirstLevelComponent,
        FormSecondLevelComponent,
        FormThirdLevelComponent
    ],
})
export class StructureNiveauModule { }
