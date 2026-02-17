import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
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
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(ProfilesPermissionsFindOneBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: ProfilesPermissionsFindOneFilterDto,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue() !== null;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }
        const command = new ProfilesPermissionsFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
