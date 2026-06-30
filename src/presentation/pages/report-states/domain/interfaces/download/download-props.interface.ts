import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadType } from '../../enums/download-type.enum';

export interface DownloadProps {
    uniqId: string;
    url: string;
    name: string;
    size: number;
    type: DownloadType;
    status: Status;
    filters: { name: string; value: string }[];
    createdAt: string;
}
