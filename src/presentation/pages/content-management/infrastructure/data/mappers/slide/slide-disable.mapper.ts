import { SlideDisableDto } from '@pages/content-management/application/dto/slide/slide-disable.dto';
import { SlideDisableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-disable-api.dto';

export function slideDisableMapper(dto: SlideDisableDto): SlideDisableApiDto {
    const prams = {} as SlideDisableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
