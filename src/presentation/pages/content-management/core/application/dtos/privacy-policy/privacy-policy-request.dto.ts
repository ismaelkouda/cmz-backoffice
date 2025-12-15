import { MediaPublishDto } from "@shared/data/dtos/media-publish.dto";

export interface PrivacyPolicyRequestDto {
    createdFrom?: string;
    createdTo?: string;
    isPublished?: MediaPublishDto;
}
