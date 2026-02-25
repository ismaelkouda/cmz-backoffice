import { AllFilterEntity } from '@presentation/pages/requests/domain/entities/all/all-filter.entity';
import { AllFilterApiDto } from '@presentation/pages/requests/infrastructure/api/dto/all/all-filter-api.dto';

export function allFilterMapper(entity: AllFilterEntity): AllFilterApiDto {
    const params: AllFilterApiDto = {} as AllFilterApiDto;

    if (entity.initiatorPhoneNumber) {
        params.initiator_phone_number = entity.initiatorPhoneNumber;
    }
    if (entity.uniqId) {
        params.uniq_id = entity.uniqId;
    }
    if (entity.reportType) {
        params.report_type = entity.reportType;
    }
    if (entity.operators) {
        params.operators = entity.operators;
    }
    if (entity.source) {
        params.source = entity.source;
    }
    if (entity.status) {
        params.state = entity.status;
    }
    if (entity.period?.start) {
        params.start_date = entity.period.start;
    }
    if (entity.period?.end) {
        params.end_date = entity.period.end;
    }

    return params;
}
