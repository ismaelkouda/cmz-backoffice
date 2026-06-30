import { Status } from '@pages/report-states/domain/enums/download/download-status.enum';
import { DownloadType } from '../../enums/download-type.enum';

export interface DownloadProps {
    uniqId: string;
    date: string;
    name: string;
    type: DownloadType;
    size: number;
    status: Status;
    filter: { name: string; value: string }[];
    updatedAt: string;
}
