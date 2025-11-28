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
import { ACTIONS_TABLE_CONST } from '@presentation/pages/reports-processing/domain/constants/actions-table.constant';
import { ActionsEntity } from '@presentation/pages/reports-processing/domain/entities/actions/actions.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-table-actions',
    standalone: true,
    templateUrl: './table-actions.component.html',
    styleUrls: ['./table-actions.component.scss'],
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
export class TableActionsComponent implements OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    readonly actions = signal<ActionsEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set actions$(value: Observable<ActionsEntity[]>) {
        this._actions$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<ActionsEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() manageRequested = new EventEmitter<{
        mode: 'edit' | 'create';
        action: ActionsEntity | null;
    }>();
    @Output() deleteRequested = new EventEmitter<ActionsEntity>();
    @Output() refreshRequested = new EventEmitter<void>();

    private _actions$!: Observable<ActionsEntity[]>;

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig = ACTIONS_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }

    onExportExcel(): void {
        const actions = this.actions();
        if (actions && actions.length > 0) {
            const fileName = `${this.exportFilePrefix}-actions`;
            this.tableExportExcelFileService.exportAsExcelFile(
                actions,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
        }
    }

    onAddClicked(): void {
        this.manageRequested.emit({
            mode: 'create',
            action: null,
        });
    }

    onUpdateClicked(item: ActionsEntity): void {
        this.manageRequested.emit({
            mode: 'edit',
            action: item,
        });
    }

    onDeleteClicked(item: ActionsEntity): void {
        this.deleteRequested.emit(item);
    }

    getUpdateTooltip(action: ActionsEntity): string {
        return this.translate.instant('ACTIONS.TOOLTIPS.EDIT');
    }

    getDeleteTooltip(action: ActionsEntity): string {
        return this.translate.instant('ACTIONS.TOOLTIPS.DELETE');
    }

    getActionTypeLabel(type: string): string {
        const translationKey = `ACTIONS.TYPES.${type}`;
        return this.translate.instant(translationKey);
    }

    getActionTypeSeverity(
        type: string
    ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
        const severityMap: Record<
            string,
            'success' | 'info' | 'warning' | 'danger' | 'secondary'
        > = {
            ANALYSIS: 'info',
            TREATMENT: 'warning',
            VERIFICATION: 'secondary',
            CORRECTION: 'danger',
            VALIDATION: 'success',
            OTHER: 'secondary',
        };
        return severityMap[type] || 'secondary';
    }

    getCreatedByName(action: ActionsEntity): string {
        if (!action.createdBy) return '-';
        return `${action.createdBy.first_name} ${action.createdBy.last_name}`;
    }

    private _subscribeToData(): void {
        this._actions$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.actions.set(items);
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
            return Number.isNaN(date.getTime())
                ? value
                : date.toLocaleString();
        } catch {
            return value;
        }
    }

    trackByUniqId(_: number, item: ActionsEntity): string {
        return item.id;
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
