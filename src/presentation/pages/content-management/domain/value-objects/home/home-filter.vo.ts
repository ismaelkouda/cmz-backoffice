import { HomeFilterDto } from '@pages/content-management/application/dto/home/home-filter.dto';
import { HomeFilterContract } from '@pages/content-management/domain/contracts/home/home-filter.contract';
import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { validateHomeFilter } from '@pages/content-management/domain/validators/home/home-filter.validator';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeFilterVo {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}

export function homeFilterVo(
    dto: HomeFilterDto | null = {} as HomeFilterDto
): HomeFilterVo {
    validateHomeFilter((dto ?? {}) as HomeFilterContract);
    return {
        search: dto?.search?.trim() || undefined,
        platforms: dto?.platforms,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
