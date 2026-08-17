import { OpticalFiberNetworkEntity } from '@pages/coverage-areas/domain/entities/optical-fiber-network/optical-fiber-network.entity';
import { OpticalFiberNetworkVmProps } from '@pages/coverage-areas/presentation/adapters/optical-fiber-network/optical-fiber-network-vm-props.interface';
import { Status } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-status.enum';
import { FiberType } from '@pages/coverage-areas/domain/enums/optical-fiber-network/optical-fiber-network-type.enum';

export class OpticalFiberNetworkPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: OpticalFiberNetworkEntity,
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
    ): OpticalFiberNetworkVmProps {
        const typeLabelMap: Record<FiberType, string> = {
            [FiberType.SINGLE_MODE]: this.t(
                'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TYPE.SINGLE_MODE'
            ),
            [FiberType.MULTI_MODE]: this.t(
                'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TYPE.MULTI_MODE'
            ),
        };

        return {
            uniqId: item.uniqId,
            name: item.name,
            operator: item.operator,
            fiberConstructorId: item.fiberConstructorId,
            fiberConstructorName: item.fiberConstructorName,
            type: item.type,
            typeLabel: typeLabelMap[item.type] ?? item.type,
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
                        'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.DETAILS'
                    ),
                },
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t(
                              'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.EDIT'
                          )
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
                                  'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.DELETE'
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
                                        'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.ENABLE'
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
                                        'COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.DISABLE'
                                    )
                                  : permission.tooltip.disable,
                          },
                      ]),
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('COVERAGE_AREAS.OPTICAL_FIBER_NETWORK.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
