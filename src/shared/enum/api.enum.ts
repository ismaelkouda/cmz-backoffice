export const enum EndPointUrl {
    GET_ALL_USERS = 'users/all',
    GET_ALL_HISTORIQUE = 'historiques',
    GET_ALL_YEAR = 'gestion-campagnes/annees/all',

    //First Level EndPoints
    GET_ALL_DIRECTION_REGIONALE = 'parametres-securite/niveau_un/all',
    SAVE_DIRECTION_REGIONALE = 'parametres-securite/niveau_un/store',
    UPDATE_DIRECTION_REGIONALE = 'parametres-securite/niveau_un/update',

    //Second Level EndPoints
    GET_ALL_EXPLOITATION = 'parametres-securite/niveau_deux/all',
    SAVE_EXPLOITATION = 'parametres-securite/niveau_deux/store',
    UPDATE_EXPLOITATION = 'parametres-securite/niveau_deux/update',

    //Third Level EndPoints
    GET_ALL_NIVEAUX_3 = 'parametres-securite/niveau_trois/all',
    SAVE_NIVEAUX_3 = 'parametres-securite/niveau_trois/store',
    UPDATE_NIVEAUX_3 = 'parametres-securite/niveau_trois/update',

    GET_ALL_ZONES = 'parametres-securite/zones/all',
}
