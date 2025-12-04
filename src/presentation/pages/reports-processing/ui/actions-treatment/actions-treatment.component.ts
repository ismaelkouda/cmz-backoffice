import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ActionsFacade } from '@presentation/pages/reports-processing/application/actions.facade';
import { DetailsFacade } from '@presentation/pages/reports-processing/application/details.facade';
import { ActionsFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-filter-payload.entity';
import { ActionsPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions-payload.entity';
import { ActionsEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions.entity';
import { DetailsEntity } from '@presentation/pages/reports-processing/domain/entities/details/details.entity';
import { ActionsFilter } from '@presentation/pages/reports-processing/domain/value-objects/actions-filter.vo';
import { FilterActionsComponent } from '@presentation/pages/reports-processing/feature/actions/filter-actions/filter-actions.component';
import { ModalActionComponent } from '@presentation/pages/reports-processing/feature/actions/modal-action/modal-action.component';
import { TableActionsComponent } from '@presentation/pages/reports-processing/feature/actions/table-actions/table-actions.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ReportType } from '@shared/domain/enums/report-type.enum';
import { TelecomOperator } from '@shared/domain/enums/telecom-operator.enum';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-actions-treatment',
    standalone: true,
    templateUrl: './actions-treatment.component.html',
    styleUrls: ['./actions-treatment.component.scss'],
    imports: [
        CommonModule,
        TranslateModule,
        AsyncPipe,
        PageTitleComponent,
        PaginationComponent,
        TableActionsComponent,
        FilterActionsComponent,
        ModalActionComponent,
        ButtonModule,
        BreadcrumbComponent,
        TagModule,
    ],
    providers: [DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsTreatmentComponent implements OnInit, OnDestroy {
    private readonly actionsFacade = inject(ActionsFacade);
    private readonly detailsFacade = inject(DetailsFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly destroy$ = new Subject<void>();
    private readonly router = inject(Router);
    private readonly datePipe = inject(DatePipe);

    public title = inject(Title);
    public module = signal<string>('');
    public subModule = signal<string>('');
    public readOnly = signal<boolean>(false);

    public reportUniqId = signal<string>('');
    public details$ = signal<DetailsEntity | null>(null);

    public pagination$!: Observable<Paginate<ActionsEntity>>;
    public actions$!: Observable<ActionsEntity[]>;
    public loading$!: Observable<boolean>;

    public readonly modalState = signal<{
        visible: boolean;
        mode: 'create' | 'edit';
        action: ActionsEntity | null;
    }>({
        visible: false,
        mode: 'create',
        action: null,
    });

    ngOnInit(): void {
        this.setupRoute();
        this.setupRouteData();
        this.setupObservables();
        this.setupDetailsObservable();
    }

    private setupRoute(): void {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
            const taskId = params['taskId'];
            if (taskId) {
                this.reportUniqId.set(taskId);
                this.loadActionsData(taskId);
            }
        });
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ??
                    'TEAM_ORGANIZATION.PARTICIPANT.FORM.CREATE_TITLE'
                );
                this.module = data['module'] ?? 'TEAM_ORGANIZATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'TEAM_ORGANIZATION.PARTICIPANT.LABEL';
            });
    }

    private loadActionsData(reportUniqId: string): void {
        const defaultFilter = ActionsFilter.create({
            report_uniq_id: reportUniqId,
        } as ActionsFilterPayloadEntity);
        this.actionsFacade.fetchActions(defaultFilter, '1', false);
        this.detailsFacade.fetchDetails(reportUniqId, 'reports-processing');
    }

    private setupObservables(): void {
        this.actions$ = this.actionsFacade.actions$;
        this.pagination$ = this.actionsFacade.pagination$;
        this.loading$ = this.actionsFacade.isLoading$;
    }

    private setupDetailsObservable(): void {
        this.detailsFacade.details$
            .pipe(takeUntil(this.destroy$))
            .subscribe((details) => {
                this.details$.set(details);
            });
    }

    public filter(filterData: ActionsFilterPayloadEntity): void {
        const filter = ActionsFilter.create({
            ...filterData,
            report_uniq_id: this.reportUniqId(),
        });
        this.actionsFacade.fetchActions(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.actionsFacade.changePage(event + 1);
    }

    public refreshActions(): void {
        this.actionsFacade.refresh();
    }

    public onManageAction(event: {
        mode: 'create' | 'edit';
        action: ActionsEntity | null;
    }): void {
        this.modalState.set({
            visible: true,
            mode: event.mode,
            action: event.action,
        });
    }

    public onModalClosed(): void {
        this.modalState.set({
            visible: false,
            mode: 'create',
            action: null,
        });
    }

    public onActionCreate(payload: ActionsPayloadEntity): void {
        this.actionsFacade
            .createAction(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        this.onModalClosed();
    }

    public onActionUpdate(event: {
        id: string;
        data: ActionsPayloadEntity;
    }): void {
        this.actionsFacade
            .updateAction(event.id, event.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
        this.onModalClosed();
    }

    public onActionDelete(action: ActionsEntity): void {
        this.actionsFacade
            .deleteAction(action.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    public onCancel(): void {
        this.router.navigate(['/reports-processing/tasks']);
    }

    // Helper methods for premium subtitle
    public getReportTypeColor(reportType: ReportType): string {
        const colorMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'card-error',
            [ReportType.ZOB]: 'card-warning',
            [ReportType.CPO]: 'card-info',
            [ReportType.CPS]: 'card-success',
            [ReportType.OTHER]: 'card-primary',
        };
        return colorMap[reportType] || 'card-primary';
    }

    public getReportTypeLabel(reportType: ReportType): string {
        const labelMap: Record<ReportType, string> = {
            [ReportType.ABI]: 'REPORT_TYPE.ABI',
            [ReportType.ZOB]: 'REPORT_TYPE.ZOB',
            [ReportType.CPO]: 'REPORT_TYPE.CPO',
            [ReportType.CPS]: 'REPORT_TYPE.CPS',
            [ReportType.OTHER]: 'REPORT_TYPE.OTHER',
        };
        return labelMap[reportType] || 'REPORT_TYPE.OTHER';
    }

    public getOperatorColor(operator: TelecomOperator): string {
        const normalized = operator?.toString().toLowerCase().trim() ?? '';
        const colorMap: Record<string, string> = {
            orange: 'rgb(241, 110, 0)',
            mtn: 'rgb(255, 203, 5)',
            moov: 'rgb(0, 91, 164)',
        };
        return colorMap[normalized] ?? 'rgba(var(--theme-default-rgb), 0.8)';
    }

    public formatCreationDate(date: string): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || date;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.actionsFacade.resetMemory();
    }
}
