import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';

import { UsersFindOneFilterDto } from '@presentation/pages/settings-security/core/application/dtos/users/users-findone-filter.dto';
import { UsersFindonUseCase } from '@presentation/pages/settings-security/core/application/use-cases/users/users-findone.use-case';
import { UsersFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/users/users-findone.entity';

@Injectable({
    providedIn: 'root',
})
export class UsersFindoneFacade extends ObjectBaseFacade<
    UsersFindOneEntity,
    UsersFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(UsersFindonUseCase);

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

        this.fetchWithFilter(
            filter,
            this.useCase.read.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
