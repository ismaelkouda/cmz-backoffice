import { inject, Injectable } from '@angular/core';
import { ApproveFilterEntity } from '@pages/report-states/domain/entities/approve/approve-filter.entity';
import { ApproveFilterApiDto } from '@pages/report-states/infrastructure/api/dto/approve/approve-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class ApproveFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    map(entity: ApproveFilterEntity): ApproveFilterApiDto {
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
            ...(entity.period?.start && { start_date: entity.period.start }),
            ...(entity.period?.end && { end_date: entity.period.end }),
        };
    }
}
