import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardViewerComponent } from '@presentation/pages/reporting/presentation/ui/shared/components/dashboard-viewer/dashboard-viewer.component';
import { RequestFacade } from '../../../../../core/application/services/request.facade';

@Component({
    selector: 'app-requests-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        @if (requests(); as data) {
            <app-dashboard-viewer
                [grafanaLink]="data.grafanaLink"
                [titleKey]="'REPORTING.REQUESTS.TITLE'"
                [moduleKey]="'REPORTING.LABEL'"
                [subModuleKey]="'REPORTING.REQUESTS.LABEL'"
                [loadingDescription]="'REPORTING.REQUESTS.LOADING_DESCRIPTION'"
                [errorDescription]="'REPORTING.REQUESTS.ERROR_DESCRIPTION'"
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
export class RequestsPageComponent implements OnInit {
    private readonly facade = inject(RequestFacade);
    readonly requests = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$)

    ngOnInit(): void {
        this.facade.fetchRequests();
    }

    refreshDashboard() {
        this.facade.refresh();
    }
}
