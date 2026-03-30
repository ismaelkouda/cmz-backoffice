import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsVmProps } from '@pages/team-organization/presentation/adapters/participants/participants-vm-props.interface';

export class ParticipantsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: ParticipantsEntity): ParticipantsVmProps {
        return {
            uniqId: item.uniqId,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            phone: item.phone,
            role: item.role,
            roleLabel: this.t(item.role),
            roleStyle: item.roleStyle(item.role),
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
        };
    }
}
