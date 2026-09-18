import { Injectable } from '@angular/core';
import { AllFilterApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-filter-api.dto';
import { AllFilterContract } from '@pages/report-states/domain/contracts/all/all-filter.contract';

@Injectable({ providedIn: 'root' })
export class AllFilterMapper {
    map(entity: AllFilterContract): AllFilterApiDto {
        return {
            initiatorPhoneNumber: entity.initiatorPhoneNumber,
            uniqId: entity.uniqId,
            requestReportUniqId: entity.requestReportUniqId,
            reportType: entity.reportType,
            operators: entity.operators,
            source: entity.source,
            startDate: entity.startDate,
            endDate: entity.endDate,
        };
    }
}
