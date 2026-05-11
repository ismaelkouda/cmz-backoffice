import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions-type.use-case';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsTypeFacade extends ArrayBaseFacade<
    TasksActionsTypeEntity,
    void
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(TasksActionsTypeUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(forceRefresh = false): void {
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
            null,
            this.useCase.readAll.bind(this.useCase),
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
