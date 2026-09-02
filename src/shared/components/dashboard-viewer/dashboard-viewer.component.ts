import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SafeUrlPipe } from '@shared/domain/pipes/safe-url.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard-viewer',
    standalone: true,
    templateUrl: './dashboard-viewer.component.html',
    styleUrls: ['./dashboard-viewer.component.scss'],
    imports: [
        BreadcrumbComponent,
        PageTitleComponent,
        TranslateModule,
        ButtonModule,
        ProgressSpinnerModule,
        TooltipModule,
        SafeUrlPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardViewerComponent implements OnInit {
    public readonly grafanaLink = input.required<string>();
    public readonly titleKey = input.required<string>();
    public readonly moduleKey = input.required<string>();
    public readonly subModuleKey = input.required<string>();
    public readonly loadingDescription = input.required<string>();
    public readonly errorDescription = input.required<string>();
    public readonly refresh = output<undefined>();
    public readonly loading = input.required<boolean>();
    public readonly error = input.required<string>();

    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);

    public readonly lastUpdated = signal<Date | null>(null);
    public readonly isFullscreen = signal<boolean>(false);

    private readonly destroy$ = new Subject<void>();
    private readonly grafanaIframe =
        viewChild<HTMLIFrameElement>('grafanaIframe');

    ngOnInit(): void {
        this.updatePageTitle();
    }

    private updatePageTitle(): void {
        this.translate
            .get(this.titleKey())
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                this.title.setTitle(res);
            });
    }

    public toggleFullscreen(): void {
        const newFullscreenState = !this.isFullscreen();
        this.isFullscreen.set(newFullscreenState);

        if (newFullscreenState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    public handleRefreshDashboard(): void {
        this.refresh.emit(undefined);
    }
}
