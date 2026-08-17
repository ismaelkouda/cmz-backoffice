import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';

export interface DownloadVmProps {
    uniqId: string;
    url: string;
    name: string;
    size: string;
    type: DownloadType;
    typeLabel: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    filters: { name: string; value: string }[];
    filtersCount: number;
    date: string;
    actionsRef: string;
    tooltipButtonDownload: string;
    disableButtonDownload: boolean;
}
