export interface TableConfig {
    cols: TableColumn[];
    globalFilterFields: string[];
}

interface TableColumn {
    field: string;
    header: string;
    class?: string;
    width?: string;
    type?: string;
}
