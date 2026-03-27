import { SlideDisableEntity } from '@pages/content-management/domain/entities/slide/slide-disable.entity';
import { SlideDisableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-disable-api.dto';

export function slideDisableMapper(vo: SlideDisableEntity): SlideDisableApiDto {
    const prams = {} as SlideDisableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
