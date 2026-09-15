import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportCompliancesFacade } from '@pages/reporting/application/services/report-compliances.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report-compliances-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="report()"
            [titleKey]="'REPORTING.REPORT_COMPLIANCES.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REPORT_COMPLIANCES.LABEL'"
            [loadingDescription]="'REPORTING.REPORT_COMPLIANCES.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REPORT_COMPLIANCES.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportCompliancesPageComponent implements OnInit {
    private readonly facade = inject(ReportCompliancesFacade);
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
