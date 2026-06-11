import { TasksFilterEntity } from '@pages/finalization/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/finalization/domain/entities/tasks/tasks.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class TasksRepository {
    abstract execute(
        filter: TasksFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TasksEntity>>;
}
