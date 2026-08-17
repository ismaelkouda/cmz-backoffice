import { Status } from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export interface PrivacyPolicyProps {
    uniqId: string;
    version: string;
    status: Status;
    createdAt: string;
    publishedAt: string;
    updatedAt: string;
}
