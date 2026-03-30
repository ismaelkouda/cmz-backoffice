import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/news/news-status.enum';

export interface NewsVmProps {
    uniqId: string;
    type: string;
    title: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    actionsRef: string;
}
