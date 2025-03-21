export const claimsTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'N° Dossier', class: "text-center", width: "12rem" },
        { field: 'operation', header: 'Service', class: "text-center" },
        { field: 'code_rapport', header: 'Rapport', class: "text-center" },
        { field: 'message', header: 'Détails Rapport', class: "text-center" },
        { field: 'statut', header: 'Statut', class: "text-center" },
        { field: 'updated_at', header: 'Date Traitement', class: "text-center", width: "12rem" },
        { field: 'demandeur', header: 'Demandeur', class: "text-center", width: "15rem" },
        { field: 'intervenant', header: 'Intervenant', class: "text-center", width: "15rem" },
        { field: '', header: 'Actions', class: "text-center", width: "6rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','operation','code_rapport','message','statut','intervenant', 'updated_at','demandeur']
}
