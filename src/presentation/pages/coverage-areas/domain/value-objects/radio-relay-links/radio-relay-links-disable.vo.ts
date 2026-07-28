import { RadioRelayLinksDisableContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.contract';
import { RadioRelayLinksDisableValidateContract } from '@pages/coverage-areas/domain/contracts/radio-relay-links/radio-relay-links-disable.validate-contract';
import { RadioRelayLinksDisableValidator } from '@pages/coverage-areas/domain/validators/radio-relay-links/radio-relay-links-disable.validator';

export function radioRelayLinksDisableVo(
    contract: RadioRelayLinksDisableContract
): RadioRelayLinksDisableValidateContract {
    RadioRelayLinksDisableValidator.assert(contract);
    return { uniqId: contract['uniqId'] as string };
}
