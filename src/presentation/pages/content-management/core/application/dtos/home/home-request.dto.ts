import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";
import { TypeMediaDto } from "@shared/data/dtos/type-media.dto";

export interface HomeRequestDto {
    createdFrom?: string;
    createdTo?: string;
    type?: Array<TypeMediaDto>;
    status?: MediaStatusDto;
}
