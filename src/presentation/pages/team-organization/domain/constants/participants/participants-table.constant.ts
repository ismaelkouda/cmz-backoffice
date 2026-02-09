export const PARTICIPANTS_TABLE_CONSTANT = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '2rem',
        },
        // {
        //     field: 'matricule',
        //     header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.MATRICULE',
        //     width: '10rem',
        // },
        {
            field: 'lastName',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.LAST_NAME',
            width: '10rem',
        },
        {
            field: 'firstName',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.FIRST_NAME',
            width: '12rem',
        },
        {
            field: 'email',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.EMAIL',
            width: '10rem',
        },
        {
            field: 'phone',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.PHONE',
            class: 'text-center',
            width: '7rem',
        },
        {
            field: 'role',
            style: 'roleStyle',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.ROLE',
            class: 'text-center',
            width: '7rem',
            type: 'badge',
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
            width: '7rem',
        },
        {
            field: '__actionDropdown',
            header: 'TEAM_ORGANIZATION.PARTICIPANTS.TABLE.ACTION',
            class: 'text-center',
            width: '5rem',
        },
    ],
    globalFilterFields: [
        // 'matricule',
        'lastName',
        'firstName',
        'email',
        'phone',
        'role',
        'status',
        'createdAt',
    ],
};
