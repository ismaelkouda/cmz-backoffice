import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/daily-goal/daily-goal-status.enum';

export interface DailyGoalVmProps {
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
