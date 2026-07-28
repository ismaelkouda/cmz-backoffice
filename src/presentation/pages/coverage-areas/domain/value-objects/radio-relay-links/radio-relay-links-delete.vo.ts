import { RadioRelayLinksDeleteContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.contract';
import { RadioRelayLinksDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.validate-contract';
import { RadioRelayLinksDeleteValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-delete.validator';

export function radioRelayLinksDeleteVo(
    contract: RadioRelayLinksDeleteContract
): RadioRelayLinksDeleteValidateContract {
    RadioRelayLinksDeleteValidator.assert(contract);
    return { uniqId: contract['uniqId'] as string };
}
