import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardViewerComponent } from '../dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-requests',
    standalone: true,
    template: `
        <app-dashboard-viewer
            [dashboardUrl]="GRAFANA_URL"
            [titleKey]="'REPORTING.REQUESTS.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.REQUESTS.LABEL'"
            [loadingDescription]="'REPORTING.REQUESTS.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.REQUESTS.ERROR_DESCRIPTION'"
        >
        </app-dashboard-viewer>
    `,
    imports: [DashboardViewerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsComponent {
    public readonly GRAFANA_URL =
        'https://dashboard.mazone.imako.digital/d/af56gptbfjv9cf/tb-signalements-qualifications-des-demandes?orgId=1&refresh=10s';
}
