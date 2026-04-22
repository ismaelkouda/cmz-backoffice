import { TeamsParticipantsEntity } from '@pages/team-organization/domain/entities/teams/teams-participants.entity';
import { TeamsParticipantsVmProps } from '@pages/team-organization/presentation/adapters/teams/teams-participants-vm-props.interface';

export class TeamsParticipantsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TeamsParticipantsEntity): TeamsParticipantsVmProps {
        return {
            uniqId: item.uniqId,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            phone: item.phone,
            role: item.role,
            roleLabel: this.t(item.role),
            roleStyle: item.roleStyle(item.role),
            actionsRef: item.actionsRef,
        };
    }
}
