import { RadioRelayLinksDeleteContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.contract';
import { RadioRelayLinksDeleteValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-delete.validate-contract';
import { radioRelayLinksDeleteValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-delete.validator';

export function radioRelayLinksDeleteVo(
    contract: RadioRelayLinksDeleteContract
): RadioRelayLinksDeleteValidateContract {
    radioRelayLinksDeleteValidator(contract);
    return { uniqId: contract['uniqId'] as string };
}
