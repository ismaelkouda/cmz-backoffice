import { Status } from '@pages/content-management/domain/enums/terms-use/terms-use-status.enum';

export interface TermsUseProps {
    uniqId: string;
    version: string;
    status: Status;
    createdAt: string;
    publishedAt: string;
    updatedAt: string;
}
