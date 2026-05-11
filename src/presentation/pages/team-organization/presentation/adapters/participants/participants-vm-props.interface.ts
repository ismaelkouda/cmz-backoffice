import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/participants/participants-status.enum';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';

export interface ParticipantsVmProps {
    uniqId: string;

    lastName: string;
    firstName: string;
    email: string;
    phone: string;

    role: Roles | null;
    roleLabel: string | null;
    roleStyle: RolesStyle | null;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    updatedAt: string;
    actionsRef: string;

    tooltipDisableDropdown: string;
    disableDropdown: boolean;
}
