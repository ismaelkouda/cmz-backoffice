import { inject, Injectable } from '@angular/core';
import { ProfilesPermissionsFindOneFilterDto } from '@pages/settings-security/application/dto/profiles-permissions/profiles-permissions-find-one-filter.dto';
import { ProfilesPermissionsFindOneQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-find-one.query';
import { ProfilesPermissionsFindOneBus } from '@pages/settings-security/application/queries-bus/profiles-permissions/profiles-permissions-find-one.bus';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsFindOneFacade extends ObjectBaseFacade<
    ProfilesPermissionsFindOneEntity,
    ProfilesPermissionsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ProfilesPermissionsFindOneBus);

    read(
        filter: ProfilesPermissionsFindOneFilterDto,
        options: FetchOptions = {}
    ): void {
        const command = new ProfilesPermissionsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command, options);
        this.fetch(filter, fetch$, this.ui);
    }
}
