export const notificationsCenterTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'Reference', class: "text-center", width: "12rem" },
        { field: 'notification', header: 'Type Notification', class: "text-center" },
        { field: 'description', header: 'Description', class: "text-center" },
        { field: '', header: 'Actions', class: "text-center", width: "6rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','notification','description']
}
