export const enum EndPointUrl {
    GET_ALL_TRANSACTIONS = 'supervision-operations/traitements-suivis/all?page={page}',
    GET_DETAIL_TRANSACTION = 'gestion-transactions/details-transaction',
    GET_ALL_PRISE_EN_CHARGE = 'supervision-operations/prise-en-charge/all?page={page}',
    GET_ALL_DEMANDES = 'supervision-operations/file-attentes/all?page={page}',
    GET_ALL_CONTENCIEUX = 'supervision-operations/contentieux/all?page={page}',
    UPDATE_TRANSACTION = 'supervision-operations/traitements-suivis/modifier-transaction',
    CANCEL_TRANSACTION = 'supervision-operations/traitements-suivis/abandonner-transaction',
    CLOSE_TRANSACTION = 'supervision-operations/traitements-suivis/cloturer-transaction',
    GET_ALL_SLA = 'supervision-operations/engagement-sla/all',
    GET_ALL_NOTIFICATIONS = 'supervision-operations/centre-notifications/all',
    READ_NOTIFICATION = 'supervision-operations/centre-notifications/read',
    SAVE_MESSAGE = 'messagerie/boite-envoi/envoyer',
    GET_ALL_MESSAGE_SENDER = 'messagerie/boite-envoi/all?page={page}',
    DETAIL_MESSAGE_SENDER = 'messagerie/boite-envoi/details',
    GET_ALL_MESSAGE_RECIEVE = 'messagerie/boite-reception/all?page={page}',
    DOWNLOAD_MESSAGE = 'messagerie/boite-reception/telecharger',
}

