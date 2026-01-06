import { inject, Injectable } from '@angular/core';
import { TasksItemDto } from '@presentation/pages/reports-processing/data/dtos/tasks/tasks-response.dto';
import { TasksEntity } from '@presentation/pages/reports-processing/domain/entities/tasks/tasks.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';

@Injectable({ providedIn: 'root' })
export class TasksMapper extends PaginatedMapper<TasksEntity, TasksItemDto> {
    reportTypeMapper = inject(ReportTypeMapper);
    telecomOperatorMapper = inject(TelecomOperatorMapper);
    reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: TasksItemDto): TasksEntity {
        return new TasksEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            dto.reported_at
        );
    }
}
