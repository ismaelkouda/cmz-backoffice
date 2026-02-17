import { MediaStatusDto } from '@shared/data/dto/media-status.dto';
import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface SlideRequestDto {
    startDate?: string;
    endDate?: string;
    platforms?: Plateform[];
    search?: string;
    status?: MediaStatusDto;
}
