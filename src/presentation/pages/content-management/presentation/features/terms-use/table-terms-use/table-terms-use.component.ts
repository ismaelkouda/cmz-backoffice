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
import { TERMS_USE_TABLE_CONST } from '@presentation/pages/content-management/core/domain/constants/terms-use/terms-use-table.constants';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { ActionDropdown } from '@shared/domain/enums/action-dropdown.enum';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import {
    TableConfig,
    TableExportExcelFileService,
} from '@shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { HomeActionDropdownComponent } from '../../home/table-home/home-action-dropdown/home-action-dropdown.component';

@Component({
    selector: 'app-table-terms-use',
    standalone: true,
    templateUrl: './table-terms-use.component.html',
    styleUrls: ['./table-terms-use.component.scss'],
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
        SkeletonModule,
        HomeActionDropdownComponent
    ],
})
export class TableTermsUseComponent implements OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(
        TableExportExcelFileService
    );
    private readonly destroy$ = new Subject<void>();

    readonly termsUseData = signal<TermsUseEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set termsUse$(value: Observable<TermsUseEntity[]>) {
        this._termsUse$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<TermsUseEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    private _termsUse$!: Observable<TermsUseEntity[]>;

    @Output() createRequested = new EventEmitter<void>();
    @Output() editRequested = new EventEmitter<TermsUseEntity>();
    @Output() deleteRequested = new EventEmitter<TermsUseEntity>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() viewRequested = new EventEmitter<TermsUseEntity>();
    @Output() publishRequested = new EventEmitter<TermsUseEntity>();
    @Output() unpublishRequested = new EventEmitter<TermsUseEntity>();

    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    readonly tableConfig: TableConfig = TERMS_USE_TABLE_CONST;

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRefresh(): void {
        this.refreshRequested.emit();
    }

    public onExportExcel(): void {
        const data = this.termsUseData();
        if (data && data.length > 0) {
            const fileName = `${this.exportFilePrefix}-terms-use`;
            this.tableExportExcelFileService.exportAsExcelFile(
                data,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
        }
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public onCreateClicked(): void {
        this.createRequested.emit();
    }

    public onEditClicked(item: TermsUseEntity): void {
        this.editRequested.emit(item);
    }

    public onDeleteClicked(item: TermsUseEntity): void {
        this.deleteRequested.emit(item);
    }

    public onViewClicked(item: TermsUseEntity): void {
        this.viewRequested.emit(item);
    }

    public onPublishClicked(item: TermsUseEntity): void {
        this.publishRequested.emit(item);
    }

    public onUnpublishClicked(item: TermsUseEntity): void {
        this.unpublishRequested.emit(item);
    }

    private _subscribeToData(): void {
        this._termsUse$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.termsUseData.set(items);
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
            return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
        } catch {
            return value;
        }
    }

    public getStatusSeverity(status: ActionDropdown): 'success' | 'danger' {
        const map: Record<ActionDropdown, 'success' | 'danger'> = {
            [ActionDropdown.PUBLISHED]: 'success',
            [ActionDropdown.UNPUBLISHED]: 'danger',
            [ActionDropdown.ACTIVE]: 'success',
            [ActionDropdown.INACTIVE]: 'danger',
        };
        return map[status];
    }

    trackByUniqId(_: number, item: TermsUseEntity): string {
        return item.uniqId;
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
