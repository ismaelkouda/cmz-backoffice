import { TermsUseFilterDto } from '@pages/content-management/application/dto/terms-use/terms-use-filter.dto';

export interface TermsUseFilterVo {
    search?: string;
    version?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function termsUseFilterVo(
    dto: TermsUseFilterDto | null = {} as TermsUseFilterDto
): TermsUseFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        version: dto?.version,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
