export const enum EndPointUrl {
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    DETAILS_SIM = 'patrimoine-sim/sims/{imsi}/details',
    GET_ALL_CYCLES = 'patrimoine-sim/cycle-de-vie/all?page={page}',
    GET_ALL_USAGES = 'patrimoine-sim/sims/all_usage',
    GET_ALL_ETAT_SOLDE = 'patrimoine-sim/sims/etat-sims?page={page}',
    UPDATE_PATRIMOINE = 'patrimoine-sim/sims/update',
    VERIFY_PATRIMOINE = 'patrimoine-sim/sims/verifier',
    ACTIVATION_SIM = 'patrimoine-sim/transactions/demande_activation',
    CHANGE_STATUT = 'patrimoine-sim/transactions/sur-sim',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data',
    REFRESH_DATA = 'patrimoine-sim/etats-des-soldes/actualisation-simple',

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
   DOWNLOAD_FILE = 'patrimoine-sim/telechargement-fichiers/all'
}
