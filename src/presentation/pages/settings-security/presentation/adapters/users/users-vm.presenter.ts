import { UsersEntity } from '@pages/settings-security/domain/entities/users/users.entity';
import { UsersVmProps } from '@pages/settings-security/presentation/adapters/users/users-vm-props.interface';
import { Status } from '@presentation/pages/settings-security/domain/enums/users/users-status.enum';

export class UsersPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: UsersEntity,
        permission: {
            authorization: {
                canEdit: boolean;
                canDelete: boolean;
                canEnable: boolean;
                canDisable: boolean;
                canChoose: boolean;
            };
            tooltip: {
                edit: string;
                delete: string;
                enable: string;
                disable: string;
                choose: string;
            };
        }
    ): UsersVmProps {
        return {
            uniqId: item.uniqId,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            phone: item.phone,
            profile: item.profile,
            // profileLabel: this.t(item.profile),
            // profileStyle: item.profileStyle(item.profile),
            role: item.role || null,
            roleLabel: item.role ? this.t(item.role) : null,
            roleStyle: item.role ? item.roleStyle(item.role) : null,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('SETTINGS_SECURITY.USERS.TOOLTIP.EDIT')
                        : permission.tooltip.edit,
                },
                ...(item.status === Status.INACTIVE
                    ? [
                          {
                              id: 'enable',
                              label: 'COMMON.ENABLE',
                              icon: 'pi pi-check',
                              disabled: !permission.authorization.canEnable,
                              tooltip: permission.authorization.canEnable
                                  ? this.t(
                                        'SETTINGS_SECURITY.USERS.TOOLTIP.ENABLE'
                                    )
                                  : permission.tooltip.enable,
                          },
                      ]
                    : [
                          {
                              id: 'disable',
                              label: 'COMMON.DISABLE',
                              icon: 'pi pi-times',
                              disabled: !permission.authorization.canDisable,
                              tooltip: permission.authorization.canDisable
                                  ? this.t(
                                        'SETTINGS_SECURITY.USERS.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),

                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled:
                        item.status === Status.ACTIVE ||
                        !permission.authorization.canDelete,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.status !== Status.ACTIVE
                            ? this.t('SETTINGS_SECURITY.USERS.TOOLTIP.DELETE')
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('SETTINGS_SECURITY.USERS.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
