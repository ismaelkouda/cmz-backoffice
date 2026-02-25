import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface SlideFilterPayloadEntity {
    startDate: string;
    endDate: string;
    platforms: Plateform[];
    search: string;
    status: boolean | null;
}
