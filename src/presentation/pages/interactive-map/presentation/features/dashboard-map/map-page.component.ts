import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MapFacade } from '@pages/interactive-map/application/services/map.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-map-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="data()?.grafanaLink"
            [titleKey]="'INTERACTIVE_MAP.DASHBOARD.TITLE'"
            [moduleKey]="'INTERACTIVE_MAP.LABEL'"
            [subModuleKey]="'INTERACTIVE_MAP.DASHBOARD.LABEL'"
            [loadingDescription]="'INTERACTIVE_MAP.DASHBOARD.LOADING_DESCRIPTION'"
            [errorDescription]="'INTERACTIVE_MAP.DASHBOARD.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements OnInit {
    private readonly facade = inject(MapFacade);
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
