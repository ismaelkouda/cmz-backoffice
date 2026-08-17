import { Injectable } from '@angular/core';
import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { RadioRelayLinksFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-filter-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFilterMapper {
    execute(
        contract: RadioRelayLinksFilterContract
    ): RadioRelayLinksFilterApiDto {
        const formatDate = (date?: Date | string): string | undefined => {
            if (!date) {
                return undefined;
            }
            if (date instanceof Date) {
                return date.toISOString();
            }
            const parsed = new Date(date);
            return !Number.isNaN(parsed.getTime())
                ? parsed.toISOString()
                : undefined;
        };

        return {
            search: contract.search,
            operator: contract.operator,
            frequency: contract.frequency,
            start_date: formatDate(contract.startDate),
            end_date: formatDate(contract.endDate),
        };
    }
}
