import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: "root",
})
export class TableExportExcelFileService {
  /**
   * Exports data as an Excel file.
   * @param json Array of data objects to export.
   * @param table Table configuration containing columns and filter fields.
   * @param excelFileName Name of the Excel file to be generated.
   */
  public exportAsExcelFile(json: any[], table: TableConfig, excelFileName: string): void {
    if (!json || !Array.isArray(json) || json.length === 0) {
      console.warn("No data to export.");
      return;
    }

    if (!table || !table.cols || !Array.isArray(table.cols)) {
      console.error("Invalid table configuration provided.");
      return;
    }

    const processedData = this.processDataForExport(json, table);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Processes raw data into a format suitable for Excel export.
   * @param data Array of data objects to process.
   * @param table Table configuration containing columns and filter fields.
   * @returns Processed data array.
   */
  private processDataForExport(data: any[], table: TableConfig): any[] {
    return data.map((item: any) => {
      const exportedRow: Record<string, any> = {};

      table.cols.forEach((col) => {
        if (col.field && table.globalFilterFields.includes(col.field)) {
          // Handle nested fields (e.g., 'demandeur.nom')
          const fieldParts = col.field.split(".");
          let value = item;

          for (const part of fieldParts) {
            value = value ? value[part] : "";
          }

          // Use column header as the key in the exported row
          exportedRow[col.header] = value;
        }
      });

      return exportedRow;
    });
  }

  /**
   * Saves the generated Excel buffer as a file.
   * @param buffer The Excel buffer to save.
   * @param fileName Name of the file to save.
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }
}
export interface TableConfig {
  cols: TableColumn[];
  globalFilterFields: string[];
}
interface TableColumn {
  field: string;
  header: string;
  class?: string;
  width?: string;
}
