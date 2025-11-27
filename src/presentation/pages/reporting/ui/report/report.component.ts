import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
    viewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { SafeUrlPipe } from '@shared/utils/safe-url.pipe';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil, timer } from 'rxjs';
import { ReportingStateService } from '../../reporting-state.service';

@Component({
    selector: 'app-report',
    standalone: true,
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
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
export class ReportComponent implements OnInit, OnDestroy {
    // Injection de dépendances
    private readonly title = inject(Title);
    private readonly translate = inject(TranslateService);
    private readonly activatedRoute = inject(ActivatedRoute);
    public readonly dashboardState = inject(ReportingStateService);

    private readonly destroy$ = new Subject<void>();

    public readonly module = signal<string>('');
    public readonly subModule = signal<string>('');
    private readonly grafanaIframe =
        viewChild<HTMLIFrameElement>('grafanaIframe');

    private readonly GRAFANA_URL =
        'https://dashboard.mazone.imako.digital/d/ef447w7mbmwaod/tb-manque-recouvrement-operateurs?orgId=1&kiosk';
    private readonly REFRESH_INTERVAL = 300000;
    private readonly LOAD_TIMEOUT = 30000;
    private loadTimeoutId?: number;

    public readonly statusIcon = computed(() => {
        const status = this.dashboardState.connectionStatus();
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
        const lastUpdated = this.dashboardState.lastUpdated();
        if (!lastUpdated) return '';

        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(lastUpdated);
    });

    ngOnInit(): void {
        this.initializeRouteData();
        this.setupAutoRefresh();
    }

    private initializeRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(data['title'] ?? 'REPORTING.REPORT.TITLE');
                this.module.set(data['module'] ?? 'REPORTING.LABEL');
                this.subModule.set(
                    data['subModule'] ?? 'REPORTING.REPORT.LABEL'
                );
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
            this.dashboardState.setLoading(false);
            this.dashboardState.setError(false);
            this.dashboardState.updateConnectionStatus('connected');
            this.dashboardState.updateLastUpdated();
        }, 2000);
    }

    public onIframeError(): void {
        console.error('Error loading Grafana iframe');

        if (this.loadTimeoutId) {
            clearTimeout(this.loadTimeoutId);
        }

        this.dashboardState.setLoading(false);
        this.dashboardState.setError(true);
        this.dashboardState.updateConnectionStatus('error');
    }

    public toggleFullscreen(): void {
        const newFullscreenState = !this.dashboardState.isFullscreen();
        this.dashboardState.setFullscreen(newFullscreenState);

        if (newFullscreenState) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    public refreshReporting(): void {
        this.dashboardState.setLoading(true);
        this.dashboardState.updateConnectionStatus('loading');

        this.loadTimeoutId = window.setTimeout(() => {
            if (this.dashboardState.isLoading()) {
                this.dashboardState.setLoading(false);
                this.dashboardState.setError(true);
                this.dashboardState.updateConnectionStatus('error');
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

    // Méthode refreshDashboard complète
    public refreshDashboard(): void {
        // Empêcher les rafraîchissements multiples
        if (this.dashboardState.isLoading()) {
            return;
        }

        console.log('🔄 Manual dashboard refresh triggered');

        // Mettre à jour l'état
        this.dashboardState.setLoading(true);
        this.dashboardState.updateConnectionStatus('loading');

        // Nettoyer le timeout précédent
        if (this.loadTimeoutId) {
            clearTimeout(this.loadTimeoutId);
        }

        // Appliquer une stratégie de rechargement intelligent
        this.performSmartRefresh();

        // Timeout de sécurité
        this.loadTimeoutId = window.setTimeout(() => {
            if (this.dashboardState.isLoading()) {
                console.warn('⚠️ Dashboard refresh timeout');
                this.handleRefreshTimeout();
            }
        }, this.LOAD_TIMEOUT);
    }

    private performSmartRefresh(): void {
        const iframe = this.grafanaIframe();

        if (iframe && iframe.contentWindow) {
            try {
                // Stratégie 1: Tentative de rechargement via l'API Grafana
                if (this.isGrafanaLoaded(iframe)) {
                    this.reloadGrafanaDashboard(iframe);
                } else {
                    // Stratégie 2: Rechargement complet de l'iframe
                    this.reloadIframe(iframe);
                }
            } catch (error) {
                console.error(
                    '❌ Smart refresh failed, using fallback:',
                    error
                );
                // Stratégie 3: Fallback - rechargement forcé
                this.forceIframeReload(iframe);
            }
        } else {
            console.warn('📭 Iframe not available, using state reset');
            this.dashboardState.setLoading(false);
            this.dashboardState.updateConnectionStatus('connected');
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
            // Essayer d'utiliser l'API de refresh de Grafana si disponible
            iframe.contentWindow?.postMessage({ action: 'refresh' }, '*');
            console.log('📊 Grafana API refresh attempted');
        } catch (error) {
            console.warn('Grafana API refresh failed, using iframe reload');
            this.reloadIframe(iframe);
        }
    }

    private reloadIframe(iframe: HTMLIFrameElement): void {
        // Technique de rechargement propre avec cache busting
        const originalSrc = iframe.src;
        const timestamp = new Date().getTime();
        const separator = originalSrc.includes('?') ? '&' : '?';

        iframe.src = originalSrc + separator + `_t=${timestamp}`;
        console.log('🔄 Iframe reloaded with cache busting');
    }

    private forceIframeReload(iframe: HTMLIFrameElement): void {
        // Rechargement forcé en réinitialisant complètement l'iframe
        const originalSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
            iframe.src = originalSrc;
        }, 100);
    }

    private handleRefreshTimeout(): void {
        this.dashboardState.setLoading(false);
        this.dashboardState.setError(true);
        this.dashboardState.updateConnectionStatus('error');

        console.error('⏰ Dashboard refresh timeout exceeded');
    }
}
