import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/services/facade.utils';
import { ObjectBaseFacade } from '@shared/application/services/object-base-facade';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dto/users/users-find-one-filter.dto';
import { UsersFindOneQuery } from '@presentation/pages/settings-security/core/application/queries/users/users-find-one.query';
import { UsersFindOneBus } from '@presentation/pages/settings-security/core/application/queries-bus/users/users-find-one.bus';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-find-one.entity';

@Injectable({
    providedIn: 'root',
})
export class UsersFindOneFacade extends ObjectBaseFacade<
    UsersFindOneEntity,
    UsersFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly bus = inject(UsersFindOneBus);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: UsersFindOneFilterDto, forceRefresh = false): void {
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
        const command = new UsersFindOneQuery(filter.uniqId);
        const fetch$ = this.bus.dispatch(command);
        this.fetchWithFilter(filter, fetch$, this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
