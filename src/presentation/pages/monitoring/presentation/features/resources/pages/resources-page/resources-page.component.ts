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

import { ResourcesFacade } from '@presentation/pages/monitoring/application/services/resources.facade';

@Component({
    selector: 'app-resources-page',
    standalone: true,
    imports: [CommonModule, TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="data()?.grafanaLink"
            [titleKey]="'MONITORING.RESOURCES.TITLE'"
            [moduleKey]="'MONITORING.LABEL'"
            [subModuleKey]="'MONITORING.RESOURCES.LABEL'"
            [loadingDescription]="'MONITORING.RESOURCES.LOADING_DESCRIPTION'"
            [errorDescription]="'MONITORING.RESOURCES.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [isLoading]="isLoading() ?? false"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPageComponent implements OnInit {
    private readonly facade = inject(ResourcesFacade);
    readonly data = toSignal(this.facade.items$);
    readonly isLoading = toSignal(this.facade.isLoading$);

    ngOnInit(): void {
        this.facade.fetchResources();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
