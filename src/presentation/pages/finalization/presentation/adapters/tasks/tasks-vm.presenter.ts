import { TasksEntity } from '@pages/finalization/domain/entities/tasks/tasks.entity';
import { TasksVmProps } from '@pages/finalization/domain/interfaces/tasks/tasks-vm-props.interface';

export class TasksPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TasksEntity, permission: { canFinalize: boolean }): TasksVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
            tooltipButtonFinalize: permission.canFinalize
                ? this.t('FINALIZATION.TASKS.TOOLTIP.FINALIZE')
                : this.t('FINALIZATION.TASKS.TOOLTIP.SEE_MORE'),
            disableButtonFinalize: !permission.canFinalize,
        };
    }
}
