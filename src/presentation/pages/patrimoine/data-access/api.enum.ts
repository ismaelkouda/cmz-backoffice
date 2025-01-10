export const enum EndPointUrl {
    
    POST_PATRIMOINE_SIM_SIMS_ALL_PAGE = 'patrimoine-sim/sims/all?page={page}',
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    POST_PATRIMOINE_SIM_SIMS_imsi_Details = 'patrimoine-sim/sims/{imsi}/details',
    DETAILS_SIM = 'patrimoine-sim/sims/{imsi}/details',
    POST_PARAMETRES_SECURITE_NIVEAU_DEUX_SIMPLE = 'parametres-securite/niveau_deux/simple',
    GET_ALL_NIVEAUX_2_SIMPLE = 'parametres-securite/niveau_deux/simple',
    POST_PARAMETRES_SECURITE_NIVEAU_UN_SIMPLE = 'parametres-securite/niveau_un/simple',
    GET_ALL_NIVEAUX_1_SIMPLE = 'parametres-securite/niveau_un/simple',
    POST_PATRIMOINE_SIM_SIMS_ALL_USAGES = 'patrimoine-sim/sims/all_usage',
    GET_ALL_USAGES = 'patrimoine-sim/sims/all_usage',
    POST_PARAMETRES_SECURITE_NIVEAU_TROIS_SIMPLE = 'parametres-securite/niveau_trois/simple',
    GET_ALL_NIVEAUX_3_SIMPLE = 'parametres-securite/niveau_trois/simple',
    UPDATE_PATRIMOINE = 'patrimoine-sim/sims/update',
    IDENTIFICATION_PATRIMOINE = 'gestion-identifications/identification',
    IDENTIFICATION_PATRIMOINE_UPDATE = 'gestion-identifications/identification/update',
    POST_PATRIMOINE_SIM_SIMS_UPDATE = 'patrimoine-sim/sims/update',
    REFRESH_DATA = 'patrimoine-sim/etats-des-soldes/actualisation-simple',
    POST_PATRIMOINE_SIM_ETATS_DES_SOLDES_ACTUALISATION_SIMPLE = 'patrimoine-sim/etats-des-soldes/actualisation-simple',

    CHANGE_STATUT_IDENTIFICATION = 'patrimoine-sim/transactions/sur-sim',
    
    GET_ALL_CYCLES = 'patrimoine-sim/cycle-de-vie/all?page={page}',
    GET_ALL_ETAT_SOLDE = 'patrimoine-sim/sims/etat-sims?page={page}',
    VERIFY_PATRIMOINE = 'patrimoine-sim/sims/verifier',
    ACTIVATION_SIM = 'patrimoine-sim/transactions/demande_activation',
    CHANGE_STATUT = 'patrimoine-sim/transactions/sur-sim',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data',

    //TRANSACTION
    GET_ALL_TRANSACTIONS = 'patrimoine-sim/transactions/all?page={page}',
    GET_ALL_DEPARTEMENT = 'analyse-alerte/departements/all',
    GET_ALL_COMMUNE = 'analyse-alerte/communes/all',

    //GROUPE
    GET_ALL_GROUPE = 'patrimoine-sim/groupe-sims/all',
    SAVE_GROUPE = 'patrimoine-sim/groupe-sims/store',
    UPDATE_GROUPE = 'patrimoine-sim/groupe-sims/update',
    DELETE_GROUPE = 'patrimoine-sim/groupe-sims/{id}/delete',
    GET_ALL_SIM_NO_GROUPE = 'patrimoine-sim/groupe-sims/sims-without-groupe?page={page}',
    GET_ALL_SIM_AT_GROUPE = 'patrimoine-sim/groupe-sims/visualiser-sims?page={page}',
    SAVE_AFFECTATION = 'patrimoine-sim/groupe-sims/affectation',
    SAVE_REAFFECTATION = 'patrimoine-sim/groupe-sims/reaffectation',
    RETRAIT_SIM = 'patrimoine-sim/groupe-sims/retrait',
    ACTIVATE_GROUPE = 'patrimoine-sim/groupe-sims/{id}/activer',
    DISABLE_GROUPE = 'patrimoine-sim/groupe-sims/{id}/desactiver',
    VERIFY_GROUPE = 'patrimoine-sim/groupe-sims/verifier-groupe',

   //DOTATION
   GET_ALL_DOTATION = 'patrimoine-sim/dotations-services/all?page={page}',
   SAVE_DOATATION = 'patrimoine-sim/dotations-services/store',
   DOWNLOAD_FILE = 'patrimoine-sim/telechargement-fichiers/all?page={page}'
}
