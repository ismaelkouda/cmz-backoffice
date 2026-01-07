import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
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
import { SafeUrlPipe } from '@shared/utils/safe-url.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil, timer } from 'rxjs';

type ConnectionStatus = 'connected' | 'loading' | 'error';

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
export class DashboardViewerComponent implements OnInit, OnDestroy {
    public readonly grafanaLink = input.required<string>();
    public readonly titleKey = input<string>('REPORTING.REPORT.TITLE');
    public readonly moduleKey = input<string>('REPORTING.LABEL');
    public readonly subModuleKey = input<string>('REPORTING.REPORT.LABEL');
    public readonly loadingDescription = input<string>(
        'REPORTING.REPORT.LOADING_DESCRIPTION'
    );
    public readonly errorDescription = input<string>(
        'REPORTING.REPORT.ERROR_DESCRIPTION'
    );
    public readonly refresh = output<void>();
    public readonly isLoading = input<boolean>();

    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);

    public readonly connectionStatus = signal<ConnectionStatus>('loading');
    public readonly lastUpdated = signal<Date | null>(null);
    public readonly isFullscreen = signal<boolean>(false);

    private readonly destroy$ = new Subject<void>();
    private readonly grafanaIframe =
        viewChild<HTMLIFrameElement>('grafanaIframe');

    private readonly REFRESH_INTERVAL = 300000;
    private readonly LOAD_TIMEOUT = 30000;
    private loadTimeoutId?: number;

    public readonly statusIcon = computed(() => {
        const status = this.connectionStatus();
        switch (status) {
            case 'connected':
                return 'pi pi-check-circle';
            case 'loading':
                return 'pi pi-spinner pi-spin';
            case 'error':
                return 'pi pi-exclamation-triangle';
            default:
                return 'pi pi-circle';
        }
    });

    public readonly formattedLastUpdated = computed(() => {
        const lastUpdated = this.lastUpdated();
        if (!lastUpdated) return '';

        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(lastUpdated);
    });

    ngOnInit(): void {
        this.updatePageTitle();
        this.setupAutoRefresh();
    }

    private updatePageTitle(): void {
        this.translate
            .get(this.titleKey())
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
                this.title.setTitle(res);
            });
    }

    private setupAutoRefresh(): void {
        timer(0, this.REFRESH_INTERVAL)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshReporting();
            });
    }

    public onIframeLoad(): void {
        if (this.loadTimeoutId) {
            clearTimeout(this.loadTimeoutId);
        }

        setTimeout(() => {
            this.connectionStatus.set('connected');
            this.lastUpdated.set(new Date());
        }, 2000);
    }

    public onIframeError(): void {
        console.error('Error loading Grafana iframe');

        if (this.loadTimeoutId) {
            clearTimeout(this.loadTimeoutId);
        }

        this.connectionStatus.set('error');
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

    public refreshReporting(): void {
        this.connectionStatus.set('loading');

        this.loadTimeoutId = window.setTimeout(() => {
            if (this.isLoading()) {
                this.connectionStatus.set('error');
            }
        }, this.LOAD_TIMEOUT);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        document.body.style.overflow = 'auto';

        if (this.loadTimeoutId) {
            clearTimeout(this.loadTimeoutId);
        }
    }

    public handleRefreshDashboard(): void {
        this.refresh.emit();
    }

    private performSmartRefresh(): void {
        const iframe = this.grafanaIframe();

        if (iframe && iframe.contentWindow) {
            try {
                if (this.isGrafanaLoaded(iframe)) {
                    this.reloadGrafanaDashboard(iframe);
                } else {
                    this.reloadIframe(iframe);
                }
            } catch (error) {
                console.error(
                    '❌ Smart refresh failed, using fallback:',
                    error
                );
                this.forceIframeReload(iframe);
            }
        } else {
            this.connectionStatus.set('connected');
        }
    }

    private isGrafanaLoaded(iframe: HTMLIFrameElement): boolean {
        try {
            return (
                !!iframe.contentWindow &&
                !!iframe.contentWindow.location &&
                iframe.src.includes('grafana')
            );
        } catch {
            return false;
        }
    }

    private reloadGrafanaDashboard(iframe: HTMLIFrameElement): void {
        try {
            iframe.contentWindow?.postMessage({ action: 'refresh' }, '*');
        } catch (error) {
            this.reloadIframe(iframe);
        }
    }

    private reloadIframe(iframe: HTMLIFrameElement): void {
        const originalSrc = iframe.src;
        const timestamp = new Date().getTime();
        const separator = originalSrc.includes('?') ? '&' : '?';

        iframe.src = originalSrc + separator + `_t=${timestamp}`;
    }

    private forceIframeReload(iframe: HTMLIFrameElement): void {
        const originalSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
            iframe.src = originalSrc;
        }, 100);
    }

    private handleRefreshTimeout(): void {
        this.connectionStatus.set('error');
    }
}
