import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { DownloadVmProps } from '@pages/report-states/presentation/adapters/download/download-vm-props.interface';
import { Status } from '@presentation/pages/report-states/domain/enums/download/download-status.enum';

export class DownloadPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: DownloadEntity): DownloadVmProps {
        console.log('item: ', item);
        return {
            uniqId: item.uniqId,
            url: item.url,
            name: item.name,
            size: item.size ? `${item.size} Ko` : '--',
            type: item.type,
            typeLabel: this.t(item.type),
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            filters: item.filters,
            filtersCount: item.filters.length,
            date: item.createdAt,
            actionsRef: item.actionsRef,
            tooltipButtonDownload:
                item.status !== Status.DONE
                    ? this.t('REPORT_STATES.DOWNLOAD.TOOLTIP.NO_DOWNLOAD')
                    : this.t('REPORT_STATES.DOWNLOAD.TOOLTIP.DOWNLOAD'),
            disableButtonDownload: item.status !== Status.DONE,
        };
    }
}
