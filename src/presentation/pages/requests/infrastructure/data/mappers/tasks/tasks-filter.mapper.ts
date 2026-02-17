import { TasksFilterEntity } from '@presentation/pages/requests/domain/entities/tasks/tasks-filter.entity';
import { TasksFilterApiDto } from '@presentation/pages/requests/infrastructure/api/dto/tasks/tasks-filter-api.dto';

export function tasksFilterMapper(
    entity: TasksFilterEntity
): TasksFilterApiDto {
    return {
        ...(entity.initiatorPhoneNumber && {
            initiator_phone_number: entity.initiatorPhoneNumber,
        }),
        ...(entity.uniqId && { uniq_id: entity.uniqId }),
        ...(entity.reportType && { report_type: entity.reportType }),
        ...(entity.operators && { operators: entity.operators }),
        ...(entity.source && { source: entity.source }),
        ...(entity.period?.start && { start_date: entity.period.start }),
        ...(entity.period?.end && { end_date: entity.period.end }),
    };
}
