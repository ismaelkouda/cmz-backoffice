export const TEAMS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'code',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.CODE',
            width: '7rem',
        },
        {
            field: 'name',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.NAME',
            width: '10rem',
        },
        {
            field: 'description',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.DESCRIPTION',
            width: '15rem',
        },
        {
            field: 'status',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.STATUS',
            class: 'text-center',
            width: '6rem',
        },
        {
            field: 'membersCount',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.PARTICIPANTS_COUNT',
            class: 'text-center',
            width: '8rem',
            type: 'badge-button',
        },
        {
            field: 'updatedAt',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.UPDATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'TEAM_ORGANIZATION.TEAMS.TABLE.ACTION',
            class: 'text-center',
            width: '5rem',
        },
    ],
    globalFilterFields: [
        'code',
        'name',
        'description',
        'membersCount',
        'status',
        'updatedAt',
    ],
};
