import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    NavigationEnd,
    Router,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TEAMS_TABS } from '@presentation/pages/team-organization/presentation/adapters/teams/teams-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-teams-page',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterOutlet,
        RouterLinkActive,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './teams-page.component.html',
    styleUrls: ['./teams-page.component.scss'],
})
export class TeamsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = TEAMS_TABS;
    public readonly activeTab = signal('0');

    ngOnInit(): void {
        this.updateActiveTab();

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.updateActiveTab();
            });
    }

    private updateActiveTab(): void {
        const urlTree = this.router.parseUrl(this.router.url);
        const path =
            urlTree.root.children['primary']?.segments
                .map((s) => s.path)
                .join('/') || '';
        const queryParams = urlTree.queryParams;

        let matchingTab = this.tabs.find((tab) => {
            const tabPath = tab.route.split('/').filter(Boolean).join('/');
            if (tabPath !== path) {
                return false;
            }
            if (tab.queryParams) {
                return Object.entries(tab.queryParams).every(
                    ([k, v]) => queryParams[k] === v
                );
            }
            return true;
        });

        if (!matchingTab && path.endsWith('history')) {
            const historyTab = this.tabs.find((t) =>
                t.route.endsWith('history')
            );
            if (historyTab) {
                this.router.navigate([historyTab.route], {
                    queryParams: historyTab.queryParams,
                });
                matchingTab = historyTab;
            }
        }

        this.activeTab.set(matchingTab?.value ?? '0');
    }
}
