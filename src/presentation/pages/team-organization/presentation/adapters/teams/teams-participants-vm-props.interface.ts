import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';

export interface TeamsParticipantsVmProps {
    uniqId: string;

    lastName: string;
    firstName: string;
    email: string;
    phone: string;

    role: Roles | null;
    roleLabel: string | null;
    roleStyle: RolesStyle | null;

    actionsRef: string;
}
