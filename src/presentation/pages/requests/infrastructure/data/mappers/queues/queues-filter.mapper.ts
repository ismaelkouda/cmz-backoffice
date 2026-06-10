import { inject, Injectable } from '@angular/core';
import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesFilterApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({
    providedIn: 'root',
})
export class QueuesFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    map(entity: QueuesFilterEntity): QueuesFilterApiDto {
        console.log('entity: ', entity);
        return {
            ...(entity?.initiatorPhoneNumber && {
                initiator_phone_number: entity?.initiatorPhoneNumber,
            }),
            ...(entity?.uniqId && { uniq_id: entity?.uniqId }),
            ...(entity?.reportType && {
                report_type: entity?.reportType,
            }),
            ...(entity?.operators && { operators: entity?.operators }),
            ...(entity?.source && { source: entity?.source }),
            ...(entity?.period?.start && {
                start_date: this.apiDateMapper.toDateApi(entity.period.start),
            }),
            ...(entity?.period?.end && {
                end_date: this.apiDateMapper.toDateApi(entity.period.end),
            }),
        };
    }
}
