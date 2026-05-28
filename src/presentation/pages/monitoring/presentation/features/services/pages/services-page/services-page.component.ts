import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesFacade } from '@pages/monitoring/application/services/services.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-services-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="data()?.grafanaLink"
            [titleKey]="'MONITORING.SERVICES.TITLE'"
            [moduleKey]="'MONITORING.LABEL'"
            [subModuleKey]="'MONITORING.SERVICES.LABEL'"
            [loadingDescription]="'MONITORING.SERVICES.LOADING_DESCRIPTION'"
            [errorDescription]="'MONITORING.SERVICES.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
    private readonly facade = inject(ServicesFacade);
    readonly data = this.facade.items;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
