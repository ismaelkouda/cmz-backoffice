import { RadioRelayLinksCreateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.contract';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { radioRelayLinksCreateValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-create.validator';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';

export function radioRelayLinksCreateVo(
    contract: RadioRelayLinksCreateContract
): RadioRelayLinksCreateValidateContract {
    radioRelayLinksCreateValidator(contract);

    return {
        name: contract.name as string,
        operator: contract.operator as RadioRelayLinksOperator,
        frequency: contract.frequency as number,
        debit: contract.debit as number,
        longitudePointA: contract.longitudePointA as string,
        latitudePointA: contract.latitudePointA as string,
        longitudePointB: contract.longitudePointB as string,
        latitudePointB: contract.latitudePointB as string,
        geomFile: contract.geomFile,
    };
}
