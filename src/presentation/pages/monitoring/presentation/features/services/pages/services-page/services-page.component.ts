import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesFacade } from '@pages/monitoring/application/services/services.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-services-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="data()?.grafanaLink"
            [titleKey]="'MONITORING.SERVICES.TITLE'"
            [moduleKey]="'MONITORING.LABEL'"
            [subModuleKey]="'MONITORING.SERVICES.LABEL'"
            [loadingDescription]="'MONITORING.SERVICES.LOADING_DESCRIPTION'"
            [errorDescription]="'MONITORING.SERVICES.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [isLoading]="isLoading() ?? false"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
    private readonly facade = inject(ServicesFacade);
    readonly data = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$);

    ngOnInit(): void {
        this.facade.fetchServices();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
