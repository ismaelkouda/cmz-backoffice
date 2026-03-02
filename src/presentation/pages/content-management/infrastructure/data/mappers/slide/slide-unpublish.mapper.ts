import { SlideUnpublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-unpublish.entity';
import { SlideUnpublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-unpublish-api.dto';

export function slideUnpublishMapper(
    vo: SlideUnpublishEntity
): SlideUnpublishApiDto {
    const prams = {} as SlideUnpublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
