import { inject, Injectable } from '@angular/core';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { RadioRelayLinksFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-filter-api.dto';
import { ApiDateMapper } from '@shared/data/mappers/api-date.mapper';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFilterMapper {
    private readonly apiDateMapper = inject(ApiDateMapper);

    execute(
        contract: RadioRelayLinksFilterContract
    ): RadioRelayLinksFilterApiDto {
        return {
            search: contract.search,
            operator: contract.operator,
            frequency: contract.frequency,
            start_date: contract.startDate
                ? this.apiDateMapper.toDateApi(contract.startDate)
                : undefined,
            end_date: contract.endDate
                ? this.apiDateMapper.toDateApi(contract.endDate)
                : undefined,
        };
    }
}
