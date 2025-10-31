export const PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM = {
    DELETE: 'delete-profiles-authorizations',
    EDIT: 'edit-profiles-authorizations',
    ADD: 'add-profiles-authorizations',
    ACTIVE: 'active-profiles-authorizations',
    INACTIVE: 'invoice-profiles-authorizations',
    SEE: 'see-profiles-authorizations',
    AFFECT: 'affect-profiles-authorizations',
} as const;

export type T_PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM =
    (typeof PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM)[keyof typeof PROFILES_AUTHORIZATIONS_BUTTONS_ACTIONS_ENUM];
