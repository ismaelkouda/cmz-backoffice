import { StatusStyle } from '@pages/settings-security/domain/enums/users/users-status.enum';
import { SlaEscalationContactEntity } from '@pages/sla/domain/entities/sla/sla-escalation-contact.entity';
import { ActionDropdownItem } from '@shared/components/action-dropdown/interfaces/action-dropdown.interface';
import { SlaEscalationContactVmProps } from './sla-escalation-contacts-vm-props.interface';

export class SlaEscalationContactsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: SlaEscalationContactEntity,
        permissions: { canEdit: boolean; canDelete: boolean }
    ): SlaEscalationContactVmProps {
        const actions: ActionDropdownItem[] = [
            {
                id: 'view',
                label: 'COMMON.VIEW',
                icon: 'pi pi-eye',
                disabled: false,
                tooltip: this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.VIEW'),
            },
            {
                id: 'edit',
                label: 'COMMON.EDIT',
                icon: 'pi pi-pencil',
                disabled: !permissions.canEdit,
                tooltip: this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.EDIT'),
            },
            {
                id: item.isActive ? 'disable' : 'enable',
                label: item.isActive ? 'COMMON.DISABLE' : 'COMMON.ENABLE',
                icon: item.isActive ? 'pi pi-times' : 'pi pi-check',
                disabled: !permissions.canEdit,
                tooltip: item.isActive
                    ? this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.DISABLE')
                    : this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.ENABLE'),
            },
            {
                id: 'delete',
                label: 'COMMON.DELETE',
                icon: 'pi pi-trash',
                disabled: !permissions.canDelete,
                tooltip: this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.DELETE'),
            },
        ];

        return {
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            email: item.email,
            categories: item.categories.map((category) => ({
                label: this.t(
                    `SLA.ESCALATION_CONTACTS.CATEGORY.${category.toUpperCase()}`
                ),
                severity:
                    category.toLowerCase() === 'job'
                        ? 'info'
                        : category.toLowerCase() === 'system'
                          ? 'contrast'
                          : 'secondary',
            })),
            categoriesLabel: item.categories
                .map((category) =>
                    this.t(
                        `SLA.ESCALATION_CONTACTS.CATEGORY.${category.toUpperCase()}`
                    )
                )
                .join(', '),
            statusLabel: this.t(
                item.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE'
            ),
            statusStyle: item.isActive
                ? StatusStyle.ACTIVE
                : StatusStyle.INACTIVE,
            updatedAt: item.updatedAt,
            dropdownActions: actions,
            disableDropdown: !permissions.canEdit && !permissions.canDelete,
            tooltipDropdown: this.t('SLA.ESCALATION_CONTACTS.TOOLTIP.ACTION'),
        };
    }
}
