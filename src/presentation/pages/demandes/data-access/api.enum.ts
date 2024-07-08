export const enum EndPointUrl {
    DEMANDE_SERVICE_ALL = 'patrimoine-sim/demandes-services/all',
    CHANGE_STATUT = 'patrimoine-sim/transactions/sur-sim',
    MODIFICATION_DEMANDE = 'supervision-operations/traitements-suivis/modifier-demande-service',
    SWAPER_SIM = 'patrimoine-sim/transactions/demande_swap',
    GET_ALL_PATRIMOINES = 'patrimoine-sim/sims/all?page={page}',
    VOLUME_DATA = 'patrimoine-sim/transactions/demande_volume_data'
}
