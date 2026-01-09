import { inject, Injectable } from '@angular/core';
import { TasksItemDto } from '@presentation/pages/reports-processing/data/dtos/tasks/tasks-response.dto';
import { TasksEntity } from '@presentation/pages/reports-processing/domain/entities/tasks/tasks.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

@Injectable({ providedIn: 'root' })
export class TasksMapper extends PaginatedMapper<TasksEntity, TasksItemDto> {

    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, TasksEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: TasksItemDto): TasksEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id']
        });

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new TasksEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapStringToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            dto.reported_at
        );
        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
