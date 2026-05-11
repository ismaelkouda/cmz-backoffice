import { inject, Injectable } from '@angular/core';
import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesFilterApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';
import { ReportTypeMapper } from '@shared/data/mappers/report-type.mapper';

@Injectable({
    providedIn: 'root',
})
export class QueuesFilterMapper {
    private readonly reportTypeMapper = inject(ReportTypeMapper);

    map(entity: QueuesFilterEntity): QueuesFilterApiDto {
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
