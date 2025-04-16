export const slaAgreementsTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'nom_service', header: 'Service', class: "text-center", width: "12rem" },
        { field: 'description', header: 'Description du service', class: "text-center" },
        { field: 'ack', header: 'Réception', class: "text-center" },
        { field: 'traitement', header: 'Traitement', class: "text-center" },
        { field: 'cloture', header: 'Clôture', class: "text-center" },
        { field: 'escalade', header: 'Escalade', class: "text-center" },
        { field: 'statut', header: 'Statut', class: "text-center" },
    ],
    globalFilterFields: ['created_at','nom_service','nom_service','description','ack','traitement','cloture','escalade','statut']
}
