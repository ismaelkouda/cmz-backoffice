import { SlideEnableEntity } from '@pages/content-management/domain/entities/slide/slide-enable.entity';
import { SlideEnableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-enable-api.dto';

export function slideEnableMapper(vo: SlideEnableEntity): SlideEnableApiDto {
    const prams = {} as SlideEnableApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
