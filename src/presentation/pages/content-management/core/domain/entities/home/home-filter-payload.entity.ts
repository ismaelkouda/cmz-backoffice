import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface HomeFilterPayloadEntity {
    startDate: string;
    endDate: string;
    plateforms: Plateform[];
    search: string;
    status: boolean | null;
}
