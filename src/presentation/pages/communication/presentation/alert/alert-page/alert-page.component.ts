import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AlertFacade } from '@pages/communication/application/services/alert.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-alert-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="dashboard()"
            [titleKey]="'COMMUNICATION.ALERT.TITLE'"
            [moduleKey]="'COMMUNICATION.LABEL'"
            [subModuleKey]="'COMMUNICATION.ALERT.LABEL'"
            [loadingDescription]="'COMMUNICATION.ALERT.LOADING_DESCRIPTION'"
            [errorDescription]="'COMMUNICATION.ALERT.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPageComponent implements OnInit {
    private readonly facade = inject(AlertFacade);

    readonly dashboard = this.facade.url;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
