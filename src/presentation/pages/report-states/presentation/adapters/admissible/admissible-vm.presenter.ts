import { AdmissibleEntity } from '@pages/report-states/domain/entities/admissible/admissible.entity';
import { AdmissibleVmProps } from '@pages/report-states/presentation/adapters/admissible/admissible-vm-props.interface';

export class AdmissiblePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AdmissibleEntity): AdmissibleVmProps {
        return {
            uniqId: item.uniqId,
            requestReportUniqId: item.requestReportUniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            isConform: item.isConform,
            conformLabel: this.t(item.isConform),
            conformStyle: item.conformStyle(item.isConform),
            actionsRef: item.actionsRef,
            tooltipButtonTasksList: this.t(
                'REPORT_STATES.ADMISSIBLE.TOOLTIP.TASKS_LIST'
            ),
            tooltipButtonQualify: this.t(
                'REPORT_STATES.ADMISSIBLE.TOOLTIP.SEE_MORE'
            ),
            disableButtonQualify: false,
        };
    }
}
