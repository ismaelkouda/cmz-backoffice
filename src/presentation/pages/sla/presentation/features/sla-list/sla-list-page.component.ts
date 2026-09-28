import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
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
import { SLA_LIST_TABS } from './sla-list-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
    selector: 'app-sla-list-page',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    template: `
        <main class="container-fluid sla-list-container" role="main">
            <section class="row sla-list-row">
                <article class="col-sm-12 sla-list-article">
                    <app-breadcrumb />
                    <section class="card sla-list-card">
                        <div class="card-body sla-list-card-body">
                            <header class="sla-list-header">
                                <app-page-title
                                    class="page-title-component"
                                    [displayDate]="false"
                                    [title]="'SLA.SLA_LIST.TITLE' | translate"
                                />
                            </header>
                            <p-tabs lazy [value]="activeTab()">
                                <p-tablist>
                                    @for (tab of tabs; track tab.route) {
                                        <p-tab
                                            [value]="tab.route"
                                            [routerLink]="tab.route"
                                        >
                                            <i [class]="tab.icon"></i>
                                            <span>{{
                                                tab.label | translate
                                            }}</span>
                                        </p-tab>
                                    }
                                </p-tablist>
                            </p-tabs>
                            <router-outlet />
                        </div>
                    </section>
                </article>
            </section>
        </main>
    `,
    styles: [
        `
            .sla-list-header {
                margin-bottom: 1rem;
            }
            .sla-list-card {
                border-radius: 1rem;
                box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlaListPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    readonly tabs = SLA_LIST_TABS;
    readonly activeTab = signal('');

    ngOnInit(): void {
        this.updateActiveTab();
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.updateActiveTab());
    }

    private updateActiveTab(): void {
        const currentPath = this.router.url.split('?')[0];
        const active = this.tabs.find((tab) =>
            currentPath.endsWith(`/${tab.route}`)
        );
        this.activeTab.set(active?.route ?? '');
    }
}
