import { DESTRUCTION } from "dns";

export const enum EndPointUrl {
    POST_SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_ABANDONNER_DEMANDE_SERVICE = 'supervision-operations/traitements-suivis/abandonner-demande-service',
    GET_SUPERVISION_OPERATIONS_DEMANDES_SERVICES_numeroDemande_DETAILS = "supervision-operations/demandes-services/{numeroDemande}/details",
    POST_SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_IDENTIFICATIONS_SIMS = 'supervision-operations/traitements-suivis/identifications-sims',
    POST_SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_CLOTURER_DEMANDE_SERVICE = 'supervision-operations/traitements-suivis/cloturer-demande-service',
    POST_SUPERVISION_OPERATIONS_TRAITEMENTS_SUIVIS_TRANSACTIONS_PAGE = 'supervision-operations/traitements-suivis/transactions?page={page}',
    GET_ALL_TRANSACTIONS = 'supervision-operations/traitements-suivis/demandes-services?page={page}',
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
    UPDATE_MESSAGE = 'messagerie/boite-envoi/update',
    GET_ALL_MESSAGE_SENDER = 'messagerie/boite-envoi/all?page={page}',
    GET_ALL_MESSAGE_RECIEVE = 'messagerie/boite-reception/all?page={page}',
    DETAIL_MESSAGE_SENDER = 'messagerie/boite-envoi/details',
    DETAIL_MESSAGE_RECIEVE = 'messagerie/boite-reception/details',
    DOWNLOAD_MESSAGE = 'messagerie/boite-reception/telecharger',
}

