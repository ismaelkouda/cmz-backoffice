import { SiteGroupEntity } from '@pages/coverage-areas/domain/entities/site-group/site-group.entity';
import { SiteGroupVmProps } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-vm-props.interface';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export class SiteGroupPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: SiteGroupEntity,
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
    ): SiteGroupVmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            description: item.description,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'details',
                    label: 'COMMON.DETAILS',
                    icon: 'pi pi-eye',
                    tooltip: this.t(
                        'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.DETAILS'
                    ),
                },
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.EDIT')
                        : permission.tooltip.edit,
                },
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
                                  'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
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
                                        'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.ENABLE'
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
                                        'COVERAGE_AREAS.SITE_GROUP.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('COVERAGE_AREAS.SITE_GROUP.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
