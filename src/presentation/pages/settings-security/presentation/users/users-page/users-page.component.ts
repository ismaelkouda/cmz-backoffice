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
import { USERS_TABS } from '@presentation/pages/settings-security/presentation/adapters/users/users-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-users-page',
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
    templateUrl: './users-page.component.html',
    styleUrls: ['./users-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = USERS_TABS;
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
