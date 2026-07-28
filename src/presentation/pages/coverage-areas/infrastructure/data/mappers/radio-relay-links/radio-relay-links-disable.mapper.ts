import { Injectable } from '@angular/core';
import { RadioRelayLinksDisableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.validate-contract';
import { RadioRelayLinksDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-disable-api.dto';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDisableMapper {
    execute(
        contract: RadioRelayLinksDisableValidateContract
    ): RadioRelayLinksDisableApiDto {
        return {
            uniq_id: contract.uniqId,
        };
    }
}
