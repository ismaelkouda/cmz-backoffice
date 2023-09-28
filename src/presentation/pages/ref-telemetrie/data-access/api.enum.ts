export const enum EndPointUrl {

    GET_ALL_REFERENTIEL_TELEMETRIE = 'profil-supervision/referentiel-telemetriques/all',
    SAVE_PROFIL_SUPERVISION = 'profil-supervision/profils/store',
    GET_METRIQUES_BY_PROFIL = 'profil-supervision/profils/{id}/metriques',
    GET_ALL_PROFILS_SUPERVISION = 'profil-supervision/profils/all',
    ACTIVATE_PROFIL = 'profil-supervision/profils/{id}/activer',
    DISABLE_PROFIL = 'profil-supervision/profils/{id}/desactiver',
    GET_LIST_AFFECTATION_BY_SIM = 'profil-supervision/profils/sims?page={page}',
    GET_LIST_SIM_AFFECTES = 'profil-supervision/profils/visualiser-sims?page={page}',
    UPDATE_REFERENTIEL_TELEMETRIE = 'profil-supervision/referentiel-telemetriques/update',
    UPDATE_PROFIL_SUPERVISION = 'profil-supervision/profils/update',
    SAVE_AFFECTATION = 'profil-supervision/sims/affectation',
    SAVE_REAFFECTATION = 'profil-supervision/sims/reaffectation',
    RETRAIT_SIM = 'profil-supervision/sims/retrait',
    DEPLOYER = 'profil-supervision/referentiel-telemetriques/deploy'
}
