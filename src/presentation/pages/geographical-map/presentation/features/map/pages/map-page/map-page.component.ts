import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MapFacade } from '@pages/geographical-map/application/services/map.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-map-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="data()?.grafanaLink"
            [titleKey]="'GEOGRAPHICAL_MAP.MAP.TITLE'"
            [moduleKey]="'GEOGRAPHICAL_MAP.LABEL'"
            [subModuleKey]="'GEOGRAPHICAL_MAP.MAP.LABEL'"
            [loadingDescription]="'GEOGRAPHICAL_MAP.MAP.LOADING_DESCRIPTION'"
            [errorDescription]="'GEOGRAPHICAL_MAP.MAP.ERROR_DESCRIPTION'"
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
