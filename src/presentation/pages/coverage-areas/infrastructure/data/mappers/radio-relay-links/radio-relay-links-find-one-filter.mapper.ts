import { Injectable } from '@angular/core';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';
import { RadioRelayLinksFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-find-one-filter-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksFindOneFilterMapper {
    execute(
        contract: RadioRelayLinksFindOneFilterValidateContract
    ): RadioRelayLinksFindOneFilterApiDto {
        return {
            id: contract.uniqId,
        };
    }
}
