import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-delete-api.dto';

export function slideDeleteMapper(dto: SlideDeleteDto): SlideDeleteApiDto {
    const prams = {} as SlideDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
