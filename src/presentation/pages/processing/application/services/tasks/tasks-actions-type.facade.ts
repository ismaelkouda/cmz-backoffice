import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeFilterDto } from '@presentation/pages/processing/application/dto/tasks/tasks-actions-type-filter.dto';
import { TasksActionsTypeUseCase } from '@pages/processing/application/use-cases/tasks/tasks-actions-type.use-case';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { ArrayBaseFacade } from '@shared/application/services/array-base-facade';

import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsTypeFacade extends ArrayBaseFacade<
    TasksActionsTypeEntity,
    TasksActionsTypeFilterDto
> {
    private readonly ui = inject(UiFeedbackService);
    private readonly useCase = inject(TasksActionsTypeUseCase);

    readonly items = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;

    readAll(filter: TasksActionsTypeFilterDto | null): void {
        this.fetchWithFilter(
            filter,
            this.useCase.readAll.bind(this.useCase),
            this.ui
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }
}
