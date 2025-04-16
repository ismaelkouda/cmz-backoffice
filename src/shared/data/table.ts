export const TABLE_FACTURE = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "10rem" },
        { field: 'reference', header: 'Référence', class: "text-center", width: "10rem" },
        { field: 'operation', header: 'Désignation', class: "text-center", width: "10rem" },
        { field: 'qte', header: 'Quantité', class: "text-center", width: "4rem" },
        { field: 'prix_unitaire', header: 'Prix unitaire (Fcfa)', class: "text-center", width: "4rem" },
        { field: 'prix_ttc', header: 'Montant TTC (Fcfa)', class: "text-center", width: "4rem" },
        { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
        { field: 'updated_at', header: 'Date Etat', class: "text-center", width: "12rem" },
        { field: '', header: 'Actions', class: "text-center", width: "4rem" }
    ],
    globalFilterFields: ['created_at','reference','operation','qte','prix_unitaire','prix_ttc','statut','updated_at']
}