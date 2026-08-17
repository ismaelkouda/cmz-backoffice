import { CloseEntity } from '@pages/report-states/domain/entities/close/close.entity';
import { CloseVmProps } from '@pages/report-states/presentation/adapters/close/close-vm-props.interface';

export class ClosePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: CloseEntity): CloseVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonTasksList: this.t(
                'REPORT_STATES.CLOSE.TOOLTIP.TASKS_LIST'
            ),
            tooltipButtonQualify: this.t(
                'REPORT_STATES.CLOSE.TOOLTIP.SEE_MORE'
            ),
            disableButtonQualify: false,
        };
    }
}
