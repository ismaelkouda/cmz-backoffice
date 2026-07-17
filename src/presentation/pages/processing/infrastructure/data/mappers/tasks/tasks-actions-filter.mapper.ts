import { TasksActionsFilterDto } from '@pages/processing/application/dto/tasks/tasks-actions-filter.dto';
import { TasksActionsFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-filter-api.dto';

export function TasksActionsFilterMapper(
    dto: TasksActionsFilterDto
): TasksActionsFilterApiDto {
    return { report_uniq_id: dto.uniqId };
}
