import { inject, Injectable } from '@angular/core';
import { QueuesItemDto } from '@presentation/pages/reports-processing/data/dtos/queues/queues-response.dto';
import { QueuesEntity } from '@presentation/pages/reports-processing/domain/entities/queues/queues.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

@Injectable({ providedIn: 'root' })
export class QueuesMapper extends PaginatedMapper<QueuesEntity, QueuesItemDto> {

    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, QueuesEntity>();

    reportTypeMapper = inject(ReportTypeMapper);
    telecomOperatorMapper = inject(TelecomOperatorMapper);
    reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: QueuesItemDto): QueuesEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id']
        });

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new QueuesEntity(
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
