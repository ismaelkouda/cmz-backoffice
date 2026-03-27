import { TasksEntity } from '@pages/requests/domain/entities/tasks/tasks.entity';
import { TasksVmProps } from '@pages/requests/presentation/adapters/tasks/tasks-vm-props.interface';

export class TasksPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TasksEntity): TasksVmProps {
        return {
            uniqId: item.uniqId,
            type: item.type,
            reportTypeLabel: this.t(item.reportType),
            operators: item.operators,
            sourceLabel: this.t(item.source),
            initiatorPhoneNumber: item.initiatorPhoneNumber,
            reportedAt: item.reportedAt,
            actionsRef: item.actionsRef,
        };
    }
}
