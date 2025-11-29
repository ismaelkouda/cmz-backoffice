export const TeamEndpoint = {
    TEAMS: 'organisation-adv/teams/all',
    STORE: 'organisation-adv/teams/store',
    UPDATE: 'organisation-adv/teams/update',
    DELETE: 'organisation-adv/teams/{id}/delete',
    ENABLE: 'organisation-adv/teams/{id}/activer',
    DISABLE: 'organisation-adv/teams/{id}/desactiver',
    TENANTS: 'organisation-adv/teams/tenants',
    TENANTS_LIBRES: 'organisation-adv/teams/tenants/libres',
    TENANTS_AFFECTATION: 'organisation-adv/teams/tenants/affectation',
    TENANTS_REASSIGNATION: 'organisation-adv/teams/tenants/reaffectation',
    TENANTS_RETRAIT: 'organisation-adv/teams/tenants/retrait',
    PARTICIPANTS: 'organisation-adv/teams/participants',
    PARTICIPANTS_LIBRES: 'organisation-adv/teams/participants/{role}/libres',
    PARTICIPANTS_AFFECTATION: 'organisation-adv/teams/participants/affectation',
    PARTICIPANTS_REASSIGNATION:
        'organisation-adv/teams/participants/reaffectation',
    PARTICIPANTS_RETRAIT: 'organisation-adv/teams/participants/retrait',
} as const;
