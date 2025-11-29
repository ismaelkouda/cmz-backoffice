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
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, take } from 'rxjs';
import { PROFILE_USERS_TABLE } from '../../../data-access/profile-habilitation/constants/profile-users-table.constant';

@Component({
    selector: 'app-table-profile-users',
    standalone: true,
    templateUrl: './table-profile-users.component.html',
    styleUrls: ['./table-profile-users.component.scss'],
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
        CheckboxModule,
        TableButtonHeaderComponent,
        SearchTableComponent,
        TableTitleComponent,
    ],
})
export class TableProfileUsersComponent {
    @Input() spinner!: boolean;
    @Input() listUsers$!: Observable<User[]>;
    @Input() pagination$!: Observable<Paginate<User>>;
    @Input() selectedUsers: User[] = [];
    @Input() hideAssignButton: boolean = false;
    @Output() selectionChange = new EventEmitter<User[]>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() assignRequested = new EventEmitter<void>();
    @Output() removeRequested = new EventEmitter<User[]>();
    @Output() reassignRequested = new EventEmitter<User[]>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = PROFILE_USERS_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listUsers$.pipe(take(1)).subscribe((users) => {
            if (users && users.length > 0) {
                const fileName = `${this.exportFilePrefix}-profile-users`;
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

    public onSelectionChange(): void {
        // PrimeNG automatically updates selectedUsers via two-way binding
        // We just need to emit the current selection
        this.selectionChange.emit([...this.selectedUsers]);
    }

    public onAssign(): void {
        this.assignRequested.emit();
    }

    public onRemove(): void {
        if (this.selectedUsers.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.removeRequested.emit([...this.selectedUsers]);
    }

    public onReassign(): void {
        if (this.selectedUsers.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'SETTINGS_SECURITY.PROFILE_HABILITATION.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.reassignRequested.emit([...this.selectedUsers]);
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
