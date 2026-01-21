export const TEAM_PARTICIPANTS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'matricule',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.MATRICULE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'fullName',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.FULL_NAME',
            width: '15rem',
        },
        {
            field: 'email',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.EMAIL',
            width: '15rem',
        },
        {
            field: 'contacts',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.CONTACTS',
            width: '12rem',
        },
        {
            field: 'statut',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: [
        'matricule',
        'fullName',
        'email',
        'contacts',
        'statut',
    ],
};
