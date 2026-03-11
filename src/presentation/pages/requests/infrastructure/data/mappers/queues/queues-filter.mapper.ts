import { QueuesFilterEntity } from '@pages/requests/domain/entities/queues/queues-filter.entity';
import { QueuesFilterApiDto } from '@pages/requests/infrastructure/api/dto/queues/queues-filter-api.dto';

export function queuesFilterMapper(vo: QueuesFilterEntity): QueuesFilterApiDto {
    const params: QueuesFilterApiDto = {} as QueuesFilterApiDto;

    if (vo.initiatorPhoneNumber) {
        params.initiator_phone_number = vo.initiatorPhoneNumber;
    }
    if (vo.uniqId) {
        params.uniq_id = vo.uniqId;
    }
    if (vo.reportType) {
        params.report_type = vo.reportType;
    }
    if (vo.operators) {
        params.operators = vo.operators;
    }
    if (vo.source) {
        params.source = vo.source;
    }
    if (vo.period?.start) {
        params.start_date = vo.period.start;
    }
    if (vo.period?.end) {
        params.end_date = vo.period.end;
    }

    return params;
}
