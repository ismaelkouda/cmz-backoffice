import { RadioRelayLinksCreateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.contract';
import { RadioRelayLinksCreateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-create.validate-contract';
import { RadioRelayLinksCreateValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-create.validator';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export function radioRelayLinksCreateVo(
    contract: RadioRelayLinksCreateContract
): RadioRelayLinksCreateValidateContract {
    RadioRelayLinksCreateValidator.assert(contract);
    const startDate = contract.startDate
        ? new Date(contract.startDate)
        : new Date();
    const endDate = contract.endDate ? new Date(contract.endDate) : new Date();

    return {
        name: contract.name as string,
        operator: contract.operator as RadioRelayLinksOperator,
        frequency: contract.frequency as RadioRelayLinksFrequency,
        startDate,
        endDate,
    };
}
