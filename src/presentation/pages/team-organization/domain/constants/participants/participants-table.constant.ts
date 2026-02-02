export const PARTICIPANTS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        {
            field: 'matricule',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.MATRICULE',
            width: '10rem',
        },
        {
            field: 'lastName',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.LAST_NAME',
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.FIRST_NAME',
            width: '15rem',
        },
        {
            field: 'email',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.EMAIL',
            width: '10rem',
        },
        {
            field: 'phone',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.PHONE',
            width: '8rem',
        },
        {
            field: 'role',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.ROLE',
            width: '7rem',
        },
        {
            field: 'state',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.STATE',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'status',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.STATUS',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'createdAt',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.CREATED_AT',
            class: 'text-center',
            width: '8rem',
        },
        {
            field: '__actionDropdown',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.ACTION',
            class: 'text-center',
            width: '4rem',
        },
    ],
    globalFilterFields: [
        'matricule',
        'lastName',
        'firstName',
        'email',
        'phone',
        'role',
        'state',
        'status',
        'createdAt',
    ],
};
