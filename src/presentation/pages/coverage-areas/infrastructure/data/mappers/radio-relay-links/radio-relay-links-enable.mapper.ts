import { Injectable } from '@angular/core';
import { RadioRelayLinksEnableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.validate-contract';
import { RadioRelayLinksEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-enable-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksEnableMapper {
    execute(
        contract: RadioRelayLinksEnableValidateContract
    ): RadioRelayLinksEnableApiDto {
        return {
            uniq_id: contract.uniqId,
        };
    }
}
