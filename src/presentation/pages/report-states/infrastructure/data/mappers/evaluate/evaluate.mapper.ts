import { inject, Injectable } from '@angular/core';
import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateProps } from '@pages/report-states/domain/interfaces/evaluate/evaluate-props.interface';
import {
    EvaluateItemApiDto,
    StatsDto as EvaluateStatsDto,
} from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-response-api.dto';
import { ConformityMapper } from '@presentation/pages/processing/infrastructure/data/mappers/tasks/tasks-actions-conformity.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { TypeReport } from '@shared/domain/enums/type-report.enum';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class EvaluateMapper extends PaginatedMapper<
    EvaluateEntity,
    EvaluateItemApiDto,
    EvaluateStatsDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, EvaluateEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);
    private readonly conformityMapper = inject(ConformityMapper);

    protected override mapItemFromDto(dto: EvaluateItemApiDto): EvaluateEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: EvaluateProps = {
            type: TypeReport.PROCESSING,
            uniqId: dto.request_report_uniq_id,
            requestReportUniqId: dto.uniq_id,
            reportType: this.reportTypeMapper.mapToEnum(dto.report_type),
            operators: this.utils.memoizedList(
                dto?.operators,
                (p) => this.telecomOperatorMapper.mapFromDto(p),
                (p) => `operator${p}`
            ),
            source: this.reportSourceMapper.mapToEnum(dto.source),
            initiatorPhoneNumber: dto.initiator_phone_number,
            requestReportsCount: dto.request_reports_count,
            reportedAt: dto.reported_at,
            isConform: this.conformityMapper.mapFromDto(dto.compliance_status),
            updatedAt: dto.updated_at,
        };

        const cacheKey = `dto:${dto.uniq_id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached ? cached.with(props) : new EvaluateEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
