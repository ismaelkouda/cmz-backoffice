import { NewsFilterDto } from '@pages/content-management/application/dto/news/news-filter.dto';
import { NewsFilterContract } from '@pages/content-management/domain/contracts/news/news-filter.contract';
import { validateNewsFilter } from '@pages/content-management/domain/validators/news/news-filter.validator';

export interface NewsFilterVo {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function newsFilterVo(
    dto: NewsFilterDto | null = {} as NewsFilterDto
): NewsFilterVo {
    validateNewsFilter((dto ?? {}) as NewsFilterContract);
    return {
        search: dto?.search?.trim() || undefined,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
