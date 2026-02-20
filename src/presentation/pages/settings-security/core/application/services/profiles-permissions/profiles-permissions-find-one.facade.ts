import { inject, Injectable } from '@angular/core';

import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { ProfilesPermissionsFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dto/profiles-permissions/profiles-permissions-find-one-filter.dto';
import { ProfilesPermissionsFindOneBus } from '@presentation/pages/settings-security/core/application/queries-bus/profiles-permissions/profiles-permissions-find-one.bus';
import { ProfilesPermissionsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';

import { ProfilesPermissionsFindOneQuery } from '../../queries/profiles-permissions/profiles-permissions-find-one.query';

@Injectable({
    providedIn: 'root',
})
export class ProfilesPermissionsFindOneFacade extends ObjectBaseFacade<
    ProfilesPermissionsFindOneEntity,
    ProfilesPermissionsFindOneFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly bus = inject(ProfilesPermissionsFindOneBus);

    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: ProfilesPermissionsFindOneFilterDto, force = false): void {
        const command = new ProfilesPermissionsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetch(filter, fetch$, this.ui, this.STALE_TIME, force);
    }
}
