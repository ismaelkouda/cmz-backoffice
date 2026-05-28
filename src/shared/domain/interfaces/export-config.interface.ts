// export-config.interface.ts
export interface ExportColumn {
    field: string;
    header: string;
    width?: number;
    transform?: (value: any, row: any) => string | number;
    alternateRowColor?: boolean; // pour activer la couleur alternée sur cette colonne
}

export interface ExportOptions {
    fileName: string;
    columns: ExportColumn[];
    data: any[];
    sheetName?: string;
    autoFilter?: boolean;
}

export interface ExcelStyle {
    font: { bold?: boolean; size?: number; color?: string };
    fill: { fgColor?: string; type?: string };
    alignment: { horizontal?: string; vertical?: string };
}
