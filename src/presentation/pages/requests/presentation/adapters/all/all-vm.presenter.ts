import { AllEntity } from '@pages/requests/domain/entities/all/all.entity';
import { AllVmProps } from '@pages/requests/presentation/adapters/all/all-vm-props.interface';

export class AllPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AllEntity): AllVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonView: this.t('REQUESTS.ALL.TOOLTIP.SEE_MORE'),
            disableButtonView: false,
        };
    }
}
