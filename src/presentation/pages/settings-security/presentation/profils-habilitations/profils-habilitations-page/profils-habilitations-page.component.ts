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
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

import { PROFILES_HABILITATIONS_TABS } from '@presentation/pages/settings-security/core/domain/constants/profils-habilitations/profils-habilitations-tabs.constants';

@Component({
    selector: 'app-profils-habilitations-page',
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './profils-habilitations-page.component.html',
    styleUrls: ['./profils-habilitations-page.component.scss'],
})
export class ProfilsHabilitationsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = PROFILES_HABILITATIONS_TABS;
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
                    replaceUrl: true,
                });
                matchingTab = historyTab;
            }
        }

        this.activeTab.set(matchingTab?.value ?? '0');
    }
}
