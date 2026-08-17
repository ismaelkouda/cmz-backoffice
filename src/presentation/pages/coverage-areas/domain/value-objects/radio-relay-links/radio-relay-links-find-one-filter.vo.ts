import { RadioRelayLinksFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.contract';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';
import { validateRadioRelayLinksFindOneFilter } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-find-one-filter.validator';

export function radioRelayLinksFindOneFilterVo(
    contract: RadioRelayLinksFindOneFilterContract
): RadioRelayLinksFindOneFilterValidateContract {
    validateRadioRelayLinksFindOneFilter(contract);
    return contract;
}
