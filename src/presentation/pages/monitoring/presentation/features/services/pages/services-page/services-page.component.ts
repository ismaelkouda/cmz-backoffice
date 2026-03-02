import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardViewerComponent } from '@presentation/pages/reporting/presentation/ui/shared/components/dashboard-viewer/dashboard-viewer.component';

import { ServicesFacade } from '../../../../../application/services/services.facade';

@Component({
    selector: 'app-services-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        @if (services(); as data) {
            <app-dashboard-viewer
                [grafanaLink]="data.grafanaLink"
                [titleKey]="'MONITORING.SERVICES.TITLE'"
                [moduleKey]="'MONITORING.LABEL'"
                [subModuleKey]="'MONITORING.SERVICES.LABEL'"
                [loadingDescription]="'MONITORING.SERVICES.LOADING_DESCRIPTION'"
                [errorDescription]="'MONITORING.SERVICES.ERROR_DESCRIPTION'"
                (refresh)="refreshDashboard()"
                [isLoading]="isLoading() ?? false"
            >
            </app-dashboard-viewer>
        } @else {
            <div class="d-flex justify-content-center align-items-center h-100">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesPageComponent implements OnInit {
    private readonly facade = inject(ServicesFacade);
    readonly services = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$);

    ngOnInit(): void {
        this.facade.fetchServices();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
