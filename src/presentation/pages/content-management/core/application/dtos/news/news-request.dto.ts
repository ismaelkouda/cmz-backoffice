import { MediaPublishDto } from '@shared/data/dto/media-publish.dto';

export interface NewsRequestDto {
    startDate?: string;
    endDate?: string;
    search?: string;
    isPublished?: MediaPublishDto;
}
