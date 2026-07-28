import { Injectable } from '@angular/core';
import { RadioRelayLinksUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.validate-contract';
import { RadioRelayLinksUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-update-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksUpdateMapper {
    execute(
        contract: RadioRelayLinksUpdateValidateContract
    ): RadioRelayLinksUpdateApiDto {
        return {
            id: contract.uniqId,
            name: contract.name,
            operator: contract.operator,
            frequency: contract.frequency,
            start_date: contract.startDate.toISOString(),
            end_date: contract.endDate.toISOString(),
        };
    }
}
