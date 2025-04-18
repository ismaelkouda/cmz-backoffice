interface Column {
    type: string;
    field?: string;
    header: string;
}

export const cols: Array<Column> = [
    { type: 'text', field: 'name', header: 'Name' },
    { type: 'text', field: 'category', header: 'Category' },
    { type: 'text', field: 'apn', header: 'APN' },
    { type: 'text', field: 'adresse_ip', header: 'Adresse IP' },
    { type: 'text', field: 'quantity', header: 'Quantity' },
    { type: 'text', field: 'point_emplacement', header: 'Emplacement' },
    { type: 'text', field: 'msisdn', header: 'MSISDN' },
    { type: 'text', field: 'imsi', header: 'IMSI' },
    { type: 'text', field: 'statut', header: 'Statut' },
];
