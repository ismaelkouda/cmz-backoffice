import { AllFilterEntity } from '@presentation/pages/finalization/domain/entities/all/all-filter.entity';
import { AllFilterApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/all/all-filter-api.dto';

export function allFilterMapper(vo: AllFilterEntity): AllFilterApiDto {
    const params: AllFilterApiDto = {} as AllFilterApiDto;

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
