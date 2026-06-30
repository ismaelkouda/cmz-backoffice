import { DownloadFilterContract } from '@pages/report-states/domain/contracts/download/download-filter.contract';
import { validateDownloadFilter } from '@pages/report-states/domain/validators/download/download-filter.validator';

export function downloadFilterVo(
    contract: DownloadFilterContract
): DownloadFilterContract {
    validateDownloadFilter(contract);
    return contract;
}
