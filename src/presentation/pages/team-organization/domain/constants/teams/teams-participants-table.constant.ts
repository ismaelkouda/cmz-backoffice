export const TEAMS_PARTICIPANTS = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'lastName',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.LAST_NAME',
            width: '15rem',
        },
        {
            field: 'firstName',
            header: 'TEAM_ORGANIZATION.TEAMS.PARTICIPANTS.TABLE.FIRST_NAME',
            width: '10rem',
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
            width: '3rem',
            type: 'selection',
        },
    ],
    globalFilterFields: ['lastName', 'firstName', 'phone', 'email'],
};
