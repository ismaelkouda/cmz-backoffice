import { RadioRelayLinksEnableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.contract';
import { RadioRelayLinksEnableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-enable.validate-contract';
import { radioRelayLinksEnableValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-enable.validator';

export function radioRelayLinksEnableVo(
    contract: RadioRelayLinksEnableContract
): RadioRelayLinksEnableValidateContract {
    radioRelayLinksEnableValidator(contract);
    return { uniqId: contract['uniqId'] as string };
}
