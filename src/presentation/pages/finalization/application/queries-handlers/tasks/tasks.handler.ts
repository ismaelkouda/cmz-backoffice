import { Injectable, inject } from '@angular/core';
import { TasksQuery } from '@pages/finalization/application/queries/tasks/tasks.query';
import { TasksUseCase } from '@pages/finalization/application/use-cases/tasks/tasks.use-case';
import { TasksEntity } from '@pages/finalization/domain/entities/tasks/tasks.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksHandler {
    private readonly useCase = inject(TasksUseCase);

    execute(
        query: TasksQuery,
        page: string
    ): Observable<Paginate<TasksEntity>> {
        return this.useCase.execute(
            {
                initiatorPhoneNumber: query.initiatorPhoneNumber,
                uniqId: query.uniqId,
                reportType: query.reportType,
                operators: query.operators,
                source: query.source,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
