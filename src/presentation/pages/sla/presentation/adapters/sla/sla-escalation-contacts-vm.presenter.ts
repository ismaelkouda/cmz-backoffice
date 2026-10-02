import { SlaEscalationContactEntity } from '@pages/sla/domain/entities/sla/sla-escalation-contact.entity';
import { SlaEscalationContactVmProps } from './sla-escalation-contacts-vm-props.interface';

export class SlaEscalationContactsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(
        item: SlaEscalationContactEntity,
        permissions: { canEdit: boolean }
    ): SlaEscalationContactVmProps {
        return {
            id: item.id,
            type: item.type,
            fullName: `${item.lastName} ${item.firstName}`.trim(),
            firstName: item.firstName,
            lastName: item.lastName,
            jobTitle: item.jobTitle,
            phone: item.phone,
            email: item.email,
            whatsapp: item.whatsapp,
            telegram: item.telegram,
            updatedAt: item.updatedAt,
            actionsRef: item.type,
            tooltipButtonView: this.t(
                'SLA.ESCALATION_CONTACTS.TOOLTIP.VIEW'
            ),
            tooltipButtonEdit: this.t(
                'SLA.ESCALATION_CONTACTS.TOOLTIP.EDIT'
            ),
        };
    }
}
