import { TasksFilterEntity } from '@pages/processing/domain/entities/tasks/tasks-filter.entity';
import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class TasksRepository {
    abstract execute(
        filter: TasksFilterEntity | null,
        page: string
    ): Observable<Paginate<TasksEntity>>;
}
