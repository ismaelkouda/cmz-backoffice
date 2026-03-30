import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsVmProps } from '@pages/team-organization/presentation/adapters/teams/teams-vm-props.interface';

export class TeamsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TeamsEntity): TeamsVmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            description: item.description,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            membersCount: item.membersCount,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
        };
    }
}
