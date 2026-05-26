import { inject, Injectable } from '@angular/core';
import { RejectFilterEntity } from '@pages/report-states/domain/entities/reject/reject-filter.entity';
import { RejectFilterApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class RejectFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);

    map(entity: RejectFilterEntity): RejectFilterApiDto {
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
            ...(entity.status && { status: entity.status }),
            ...(entity.period?.start && { start_date: entity.period.start }),
            ...(entity.period?.end && { end_date: entity.period.end }),
        };
    }
}
