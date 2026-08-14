import { RadioRelayLinksUpdateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.contract';
import { RadioRelayLinksUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.validate-contract';
import { radioRelayLinksUpdateValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-update.validator';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export function radioRelayLinksUpdateVo(
    contract: RadioRelayLinksUpdateContract
): RadioRelayLinksUpdateValidateContract {
    radioRelayLinksUpdateValidator(contract);

    return {
        uniqId: contract.uniqId as string,
        name: contract.name as string,
        operator: contract.operator as RadioRelayLinksOperator,
        frequency: contract.frequency as RadioRelayLinksFrequency,
        longitudePointA: contract.longitudePointA as string,
        latitudePointA: contract.latitudePointA as string,
        longitudePointB: contract.longitudePointB as string,
        latitudePointB: contract.latitudePointB as string,
        geomFile: contract.geomFile,
    };
}
