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
            roleLabel: item.role ? this.t(item.role) : null,
            roleStyle: item.role ? item.roleStyle(item.role) : null,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
        };
    }
}
