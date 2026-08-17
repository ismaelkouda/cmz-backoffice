import { Status } from '@pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface LegalNoticeFindOneProps {
    uniqId: string;
    version: string;
    status: Status;
    content: string;
    createdAt: string;
    updatedAt: string;
}
