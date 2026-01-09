import { inject, Injectable } from '@angular/core';
import { AllItemDto } from '@presentation/pages/finalization/data/dtos/all/all-response.dto';
import {
    AllEntity,
    ReportState,
} from '@presentation/pages/finalization/domain/entities/all/all.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemDto> {

    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, AllEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    private static readonly stateMap: Record<string, ReportState> = {
        [ReportState.COMPLETED]: ReportState.COMPLETED,
    };

    protected override mapItemFromDto(dto: AllItemDto): AllEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id']
        });

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);
        if (cached) return cached;

        const entity = new AllEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapStringToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            ReportState.COMPLETED,
            dto.reported_at
        );

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
