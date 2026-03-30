import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/teams/teams-status.enum';

export interface TeamsVmProps {
    uniqId: string;

    code: string;
    name: string;
    description: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    membersCount: string;

    updatedAt: string;
    actionsRef: string;
}
