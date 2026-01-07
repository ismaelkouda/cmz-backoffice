import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, takeUntil } from 'rxjs';
import { separatorThousands } from '../../../shared/functions/separator-thousands';
import { DashboardFacade } from './application/dashboard.facade';
import { DashboardStatistics } from './domain/entities/dashboard-statistics.entity';

interface StatisticCard {
    key: string;
    count: number | string;
    label: string;
    subtitle: string;
    color: string;
    icon: string;
    routerFilter?: () => void;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}
type PeriodOption = '7' | '30' | '60' | '90';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ButtonModule,
        ProgressSpinnerModule,
        SelectButtonModule,
        SkeletonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly dashboardFacade = inject(DashboardFacade);
    private readonly translate = inject(TranslateService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly destroy$ = new Subject<void>();

    public isLoading$ = this.dashboardFacade.isLoading$;
    public majDate$ = this.dashboardFacade.majDate$;
    public error: string | null = null;
    public dashboardData: DashboardStatistics | null = null;
    public selectedPeriod: PeriodOption = '7';

    public periodOptions = [
        { label: '7', value: '7' },
        { label: '30', value: '30' },
        { label: '60', value: '60' },
        { label: '90', value: '90' },
    ];

    public typeStatistics: StatisticCard[] = [];
    public taskStatusStatistics: StatisticCard[] = [];
    public performanceStatistics: StatisticCard[] = [];

    ngOnInit(): void {
        this.setupTitle();
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupTitle(): void {
        this.title.setTitle(this.translate.instant('DASHBOARD.TITLE'));
    }

    private loadDashboardData(): void {
        this.error = null;

        const period = parseInt(this.selectedPeriod, 10);

        this.dashboardFacade
            .loadStatistics(period)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (statistics) => {
                    this.handleDashboardData(statistics);
                },
            });
    }

    public onPeriodChange(period: PeriodOption): void {
        this.selectedPeriod = period;
        this.cdr.markForCheck();
        this.loadDashboardData();
    }

    private handleDashboardData(data: DashboardStatistics): void {
        this.dashboardData = data;
        this.generateStatistics(data);
        this.cdr.markForCheck();
    }

    private generateStatistics(data: DashboardStatistics | null): void {
        if (!data) {
            return;
        }
        this.typeStatistics = [
            {
                key: 'totalReports',
                count: separatorThousands(data.totalReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.TOTAL_REPORTS_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.TOTAL_REPORTS_PROCESSING.SUBTITLE',
                color: 'primary',
                icon: 'pi-chart-bar',
            },
            {
                key: 'whiteZoneReports',
                count: separatorThousands(data.whiteZoneReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_REPORTS_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_REPORTS_PROCESSING.SUBTITLE',
                color: 'error',
                icon: 'pi-map-marker',
            },
            {
                key: 'partialOperatorReports',
                count: separatorThousands(data.partialOperatorReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_REPORTS_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_REPORTS_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-building',
            },
            {
                key: 'partialSignalReports',
                count: separatorThousands(data.partialSignalReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_REPORTS_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_REPORTS_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-chart-line',
            },
            {
                key: 'noInternetReports',
                count: separatorThousands(data.noInternetReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_REPORTS_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_REPORTS_PROCESSING.SUBTITLE',
                color: 'info',
                icon: 'pi-ban',
            },
        ];

        this.taskStatusStatistics = [
            {
                key: 'totalReportsPending',
                count: separatorThousands(data.totalReportsPending || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.PENDING.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.PENDING.SUBTITLE',
                color: 'primary',
                icon: 'pi-clock pi-spin',
                routerFilter: () => this.router.navigate(['/report/queue']),
            },
            {
                key: 'totalReportsInProcessing',
                count: separatorThousands(data.totalReportsInProcessing || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.IN_PROGRESS.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.IN_PROGRESS.SUBTITLE',
                color: 'info',
                icon: 'pi-cog pi-spin',
                routerFilter: () => this.router.navigate(['/report/approval']),
            },
            {
                key: 'totalReportsProcessed',
                count: separatorThousands(data.totalReportsProcessed || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATED.SUBTITLE',
                color: 'warning',
                icon: 'pi-check',
                routerFilter: () =>
                    this.router.navigate(['/report/processing']),
            },
            {
                key: 'totalReportsFinalized',
                count: separatorThousands(data.totalReportsFinalized || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZED.SUBTITLE',
                color: 'success',
                icon: 'pi-check-circle',
                routerFilter: () => this.router.navigate(['/report/finalize']),
            },
            {
                key: 'totalReportsEvaluated',
                count: separatorThousands(data.totalReportsEvaluated || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATED.SUBTITLE',
                color: 'primary',
                icon: 'pi-star-fill',
            },
        ];

        this.performanceStatistics = [
            {
                key: 'treatmentRate',
                count: `${data.treatmentRate || 0}%`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.TREATMENT_RATE.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.TREATMENT_RATE.SUBTITLE',
                color: 'success',
                icon: 'pi-chart-line',
            },
            {
                key: 'completionRate',
                count: `${data.completionRate || 0}%`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.COMPLETION_RATE.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.COMPLETION_RATE.SUBTITLE',
                color: 'primary',
                icon: 'pi-check-circle',
            },
            {
                key: 'averageTreatmentTime',
                count: `${data.averageTreatmentTime || 0}j`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_TREATMENT_TIME.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_TREATMENT_TIME.SUBTITLE',
                color: 'info',
                icon: 'pi-calendar',
            },
            {
                key: 'responseTime',
                count: `${data.responseTime || 0}h`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.RESPONSE_TIME.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.RESPONSE_TIME.SUBTITLE',
                color: 'warning',
                icon: 'pi-clock',
            },
        ];
    }

    public refreshData(): void {
        this.loadDashboardData();
    }

    public navigateToReport(stat: StatisticCard): void {
        if (stat.routerFilter) {
            stat.routerFilter();
        }
    }
}
