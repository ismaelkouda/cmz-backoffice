export const PARTICIPANT_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'matricule',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.MATRICULE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'nom',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.NOM',
            width: '12rem',
        },
        {
            field: 'prenoms',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.PRENOMS',
            width: '12rem',
        },
        {
            field: 'username',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.USERNAME',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'contacts',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.CONTACT',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'role',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.ROLE',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'statut',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.STATUT',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: '__action',
            header: 'TEAM_ORGANIZATION.PARTICIPANT.TABLE.ACTION',
            class: 'text-center',
            width: '10rem',
        },
    ],
    globalFilterFields: [
        'matricule',
        'nom',
        'prenoms',
        'username',
        'contacts',
        'role',
        'statut',
    ],
};
