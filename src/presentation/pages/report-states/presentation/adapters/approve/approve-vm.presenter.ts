import { ApproveEntity } from '@pages/report-states/domain/entities/approve/approve.entity';
import { ApproveVmProps } from '@pages/report-states/presentation/adapters/approve/approve-vm-props.interface';

export class ApprovePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: ApproveEntity): ApproveVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonQualify: this.t(
                'REPORT_STATES.APPROVE.TOOLTIP.SEE_MORE'
            ),
            disableButtonQualify: false,
        };
    }
}
