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
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

import { PARTICIPANTS_TABS } from '@presentation/pages/team-organization/domain/constants/participants/participants-tabs.constants';

@Component({
    selector: 'app-participants-page',
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
    templateUrl: './participants-page.component.html',
    styleUrls: ['./participants-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = PARTICIPANTS_TABS;
    public readonly activeTab = signal<string>('0');

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
                    replaceUrl: true,
                });
                matchingTab = historyTab;
            }
        }

        this.activeTab.set(matchingTab?.value ?? '0');
    }
}
