import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsBus } from '@pages/settings-security/application/queries-bus/profiles-permissions/profiles-permissions-permissions.bus';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsPermissionsFacade extends ObjectBaseFacade<
    ProfilesPermissionsPermissionsEntity,
    null
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ProfilesPermissionsPermissionsBus);

    readAll(options: FetchOptions = {}): void {
        const fetch$ = this.bus.dispatch(options);
        this.fetch(null, fetch$, this.ui);
    }
}
