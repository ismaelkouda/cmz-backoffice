import { LegalNoticeFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-filter.dto';

export interface LegalNoticeFilterVo {
    search?: string;
    version?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function legalNoticeFilterVo(
    dto: LegalNoticeFilterDto | null = {} as LegalNoticeFilterDto
): LegalNoticeFilterVo {
    return {
        search: dto?.search?.trim() || undefined,
        version: dto?.version,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
