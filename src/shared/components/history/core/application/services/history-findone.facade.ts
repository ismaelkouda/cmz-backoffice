import { inject, Injectable } from '@angular/core';

import { shouldFetch } from '@shared/application/base/facade.utils';
import { ObjectBaseFacade } from '@shared/application/base/object-base-facade';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { HistoryFindonUseCase } from '@shared/components/history/core/application/use-cases/history-findone.use-case';
import { HistoryFindOneEntity } from '@shared/components/history/core/domain/entities/history-findone.entity';

import { HistoryFindOneFilterDto } from '../dtos/history-findone-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class HistoryFindoneFacade extends ObjectBaseFacade<
    HistoryFindOneEntity,
    HistoryFindOneFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(HistoryFindonUseCase);

    readonly item$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(filter: HistoryFindOneFilterDto, forceRefresh = false): void {
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
