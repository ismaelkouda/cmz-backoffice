import { SlaAlertContactEntity } from '@pages/sla/domain/entities/sla/sla-alert-contact.entity';
import { SlaAlertChannelVmProps } from '@pages/sla/presentation/adapters/sla/sla-alert-channel-vm-props.interface';

export class SlaAlertChannelPresenter {
    map(item: SlaAlertContactEntity): SlaAlertChannelVmProps {
        return {
            ...item,
            typeLabel: item.type,
        };
    }
}
