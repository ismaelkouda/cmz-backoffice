import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface LegalNoticeVmProps {
    uniqId: string;
    version: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    publishedAt: string;
    actionsRef: string;
}
