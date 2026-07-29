import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { RadioRelayLinksEnableContract } from '../../contracts/radio-relay-links/radio-relay-links-enable.contract';
import { RadioRelayLinksEnableValidateContract } from '../../contracts/radio-relay-links/radio-relay-links-enable.validate-contract';

export function radioRelayLinksEnableValidator(
    contract: RadioRelayLinksEnableContract
): asserts contract is RadioRelayLinksEnableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.ENABLE.UNIQ_ID_REQUIRE'
        );
    }
}
