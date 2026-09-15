import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TeamCompliancesFacade } from '@pages/reporting/application/services/team-compliances.facade';
import { DashboardViewerComponent } from '@shared/components/dashboard-viewer/dashboard-viewer.component';

@Component({
    selector: 'app-team-compliances-page',
    standalone: true,
    imports: [TranslateModule, DashboardViewerComponent],
    template: `
        <app-dashboard-viewer
            [grafanaLink]="report()"
            [titleKey]="'REPORTING.TEAM_COMPLIANCES.TITLE'"
            [moduleKey]="'REPORTING.LABEL'"
            [subModuleKey]="'REPORTING.TEAM_COMPLIANCES.LABEL'"
            [loadingDescription]="'REPORTING.TEAM_COMPLIANCES.LOADING_DESCRIPTION'"
            [errorDescription]="'REPORTING.TEAM_COMPLIANCES.ERROR_DESCRIPTION'"
            (refresh)="refreshDashboard()"
            [loading]="loading()"
            [error]="error()"
        >
        </app-dashboard-viewer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCompliancesPageComponent implements OnInit {
    private readonly facade = inject(TeamCompliancesFacade);
    readonly report = this.facade.url;
    readonly loading = this.facade.loading;
    readonly error = this.facade.error;

    ngOnInit(): void {
        this.facade.execute();
    }

    refreshDashboard(): void {
        this.facade.refresh();
    }
}
