import { Injectable } from '@angular/core';
import { AdmissibleFilterApiDto } from '@pages/report-states/infrastructure/api/dto/admissible/admissible-filter-api.dto';
import { AdmissibleFilterContract } from '@pages/report-states/domain/contracts/admissible/admissible-filter.contract';

@Injectable({ providedIn: 'root' })
export class AdmissibleFilterMapper {
    map(entity: AdmissibleFilterContract): AdmissibleFilterApiDto {
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
