export const enum EndPointUrl {
    GET_ALL_USERS = 'users/all',
    SAVE_USER = 'users/store',
    UPDATE_USER = 'users/update',
    DELETE_USER = 'users/delete',
    GET_ALL_HISTORIQUE = 'historiques',
    GET_ALL_JOURNAL = 'gestion-transactions/{typeJournal}/journal-evenements',
    GET_ALL_YEAR = 'gestion-campagnes/annees/all',

    //First Level EndPoints
    GET_ALL_FIRSTLEVEL = 'parametres-securite/niveau_un/all?page={page}',
    GET_ALL_FIRSTLEVEL_HABILITATION = 'parametres-securite/niveau_un/all-for-habilitation',
    SAVE_DIRECTION_REGIONALE = 'parametres-securite/niveau_un/store',
    UPDATE_DIRECTION_REGIONALE = 'parametres-securite/niveau_un/update',

    //Second Level EndPoints
    GET_ALL_EXPLOITATION = 'parametres-securite/niveau_deux/all?page={page}',
    GET_ALL_SECOND_LEVEL_HABILITATION = 'parametres-securite/niveau_deux/all-for-habilitation',
    SAVE_EXPLOITATION = 'parametres-securite/niveau_deux/store',
    UPDATE_EXPLOITATION = 'parametres-securite/niveau_deux/update',
    GET_EXPLOIATATION_NO_AFFECTE = 'parametres-securite/niveau_deux/all-non-affectes',

    //Third Level EndPoints
    GET_ALL_NIVEAUX_3 = 'parametres-securite/niveau_trois/all?page={page}',
    GET_ALL_NIVEAUX_3_HABILITATION = 'parametres-securite/niveau_trois/all-for-habilitation',
    SAVE_NIVEAUX_3 = 'parametres-securite/niveau_trois/store',
    UPDATE_NIVEAUX_3 = 'parametres-securite/niveau_trois/update',
    GET_ALL_ZONES = 'parametres-securite/zones/all',
    UPDATE_STATUT_USAGE = 'usages/mise-a-jour-statut',
    DELETE_NIVEAUX_3 = 'parametres-securite/niveau_trois/{id}/delete',
    ACTIVATE_NIVEAUX_3 = 'parametres-securite/niveau_trois/{id}/activer',
    DISABLE_NIVEAUX_3 = 'parametres-securite/niveau_trois/{id}/desactiver',

    //Third Level EndPoints
    GET_ALL_USAGES = 'parametres-securite/usages/all',    
    SAVE_USAGE = 'parametres-securite/usages/store',
    UPDATE_USAGE = 'parametres-securite/usages/update',
    ACTIVATE_USAGE = 'parametres-securite/usages/{id}/activer',
    DISABLE_USAGE = 'parametres-securite/usages/{id}/desactiver',
    DELETE_USAGE = 'parametres-securite/usages/{id}/delete',
    
    // SECURITY
    HANDLE_UPDATE_PASSWORD = 'users/update-password',
    GET_ALL_SITES = 'sites/all',
    LOGOUT = 'logout',
    GET_ALL_PORTEFEUILLE = 'gestion-portefeuille/all',

    // LEVEL SIMPLE
    GET_ALL_NIVEAUX_1_SIMPLE = 'parametres-securite/niveau_un/simple',
    GET_ALL_NIVEAUX_2_SIMPLE = 'parametres-securite/niveau_deux/simple',
    GET_ALL_NIVEAUX_3_SIMPLE = 'parametres-securite/niveau_trois/simple',
    GET_ALL_FORMULES = 'parametres-securite/formules-sims/all',

    GET_ALL_APN = 'patrimoine-sim/apn/all',

    FORCE_VENTE_COMMERCIAL_ALL = "force-vente/commercial/all?page={page}",
    POST_GESTION_TENANTS_PORTEFEUILLES_TENANT_ALL = "gestion-tenants/portefeuilles-tenant/all",

}
