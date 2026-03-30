import { Status } from '@pages/team-organization/domain/enums/participants/participants-status.enum';
import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsProps {
    uniqId: string;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    role: Roles;
    status: Status;
    updatedAt: string;
}
