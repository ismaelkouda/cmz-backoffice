import { MediaPublishDto } from "@shared/data/dtos/media-publish.dto";

export interface TermsUseRequestDto {
    startDate?: string;
    endDate?: string;
    version?: string;
    search?: string;
    isPublished?: MediaPublishDto;
}
