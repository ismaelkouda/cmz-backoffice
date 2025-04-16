export const historyTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'createdAt', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'typeAction', header: 'Operation', class: "text-center", width: "12rem" },
        { field: 'action', header: 'Détails Operation' },
        { field: 'source', header: 'Source [Utilisateur]' },
        { field: '', header: 'Actions', class: "text-center", width: "5rem" }
    ],
    globalFilterFields: ['createdAt','typeAction','action','source']
}
