import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RequestsFacade } from '@pages/reporting/application/services/request.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

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
                [loading]="loading()"
                [error]="error()"
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
    private readonly facade = inject(RequestsFacade);
    readonly requests = this.facade.items;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
