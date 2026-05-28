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
import { REGIONS_TABS } from '@pages/administrative-boundary/domain/constants/regions/regions-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-regions-page',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    templateUrl: './regions-page.component.html',
    styleUrls: ['./regions-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly tabs = REGIONS_TABS;
    protected readonly activeTab = signal<string>('0');

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
