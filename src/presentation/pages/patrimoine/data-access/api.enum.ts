export const enum EndPointUrl {
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    GET_ALL_CYCLES = 'patrimoine-sim/sims/cycle-de-vie?page={page}',
    GET_ALL_USAGES = 'patrimoine-sim/sims/all_usage',
    UPDATE_PATRIMOINE = 'patrimoine-sim/sims/update',
    VERIFY_PATRIMOINE = 'patrimoine-sim/sims/verifier',
    ACTIVATION_SIM = 'patrimoine-sim/transactions/demande_activation',
    CHANGE_STATUT = 'patrimoine-sim/transactions/demande_changement_statut',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data',
    //Transactions
    GET_ALL_TRANSACTIONS = 'patrimoine-sim/transactions/all?page={page}'

}
