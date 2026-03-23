import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export interface TermsUseFindOneProps {
    uniqId: string;
    version: string;
    status: Status;
    content: string;
    createdAt: string;
    updatedAt: string;
}
