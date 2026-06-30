import {
    Status,
    StatusStyle,
} from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadType } from '@presentation/pages/report-states/domain/enums/download-type.enum';

export interface DownloadVmProps {
    uniqId: string;
    date: string;
    name: string;
    type: DownloadType;
    size: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    filter: { name: string; value: string }[];
    actionsRef: string;
    tooltipButtonDownload: string;
    disableButtonDownload: boolean;
}
