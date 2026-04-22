import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { ProfilesPermissionsVmProps } from '@pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-vm-props.interface';

const profilesNotDelete = new Set(['utilisateur-standard', 'administrateur']);

export class ProfilesPermissionsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: ProfilesPermissionsEntity): ProfilesPermissionsVmProps {
        return {
            uniqId: item.uniqId,
            name: item.name,
            description: item.description,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            usersCount: item.usersCount,
            updatedAt: item.updatedAt,
            disableDropdownDelete: Number(item.usersCount) > 0,
            hiddenDropdownDelete: profilesNotDelete.has(item.slug),
            actionsRef: item.actionsRef,
        };
    }
}
