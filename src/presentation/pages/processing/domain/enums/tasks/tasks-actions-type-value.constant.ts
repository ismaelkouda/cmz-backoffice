export const TASKS_ACTION_TYPE_VALUE = {
    OPERATOR_VERIFICATION: 'network_coverage',
} as const;

export type TasksActionTypeValue =
    (typeof TASKS_ACTION_TYPE_VALUE)[keyof typeof TASKS_ACTION_TYPE_VALUE];
