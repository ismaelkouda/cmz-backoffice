import { ParticipantsEntity } from '@pages/team-organization/domain/entities/participants/participants.entity';
import { ParticipantsVmProps } from '@pages/team-organization/presentation/adapters/participants/participants-vm-props.interface';
import { Status } from '@presentation/pages/team-organization/domain/enums/participants/participants-status.enum';

export class ParticipantsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: ParticipantsEntity,
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
    ): ParticipantsVmProps {
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
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.EDIT')
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
                                        'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.ENABLE'
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
                                        'TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.DISABLE'
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
                            ? this.t(
                                  'TEAM_ORGANIZATION.PARTICIPANTS.ACTIONS.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('TEAM_ORGANIZATION.PARTICIPANTS.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
