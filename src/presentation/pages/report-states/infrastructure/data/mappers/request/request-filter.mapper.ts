import { Injectable } from '@angular/core';
import { RequestFilterContract } from '@pages/report-states/domain/contracts/request/request-filter.contract';
import { RequestFilterApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-filter-api.dto';

@Injectable({
    providedIn: 'root',
})
export class RequestFilterMapper {
    map(entity: RequestFilterContract): RequestFilterApiDto {
        return {
            ...(entity.initiatorPhoneNumber && {
                initiator_phone_number: entity.initiatorPhoneNumber,
            }),
            ...(entity.uniqId && { uniq_id: entity.uniqId }),
            ...(entity.requestReportUniqId && {
                report_uniq_id: entity.requestReportUniqId,
            }),
            ...(entity.reportType && { report_type: entity.reportType }),
            ...(entity.operators && { operators: entity.operators }),
            ...(entity.source && { source: entity.source }),
            ...(entity?.startDate && { start_date: entity.startDate }),
            ...(entity?.endDate && { end_date: entity.endDate }),
        };
    }
}
