import { inject, Injectable } from '@angular/core';
import { AllItemDto, ReportStatusDto } from '@presentation/pages/report-requests/data/dtos/all/all-response.dto';
import {
    AllEntity,
    ReportStatus
} from '@presentation/pages/report-requests/domain/entities/all/all.entity';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { ReportSourceMapper } from '@shared/data/mappers/report-source.mapper';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';
import { TelecomOperatorMapper } from '@shared/data/mappers/telecom-operator.mapper';

@Injectable({ providedIn: 'root' })
export class AllMapper extends PaginatedMapper<AllEntity, AllItemDto> {
    reportTypeMapper = inject(ReportTypeMapper)
    telecomOperatorMapper = inject(TelecomOperatorMapper)
    reportSourceMapper = inject(ReportSourceMapper)

    protected override mapItemFromDto(dto: AllItemDto): AllEntity {
        return new AllEntity(
            dto.uniq_id,
            this.reportTypeMapper.mapToEnum(dto.report_type),
            this.telecomOperatorMapper.mapToEnum(dto.operators),
            this.reportSourceMapper.mapToEnum(dto.source),
            dto.initiator_phone_number,
            this.mapStatus(dto.status),
            dto.created_at
        );
    }

    private mapStatus(status: ReportStatusDto): ReportStatus {
        if (status == null) {
            return ReportStatus.UNKNOWN;
        }
        const statusMap: Record<ReportStatusDto, ReportStatus> = {
            [ReportStatusDto.CONFIRMED]: ReportStatus.CONFIRMED,
            [ReportStatusDto.APPROVED]: ReportStatus.APPROVED,
            [ReportStatusDto.REJECTED]: ReportStatus.REJECTED,
            [ReportStatusDto.ABANDONED]: ReportStatus.ABANDONED,
            [ReportStatusDto.UNKNOWN]: ReportStatus.UNKNOWN,

        };
        return statusMap[status] || ReportStatus.UNKNOWN;
    }

}
