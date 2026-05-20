import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

import { TasksActionsVmProps } from './actions-treatments-vm-props.interface';

export class ActionsTreatmentPresenter {
    constructor(private readonly t: (key: string) => string) {}
    map(
        item: TasksActionsEntity,
        permission: {
            hasClosed: boolean;
            canTreat: boolean;
            tooltip: {
                edit: string;
                delete: string;
            };
        }
    ): TasksActionsVmProps {
        return {
            uniqId: item.uniqId,
            notifyUser: item.shouldNotifyUser,
            type: item.type,
            code: item.code,
            operators: item.operators,
            shouldNotifyUser: item.shouldNotifyUser,
            autoChecked: item.autoChecked,
            isConform: item.isConform,
            conformLabel: this.t(item.isConform),
            conformStyle: item.conformStyle(item.isConform),
            date: item.formatDate,
            description: item.description,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            tooltipButtonView: this.t(
                'PROCESSING.TASKS.ACTIONS.TOOLTIP.SEE_MORE'
            ),
            tooltipButtonDelete:
                permission.canTreat &&
                !item.shouldNotifyUser &&
                !item.autoChecked
                    ? this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.DELETE')
                    : permission.tooltip.delete,
            tooltipButtonEdit:
                permission.canTreat &&
                !item.shouldNotifyUser &&
                !item.autoChecked
                    ? this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.EDIT')
                    : permission.tooltip.edit,
            disableButtonDelete:
                item.shouldNotifyUser ||
                !permission.canTreat ||
                !permission.hasClosed ||
                item.autoChecked,
            disableButtonEdit:
                item.shouldNotifyUser ||
                !permission.canTreat ||
                !permission.hasClosed ||
                item.autoChecked,
        };
    }
}
