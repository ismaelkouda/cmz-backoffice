import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    inject,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NEWSPAPERS_TABLE_CONST } from '@presentation/pages/reports-processing/domain/constants/newspapers-table.constant';
import { NewspapersEntity } from '@presentation/pages/reports-processing/domain/entities/management/newspapers/newspapers.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/interfaces/paginate';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-table-newspapers',
    standalone: true,
    templateUrl: './table-newspapers.component.html',
    styleUrls: ['./table-newspapers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        AsyncPipe,
        TableModule,
        TranslateModule,
        ButtonModule,
        TooltipModule,
        ProgressSpinnerModule,
        TagModule,
        TableButtonHeaderComponent,
        SearchTableComponent,
        TableTitleComponent,
    ],
})
export class TableNewspapersComponent implements OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly newspapers = signal<NewspapersEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set newspapers$(value: Observable<NewspapersEntity[]>) {
        this._newspapers$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<NewspapersEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() treatmentRequested = new EventEmitter<{
        mode: 'edit' | 'create';
        newspaper: NewspapersEntity | null;
    }>();
    @Output() journalRequested = new EventEmitter<NewspapersEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private _newspapers$!: Observable<NewspapersEntity[]>;

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig = NEWSPAPERS_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }
    public onExportExcel(): void {
        /* this.newspapers$.pipe(take(1)).subscribe((newspapers) => {
            if (newspapers && newspapers.length > 0) {
                const fileName = `${this.exportFilePrefix}-newspapers`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    newspapers,
                    this.table,
                    fileName
                );
            } else {
                this.toastService.error(
                    this.translate.instant('EXPORT.NO_DATA')
                );
            }
        }); */
    }

    public onAddClicked(): void {
        this.treatmentRequested.emit({
            mode: 'create',
            newspaper: null,
        });
    }

    public onUpdateClicked(item: NewspapersEntity): void {
        this.treatmentRequested.emit({
            mode: 'edit',
            newspaper: item,
        });
    }

    public getUpdateTooltip(newspaper: NewspapersEntity): string {
        return this.translate.instant('MANAGEMENT.NEWSPAPERS.TOOLTIPS.EDIT');
    }

    public getDeleteTooltip(newspaper: NewspapersEntity): string {
        return this.translate.instant('MANAGEMENT.NEWSPAPERS.TOOLTIPS.DELETE');
    }

    public onDeleteClicked(item: NewspapersEntity): void {
        /*         SweetAlert.fire({
            ...SWEET_ALERT_PARAMS,
            title: `${this.translate.instant()}`,
            text: `${this.translate.instant()} ${item.uniqId}`,
            backdrop: false,
            confirmButtonText: this.translate.instant(),
            cancelButtonText: this.translate.instant('CANCEL'),
        }).then((result) => {
            if (result.isConfirmed) {
                this.executeManagementAction(management, credentials);
            }
        }); */
    }

    private _subscribeToData(): void {
        this._newspapers$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.newspapers.set(items);
                    this.hasData.set(items.length > 0);
                })
            )
            .subscribe();
    }

    formatDate(value: string): string {
        if (!value) return '-';
        try {
            const normalized = value.includes('T')
                ? value
                : value.replace(' ', 'T');
            const withTimezone = normalized.endsWith('Z')
                ? normalized
                : `${normalized}Z`;
            const date = new Date(withTimezone);
            return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
        } catch {
            return value;
        }
    }

    trackByUniqId(_: number, item: NewspapersEntity): string {
        return item.uniqId;
    }

    trackByOperator(_: number, operator: string): string {
        return operator;
    }

    trackByColField(_: number, col: any): string {
        return col.field;
    }

    private normalizeExportPrefix(appName: string): string {
        return (
            appName
                .toLowerCase()
                .replaceAll(/[^a-z0-9]+/g, '-')
                .replaceAll(/(^-|-$)/g, '') || 'cmz'
        );
    }
}
