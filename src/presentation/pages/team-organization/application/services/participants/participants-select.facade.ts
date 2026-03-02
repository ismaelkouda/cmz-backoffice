import { inject, Injectable } from '@angular/core';

import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

// import { ParticipantsSelectDto } from '@presentation/pages/team-organization/application/dto/participants/participants-select.dto';
import { ParticipantsSelectUseCase } from '@presentation/pages/team-organization/application/use-cases/participants/participants-select.use-case';
import { ParticipantsSelectEntity } from '@presentation/pages/team-organization/domain/entities/participants/participants-select.entity';

@Injectable({
    providedIn: 'root',
})
export class ParticipantsSelectFacade extends ArrayBaseFacade<
    ParticipantsSelectEntity,
    string
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(ParticipantsSelectUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(filter: string, forceRefresh = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
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
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
