import { inject, Injectable } from '@angular/core';
import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveProps } from '@pages/report-states/domain/interfaces/approve/approve-props.interface';
import { ApproveItemApiDto } from '@pages/report-states/infrastructure/api/dto/approve/approve-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ApproveMapper extends PaginatedMapper<
    ApproveEntity,
    ApproveItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, ApproveEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: ApproveItemApiDto): ApproveEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: ApproveProps = {
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
            reportedAt: dto.reported_at,
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new ApproveEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
