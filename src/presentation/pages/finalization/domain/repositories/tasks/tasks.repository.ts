import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TasksFilterEntity } from '@presentation/pages/finalization/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@presentation/pages/finalization/domain/entities/tasks/tasks.entity';

export abstract class TasksRepository {
    abstract execute(
        filter: TasksFilterEntity | null,
        page: string
    ): Observable<Paginate<TasksEntity>>;
}
