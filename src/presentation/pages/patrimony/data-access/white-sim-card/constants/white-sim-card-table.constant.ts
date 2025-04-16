export const whiteSimCardTableConstant = {
    cols: [
        { field: '', header: '#', class: "text-center", width: "2rem" },
        { field: 'created_at', header: 'Date / Heure', class: "text-center", width: "12rem" },
        { field: 'numero_demande', header: 'Référence du lot', class: "text-center", width: "12rem" },
        { field: 'nb_numeros_total', header: '# SIM', class: "text-center", width: "10rem" },
        { field: 'nb_numeros_utilises', header: '# SIM Utilisées', class: "text-center", width: "10rem" },
        { field: 'nb_numeros_disponibles', header: '# SIM Disponibles', class: "text-center", width: "10rem" },
        { field: 'taux_utilisation', header: 'Taux d\'utilisation (%)', class: "text-center", width: "6rem" },
        { field: 'statut', header: 'Statut', class: "text-center", width: "4rem" },
        { field: '', header: 'Actions', class: "text-center", width: "10rem" }
    ],
    globalFilterFields: ['created_at','numero_demande','nb_numeros_total','nb_numeros_utilises','nb_numeros_disponibles','statut','taux_utilisation']
};
