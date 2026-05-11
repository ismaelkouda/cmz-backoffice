import { QueuesEntity } from '@pages/finalization/domain/entities/queues/queues.entity';
import { QueuesVmProps } from '@pages/finalization/domain/interfaces/queues/queues-vm-props.interface';

export class QueuesPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: QueuesEntity, permission: { canTake: boolean }): QueuesVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonTake: permission.canTake
                ? this.t('FINALIZATION.QUEUES.TOOLTIP.TAKE')
                : this.t('FINALIZATION.QUEUES.TOOLTIP.SEE_MORE'),
            disableButtonTake: !permission.canTake,
        };
    }
}
