import { InfrastructureEntity } from '@presentation/pages/administrative-infrastructure/domain/entities/infrastructure/infrastructure.entity';
import { InfrastructureVmProps } from '@presentation/pages/administrative-infrastructure/presentation/adapters/infrastructure/infrastructure-vm-props.interface';

export class InfrastructurePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: InfrastructureEntity,
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
    ): InfrastructureVmProps {
        return {
            uniqId: item.uniqId,
            name: item.name,
            type: item.type,
            description: item.description,
            region: item.region,
            department: item.department,
            municipality: item.municipality,
            position: item.position,
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
                              'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.EDIT'
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
                              'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.DELETE'
                          )
                        : permission.tooltip.delete,
                },
            ],
            disableDropdown: !permission.authorization.canChoose,
            tooltipDropdown: permission.authorization.canChoose
                ? this.t(
                      'ADMINISTRATIVE_INFRASTRUCTURE.INFRASTRUCTURE.TOOLTIP.CHOOSE'
                  )
                : permission.tooltip.choose,
        };
    }
}
