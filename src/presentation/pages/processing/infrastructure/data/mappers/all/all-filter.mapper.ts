import { inject, Injectable } from '@angular/core';
import { AllFilterEntity } from '@pages/processing/domain/entities/all/all-filter.entity';
import { AllFilterApiDto } from '@pages/processing/infrastructure/api/dto/all/all-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({ providedIn: 'root' })
export class AllFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);
    map(entity: AllFilterEntity): AllFilterApiDto {
        console.log('entity: ', entity);
        return {
            ...(entity.initiatorPhoneNumber && {
                initiator_phone_number: entity.initiatorPhoneNumber,
            }),
            ...(entity.uniqId && { uniq_id: entity.uniqId }),
            ...(entity.reportType && {
                report_type: this.reportTypeMapper.mapToDto(entity.reportType),
            }),
            ...(entity.operators && { operators: entity.operators }),
            ...(entity.source && { source: entity.source }),
            ...(entity.period?.start && { start_date: entity.period.start }),
            ...(entity.period?.end && { end_date: entity.period.end }),
        };
    }
}
