import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsersEntity } from '@presentation/pages/settings-security/domain/entities/users/users.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import {
    TableConfig,
    TableExportExcelFileService,
} from '@shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { USER_TABLE_CONST } from '../../../domain/constants/user/user-table.constant';

@Component({
    selector: 'app-table-user',
    standalone: true,
    templateUrl: './table-user.component.html',
    styleUrls: ['./table-user.component.scss'],
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
export class TableUserComponent {
    private readonly translate = inject(TranslateService);
    private readonly toastService = inject(ToastrService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly destroy$ = new Subject<void>();

    readonly users = signal<UsersEntity[]>([]);
    readonly isLoading = signal<boolean>(false);
    readonly hasData = signal<boolean>(false);

    @Input({ required: true })
    set users$(value: Observable<UsersEntity[]>) {
        this._users$ = value;
        this._subscribeToData();
    }

    @Input({ required: true })
    pagination$!: Observable<Paginate<UsersEntity>>;

    @Input()
    set loading(value: boolean) {
        this.isLoading.set(value);
    }

    @Output() userRequested = new EventEmitter<{
        user: UsersEntity;
        action: 'view' | 'edit' | 'delete' | 'disable';
    }>();

    @Output() journalRequested = new EventEmitter<UsersEntity>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() addUserRequested = new EventEmitter<void>();

    private _users$: Observable<UsersEntity[]> = of([]);

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly tableConfig: TableConfig = USER_TABLE_CONST;

    constructor(
        private readonly tableExportExcelFileService: TableExportExcelFileService,
    ) { }

    private _subscribeToData(): void {
        this._users$
            .pipe(
                takeUntil(this.destroy$),
                tap((data) => {
                    const items = data ?? [];
                    this.users.set(items);
                    this.hasData.set(items.length > 0);
                })
            )
            .subscribe();
    }

    public onExportExcel(): void {
        const all = this.users();
        if (all && all.length > 0) {
            const fileName = `${this.exportFilePrefix}-users`;
            this.tableExportExcelFileService.exportAsExcelFile(
                all,
                this.tableConfig,
                fileName
            );
        } else {
            this.toastService.error(this.translate.instant('EXPORT.NO_DATA'));
        }
    }

    public onRefresh(): void {
        this.refreshRequested.emit();
    }

    public copyToClipboard(data: string): void {
        this.clipboardService.copyFromContent(data);
        this.toastService.success(
            this.translate.instant('COPIED_TO_THE_CLIPBOARD')
        );
    }

    public formatDate(value: string | null | undefined): string {
        if (!value) {
            return '-';
        }

        const normalized = value.replace(' ', 'T');
        const withTimezone =
            /z$/i.test(normalized) || normalized.endsWith('Z')
                ? normalized
                : `${normalized}Z`;
        const parsed = new Date(withTimezone);

        if (Number.isNaN(parsed.getTime())) {
            return value;
        }

        return parsed.toLocaleString();
    }

    public getStatusSeverity(status: string | null | undefined): string {
        const normalized = status?.toLowerCase() ?? '';
        switch (normalized) {
            case 'active':
            case 'actif':
                return 'success';
            case 'inactive':
            case 'inactif':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    public getStatusLabel(status: string | null | undefined): string {
        if (!status) {
            return '-';
        }
        const normalized = status.toLowerCase();
        if (normalized === 'active' || normalized === 'actif') {
            return this.translate.instant(
                'SETTINGS_SECURITY.USER.LABELS.STATUS.ACTIVE'
            );
        }
        if (normalized === 'inactive' || normalized === 'inactif') {
            return this.translate.instant(
                'SETTINGS_SECURITY.USER.LABELS.STATUS.INACTIVE'
            );
        }
        return status;
    }

    public getProfileLabel(profile: string | null | undefined): string {
        if (!profile) {
            return this.translate.instant(
                'SETTINGS_SECURITY.USER.PROFIL.NOT_ASSIGNED'
            );
        }
        return profile;
    }

    public onActionClicked(
        item: UsersEntity,
        action: 'view' | 'edit' | 'delete' | 'disable'
    ): void {
        this.userRequested.emit({ user: item, action });
    }

    public onAddUser(): void {
        this.addUserRequested.emit();
    }

    public onJournalClicked(item: UsersEntity): void {
        this.journalRequested.emit(item);
    }

    trackByUniqId(_: number, item: UsersEntity): string {
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
