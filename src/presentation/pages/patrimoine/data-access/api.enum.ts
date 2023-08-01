export const enum EndPointUrl {
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    GET_ALL_CYCLES = 'patrimoine-sim/cycle-de-vie/all?page={page}',
    GET_ALL_USAGES = 'patrimoine-sim/sims/all_usage',
    UPDATE_PATRIMOINE = 'patrimoine-sim/sims/update',
    VERIFY_PATRIMOINE = 'patrimoine-sim/sims/verifier',
    ACTIVATION_SIM = 'patrimoine-sim/transactions/demande_activation',
    CHANGE_STATUT = 'patrimoine-sim/transactions/demande_changement_statut',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data',

    //TRANSACTION
    GET_ALL_TRANSACTIONS = 'patrimoine-sim/transactions/all?page={page}',
    GET_ALL_DEPARTEMENT = 'analyse-alerte/departements/all',
    GET_ALL_COMMUNE = 'analyse-alerte/communes/all',

    //GROUPE
    GET_ALL_GROUPE = 'patrimoine-sim/groupe-sims/all?page={page}',
    SAVE_GROUPE = 'patrimoine-sim/groupe-sims/store',
    UPDATE_GROUPE = 'patrimoine-sim/groupe-sims/update',
    GET_ALL_SIM_NO_GROUPE = 'patrimoine-sim/groupe-sims/sims?page={page}',
    GET_ALL_SIM_AT_GROUPE = 'patrimoine-sim/groupe-sims/visualiser-sims?page={page}',
    SAVE_AFFECTATION = 'patrimoine-sim/groupe-sims/affectation',
    SAVE_REAFFECTATION = 'patrimoine-sim/groupe-sims/reaffectation',
    RETRAIT_SIM = 'patrimoine-sim/groupe-sims/retrait',
    ACTIVATE_GROUPE = 'patrimoine-sim/groupe-sims/{id}/activer',
    DISABLE_GROUPE = 'patrimoine-sim/groupe-sims/{id}/desactiver',
}