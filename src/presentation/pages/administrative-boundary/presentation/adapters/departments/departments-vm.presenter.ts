import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { DepartmentsVmProps } from '@pages/administrative-boundary/presentation/adapters/departments/departments-vm-props.interface';

export class DepartmentsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: DepartmentsEntity,
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
    ): DepartmentsVmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            region: item.region,
            description: item.description,
            municipalitiesCount: item.municipalitiesCount,
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
                        ? this.t(
                              'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.EDIT'
                          )
                        : permission.tooltip.edit,
                },
                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled:
                        !permission.authorization.canDelete ||
                        item.municipalitiesCount > 0,
                    tooltip:
                        permission.authorization.canDelete &&
                        item.municipalitiesCount <= 0
                            ? this.t(
                                  'ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.DELETE'
                              )
                            : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t('ADMINISTRATIVE_BOUNDARY.DEPARTMENTS.TOOLTIP.CHOOSE')
                : permission.tooltip.choose,
        };
    }
}
