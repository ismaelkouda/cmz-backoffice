import { TasksActionsEntity } from '@presentation/pages/processing/domain/entities/tasks/tasks-actions.entity';

import { TasksActionsVmProps } from './actions-treatments-vm-props.interface';

export class ActionsTreatmentPresenter {
    constructor(private readonly t: (key: string) => string) {}
    map(item: TasksActionsEntity): TasksActionsVmProps {
        return {
            uniqId: item.uniqId,
            notifyUser: item.shouldNotifyUser,
            type: item.type,
            date: item.formatDate,
            description: item.description,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            actionsRef: item.actionsRef,
            tooltipButtonCanNotDelete: this.t(
                'PROCESSING.TASKS.ACTIONS.TABLE.TOOLTIP_BUTTON_CAN_NOT_DELETE'
            ),
            tooltipButtonCanDelete: this.t(
                'PROCESSING.TASKS.ACTIONS.TABLE.TOOLTIP_BUTTON_CAN_DELETE'
            ),
            disableButtonDelete: item.shouldNotifyUser,
            tooltipButtonCanNotEdit: this.t(
                'PROCESSING.TASKS.ACTIONS.TABLE.TOOLTIP_BUTTON_CAN_NOT_EDIT'
            ),
            tooltipButtonCanEdit: this.t(
                'PROCESSING.TASKS.ACTIONS.TABLE.TOOLTIP_BUTTON_CAN_EDIT'
            ),
            disableButtonEdit: item.shouldNotifyUser,
        };
    }
}
