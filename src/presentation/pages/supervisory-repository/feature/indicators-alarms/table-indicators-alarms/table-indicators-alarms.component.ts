import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { indicatorsAlarmsInterface } from '../../../data-access/indicators-alarms/interfaces/indicators-alarms.interface';
import { indicatorsAlarmsTableConstant } from '../../../data-access/indicators-alarms/constants/indicators-alarms-table.constant';
import { Observable, take } from 'rxjs';
import { IndicatorsAlarmsApiService } from '../../../data-access/indicators-alarms/services/indicators-alarms-api.service';

@Component({
    selector: 'app-table-indicators-alarms',
    templateUrl: './table-indicators-alarms.component.html',
})
export class TableIndicatorsAlarmsComponent {
    @Input() listIndicatorsAlarms$: Observable<
        Array<indicatorsAlarmsInterface>
    >;
    indicatorsAlarmsSelected: indicatorsAlarmsInterface;

    public readonly table: TableConfig = indicatorsAlarmsTableConstant;

    constructor(
        private tableExportExcelFileService: TableExportExcelFileService,
        private indicatorsAlarmsApiService: IndicatorsAlarmsApiService
    ) {}

    public onExportExcel(): void {
        this.listIndicatorsAlarms$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_indicators'
                );
            }
        });
    }

    public pageCallback() {
        this.indicatorsAlarmsApiService.fetchIndicatorsAlarms();
    }
}
