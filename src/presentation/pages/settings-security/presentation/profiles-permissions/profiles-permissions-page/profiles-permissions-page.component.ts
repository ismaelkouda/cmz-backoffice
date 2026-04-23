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
import { PROFILES_PERMISSIONS_TABS } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-tabs.constants';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';

@Component({
    selector: 'app-profiles-permissions-page',
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
    templateUrl: './profiles-permissions-page.component.html',
    styleUrls: ['./profiles-permissions-page.component.scss'],
})
export class ProfilesPermissionsPageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    public readonly tabs = PROFILES_PERMISSIONS_TABS;
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
        const currentPath = this.router.url.split('?')[0];
        this.activeTab.set(currentPath);
    }
}
