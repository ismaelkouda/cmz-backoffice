import { EvaluateEntity } from '@pages/report-states/domain/entities/evaluate/evaluate.entity';
import { EvaluateVmProps } from '@pages/report-states/presentation/adapters/evaluate/evaluate-vm-props.interface';

export class EvaluatePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: EvaluateEntity): EvaluateVmProps {
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
                'REPORT_STATES.EVALUATE.TOOLTIP.TASKS_LIST'
            ),
            tooltipButtonTake: this.t(
                'REPORT_STATES.EVALUATE.TOOLTIP.SEE_MORE'
            ),
            disableButtonTake: false,
        };
    }
}
