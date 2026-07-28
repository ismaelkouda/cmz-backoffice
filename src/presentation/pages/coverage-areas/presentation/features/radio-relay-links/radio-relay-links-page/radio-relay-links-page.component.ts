import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import {
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { RADIO_RELAY_LINKS_TABS } from '@pages/coverage-areas/presentation/adapters/radio-relay-links/radio-relay-links-tabs.constants';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-radio-relay-links-page',
    templateUrl: './radio-relay-links-page.component.html',
    styleUrls: ['./radio-relay-links-page.component.scss'],
    standalone: true,
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TabsModule,
        TranslateModule,
        RouterModule,
        RouterOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioRelayLinksPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = RADIO_RELAY_LINKS_TABS;
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
