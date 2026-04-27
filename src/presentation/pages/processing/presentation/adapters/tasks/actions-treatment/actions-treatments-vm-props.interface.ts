export interface TasksActionsVmProps {
    uniqId: string;
    type: string;
    date: string;
    description: string;
    notifyUser: boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    actionsRef: string;

    tooltipButtonCanNotDelete: string;
    tooltipButtonCanDelete: string;
    disableButtonDelete: boolean;
    tooltipButtonCanNotEdit: string;
    tooltipButtonCanEdit: string;
    disableButtonEdit: boolean;
}
