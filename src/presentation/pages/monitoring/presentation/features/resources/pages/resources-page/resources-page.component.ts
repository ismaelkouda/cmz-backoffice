import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResourcesFacade } from '@pages/monitoring/application/services/resources.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

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
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourcesPageComponent implements OnInit {
    private readonly facade = inject(ResourcesFacade);
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
