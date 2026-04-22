import { AgentsPerformancesEntity } from '@pages/team-organization/domain/entities/agents-performances/agents-performances.entity';
import {
    Status,
    StatusStyle,
} from '@pages/team-organization/domain/enums/agents-performances/agents-performances-status.enum';
import { AgentsPerformancesVmProps } from '@pages/team-organization/presentation/adapters/agents-performances/agents-performances-vm-props.interface';

export class AgentsPerformancesPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AgentsPerformancesEntity): AgentsPerformancesVmProps {
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
            [Status.COMPLETED]: StatusStyle.COMPLETED,
            [Status.NOT_COMPLETED]: StatusStyle.NOT_COMPLETED,
        };
        return methodMap[status];
    }
}
