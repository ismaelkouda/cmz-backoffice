import { SlaEntity } from '@pages/sla/domain/entities/sla/sla.entity';
import { SlaVmProps } from '@pages/sla/presentation/adapters/sla/sla-vm-props.interface';

export class SlaPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: SlaEntity): SlaVmProps {
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            isActive: item.isActive,
            statusLabel: this.t(
                item.isActive ? 'SLA.STATUS.ACTIVE' : 'SLA.STATUS.INACTIVE'
            ),
            statusStyle: item.isActive
                ? 'COMMON.ACTIVE_STYLE'
                : 'COMMON.INACTIVE_STYLE',
            dropdownActions: [
                { id: 'edit', label: 'COMMON.EDIT', icon: 'pi pi-pencil' },
                item.isActive
                    ? {
                          id: 'disable',
                          label: 'COMMON.DISABLE',
                          icon: 'pi pi-times',
                      }
                    : {
                          id: 'enable',
                          label: 'COMMON.ENABLE',
                          icon: 'pi pi-check',
                      },
                { id: 'delete', label: 'COMMON.DELETE', icon: 'pi pi-trash' },
                { id: 'view', label: 'COMMON.VIEW', icon: 'pi pi-eye' },
            ],
            disableDropdown: false,
            tooltipDropdown: this.t('COMMON.CHOOSE'),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
}
