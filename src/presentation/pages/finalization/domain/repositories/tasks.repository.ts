import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { TasksEntity } from '../entities/tasks/tasks.entity';
import { TasksFilter } from '../value-objects/tasks-filter.vo';

export abstract class TasksRepository {
    abstract fetchTasks(
        filter: TasksFilter,
        page: string
    ): Observable<Paginate<TasksEntity>>;
}
