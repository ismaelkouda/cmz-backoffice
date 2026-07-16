import { PrivacyPolicyFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-filter.dto';

export interface PrivacyPolicyFilterVo {
    search?: string;
    version?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function privacyPolicyFilterVo(
    dto: PrivacyPolicyFilterDto | null = {} as PrivacyPolicyFilterDto
): PrivacyPolicyFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        version: dto?.version,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
