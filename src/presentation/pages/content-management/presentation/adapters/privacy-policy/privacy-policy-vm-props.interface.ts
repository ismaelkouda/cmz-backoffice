import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export interface PrivacyPolicyVmProps {
    uniqId: string;
    version: string;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    publishedAt: string;
    actionsRef: string;
}
