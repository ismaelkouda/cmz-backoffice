import { TableConfig } from '@shared/interfaces/table-config';

export const AGENT_TABLE: TableConfig = {
    cols: [
        {
            field: '__index',
            header: 'TABLE.COMMON.INDEX',
            class: 'text-center',
            width: '3rem',
        },
        {
            field: 'code',
            header: 'TEAM_ORGANIZATION.AGENT_IA.TABLE.CODE',
            class: 'text-center',
            width: '10rem',
        },
        {
            field: 'nom',
            header: 'TEAM_ORGANIZATION.AGENT_IA.TABLE.NAME',
            width: '15rem',
        },
        {
            field: 'tenants_count',
            header: 'TEAM_ORGANIZATION.AGENT_IA.TABLE.TENANTS',
            class: 'text-center',
            width: '12rem',
        },
        {
            field: 'statut',
            header: 'TEAM_ORGANIZATION.AGENT_IA.TABLE.STATUS',
            class: 'text-center',
            width: '9rem',
        },
        {
            field: '__action',
            header: 'TEAM_ORGANIZATION.AGENT_IA.TABLE.ACTION',
            class: 'text-center',
            width: '9rem',
        },
    ],
    globalFilterFields: ['code', 'nom', 'description', 'statut'],
};
