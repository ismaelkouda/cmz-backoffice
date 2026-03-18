import { Status } from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface LegalNoticeProps {
    uniqId: string;
    version: string;
    status: Status;
    createdAt: string;
    publishedAt: string;
    updatedAt: string;
}
