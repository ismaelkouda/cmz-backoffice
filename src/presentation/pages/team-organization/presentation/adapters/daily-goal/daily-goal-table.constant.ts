export const DAILY_GOAL_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'fullName',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.NAME',
            width: '18rem',
        },
        {
            field: 'goalsSize',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.GOALS_SIZE',
            width: '10rem',
            type: 'number',
        },
        {
            field: 'achievementsSize',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.ACHIEVEMENTS_SIZE',
            width: '10rem',
            type: 'number',
        },
        {
            field: 'percentages',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.PERCENTAGES',
            width: '10rem',
        },
        {
            field: 'statusLabel',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'TEAM_ORGANIZATION.DAILY_GOAL.TABLE.CREATED_AT',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: [
        'fullName',
        'goalsSize',
        'achievementsSize',
        'percentages',
        'statusLabel',
        'createdAt',
    ],
};
