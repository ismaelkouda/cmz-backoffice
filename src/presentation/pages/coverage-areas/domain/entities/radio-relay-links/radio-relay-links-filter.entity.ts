import { RadioRelayLinksFilterContract } from '../../contracts/radio-relay-links/radio-relay-links-filter.contract';
import { resolveOpenEndedEndDate } from '@shared/domain/utils/resolve-open-ended-end-date.util';

export function RadioRelayLinksFilterEntity(
    contract: RadioRelayLinksFilterContract
): RadioRelayLinksFilterContract {
    return {
        ...contract,
        endDate: resolveOpenEndedEndDate(contract.startDate, contract.endDate),
    };
}
