import { inject, Injectable } from '@angular/core';

import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

import { QueuesEntity } from '@presentation/pages/finalization/domain/entities/queues/queues.entity';
import { QueuesProps } from '@presentation/pages/finalization/domain/interfaces/queues/queues-props.interface';
import { QueuesItemApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/queues/queues-response-api.dto';

@Injectable({ providedIn: 'root' })
export class QueuesMapper extends PaginatedMapper<
    QueuesEntity,
    QueuesItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, QueuesEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: QueuesItemApiDto): QueuesEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: QueuesProps = {
            uniqId: dto.uniq_id,
            reportType: this.reportTypeMapper.mapToEnum(dto.report_type),
            operators: this.utils.memoizedList(
                dto?.operators,
                (p) => this.telecomOperatorMapper.mapFromDto(p),
                (p) => `operator${p}`
            ),
            source: this.reportSourceMapper.mapToEnum(dto.source),
            initiatorPhoneNumber: dto.initiator_phone_number,
            reportedAt: dto.reported_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new QueuesEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
