export function calculateActionColumnWidth(actionCount: number): string {
    const width = Math.max(3, 0.5 + actionCount * 3);
    return `${width}rem`;
}

export const TASKS_ACTIONS_TABLE = {
    actions: [
        {
            id: 'edit',
            icon: 'pi pi-pencil',
            tooltip: 'PROCESSING.TASKS.TABLE.EDIT',
            severity: 'primary',
        },
        // {
        //     id: 'details',
        //     icon: 'pi pi-eye',
        //     tooltip: 'PROCESSING.TASKS.TABLE.SEE_REPORT',
        //     severity: 'contrast',
        // },
        {
            id: 'delete',
            icon: 'pi pi-trash',
            tooltip: 'PROCESSING.TASKS.TABLE.DELETE',
            severity: 'danger',
        },
    ],
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'date',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.DATE_ACTION',
            width: '8rem',
            class: 'text-center',
        },
        {
            field: 'type',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.TYPE',
            width: '12rem',
        },
        {
            field: 'operators',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.OPERATORS',
            width: '6rem',
            class: 'text-center',
        },
        {
            field: 'description',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.DESCRIPTION',
            width: '12rem',
            class: 'text-left',
        },
        {
            field: 'createdBy',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.CREATED_BY',
            width: '8rem',
            class: 'text-center',
        },
        {
            field: 'conformLabel',
            header: 'PROCESSING.TASKS.ACTIONS.TABLE.CONFORMITY',
            width: '6rem',
            class: 'text-center',
        },
        {
            field: '__action',
            header: 'PROCESSING.TASKS.TABLE.ACTION',
            class: 'text-center',
            width: calculateActionColumnWidth(1),
        },
    ],
    globalFilterFields: [
        'date',
        'type',
        'operators',
        'description',
        'createdBy',
        'conformLabel',
    ],
};
