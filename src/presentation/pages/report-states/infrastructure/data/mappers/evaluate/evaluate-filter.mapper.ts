import { inject, Injectable } from '@angular/core';
import { EvaluateFilterContract } from '@pages/report-states/domain/contracts/evaluate/evaluate-filter.contract';
import { EvaluateFilterApiDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class EvaluateFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);

    map(entity: EvaluateFilterContract): EvaluateFilterApiDto {
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
