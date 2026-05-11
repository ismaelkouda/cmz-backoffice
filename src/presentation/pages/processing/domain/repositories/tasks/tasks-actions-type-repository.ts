import { TasksActionsTypeEntity } from '@pages/processing/domain/entities/tasks/tasks-actions-type.entity';
import { Observable } from 'rxjs';

export abstract class TasksActionsTypeRepository {
    abstract readAll(): Observable<TasksActionsTypeEntity[]>;
}
