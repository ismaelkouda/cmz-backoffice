import { SlideDeleteEntity } from '@pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-delete-api.dto';

export function slideDeleteMapper(vo: SlideDeleteEntity): SlideDeleteApiDto {
    const prams = {} as SlideDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
