export const TABLE_SIM_DEMAND = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'transaction', header: 'N° Transaction', class: "text-center", width: "12rem" },
        { field: 'imsi', header: 'IMSI', class: "text-center" },
        { field: 'msisdn', header: 'MSISDN', class: "text-center" },

        { field: 'statut', header: 'Etape', class: "text-center" },
        { field: 'traitement', header: 'Etat', class: "text-center" },
        { field: 'updated_at', header: 'Date Etat', class: "text-center", width: "12rem" },
        { field: '', header: 'Actions', class: "text-center", width: "20rem" }
    ],
    globalFilterFields: ['created_at','transaction','imsi','msisdn','nb_demande_identifiees','statut','traitement', 'updated_at']
}