import { inject, Injectable } from '@angular/core';
import { AllItemDto } from '@presentation/pages/reports-processing/data/dtos/all/all-response.dto';
import {
    AllEntity,
    ReportState,
} from '@presentation/pages/reports-processing/domain/entities/all/all.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemDto> {
    reportTypeMapper = inject(ReportTypeMapper);
    telecomOperatorMapper = inject(TelecomOperatorMapper);
    reportSourceMapper = inject(ReportSourceMapper);

    protected override mapItemFromDto(dto: AllItemDto): AllEntity {
        return new AllEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            this.mapState(dto.state),
            dto.created_at
        );
    }

    private mapState(status: string): ReportState {
        if (status == null) {
            return ReportState.TERMINATED;
        }
        const statusMap: Record<string, ReportState> = {
            [ReportState.TERMINATED]: ReportState.TERMINATED,
        };
        return statusMap[status] || ReportState.TERMINATED;
    }
}
