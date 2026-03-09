import { Roles } from '@shared/domain/enums/roles.enum';

import { Status } from '../../enums/participants/participants-status.enum';

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
