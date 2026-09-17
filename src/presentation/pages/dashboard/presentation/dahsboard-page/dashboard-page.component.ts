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
import { DashboardFacade } from '@pages/dashboard/application/services/dashboard.facade';
import { period } from '@pages/dashboard/domain/constants/period.const';
import { DashboardEntity } from '@pages/dashboard/domain/entities/dashboard.entity';
import { Period } from '@pages/dashboard/domain/type/period.type';
import { DashboardSkeletonComponent } from '@pages/dashboard/presentation/dashboard-skeleton/dashboard-skeleton.component';
import { separatorThousands } from '@shared/domain/functions/separator-thousands';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

interface StatisticCard {
    key: string;
    count: number | string;
    label: string;
    subtitle?: string;
    color: string;
    icon: string;
    routerFilter?: () => void;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}
const INITIAL_DAY = '100';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss'],
    imports: [
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

    private readonly _selectedPeriod = signal<Period>(INITIAL_DAY as Period);
    readonly selectedPeriod = this._selectedPeriod.asReadonly();

    public periodOpts = period;
    readonly loading = this.facade.loading;
    readonly items = this.facade.items;
    readonly error = this.facade.error;

    public typeStatistics: StatisticCard[] = [];
    public taskStatusStatistics: StatisticCard[] = [];
    public performanceStatistics: StatisticCard[] = [];

    constructor() {
        effect(() => {
            const data = this.items();
            if (data) {
                this.generateStatistics(data);
            }
        });

        effect(() => {
            const facadeFilter = this.facade.filter();
            if (
                facadeFilter?.period &&
                facadeFilter.period !== this._selectedPeriod()
            ) {
                this._selectedPeriod.set(facadeFilter.period as Period);
            }
        });
    }

    ngOnInit(): void {
        this.title.setTitle(this.translate.instant('DASHBOARD.TITLE'));
        const initialPeriod = (this.facade.filter()?.period ??
            INITIAL_DAY) as Period;
        this._selectedPeriod.set(initialPeriod);
        this.facade.read({ period: initialPeriod });
    }

    onPeriodChange(period: Period): void {
        if (!period || period === this._selectedPeriod()) {
            return;
        }
        this._selectedPeriod.set(period);
        this.facade.read(
            { period: this.selectedPeriod() },
            { forceRefresh: true }
        );
    }

    refreshData(): void {
        const currentPeriod = this._selectedPeriod();
        this.facade.read({ period: currentPeriod }, { forceRefresh: true });
    }

    public navigateToReport(stat: StatisticCard): void {
        console.log('stat', stat);
        if (stat.routerFilter) {
            stat?.routerFilter();
        }
    }

    private generateStatistics(data: DashboardEntity): void {
        if (!data) {
            return;
        }
        this.typeStatistics = [
            {
                key: 'totalRequestReports',
                count: separatorThousands(data.totalRequestReports || 0),
                label: 'DASHBOARD.SECTIONS.TYPE.TOTAL_REQUESTS.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TYPE.TOTAL_REQUESTS.SUBTITLE',
                color: 'primary',
                icon: 'pi-list',
            },
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
                icon: 'pi-times',
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
            // {
            //     key: 'partialSignalReports',
            //     count: separatorThousands(data.partialSignalReports || 0),
            //     label: 'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_PROCESSING.LABEL',
            //     subtitle:
            //         'DASHBOARD.SECTIONS.TYPE.PARTIAL_SIGNAL_PROCESSING.SUBTITLE',
            //     color: 'warning',
            //     icon: 'pi-chart-line',
            // },
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
                routerFilter: (): Promise<boolean> =>
                    this.router.navigate(['/requests/queues']),
            },
            {
                key: 'totalReportsInProcessing',
                count: separatorThousands(data.totalReportsInProcessing || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.IN_PROGRESS.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.IN_PROGRESS.SUBTITLE',
                color: 'error',
                icon: 'pi-times',
                routerFilter: () =>
                    this.router.navigate(['/report-status/rejected']),
            },
            {
                key: 'totalReportsProcessed',
                count: separatorThousands(data.totalReportsProcessed || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.TREATED.SUBTITLE',
                color: 'warning',
                icon: 'pi-cog pi-spin',
                routerFilter: (): Promise<boolean> =>
                    this.router.navigate(['/reports-processing/queues']),
            },
            {
                key: 'totalReportsFinalized',
                count: separatorThousands(data.totalReportsFinalized || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.FINALIZED.SUBTITLE',
                color: 'success',
                icon: 'pi-check-circle',
                routerFilter: (): Promise<boolean> =>
                    this.router.navigate(['/reports-processing/tasks']),
            },
            {
                key: 'totalReportsEvaluated',
                count: separatorThousands(data.totalReportsEvaluated || 0),
                label: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATED.LABEL',
                subtitle: 'DASHBOARD.SECTIONS.TASK_STATUS.EVALUATED.SUBTITLE',
                color: 'primary',
                icon: 'pi-star-fill',
                routerFilter: () =>
                    this.router.navigate(['/report-status/closed']),
            },
        ];

        this.performanceStatistics = [
            {
                key: 'averageQualificationTime',
                count: `${data.averageQualificationTime || 0} h`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_QUALIFICATION_TIME.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_QUALIFICATION_TIME.SUBTITLE',
                color: 'primary',
                icon: 'pi-stopwatch',
            },
            {
                key: 'averageHandlingTime',
                count: `${data.averageHandlingTime || 0} h`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_HANDLING_TIME.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_HANDLING_TIME.SUBTITLE',
                color: 'warning',
                icon: 'pi-stopwatch',
            },
            {
                key: 'averageResolutionTime',
                count: `${data.averageResolutionTime || 0} h`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_RESOLUTION_TIME.LABEL',
                subtitle:
                    'DASHBOARD.SECTIONS.PERFORMANCE.AVERAGE_RESOLUTION_TIME.SUBTITLE',
                color: 'primary',
                icon: 'pi-stopwatch',
            },
            {
                key: 'conformanceRate',
                count: `${data.conformanceRate || 0}%`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.CONFORMANCE_RATE.LABEL',
                color: 'success',
                icon: 'pi pi-verified',
            },
            {
                key: 'userSatisfactionRate',
                count: `${data.userSatisfactionRate || 0}%`,
                label: 'DASHBOARD.SECTIONS.PERFORMANCE.USER_SATISFACTION_RATE.LABEL',
                color: 'info',
                icon: 'pi pi-thumbs-up',
            },
        ];
    }
}
