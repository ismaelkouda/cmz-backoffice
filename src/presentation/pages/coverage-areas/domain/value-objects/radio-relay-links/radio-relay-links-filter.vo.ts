import { RadioRelayLinksFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-filter.contract';
import { radioRelayLinksFilterValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-filter.validator';

export function radioRelayLinksFilterVo(
    contract: RadioRelayLinksFilterContract
): RadioRelayLinksFilterContract {
    radioRelayLinksFilterValidator(contract);
    return contract;
}
