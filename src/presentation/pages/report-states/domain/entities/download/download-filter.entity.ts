import { DownloadFilterContract } from '@pages/report-states/domain/contracts/download/download-filter.contract';

export function downloadFilterEntity(
    contract: DownloadFilterContract
): DownloadFilterContract {
    const endDateRule =
        contract.startDate && !contract.endDate ? new Date() : contract.endDate;
    return {
        ...contract,
        endDate: endDateRule,
    };
}
