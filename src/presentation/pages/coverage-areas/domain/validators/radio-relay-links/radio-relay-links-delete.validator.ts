import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { RadioRelayLinksDeleteContract } from '../../contracts/radio-relay-links/radio-relay-links-delete.contract';
import { RadioRelayLinksDeleteValidateContract } from '../../contracts/radio-relay-links/radio-relay-links-delete.validate-contract';

export function radioRelayLinksDeleteValidator(
    contract: RadioRelayLinksDeleteContract
): asserts contract is RadioRelayLinksDeleteValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.DELETE.UNIQ_ID_REQUIRE'
        );
    }
}
