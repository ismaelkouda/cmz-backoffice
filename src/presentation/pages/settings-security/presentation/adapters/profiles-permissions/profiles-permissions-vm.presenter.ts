import { ProfilesPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions.entity';
import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';
import { ProfilesPermissionsVmProps } from '@pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-vm-props.interface';

const profilesNotDelete = new Set(['utilisateur-standard', 'administrateur']);

export class ProfilesPermissionsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: ProfilesPermissionsEntity,
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
    ): ProfilesPermissionsVmProps {
        return {
            uniqId: item.uniqId,
            name: item.name,
            description: item.description,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            usersCount: item.usersCount,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t(
                              'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TOOLTIP.EDIT'
                          )
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
                                        'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TOOLTIP.ENABLE'
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
                                        'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),

                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    hidden: profilesNotDelete.has(item.slug),
                    disabled:
                        item.status === Status.ACTIVE ||
                        !permission.authorization.canDelete ||
                        Number(item.usersCount) > 0,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.status !== Status.ACTIVE
                            ? this.t(
                                  'SETTINGS_SECURITY.PROFILES_PERMISSIONS.ACTIONS.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t(
                      'SETTINGS_SECURITY.PROFILES_PERMISSIONS.TOOLTIP.CHOOSE'
                  )
                : permission.tooltip.choose,
        };
    }
}
