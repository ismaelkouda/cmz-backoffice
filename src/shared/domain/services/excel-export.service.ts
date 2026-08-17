import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { ExportOptions } from '../interfaces/export-config.interface';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
    async exportToExcel(options: ExportOptions): Promise<void> {
        const {
            fileName,
            columns,
            data,
            sheetName = 'Export',
            autoFilter = true,
        } = options;

        if (!data?.length || !columns?.length) {
            console.warn('Aucune donnée à exporter');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        // 1. Définir les colonnes avec largeur
        worksheet.columns = columns.map((col) => ({
            header: col.header,
            key: col.field,
            width: col.width ?? 15,
        }));

        // 2. Style de l'en-tête (ligne 1)
        const headerRow = worksheet.getRow(1);
        headerRow.height = 24;
        headerRow.eachCell((cell) => {
            cell.font = {
                name: 'Segoe UI',
                size: 11,
                bold: true,
                color: { argb: 'FFFFFFFF' },
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F4E79' }, // Bleu foncé professionnel
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
                left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
                bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
                right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
            };
        });

        // 3. Remplir les données
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const rowData: Record<string, any> = {};

            for (const col of columns) {
                let value = this.getNestedValue(item, col.field);
                if (col.transform) {
                    value = col.transform(value, item);
                }
                rowData[col.field] = value ?? '';
            }

            const row = worksheet.addRow(rowData);
            row.height = 18;

            // Style des cellules de données
            row.eachCell((cell, colNumber) => {
                const colDef = columns[colNumber - 1];
                const isNumeric = typeof cell.value === 'number';

                cell.font = {
                    name: 'Segoe UI',
                    size: 10,
                    color: { argb: 'FF000000' },
                };
                cell.alignment = {
                    horizontal: isNumeric ? 'right' : 'left',
                    vertical: 'middle',
                };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFDFDFDF' } },
                    left: { style: 'thin', color: { argb: 'FFDFDFDF' } },
                    bottom: { style: 'thin', color: { argb: 'FFDFDFDF' } },
                    right: { style: 'thin', color: { argb: 'FFDFDFDF' } },
                };

                // Zébrures optionnelles (si vous voulez alternance de couleurs)
                if (i % 2 === 1 && colDef?.alternateRowColor) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF9F9F9' }, // Gris très clair
                    };
                }
            });
        }

        // 4. Appliquer un filtre automatique sur les en-têtes
        if (autoFilter && data.length > 0) {
            worksheet.autoFilter = {
                from: { row: 1, column: 1 },
                to: { row: 1, column: columns.length },
            };
        }

        // 5. Figer la première ligne (en-tête)
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // 6. Générer et télécharger
        const buffer = await workbook.xlsx.writeBuffer();
        this.downloadBlob(buffer, `${fileName}_${Date.now()}.xlsx`);
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }

    private downloadBlob(buffer: ArrayBuffer, filename: string): void {
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
}
