import { DailyGoalEntity } from '@pages/team-organization/domain/entities/daily-goal/daily-goal.entity';
import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/daily-goal/daily-goal-status.enum';
import { DailyGoalVmProps } from '@pages/team-organization/presentation/adapters/daily-goal/daily-goal-vm-props.interface';

export class DailyGoalPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: DailyGoalEntity): DailyGoalVmProps {
        return {
            uniqId: item.uniqId,
            fullName: `${item.user.lastName} ${item.user.firstName}`,
            goalsSize: item.goalsSize,
            achievementsSize: item.achievementsSize,
            percentages: item.percentages,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: this.statusStyle(item.status),
            createdAt: item.createdAt,
            actionsRef: item.user.lastName,
        };
    }

    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
        };
        return methodMap[status];
    }
}
