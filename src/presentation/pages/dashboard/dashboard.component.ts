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

type PeriodOption = '15' | '30' | '90';

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

    public loading = true;
    public error: string | null = null;
    public currentDate: string = '';
    public dashboardData: DashboardStatistics | null = null;
    public selectedPeriod: PeriodOption = '30';

    public periodOptions = [
        { label: '15', value: '15' },
        { label: '30', value: '30' },
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
        this.title.setTitle(
            this.translate.instant('DASHBOARD.TITLE') ||
                'Tableau de bord - Signalements'
        );
    }

    private loadDashboardData(): void {
        this.error = null;

        const periodDays = parseInt(this.selectedPeriod, 10);

        this.dashboardFacade
            .loadStatistics(periodDays)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (statistics) => {
                    this.handleDashboardData(statistics);
                },
                error: () => {
                    this.error = this.translate.instant(
                        'DASHBOARD.ERROR.LOAD_DATA'
                    );
                    this.cdr.markForCheck();
                },
            });

        this.dashboardFacade.isLoading$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isLoading) => {
                this.loading = isLoading;
                this.cdr.markForCheck();
            });
    }

    public onPeriodChange(period: PeriodOption): void {
        this.selectedPeriod = period;
        this.cdr.markForCheck();
        this.loadDashboardData();
    }

    private handleDashboardData(data: DashboardStatistics): void {
        this.dashboardData = data;
        this.currentDate = data.date_derniere_maj || '';
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
                label: 'DASHBOARD.SECTIONS.TYPE.TOTAL_REPORT_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.TOTAL_REPORT_PROCESSING.SUBTITLE',
                color: 'primary',
                icon: 'pi-file',
            },
            {
                key: 'whiteZoneReports',
                count: separatorThousands(data.whiteZoneReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_REPORT_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_REPORT_PROCESSING.SUBTITLE',
                color: 'error',
                icon: 'pi-map',
            },
            {
                key: 'partialOperatorReports',
                count: separatorThousands(data.partialOperatorReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_REPORT_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_REPORT_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-signal',
            },
            {
                key: 'partialSignalReports',
                count: separatorThousands(data.partialSignalReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_REPORT_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_REPORT_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-signal',
            },
            {
                key: 'noInternetReports',
                count: separatorThousands(data.noInternetReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_REPORT_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_REPORT_PROCESSING.SUBTITLE',
                color: 'info',
                icon: 'pi-wifi',
            },
        ];

        this.taskStatusStatistics = [
            {
                key: 'qualificationReports',
                count: separatorThousands(data.qualificationReports || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.QUALIFICATION.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TASK_STATUS.QUALIFICATION.SUBTITLE',
                color: 'primary',
                icon: 'pi-check-square',
                routerFilter: () => this.router.navigate(['/report/queue']),
            },
            {
                key: 'assignmentReports',
                count: separatorThousands(data.assignmentReports || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.ASSIGNMENT.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.ASSIGNMENT.SUBTITLE',
                color: 'info',
                icon: 'pi-users',
                routerFilter: () => this.router.navigate(['/report/approval']),
            },
            {
                key: 'treatmentReports',
                count: separatorThousands(data.treatmentReports || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATMENT.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATMENT.SUBTITLE',
                color: 'warning',
                icon: 'pi-cog',
                routerFilter: () =>
                    this.router.navigate(['/report/processing']),
            },
            {
                key: 'finalizationReports',
                count: separatorThousands(data.finalizationReports || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZATION.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZATION.SUBTITLE',
                color: 'success',
                icon: 'pi-flag',
                routerFilter: () => this.router.navigate(['/report/finalize']),
            },
            {
                key: 'evaluationReports',
                count: separatorThousands(data.evaluationReports || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATION.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATION.SUBTITLE',
                color: 'primary',
                icon: 'pi-star',
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
