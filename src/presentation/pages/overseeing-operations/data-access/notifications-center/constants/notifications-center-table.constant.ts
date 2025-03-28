export const notificationsCenterTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'reference', header: 'Reference', class: "text-center", width: "12rem" },
        { field: 'type', header: 'Type Notification', class: "text-center" },
        { field: 'description', header: 'Description', class: "text-center" },
        { field: '', header: 'Actions'}
    ],
    globalFilterFields: ['created_at','reference','type','description']
}
