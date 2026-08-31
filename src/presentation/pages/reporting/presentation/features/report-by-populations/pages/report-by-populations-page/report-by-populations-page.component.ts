import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportByPopulationsFacade } from '@pages/reporting/application/services/report-by-populations.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report-by-populations-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="report()?.grafanaLink"
            [titleKey]="'REPORTING.REPORT_BY_POPULATIONS.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REPORT_BY_POPULATIONS.LABEL'"
            [loadingDescription]="'REPORTING.REPORT_BY_POPULATIONS.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REPORT_BY_POPULATIONS.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportByPopulationsPageComponent implements OnInit {
    private readonly facade = inject(ReportByPopulationsFacade);
    readonly report = this.facade.items;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
