import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

import { NodeFacade } from '@presentation/pages/monitoring/application/services/node.facade';

@Component({
    selector: 'app-node-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        @if (node(); as data) {
            <app-dashboard-viewer
                [grafanaLink]="data.grafanaLink"
                [titleKey]="'MONITORING.NODE.TITLE'"
                [moduleKey]="'MONITORING.LABEL'"
                [subModuleKey]="'MONITORING.NODE.LABEL'"
                [loadingDescription]="'MONITORING.NODE.LOADING_DESCRIPTION'"
                [errorDescription]="'MONITORING.NODE.ERROR_DESCRIPTION'"
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
export class NodePageComponent implements OnInit {
    private readonly facade = inject(NodeFacade);
    readonly node = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$);

    ngOnInit(): void {
        this.facade.fetchNode();
    }

    refreshDashboard() {
        this.facade.refresh();
    }
}
