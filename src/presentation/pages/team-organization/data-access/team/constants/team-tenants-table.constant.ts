export const TEAM_TENANTS_TABLE = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'code',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.CODE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'nom_tenant',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.TENANT_NAME',
            width: '15rem',
        },
        {
            field: 'compte_client',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.ACCOUNT_CLIENT',
            width: '15rem',
        },
        {
            field: 'statut',
            header: 'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['code', 'nom_tenant', 'compte_client', 'statut'],
};
