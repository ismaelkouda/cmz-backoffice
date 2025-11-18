export const AgentEndpoint = {
    AGENTS: 'organisation-adv/agent-ia',
    STORE: 'organisation-adv/agent-ia/store',
    UPDATE: 'organisation-adv/agent-ia/update',
    DELETE: 'organisation-adv/agent-ia/{id}/delete',
    ENABLE: 'organisation-adv/agent-ia/{id}/activer',
    DISABLE: 'organisation-adv/agent-ia/{id}/desactiver',
    TENANTS_LIBRES: 'organisation-adv/agent-ia/tenants/libres',
    TENANTS_AFFECTATION: 'organisation-adv/agent-ia/tenants/affectation',
    TENANTS_REASSIGNATION: 'organisation-adv/agent-ia/tenants/reaffectation',
    TENANTS_RETRAIT: 'organisation-adv/agent-ia/tenants/retrait',
} as const;
