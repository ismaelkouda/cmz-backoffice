import { RejectEntity } from '@pages/report-states/domain/entities/reject/reject.entity';
import { RejectVmProps } from '@pages/report-states/presentation/adapters/reject/reject-vm-props.interface';

export class RejectPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: RejectEntity): RejectVmProps {
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
            tooltipButtonView: this.t('REPORT_STATES.REJECT.TOOLTIP.SEE_MORE'),
            disableButtonView: false,
        };
    }
}
