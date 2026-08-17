import { TeamsEntity } from '@pages/team-organization/domain/entities/teams/teams.entity';
import { TeamsVmProps } from '@pages/team-organization/presentation/adapters/teams/teams-vm-props.interface';
import { Status } from '@presentation/pages/team-organization/domain/enums/teams/teams-status.enum';

export class TeamsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: TeamsEntity,
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
    ): TeamsVmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            description: item.description,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            membersCount: item.membersCount,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.EDIT')
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
                                        'TEAM_ORGANIZATION.TEAMS.TOOLTIP.ENABLE'
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
                                        'TEAM_ORGANIZATION.TEAMS.TOOLTIP.DISABLE'
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
                        !permission.authorization.canDelete ||
                        Number(item.membersCount) > 0,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.status !== Status.ACTIVE
                            ? this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.DELETE')
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('TEAM_ORGANIZATION.TEAMS.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
