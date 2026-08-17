import { inject, Injectable } from '@angular/core';
import { TasksFilterEntity } from '@pages/requests/domain/entities/tasks/tasks-filter.entity';
import { TasksFilterApiDto } from '@pages/requests/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class TasksFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(entity: TasksFilterEntity): TasksFilterApiDto {
        return {
            ...(entity.initiatorPhoneNumber && {
                initiator_phone_number: entity.initiatorPhoneNumber,
            }),
            ...(entity.uniqId && { uniq_id: entity.uniqId }),
            ...(entity.reportType && {
                report_type: entity.reportType,
            }),
            ...(entity.operators && { operators: entity.operators }),
            ...(entity.source && { source: entity.source }),
            ...(entity?.period?.start && {
                start_date: this.apiDateMapper.toDateApi(entity.period.start),
            }),
            ...(entity?.period?.end && {
                end_date: this.apiDateMapper.toDateApi(entity.period.end),
            }),
        };
    }
}
