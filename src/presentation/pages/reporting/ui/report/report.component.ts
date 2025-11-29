import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardViewerComponent } from '../dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report',
    standalone: true,
    template: `
        <app-dashboard-viewer
            [dashboardUrl]="GRAFANA_URL"
            [titleKey]="'REPORTING.REPORT.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REPORT.LABEL'"
            [loadingDescription]="'REPORTING.REPORT.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REPORT.ERROR_DESCRIPTION'"
        >
        </app-dashboard-viewer>
    `,
    imports: [DashboardViewerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {
    public readonly GRAFANA_URL =
        'https://dashboard.mazone.imako.digital/d/ef447w7mbmwaod/tb-manque-recouvrement-operateurs?orgId=1&kiosk';
}
