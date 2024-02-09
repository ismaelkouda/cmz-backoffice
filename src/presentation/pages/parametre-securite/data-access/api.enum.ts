export const enum EndPointUrl {
    GET_ALL_PROFIL_HABILITATIONS = 'user-profiles/all',
    SAVE_PROFIL_HABILITATION = 'user-profiles/store',
    DELETE_PROFIL_HABILITATION = 'user-profiles/{id}/delete',
    GET_ALL_USERS_WITHOUT_PROFIL = 'users/without-profil',
    GET_ALL_USER_WITH_PROFIL = 'user-profiles/{id}/users',
    UPDATE_PROFIL = 'user-profiles/{id}/update',
    SAVE_AFFECTATION = 'user-profiles/affectation',
    SAVE_REAFFECTATION = 'user-profiles/reaffectation',
    SAVE_RETRAIT = 'user-profiles/retrait',
    ACTIVATE_PROFIL = 'user-profiles/{id}/activer',
    DISABLE_PROFIL = 'user-profiles/{id}/desactiver',
    ACTIVATE_USER = 'users/{id}/activer',
    DISABLE_USER = 'users/{id}/desactiver'
}

