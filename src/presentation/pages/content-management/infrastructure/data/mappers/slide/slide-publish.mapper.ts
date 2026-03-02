import { SlidePublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-publish.entity';
import { SlidePublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-publish-api.dto';

export function slidePublishMapper(vo: SlidePublishEntity): SlidePublishApiDto {
    const prams = {} as SlidePublishApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
