import { SlideEnableDto } from '@pages/content-management/application/dto/slide/slide-enable.dto';
import { SlideEnableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-enable-api.dto';

export function slideEnableMapper(dto: SlideEnableDto): SlideEnableApiDto {
    const prams = {} as SlideEnableApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
