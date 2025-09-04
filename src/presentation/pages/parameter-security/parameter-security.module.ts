import { NgModule } from '@angular/core';
import { ParameterSecurityRoutingModule } from './parameter-security-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfilesAuthorizationsApiService } from './data-access/profiles-authorizations/services/profiles-authorizations-api.service';
import { TableProfilesAuthorizationsComponent } from './features/profiles-authorizations/table-profiles-authorizations/table-profiles-authorizations.component';
import { ProfilesAuthorizationsComponent } from './ui/profiles-authorizations/profiles-authorizations.component';
import { ProfilesAuthorizationsNavigationGuardService } from './data-access/profiles-authorizations/services/profiles-authorizations-navigation-guard.service';
import { FormProfilesAuthorizationsComponent } from './features/profiles-authorizations/form-profiles-authorizations/form-profiles-authorizations.component';

@NgModule({
    declarations: [
        FormProfilesAuthorizationsComponent,
        TableProfilesAuthorizationsComponent,
        ProfilesAuthorizationsComponent,
    ],
    imports: [
        SharedModule,
        ParameterSecurityRoutingModule,
        NgxPaginationModule,
    ],
    providers: [
        ProfilesAuthorizationsApiService,
        ProfilesAuthorizationsNavigationGuardService,
    ],
})
export class ParameterSecurityModule {}
