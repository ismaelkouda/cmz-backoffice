import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsUpdateDto {
    uniqId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role?: Roles;
    team?: string;
}
