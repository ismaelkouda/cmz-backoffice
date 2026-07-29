import { RadioRelayLinksCreateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.contract';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { radioRelayLinksCreateValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-create.validator';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export function radioRelayLinksCreateVo(
    contract: RadioRelayLinksCreateContract
): RadioRelayLinksCreateValidateContract {
    radioRelayLinksCreateValidator(contract);

    return {
        name: contract.name as string,
        operator: contract.operator as RadioRelayLinksOperator,
        frequency: contract.frequency as RadioRelayLinksFrequency,
    };
}
