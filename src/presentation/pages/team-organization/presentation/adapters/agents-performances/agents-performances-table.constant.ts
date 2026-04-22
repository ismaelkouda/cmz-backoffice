export const AGENTS_PERFORMANCES_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'fullName',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.NAME',
            width: '18rem',
        },
        {
            field: 'goalsSize',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.GOALS_SIZE',
            width: '10rem',
            type: 'number',
        },
        {
            field: 'achievementsSize',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.ACHIEVEMENTS_SIZE',
            width: '10rem',
            type: 'number',
        },
        {
            field: 'percentages',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.PERCENTAGES',
            width: '10rem',
        },
        {
            field: 'statusLabel',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.STATUS',
            class: 'text-center',
            width: '5rem',
        },
        {
            field: 'createdAt',
            header: 'TEAM_ORGANIZATION.AGENTS_PERFORMANCES.TABLE.CREATED_AT',
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
