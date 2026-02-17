import { MediaPublishDto } from '@shared/data/dto/media-publish.dto';

export interface LegalNoticeRequestDto {
    startDate?: string;
    endDate?: string;
    version?: string;
    search?: string;
    isPublished?: MediaPublishDto;
}
