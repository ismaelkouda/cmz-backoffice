import { inject, Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import {
    AllEntity,
    ReportState,
    AllProps,
} from '@presentation/pages/requests/domain/entities/all/all.entity';
import { AllItemApiDto } from '@presentation/pages/requests/infrastructure/api/dto/all/all-response-api.dto';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemApiDto> {
    private readonly entityCache = new Map<string, AllEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    private static readonly STATE_MAP = MapperUtils.createEnumMap({
        [ReportState.TERMINATED]: ReportState.TERMINATED,
    });

    protected override mapItemFromDto(dto: AllItemApiDto): AllEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: AllProps = {
            uniqId: dto.uniq_id,
            reportType: this.reportTypeMapper.mapToEnum(dto.report_type),
            operators: this.telecomOperatorMapper.mapStringToEnum(
                dto.operators
            ),
            source: this.reportSourceMapper.mapToEnum(dto.source),
            initiatorPhoneNumber: dto.initiator_phone_number,
            state: ReportState.TERMINATED,
            reportedAt: dto.reported_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new AllEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
