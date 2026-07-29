import { RadioRelayLinksUpdateContract } from '../../contracts/radio-relay-links/radio-relay-links-update.contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { RadioRelayLinksUpdateValidateContract } from '../../contracts/radio-relay-links/radio-relay-links-update.validate-contract';

export function radioRelayLinksUpdateValidator(
    contract: RadioRelayLinksUpdateContract
): asserts contract is RadioRelayLinksUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (
        !contract.name ||
        typeof contract.name !== 'string' ||
        !contract.name.trim()
    ) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.UPDATE.OPERATOR_REQUIRE'
        );
    }
    if (!contract.frequency) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.UPDATE.FREQUENCY_REQUIRE'
        );
    }
}
