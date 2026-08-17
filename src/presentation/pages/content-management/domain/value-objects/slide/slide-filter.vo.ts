import { SlideFilterDto } from '@pages/content-management/application/dto/slide/slide-filter.dto';
import { SlideFilterContract } from '@pages/content-management/domain/contracts/slide/slide-filter.contract';
import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { validateSlideFilter } from '@pages/content-management/domain/validators/slide/slide-filter.validator';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideFilterVo {
    search?: string;
    platforms?: Platform[];
    status?: Status;
    startDate?: string;
    endDate?: string;
}

export function slideFilterVo(
    dto: SlideFilterDto | null = {} as SlideFilterDto
): SlideFilterVo {
    validateSlideFilter((dto ?? {}) as SlideFilterContract);
    return {
        search: dto?.search?.trim() || undefined,
        platforms: dto?.platforms,
        status: dto?.status,
        startDate: dto?.startDate,
        endDate: dto?.endDate,
    };
}
