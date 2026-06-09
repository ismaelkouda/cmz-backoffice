import { Injectable, inject } from '@angular/core';
import { TasksQuery } from '@pages/processing/application/queries/tasks/tasks.query';
import { TasksUseCase } from '@pages/processing/application/use-cases/tasks/tasks.use-case';
import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksHandler {
    private readonly useCase = inject(TasksUseCase);

    execute(
        query: TasksQuery,
        page: string,
        options?: FetchOptions
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
            page,
            options
        );
    }
}
