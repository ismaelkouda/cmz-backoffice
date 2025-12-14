import { MediaPublishDto } from "@shared/data/dtos/media-publish.dto";

export interface LegalNoticeRequestDto {
    createdFrom?: string;
    createdTo?: string;
    isPublished?: MediaPublishDto;
}
