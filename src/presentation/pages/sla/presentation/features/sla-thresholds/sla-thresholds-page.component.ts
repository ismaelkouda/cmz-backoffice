import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { SLA_THRESHOLDS_TABS } from '@pages/sla/presentation/adapters/sla/sla-thresholds-tabs.constants';

@Component({
    selector: 'app-sla-thresholds-page',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    templateUrl: './sla-thresholds-page.component.html',
    styleUrls: ['./sla-thresholds-page.component.scss'],
})
export class SlaThresholdsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    readonly tabs = SLA_THRESHOLDS_TABS;
    readonly activeTab = signal('0');

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
        const tab = this.tabs.find((item) => currentPath === item.route);
        this.activeTab.set(tab?.value ?? '0');
    }
}
