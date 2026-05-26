import { RegionsEntity } from '@pages/administrative-boundary/domain/entities/regions/regions.entity';
import { RegionsVmProps } from '@pages/administrative-boundary/presentation/adapters/regions/regions-vm-props.interface';

export class RegionsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: RegionsEntity,
        permission: {
            authorization: {
                canEdit: boolean;
                canDelete: boolean;
                canChoose: boolean;
            };
            tooltip: {
                edit: string;
                delete: string;
                choose: string;
            };
        }
    ): RegionsVmProps {
        console.log(
            'permission.authorization.canDelete && item.departmentsCount < 0: ',
            item.departmentsCount <= 0
        );
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            description: item.description,
            departmentsCount: item.departmentsCount,
            populationSize: item.populationSize,
            infrastructureCount: item.infrastructureCount,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            dropdownActions: [
                {
                    id: 'edit',
                    label: 'COMMON.EDIT',
                    icon: 'pi pi-pencil',
                    disabled: !permission.authorization.canEdit,
                    tooltip: permission.authorization.canEdit
                        ? this.t('ADMINISTRATIVE_BOUNDARY.REGIONS.TOOLTIP.EDIT')
                        : permission.tooltip.edit,
                },
                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled:
                        !permission.authorization.canDelete ||
                        item.departmentsCount > 0,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.departmentsCount <= 0
                            ? this.t(
                                  'ADMINISTRATIVE_BOUNDARY.REGIONS.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('ADMINISTRATIVE_BOUNDARY.REGIONS.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
