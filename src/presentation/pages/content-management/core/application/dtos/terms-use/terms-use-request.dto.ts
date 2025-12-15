import { MediaPublishDto } from "@shared/data/dtos/media-publish.dto";

export interface TermsUseRequestDto {
    createdFrom?: string;
    createdTo?: string;
    isPublished?: MediaPublishDto;
}
