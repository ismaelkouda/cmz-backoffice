import { assertValidDateRange } from '@shared/domain/validators/assert-valid-date-range.validator';
import { RadioRelayLinksFilterContract } from '../../contracts/radio-relay-links/radio-relay-links-filter.contract';

export function radioRelayLinksFilterValidator(
    contract: RadioRelayLinksFilterContract
): asserts contract is RadioRelayLinksFilterContract {
    assertValidDateRange(contract?.startDate, contract?.endDate);
}
