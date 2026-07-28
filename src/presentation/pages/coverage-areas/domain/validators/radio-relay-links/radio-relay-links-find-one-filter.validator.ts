import { RadioRelayLinksFindOneFilterContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.contract';
import { RadioRelayLinksFindOneFilterValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-find-one-filter.validate-contract';

export function validateRadioRelayLinksFindOneFilter(
    contract: RadioRelayLinksFindOneFilterContract
): asserts contract is RadioRelayLinksFindOneFilterValidateContract {
    if (!contract.uniqId) {
        throw new Error(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.FIND_ONE.UNIQ_ID_REQUIRE'
        );
    }
}
