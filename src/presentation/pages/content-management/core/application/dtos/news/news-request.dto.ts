import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";

export interface NewsRequestDto {
    startDate?: string;
    endDate?: string;
    search?: string;
    status?: MediaStatusDto;
}
