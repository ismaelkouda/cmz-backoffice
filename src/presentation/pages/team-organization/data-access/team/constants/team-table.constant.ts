export const TEAM_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'code',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.CODE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'nom',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.NAME',
            width: '16rem',
        },
        {
            field: 'tenants_count',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.TENANTS',
            class: 'text-center',
            width: '11rem',
        },
        {
            field: 'agents_count',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.PARTICIPANTS',
            class: 'text-center',
            width: '13rem',
        },
        {
            field: 'statut',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: '__action',
            header: 'TEAM_ORGANIZATION.TEAM.TABLE.ACTION',
            class: 'text-center',
            width: '10rem',
        },
    ],
    globalFilterFields: ['code', 'nom', 'statut'],
};
