import {
    Status,
    StatusStyle,
} from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';

export interface ProfilesPermissionsVmProps {
    uniqId: string;

    name: string;
    description: string;

    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;

    usersCount: string;

    updatedAt: string;
    actionsRef: string;

    disableDropdownDelete: boolean;
    hiddenDropdownDelete: boolean;
}
