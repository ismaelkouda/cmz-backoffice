import { TasksFilterEntity } from '@pages/requests/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/requests/domain/entities/tasks/tasks.entity';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class TasksRepository {
    abstract execute(
        filter: TasksFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>>;
}
