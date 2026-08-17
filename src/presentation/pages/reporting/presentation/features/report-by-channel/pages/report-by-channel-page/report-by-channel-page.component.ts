import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReportByChannelFacade } from '@pages/reporting/application/services/report-by-channel.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report-by-channel-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="report()?.grafanaLink"
            [titleKey]="'REPORTING.REPORT_BY_CHANNEL.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REPORT_BY_CHANNEL.LABEL'"
            [loadingDescription]="'REPORTING.REPORT_BY_CHANNEL.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REPORT_BY_CHANNEL.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportByChannelPageComponent implements OnInit {
    private readonly facade = inject(ReportByChannelFacade);
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
