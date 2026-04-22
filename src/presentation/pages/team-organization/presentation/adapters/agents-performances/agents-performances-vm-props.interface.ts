import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';

export interface AgentsPerformancesVmProps {
    uniqId: string;

    fullName: string;
    goalsSize: string;
    achievementsSize: string;
    percentages: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    createdAt: string;
    actionsRef: string;
}
