import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportByEquipmentsFacade } from '@pages/reporting/application/services/report-by-equipments.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report-by-equipments-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="report()"
            [titleKey]="'REPORTING.REPORT_BY_EQUIPMENTS.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REPORT_BY_EQUIPMENTS.LABEL'"
            [loadingDescription]="'REPORTING.REPORT_BY_EQUIPMENTS.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REPORT_BY_EQUIPMENTS.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportByEquipmentsPageComponent implements OnInit {
    private readonly facade = inject(ReportByEquipmentsFacade);
    readonly report = this.facade.url;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
