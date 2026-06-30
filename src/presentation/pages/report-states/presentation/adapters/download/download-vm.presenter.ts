import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { DownloadVmProps } from '@pages/report-states/presentation/adapters/download/download-vm-props.interface';

export class DownloadPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: DownloadEntity): DownloadVmProps {
        return {
            uniqId: item.uniqId,
            date: item.date,
            name: item.name,
            type: item.type,
            size: `${item.size} Ko`,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            filter: item.filter,
            actionsRef: item.actionsRef,
            tooltipButtonDownload: this.t(
                'REPORT_STATES.DOWNLOAD.TOOLTIP.DOWNLOAD'
            ),
            disableButtonDownload: false,
        };
    }
}
