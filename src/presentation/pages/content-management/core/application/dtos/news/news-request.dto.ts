import { MediaPublishDto } from '@shared/data/dtos/media-publish.dto';

export interface NewsRequestDto {
    startDate?: string;
    endDate?: string;
    search?: string;
    isPublished?: MediaPublishDto;
}
