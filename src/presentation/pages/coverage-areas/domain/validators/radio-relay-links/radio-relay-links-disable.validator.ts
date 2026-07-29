import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { RadioRelayLinksDisableContract } from '../../contracts/radio-relay-links/radio-relay-links-disable.contract';
import { RadioRelayLinksDisableValidateContract } from '../../contracts/radio-relay-links/radio-relay-links-disable.validate-contract';

export function radioRelayLinksDisableValidator(
    contract: RadioRelayLinksDisableContract
): asserts contract is RadioRelayLinksDisableValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.DISABLE.UNIQ_ID_REQUIRE'
        );
    }
}
