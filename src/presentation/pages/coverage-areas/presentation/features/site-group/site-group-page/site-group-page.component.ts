import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SITE_GROUP_TABS } from '@pages/coverage-areas/presentation/adapters/site-group/site-group-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-site-group-page',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    templateUrl: './site-group-page.component.html',
    styleUrls: ['./site-group-page.component.scss'],
})
export class SiteGroupPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = SITE_GROUP_TABS;
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
        const currentPath = this.router.url.split('?')[0];
        this.activeTab.set(currentPath);
    }
}
