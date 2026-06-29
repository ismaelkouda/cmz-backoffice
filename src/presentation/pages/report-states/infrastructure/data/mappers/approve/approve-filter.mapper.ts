import { inject, Injectable } from '@angular/core';
import { ApproveFilterContract } from '@pages/report-states/domain/contracts/approve/approve-filter.contract';
import { ApproveFilterApiDto } from '@pages/report-states/infrastructure/api/dto/approve/approve-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class ApproveFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    map(entity: ApproveFilterContract): ApproveFilterApiDto {
        return {
            ...(entity.initiatorPhoneNumber && {
                initiator_phone_number: entity.initiatorPhoneNumber,
            }),
            ...(entity.uniqId && { uniq_id: entity.uniqId }),
            // ...(entity.reportType && {
            //     report_type: this.reportTypeMapper.mapToDto(entity.reportType),
            // }),
            ...(entity.reportType && {
                report_type: entity.reportType,
            }),
            ...(entity.operators && { operators: entity.operators }),
            ...(entity.source && { source: entity.source }),
            ...(entity?.startDate && { start_date: entity.startDate }),
            ...(entity?.endDate && { end_date: entity.endDate }),
        };
    }
}
