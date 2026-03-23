import { inject, Injectable } from '@angular/core';
import { AllEntity } from '@pages/finalization/domain/entities/all/all.entity';
import { AllProps } from '@pages/finalization/domain/interfaces/all/all-props.interface';
import { AllItemApiDto } from '@pages/finalization/infrastructure/api/dto/all/all-response-api.dto';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemApiDto> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, AllEntity>();

    private readonly reportTypeMapper = inject(ReportTypeMapper);
    private readonly telecomOperatorMapper = inject(TelecomOperatorMapper);
    private readonly reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: AllItemApiDto): AllEntity {
        MapperUtils.validateDto(dto, {
            required: ['uniq_id'],
        });

        const props: AllProps = {
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

        const entity = cached ? cached.with(props) : new AllEntity(props);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
