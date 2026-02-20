import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    effect,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { separatorThousands } from '@shared/domain/functions/separator-thousands';

import { DashboardFacade } from '@presentation/pages/dashboard/application/services/dashboard.facade';
import { period } from '@presentation/pages/dashboard/domain/constants/period.const';
import { DashboardEntity } from '@presentation/pages/dashboard/domain/entities/dashboard.entity';
import { Period } from '@presentation/pages/dashboard/domain/type/period.type';
import { DashboardSkeletonComponent } from '@presentation/pages/dashboard/presentation/dashboard-skeleton/dashboard-skeleton.component';

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

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ButtonModule,
        ProgressSpinnerModule,
        SelectButtonModule,
        DashboardSkeletonComponent,
        SkeletonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly facade = inject(DashboardFacade);
    private readonly translate = inject(TranslateService);

    public periodOpts = period;
    readonly loading = this.facade.loading;
    readonly items = this.facade.items;
    public readonly selectedPeriod = signal<Period>('7');
    public error: string | null = null;

    public typeStatistics: StatisticCard[] = [];
    public taskStatusStatistics: StatisticCard[] = [];
    public performanceStatistics: StatisticCard[] = [];

    constructor() {
        effect(() => {
            const period = this.selectedPeriod();
            this.facade.read({ period }, true);
        });

        effect(() => {
            const data = this.items();
            if (data) {
                this.generateStatistics(data);
            }
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.translate.instant('DASHBOARD.TITLE'));
    }

    onPeriodChange(period: Period): void {
        this.selectedPeriod.set(period);
    }

    refreshData(): void {
        this.facade.read({ period: this.selectedPeriod() }, true);
    }

    public navigateToReport(stat: StatisticCard): void {
        stat.routerFilter?.();
    }

    private generateStatistics(data: DashboardEntity): void {
        if (!data) {
            return;
        }
        this.typeStatistics = [
            {
                key: 'totalReports',
                count: separatorThousands(data.totalReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.TOTAL_PROCESSING.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TYPE.TOTAL_PROCESSING.SUBTITLE',
                color: 'primary',
                icon: 'pi-chart-bar',
            },
            {
                key: 'whiteZoneReports',
                count: separatorThousands(data.whiteZoneReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.WHITE_ZONE_PROCESSING.SUBTITLE',
                color: 'error',
                icon: 'pi-map-marker',
            },
            {
                key: 'partialOperatorReports',
                count: separatorThousands(data.partialOperatorReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_OPERATOR_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-building',
            },
            {
                key: 'partialSignalReports',
                count: separatorThousands(data.partialSignalReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_PROCESSING.SUBTITLE',
                color: 'warning',
                icon: 'pi-chart-line',
            },
            {
                key: 'noInternetReports',
                count: separatorThousands(data.noInternetReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_PROCESSING.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.TYPE.NO_INTERNET_PROCESSING.SUBTITLE',
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
}
