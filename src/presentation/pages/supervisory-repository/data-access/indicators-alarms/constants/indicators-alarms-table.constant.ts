export const indicatorsAlarmsTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'classification', header: 'Services', class: "text-center", width: "12rem" },
        { field: 'description', header: 'Description mésure', class: "text-center" },
        { field: 'type_mesure', header: 'Type de mésure', class: "text-center" },
        { field: 'unite', header: 'Unité', class: "text-center" },
    ],
    globalFilterFields: ['created_at','classification','description','type_mesure','unite']
}
