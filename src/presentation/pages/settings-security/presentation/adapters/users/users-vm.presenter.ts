import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersVmProps } from '@pages/settings-security/presentation/adapters/users/users-vm-props.interface';

export class UsersPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: UsersEntity): UsersVmProps {
        return {
            uniqId: item.uniqId,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            phone: item.phone,
            profile: item.profile,
            // profileLabel: this.t(item.profile),
            // profileStyle: item.profileStyle(item.profile),
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
