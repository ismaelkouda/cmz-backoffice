import { Injectable } from '@angular/core';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { RadioRelayLinksFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-filter-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFilterMapper {
    execute(
        contract: RadioRelayLinksFilterContract
    ): RadioRelayLinksFilterApiDto {
        return {
            search: contract.search,
            operator: contract.operator,
            start_date: contract.startDate?.toISOString(),
            end_date: contract.endDate?.toISOString(),
        };
    }
}
