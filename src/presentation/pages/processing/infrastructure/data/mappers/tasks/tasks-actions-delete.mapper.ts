import { TasksActionsDeleteDto } from '@pages/processing/application/dto/tasks/tasks-actions-delete.dto';
import { TasksActionsDeleteApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-delete-api.dto';

export function tasksActionsDeleteMapper(
    dto: TasksActionsDeleteDto
): TasksActionsDeleteApiDto {
    return { uniq_id: dto.uniqId };
}
