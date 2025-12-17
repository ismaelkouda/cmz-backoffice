import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface SlideFilterPayloadEntity {
    startDate: string;
    endDate: string;
    plateforms: Plateform[];
    search: string;
    status: boolean | null;
}
