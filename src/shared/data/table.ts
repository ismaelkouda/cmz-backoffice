export const TABLE_FACTURE = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'operation', header: 'Type Opération', class: "text-center", width: "16rem" },
        { field: 'numero_demande', header: 'N° Dossier', class: "text-center", width: "12rem" },
        { field: 'type_operation', header: 'Type d\'opertion', class: "text-center", width: "10rem" },
        { field: 'etat_facture', header: 'Etat', class: "text-center", width: "4rem" },
        { field: 'date_etat', header: 'Date Etat', class: "text-center", width: "12rem" },
        { field: 'demandeur', header: 'Demandeur', class: "text-center" },
        { field: '', header: 'Actions', class: "td-actions" }
    ],
    globalFilterFields: ['created_at','operation','numero_demande','type_operation','etat_facture','date_etat', 'demandeur']
}