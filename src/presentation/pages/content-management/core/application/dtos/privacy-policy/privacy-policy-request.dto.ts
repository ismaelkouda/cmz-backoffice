import { MediaPublishDto } from '@shared/data/dtos/media-publish.dto';

export interface PrivacyPolicyRequestDto {
    startDate?: string;
    endDate?: string;
    version?: string;
    search?: string;
    isPublished?: MediaPublishDto;
}
