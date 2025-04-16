export const TABLE_FORM_SIMPLE_DEMAND = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'numero_demande', header: 'Référence', class: "text-center", width: "12rem" },
        { field: 'nb_restants', header: 'SIM disponibles', class: "text-center" },
        { field: '', header: 'Actions', class: "text-center", width: "20rem" }
    ],
    globalFilterFields: ['numero_demande','nb_restants']
}

export const TABLE_FORM_MASS_DEMAND = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'numero_demande', header: 'Référence', class: "text-center", width: "12rem" },
        { field: 'nb_restants', header: 'SIM disponibles', class: "text-center" },
        { field: '', header: 'Sélection', class: "text-center" },
        { field: '', header: 'Actions', class: "text-center", width: "20rem" }
    ],
    globalFilterFields: ['numero_demande','nb_restants']
}