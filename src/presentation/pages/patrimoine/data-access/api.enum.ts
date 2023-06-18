export const enum EndPointUrl {
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    UPDATE_PATRIMOINE = 'patrimoine-sim/sims/update',
    VERIFY_PATRIMOINE = 'patrimoine-sim/sims/verifier',
    CHANGE_STATUT = 'patrimoine-sim/transactions/demande_changement_statut',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data',


    //Transactions
    GET_ALL_TRANSACTIONS = 'patrimoine-sim/transactions/all?page={page}'

}
