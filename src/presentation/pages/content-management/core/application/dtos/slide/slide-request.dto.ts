import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";
import { Plateform } from "@shared/domain/enums/plateform.enum";

export interface SlideRequestDto {
    startDate?: string;
    endDate?: string;
    plateforms?: Array<Plateform>;
    search?: string;
    status?: MediaStatusDto;
}
