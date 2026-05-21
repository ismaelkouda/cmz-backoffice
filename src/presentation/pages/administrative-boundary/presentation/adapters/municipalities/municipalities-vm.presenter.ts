import { MunicipalitiesEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities.entity';
import { MunicipalitiesVmProps } from '@pages/administrative-boundary/presentation/adapters/municipalities/municipalities-vm-props.interface';

export class MunicipalitiesPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: MunicipalitiesEntity,
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
    ): MunicipalitiesVmProps {
        return {
            uniqId: item.uniqId,
            code: item.code,
            name: item.name,
            region: item.region,
            department: item?.department,
            description: item.description,
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
                              'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.EDIT'
                          )
                        : permission.tooltip.edit,
                },
                {
                    id: 'delete',
                    label: 'COMMON.DELETE',
                    icon: 'pi pi-trash',
                    disabled: !permission.authorization.canDelete,
                    tooltip: permission.authorization.canDelete
                        ? this.t(
                              'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.DELETE'
                          )
                        : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t(
                      'ADMINISTRATIVE_BOUNDARY.MUNICIPALITIES.TOOLTIP.CHOOSE'
                  )
                : permission.tooltip.choose,
        };
    }
}
