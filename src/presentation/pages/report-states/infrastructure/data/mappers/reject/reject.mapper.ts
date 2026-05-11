import { inject, Injectable } from '@angular/core';
import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectProps } from '@pages/report-states/domain/interfaces/reject/reject-props.interface';
import { RejectItemApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-response-api.dto';
import { StatusMapper } from '@pages/report-states/infrastructure/data/mappers/reject/reject-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class RejectMapper extends PaginatedMapper<
    RejectEntity,
    RejectItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, RejectEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);
    private readonly statusMapper = inject(StatusMapper);

    protected override mapItemFromDto(dto: RejectItemApiDto): RejectEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: RejectProps = {
            type: TypeReport.REQUESTS,
            uniqId: dto.uniq_id,
            reportType: this.reportTypeMapper.mapToEnum(dto.report_type),
            operators: this.utils.memoizedList(
                dto?.operators,
                (p) => this.telecomOperatorMapper.mapFromDto(p),
                (p) => `operator${p}`
            ),
            source: this.reportSourceMapper.mapToEnum(dto.source),
            initiatorPhoneNumber: dto.initiator_phone_number,
            status: this.statusMapper.mapApiToStatus(dto.status),
            reportedAt: dto.reported_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new RejectEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
