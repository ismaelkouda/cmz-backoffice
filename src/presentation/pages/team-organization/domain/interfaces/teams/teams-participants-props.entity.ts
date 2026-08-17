import { Roles } from '@shared/domain/enums/roles.enum';

export interface TeamsParticipantsProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: Roles | null;
    updatedAt: string;
}
