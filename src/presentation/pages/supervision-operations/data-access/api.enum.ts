export const enum EndPointUrl {
    GET_ALL_TRANSACTIONS = 'supervision-operations/traitements-suivis/all?page={page}',
    GET_DETAIL_TRANSACTION = 'gestion-transactions/details-transaction',
    GET_ALL_PRISE_EN_CHARGE = 'supervision-operations/prise-en-charge/all?page={page}',
    GET_ALL_DEMANDES = 'supervision-operations/file-attentes/all',
    UPDATE_TRANSACTION = 'supervision-operations/traitements-suivis/modifier-transaction',
    CANCEL_TRANSACTION = 'supervision-operations/traitements-suivis/abandonner-transaction',
    CLOSE_TRANSACTION = 'supervision-operations/traitements-suivis/cloturer-transaction'
}
