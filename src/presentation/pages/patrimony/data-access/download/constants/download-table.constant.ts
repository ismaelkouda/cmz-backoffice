export const downloadTableConstant = {
    cols: [
        { field: '', header: '#', class: 'text-center', width: '2rem' },
        {
            field: 'created_at',
            header: 'Date fichier',
            class: 'text-center',
            width: '6rem',
        },
        { field: 'nom_fichier', header: 'Nom fichier CSV' },
        {
            field: 'taille_fichier',
            header: 'Taille fichier (Mo)',
            class: 'text-center',
            width: '10rem',
        },
        { field: '', header: 'Actions', class: 'text-center', width: '20rem' },
    ],
    globalFilterFields: ['created_at', 'nom_fichier', 'taille_fichier'],
};
