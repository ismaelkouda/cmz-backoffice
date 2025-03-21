export const whiteSimTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'N° Commande', class: "text-center", width: "12rem" },
        { field: 'nb_demande_soumises', header: '# Produits', class: "text-center" },
        { field: 'nb_demande_traitees', header: '# Traitées', class: "text-center" },
        // { field: 'nb_demande_identifiees', header: '# Identifiées', class: "text-center" },

        { field: 'statut', header: 'Etape', class: "text-center" },
        { field: 'traitement', header: 'Etat', class: "text-center" },
        { field: 'updated_at', header: 'Date Etat', class: "text-center", width: "12rem" },
        { field: 'demandeur', header: 'Demandeur', class: "text-center", width: "20rem" },
        { field: '', header: 'Actions', class: "text-center", width: "20rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','nb_demande_soumises','nb_demande_traitees','nb_demande_identifiees','statut','traitement', 'updated_at','demandeur']
}
