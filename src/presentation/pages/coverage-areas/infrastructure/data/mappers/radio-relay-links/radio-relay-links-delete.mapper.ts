import { Injectable } from '@angular/core';
import { RadioRelayLinksDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-delete-api.dto';
import { RadioRelayLinksDeleteValidateContract } from '@presentation/pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.validate-contract';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksDeleteMapper {
    execute(
        contract: RadioRelayLinksDeleteValidateContract
    ): RadioRelayLinksDeleteApiDto {
        return {
            uniq_id: contract.uniqId,
        };
    }
}
