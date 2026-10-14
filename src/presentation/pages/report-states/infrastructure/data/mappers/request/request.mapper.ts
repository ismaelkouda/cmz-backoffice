import { inject, Injectable } from '@angular/core';
import { RequestEntity } from '@pages/report-states/domain/entities/request/request.entity';
import { RequestProps } from '@pages/report-states/domain/interfaces/request/request-props.interface';
import { RequestItemApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class RequestMapper extends PaginatedMapper<
    RequestEntity,
    RequestItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, RequestEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: RequestItemApiDto): RequestEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: RequestProps = {
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
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new RequestEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
