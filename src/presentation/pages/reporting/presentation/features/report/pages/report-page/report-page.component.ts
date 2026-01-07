import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ReportFacade } from '../../../../../core/application/services/report.facade';
import { DashboardViewerComponent } from '../../../../ui/shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-report-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        @if (report(); as data) {
            <app-dashboard-viewer
                [grafanaLink]="data.grafanaLink"
                [titleKey]="'REPORTING.REPORT.TITLE'"
                [moduleKey]="'REPORTING.LABEL'"
                [subModuleKey]="'REPORTING.REPORT.LABEL'"
                [loadingDescription]="'REPORTING.REPORT.LOADING_DESCRIPTION'"
                [errorDescription]="'REPORTING.REPORT.ERROR_DESCRIPTION'"
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
export class ReportPageComponent implements OnInit {
    private readonly facade = inject(ReportFacade);
    readonly report = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$)

    ngOnInit(): void {
        this.facade.fetchReport();
    }

    refreshDashboard() {
        this.facade.refresh();
    }
}
