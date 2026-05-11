import { inject, Injectable } from '@angular/core';
import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { TasksActionsTypeRepository } from '@pages/processing/domain/repositories/tasks/tasks-actions-type-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksActionsTypeUseCase {
    private readonly repository = inject(TasksActionsTypeRepository);

    readAll(): Observable<TasksActionsTypeEntity[]> {
        return this.repository.readAll();
    }
}
