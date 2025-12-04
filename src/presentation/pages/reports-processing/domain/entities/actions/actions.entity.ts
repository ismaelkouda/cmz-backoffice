import { UserInfo } from '@shared/domain/interfaces/user-info.interface';

export type ActionType =
    | 'ANALYSIS'
    | 'TREATMENT'
    | 'VERIFICATION'
    | 'CORRECTION'
    | 'VALIDATION'
    | 'OTHER';

export interface ActionsEntity {
    id: string;
    reportUniqId: string;
    date: string;
    type: ActionType;
    description: string;
    reportProcessingsCount: boolean;
    createdBy: UserInfo;
    updatedBy: UserInfo;
    createdAt: string;
    updatedAt: string;
}
