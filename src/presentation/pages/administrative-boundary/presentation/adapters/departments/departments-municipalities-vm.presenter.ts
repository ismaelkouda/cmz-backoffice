import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsVmProps } from '@pages/team-organization/presentation/adapters/teams/teams-participants-vm-props.interface';
import { Roles, RolesStyle } from '@shared/domain/enums/roles.enum';

export class TeamsParticipantsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TeamsParticipantsEntity): TeamsParticipantsVmProps {
        return {
            uniqId: item.uniqId,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            phone: item.phone,
            role: item.role || null,
            roleLabel: item.role ? this.t(item.role) : null,
            roleStyle: item.role ? this.roleStyle(item.role) : null,
            actionsRef: item.actionsRef,
        };
    }

    roleStyle(role: Roles): RolesStyle {
        const methodMap: Record<Roles, RolesStyle> = {
            [Roles.SUPERVISOR]: RolesStyle.SUPERVISOR,
            [Roles['TEAM-LEADER']]: RolesStyle['TEAM-LEADER'],
            [Roles.AGENT]: RolesStyle.AGENT,
        };
        return methodMap[role || null];
    }
}
