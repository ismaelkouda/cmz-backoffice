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
import { Tenant } from '@presentation/pages/team-organization/domain/entities/tenant.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
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
import { TEAM_TENANTS_TABLE } from '../../../data-access/team/constants/team-tenants-table.constant';

@Component({
    selector: 'app-table-team-tenants',
    standalone: true,
    templateUrl: './table-team-tenants.component.html',
    styleUrls: ['./table-team-tenants.component.scss'],
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
    ],
})
export class TableTeamTenantsComponent {
    @Input() spinner!: boolean;
    @Input() listTenants$!: Observable<Tenant[]>;
    @Input() selectedTenants: Tenant[] = [];
    @Input() hideAssignButton: boolean = false;
    @Output() selectionChange = new EventEmitter<Tenant[]>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() assignRequested = new EventEmitter<void>();
    @Output() removeRequested = new EventEmitter<Tenant[]>();
    @Output() reassignRequested = new EventEmitter<Tenant[]>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = TEAM_TENANTS_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listTenants$.pipe(take(1)).subscribe((tenants) => {
            if (tenants && tenants.length > 0) {
                const fileName = `${this.exportFilePrefix}-team-tenants`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    tenants,
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
                'TEAM_ORGANIZATION.TEAM.LABELS.STATUS.ACTIVE'
            );
        }
        if (normalized === 'inactive' || normalized === 'inactif') {
            return this.translate.instant(
                'TEAM_ORGANIZATION.TEAM.LABELS.STATUS.INACTIVE'
            );
        }
        return status;
    }

    public onSelectionChange(): void {
        this.selectionChange.emit([...this.selectedTenants]);
    }

    public onAssign(): void {
        this.assignRequested.emit();
    }

    public onRemove(): void {
        if (this.selectedTenants.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.removeRequested.emit([...this.selectedTenants]);
    }

    public onReassign(): void {
        if (this.selectedTenants.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.reassignRequested.emit([...this.selectedTenants]);
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
