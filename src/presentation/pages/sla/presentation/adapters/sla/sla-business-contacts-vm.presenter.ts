import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { StatusStyle } from '@pages/settings-security/domain/enums/users/users-status.enum';
import { SlaBusinessContactEntity } from '@pages/sla/domain/entities/sla/sla-business-contact.entity';
import { SlaBusinessContactsVmProps } from './sla-business-contacts-vm-props.interface';

export class SlaBusinessContactsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: SlaBusinessContactEntity,
        permissions: {
            canEdit: boolean;
            canDelete: boolean;
        }
    ): SlaBusinessContactsVmProps {
        const statusLabel = this.t(
            item.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE'
        );
        const actions: ActionDropdownItem[] = [
            {
                id: item.isActive ? 'disable' : 'enable',
                label: item.isActive ? 'COMMON.DISABLE' : 'COMMON.ENABLE',
                icon: item.isActive ? 'pi pi-times' : 'pi pi-check',
                disabled: !permissions.canEdit,
                tooltip: item.isActive
                    ? this.t('SLA.BUSINESS_CONTACTS.TOOLTIP.DISABLE')
                    : this.t('SLA.BUSINESS_CONTACTS.TOOLTIP.ENABLE'),
            },
            {
                id: 'delete',
                label: 'COMMON.DELETE',
                icon: 'pi pi-trash',
                disabled: !permissions.canDelete,
                tooltip: this.t('SLA.BUSINESS_CONTACTS.TOOLTIP.DELETE'),
            },
        ];

        return {
            id: item.id,
            lastName: item.lastName,
            firstName: item.firstName,
            phone: item.phone,
            email: item.email,
            indicatorsCount: item.indicatorsCount,
            statusLabel,
            statusStyle: item.isActive
                ? StatusStyle.ACTIVE
                : StatusStyle.INACTIVE,
            createdAt: item.createdAt,
            dropdownActions: actions,
            disableDropdown: !permissions.canEdit && !permissions.canDelete,
            tooltipDropdown: this.t('SLA.BUSINESS_CONTACTS.TOOLTIP.ACTION'),
        };
    }
}
