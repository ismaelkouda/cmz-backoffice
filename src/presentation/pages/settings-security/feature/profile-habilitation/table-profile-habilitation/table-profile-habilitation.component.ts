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
import { ProfileHabilitation } from '@presentation/pages/settings-security/domain/entities/profile-habilitation.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { Paginate } from '@shared/interfaces/paginate';
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
import { PROFILE_HABILITATION_TABLE } from '../../../data-access/profile-habilitation/constants/profile-habilitation-table.constant';

@Component({
    selector: 'app-table-profile-habilitation',
    standalone: true,
    templateUrl: './table-profile-habilitation.component.html',
    styleUrls: ['./table-profile-habilitation.component.scss'],
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
export class TableProfileHabilitationComponent {
    @Input() spinner!: boolean;
    @Input() listProfileHabilitation$!: Observable<ProfileHabilitation[]>;
    @Input() pagination$!: Observable<Paginate<ProfileHabilitation>>;
    @Output() profileHabilitationRequested = new EventEmitter<{
        profile: ProfileHabilitation;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'users';
    }>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() addProfileRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = PROFILE_HABILITATION_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listProfileHabilitation$.pipe(take(1)).subscribe((profils) => {
            if (profils && profils.length > 0) {
                const fileName = `${this.exportFilePrefix}-profile-habilitations`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    profils,
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
                'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.ACTIVE'
            );
        }
        if (normalized === 'inactive' || normalized === 'inactif') {
            return this.translate.instant(
                'SETTINGS_SECURITY.PROFILE_HABILITATION.LABELS.STATUS.INACTIVE'
            );
        }
        return status;
    }

    public getProfileLabel(profile: string | null | undefined): string {
        if (!profile) {
            return '-';
        }
        return profile;
    }

    public onActionClicked(
        item: ProfileHabilitation,
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable'
    ): void {
        this.profileHabilitationRequested.emit({ profile: item, action });
    }

    public onUsersClicked(item: ProfileHabilitation): void {
        this.profileHabilitationRequested.emit({ profile: item, action: 'users' });
    }

    public onAddProfile(): void {
        this.addProfileRequested.emit();
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
