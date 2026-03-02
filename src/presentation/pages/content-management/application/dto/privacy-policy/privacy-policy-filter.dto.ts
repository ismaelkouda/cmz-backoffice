import { Status } from '@presentation/pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export interface PrivacyPolicyFilterDto {
    search?: string;
    version?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
