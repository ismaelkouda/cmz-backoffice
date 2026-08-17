import { QueuesEntity } from '@pages/processing/domain/entities/queues/queues.entity';
import { QueuesVmProps } from '@pages/processing/presentation/adapters/queues/queues-vm-props.interface';

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
                ? this.t('PROCESSING.QUEUES.TOOLTIP.TAKE')
                : this.t('PROCESSING.QUEUES.TOOLTIP.SEE_MORE'),
            disableButtonTake: false,
        };
    }
}
