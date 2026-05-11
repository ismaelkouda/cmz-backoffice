import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

import { TasksActionsVmProps } from './actions-treatments-vm-props.interface';

export class ActionsTreatmentPresenter {
    constructor(private readonly t: (key: string) => string) {}
    map(
        item: TasksActionsEntity,
        permission: {
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
            isConform: item.isConform,
            date: item.formatDate,
            description: item.description,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            tooltipButtonDelete:
                permission.canTreat && !item.shouldNotifyUser
                    ? this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.DELETE')
                    : permission.tooltip.delete,
            tooltipButtonEdit:
                permission.canTreat && !item.shouldNotifyUser
                    ? this.t('PROCESSING.TASKS.ACTIONS.TOOLTIP.EDIT')
                    : permission.tooltip.edit,
            disableButtonDelete: item.shouldNotifyUser || !permission.canTreat,
            disableButtonEdit: item.shouldNotifyUser || !permission.canTreat,
        };
    }
}
