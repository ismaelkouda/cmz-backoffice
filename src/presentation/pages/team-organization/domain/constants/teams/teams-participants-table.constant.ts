export const TEAMS_PARTICIPANTS_TABLE_CONSTANT = {
    cols: [
        {
            field: 'firstName',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.FIRST_NAME',
            width: '10rem',
        },
        {
            field: 'lastName',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.LAST_NAME',
            width: '15rem',
        },
        {
            field: 'phone',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.PHONE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'email',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.EMAIL',
            class: 'text-center',
            width: '15rem',
        },
        {
            field: '__selection',
            header: 'COMMON.SELECTION',
            class: 'text-center',
            width: '5rem',
            type: 'selection',
        },
    ],
    globalFilterFields: ['firstName', 'lastName', 'phone', 'email'],
};
