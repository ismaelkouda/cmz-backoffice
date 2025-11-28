import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '@presentation/pages/settings-security/domain/entities/user.entity';
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
import { Observable, take } from 'rxjs';
import { USER_TABLE } from '../../../data-access/user/constants/user-table.constant';

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
    @Input() spinner!: boolean;
    @Input() listUsers$!: Observable<User[]>;
    @Input() pagination$!: Observable<Paginate<User>>;
    @Output() userRequested = new EventEmitter<{ user: User; action: 'view' | 'edit' | 'delete' | 'disable' }>();
    @Output() journalRequested = new EventEmitter<User>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() addUserRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = USER_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listUsers$.pipe(take(1)).subscribe((users) => {
            if (users && users.length > 0) {
                const fileName = `${this.exportFilePrefix}-users`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    users,
                    this.table,
                    fileName
                );
            } else {
                this.toastService.error(
                    this.translate.instant('EXPORT.NO_DATA')
                );
            }
        });
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
            return this.translate.instant('SETTINGS_SECURITY.USER.LABELS.STATUS.ACTIVE');
        }
        if (normalized === 'inactive' || normalized === 'inactif') {
            return this.translate.instant('SETTINGS_SECURITY.USER.LABELS.STATUS.INACTIVE');
        }
        return status;
    }

    public getProfileLabel(profile: string | null | undefined): string {
        if (!profile) {
            return this.translate.instant('SETTINGS_SECURITY.USER.PROFIL.NOT_ASSIGNED');
        }
        return profile;
    }

    public onActionClicked(
        item: User,
        action: 'view' | 'edit' | 'delete' | 'disable'
    ): void {
        this.userRequested.emit({ user: item, action });
    }

    public onAddUser(): void {
        this.addUserRequested.emit();
    }

    public onJournalClicked(item: User): void {
        this.journalRequested.emit(item);
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
