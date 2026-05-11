import { AllEntity } from '@pages/processing/domain/entities/all/all.entity';
import { AllVmProps } from '@pages/processing/presentation/adapters/all/all-vm-props.interface';

export class AllPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AllEntity): AllVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonView: this.t('PROCESSING.ALL.TOOLTIP.SEE_MORE'),
            disableButtonView: false,
        };
    }
}
