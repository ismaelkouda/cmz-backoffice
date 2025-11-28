import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    inject,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NewspapersFacade } from '@presentation/pages/reports-processing/application/newspapers.facade';
import { ModalActivityPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/modal-activity/modal-activity-payload.entity';
import { ModalActivityEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/modal-activity/modal-activity.entity';
import { NewspapersFilterPayloadEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers-filter-payload.entity';
import { NewspapersEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers.entity';
import { NewspapersFilter } from '@presentation/pages/reports-processing/domain/value-objects/newspapers-filter.vo';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ModalActivityComponent } from './modal-activity/modal-activity.component';
import { NewspaperService } from './modal-activity/newspaper.service';
import { TableNewspapersComponent } from './table-newspapers/table-newspapers.component';

@Component({
    selector: 'app-newspapers',
    standalone: true,
    templateUrl: './newspapers.component.html',
    imports: [
        CommonModule,
        TableNewspapersComponent,
        PageTitleComponent,
        PaginationComponent,
        TranslateModule,
        AsyncPipe,
        ModalActivityComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewspapersComponent implements OnInit, OnDestroy {
    private readonly newspapersFacade = inject(NewspapersFacade);
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    @Input() reportUniqId!: string;
    public visibleActivity: boolean = false;

    public pagination$!: Observable<Paginate<NewspapersEntity>>;
    public newspapers$!: Observable<NewspapersEntity[]>;
    public loading$!: Observable<boolean>;

    public readonly modalState = signal<{
        visible: boolean;
        mode: 'create' | 'edit';
        newspaper: NewspapersEntity | null;
    }>({
        visible: false,
        mode: 'create',
        newspaper: null,
    });

    @Output() activityCreated = new EventEmitter<ModalActivityPayloadEntity>();
    @Output() activityUpdated = new EventEmitter<{
        id: string;
        data: ModalActivityPayloadEntity;
    }>();
    @Output() activityDeleted = new EventEmitter<string>();

    private readonly newspaperService = inject(NewspaperService);

    public readonly isLoading = signal<boolean>(false);

    public readonly activities = signal<ModalActivityEntity[]>([]);

    ngOnInit(): void {
        this.setupObservables();
        this.loadNewspapersData();
    }

    private loadNewspapersData(): void {
        const defaultFilter = NewspapersFilter.create({
            reportUniqId: this.reportUniqId,
        } as NewspapersFilterPayloadEntity);
        this.newspapersFacade.fetchNewspapers(defaultFilter, '1', false);
    }

    private setupObservables(): void {
        this.newspapers$ = this.newspapersFacade.newspapers$;
        this.pagination$ = this.newspapersFacade.pagination$;
        this.loading$ = this.newspapersFacade.isLoading$;
    }

    public filter(filterData: NewspapersFilterPayloadEntity): void {
        const filter = NewspapersFilter.create({
            ...filterData,
            reportUniqId: this.reportUniqId,
        });
        this.newspapersFacade.fetchNewspapers(filter, '1', true);
    }

    public onPageChange(event: number): void {
        this.newspapersFacade.changePage(event + 1);
    }

    public refreshNewspapers(): void {
        this.newspapersFacade.refresh();
    }

    public onManageAction(event: {
        mode: 'create' | 'edit';
        newspaper: NewspapersEntity | null;
    }): void {
        this.modalState.set({
            visible: true,
            mode: event.mode,
            newspaper: event.newspaper,
        });
    }

    public onReportActivityClosed(): void {
        this.modalState.set({
            visible: false,
            mode: 'create',
            newspaper: null,
        });
    }

    // Gestion des actions du modal
    public onActivityCreate(payload: ModalActivityPayloadEntity): void {
        this.isLoading.set(true);

        this.newspaperService
            .createActivity(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.handleActivitySuccess('created');
                    this.activityCreated.emit(payload);
                    const defaultFilter = NewspapersFilter.create({
                        reportUniqId: this.reportUniqId,
                    } as NewspapersFilterPayloadEntity);
                    this.newspapersFacade.fetchNewspapers(
                        defaultFilter,
                        '1',
                        false
                    );
                },
                error: (error) => {
                    this.handleActivityError(error, 'create');
                    this.isLoading.set(false);
                },
            });
    }

    public onActivityUpdate(event: {
        id: string;
        data: ModalActivityPayloadEntity;
    }): void {
        this.isLoading.set(true);

        this.newspaperService
            .updateActivity(event.id, event.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.handleActivitySuccess('updated');
                    this.activityUpdated.emit(event);
                    const defaultFilter = NewspapersFilter.create({
                        reportUniqId: this.reportUniqId,
                    } as NewspapersFilterPayloadEntity);
                    this.newspapersFacade.fetchNewspapers(
                        defaultFilter,
                        '1',
                        false
                    );
                },
                error: (error) => {
                    this.handleActivityError(error, 'update');
                    this.isLoading.set(false);
                },
            });
    }

    public onActivityDelete(activityId: string): void {
        this.newspaperService.deleteActivity(activityId).subscribe({
            next: () => {
                const defaultFilter = NewspapersFilter.create({
                    reportUniqId: this.reportUniqId,
                } as NewspapersFilterPayloadEntity);
                this.newspapersFacade.fetchNewspapers(
                    defaultFilter,
                    '1',
                    false
                );
            },
            error: (error) => this.handleActivityError(error, 'delete'),
        });
    }

    private handleActivitySuccess(action: string): void {
        // Notification de succès
        this.onReportActivityClosed();
    }

    private handleActivityError(error: any, action: string): void {
        // Gestion d'erreur
        console.error(`Failed to ${action} activity:`, error);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
