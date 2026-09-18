import { AllEntity } from '@pages/report-states/domain/entities/all/all.entity';
import { AllVmProps } from '@pages/report-states/presentation/adapters/all/all-vm-props.interface';

export class AllPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AllEntity): AllVmProps {
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
                'REPORT_STATES.ALL.TOOLTIP.TASKS_LIST'
            ),
            tooltipButtonQualify: this.t('REPORT_STATES.ALL.TOOLTIP.SEE_MORE'),
            disableButtonQualify: false,
        };
    }
}
