import { MobileNetworkEntity } from '@pages/coverage-areas/domain/entities/mobile-network/mobile-network.entity';
import { MobileNetworkVmProps } from '@pages/coverage-areas/presentation/adapters/mobile-network/mobile-network-vm-props.interface';
import { Status } from '@pages/coverage-areas/domain/enums/mobile-network/mobile-network-status.enum';

export class MobileNetworkPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: MobileNetworkEntity,
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
    ): MobileNetworkVmProps {
        return {
            uniqId: item.uniqId,
            siteId: item.siteId,
            siteName: item.siteName,
            siteGroupName: item.siteGroupName,
            towerTypeId: item.towerTypeId,
            towerTypeName: item.towerTypeName,
            towerHeight: item.towerHeight,
            networkTechnology: item.networkTechnology,
            operator: item.operator,
            coverageRadius: item.coverageRadius,
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
                        'COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.DETAILS'
                    ),
                },
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.EDIT')
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
                                  'COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.DELETE'
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
                                        'COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.ENABLE'
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
                                        'COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('COVERAGE_AREAS.MOBILE_NETWORK.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
