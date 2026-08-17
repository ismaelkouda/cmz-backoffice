import { DownloadFilterContract } from '@presentation/pages/report-states/domain/contracts/download/download-filter.contract';
import { DateRangeInvalidError } from '@shared/domain/errors/validation/date-range-invalid.error';

export function validateDownloadFilter(
    contract: DownloadFilterContract
): asserts contract is DownloadFilterContract {
    if (
        contract &&
        contract.startDate &&
        contract.endDate &&
        contract.startDate.getTime() > contract.endDate.getTime()
    ) {
        throw new DateRangeInvalidError();
    }
}
