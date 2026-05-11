import { TasksEntity } from '@pages/processing/domain/entities/tasks/tasks.entity';
import { TasksVmProps } from '@pages/processing/presentation/adapters/tasks/tasks-vm-props.interface';

export class TasksPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TasksEntity, permission: { canTreat: boolean }): TasksVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonTreat: permission.canTreat
                ? this.t('PROCESSING.TASKS.TOOLTIP.TREAT')
                : this.t('PROCESSING.TASKS.TOOLTIP.SEE_MORE'),
            disableButtonTreat: false,
        };
    }
}
