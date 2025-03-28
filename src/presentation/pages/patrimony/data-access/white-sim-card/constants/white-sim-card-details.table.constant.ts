export const whiteSimCardDetailsTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'imsi', header: 'IMSI', class: "text-center", width: "12rem" },
        { field: 'iccid', header: 'ICCID', class: "text-center", width: "12rem" },
        { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
    ],
    globalFilterFields: ['created_at','imsi','iccid','statut']
};
