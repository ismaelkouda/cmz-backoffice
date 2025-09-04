export enum TreatmentRequestsServiceFormEndpointEnum {
    REQUESTS_SERVICE_DETAILS = 'supervision-operations/demandes-services/{numberDemand}/details',
    INVOICE_DETAILS = 'gestion-facture/factures/{numberDemand}/details',
    REQUESTS_SERVICE_MODIFY = 'demandes-services/{numberDemand}/update',
    REQUESTS_SERVICE_CLOSURE = 'demandes-services/{numberDemand}/cloturer',
    REQUESTS_SERVICE_ABANDON = 'demandes-services/{numberDemand}/abandonner',
}
