import { RadioRelayLinksCreateContract } from '../../contracts/radio-relay-links/radio-relay-links-create.contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';
import { RadioRelayLinksCreateValidateContract } from '../../contracts/radio-relay-links/radio-relay-links-create.validate-contract';

export function radioRelayLinksCreateValidator(
    contract: RadioRelayLinksCreateContract
): asserts contract is RadioRelayLinksCreateValidateContract {
    if (
        !contract.name ||
        typeof contract.name !== 'string' ||
        !contract.name.trim()
    ) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.operator) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.OPERATOR_REQUIRE'
        );
    }
    if (!contract.frequency) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.FREQUENCY_REQUIRE'
        );
    }
    if (!contract.longitudePointA) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.LONGITUDE_POINT_A_REQUIRE'
        );
    }
    if (!contract.latitudePointA) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.LATITUDE_POINT_A_REQUIRE'
        );
    }
    if (!contract.longitudePointB) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.LONGITUDE_POINT_B_REQUIRE'
        );
    }
    if (!contract.latitudePointB) {
        throw new GenericRequiredError(
            'COVERAGE_AREAS.RADIO_RELAY_LINKS.FORM.ERROR.CREATE.LATITUDE_POINT_B_REQUIRE'
        );
    }
}
