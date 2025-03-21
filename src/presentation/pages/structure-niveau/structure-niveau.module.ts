import { FormThirdLevelComponent } from './feature/form-third-level/form-third-level.component';
import { FormSecondLevelComponent } from './feature/form-second-level/form-second-level.component';
import { FormFirstLevelComponent } from './feature/form-first-level/form-first-level.component';
import { FormUsageComponent } from './feature/form-usage/form-usage.component';
import { UsageMetierComponent } from './ui/usage-metier/usage-metier.component';
import { StructureNiveauRoutingModule } from './structure-niveau-routing.module';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxCaptchaModule } from 'ngx-captcha';


//Modules Primeng

//Components
import { FirstLevelComponent } from './ui/first-level/first-level.component';
import { SecondLevelComponent } from './ui/second-level/second-level.component';
import { ThirdLevelComponent } from './ui/third-level/third-level.component';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
    imports: [
        StructureNiveauRoutingModule,
        SharedModule,
        NgxPaginationModule,
        NgxCaptchaModule,
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
