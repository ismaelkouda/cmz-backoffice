import { RadioRelayLinksUpdateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.contract';
import { RadioRelayLinksUpdateValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-update.validate-contract';
import { RadioRelayLinksUpdateValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-update.validator';
import { RadioRelayLinksOperator } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-operator.enum';
import { RadioRelayLinksFrequency } from '@pages/coverage-areas/domain/enums/radio-relay-links/radio-relay-links-frequency.enum';

export function radioRelayLinksUpdateVo(
    contract: RadioRelayLinksUpdateContract
): RadioRelayLinksUpdateValidateContract {
    RadioRelayLinksUpdateValidator.assert(contract);
    const startDate = contract.startDate
        ? new Date(contract.startDate)
        : new Date();
    const endDate = contract.endDate ? new Date(contract.endDate) : new Date();

    return {
        uniqId: contract.uniqId as string,
        name: contract.name as string,
        operator: contract.operator as RadioRelayLinksOperator,
        frequency: contract.frequency as RadioRelayLinksFrequency,
        startDate,
        endDate,
    };
}
