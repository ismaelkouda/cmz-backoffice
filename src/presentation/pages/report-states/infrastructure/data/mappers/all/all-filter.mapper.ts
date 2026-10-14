import { Injectable } from '@angular/core';
import { AllFilterApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-filter-api.dto';
import { AllFilterContract } from '@pages/report-states/domain/contracts/all/all-filter.contract';

@Injectable({ providedIn: 'root' })
export class AllFilterMapper {
    map(entity: AllFilterContract): AllFilterApiDto {
        return {
            initiator_phone_number: entity.initiatorPhoneNumber,
            uniq_id: entity.uniqId,
            request_report_uniq_id: entity.requestReportUniqId,
            report_type: entity.reportType,
            operators: entity.operators,
            source: entity.source,
            start_date: entity.startDate,
            end_date: entity.endDate,
        };
    }
}
