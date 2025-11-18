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
import { Participant } from '@presentation/pages/team-organization/domain/entities/participant.entity';
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
import { TEAM_PARTICIPANTS_TABLE } from '../../../data-access/team/constants/team-participants-table.constant';

@Component({
    selector: 'app-table-team-participants',
    standalone: true,
    templateUrl: './table-team-participants.component.html',
    styleUrls: ['./table-team-participants.component.scss'],
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
export class TableTeamParticipantsComponent {
    @Input() spinner!: boolean;
    @Input() listParticipants$!: Observable<Participant[]>;
    @Input() selectedParticipants: Participant[] = [];
    @Input() hideAssignButton: boolean = false;
    @Output() selectionChange = new EventEmitter<Participant[]>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() assignRequested = new EventEmitter<void>();
    @Output() removeRequested = new EventEmitter<Participant[]>();
    @Output() reassignRequested = new EventEmitter<Participant[]>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = TEAM_PARTICIPANTS_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listParticipants$.pipe(take(1)).subscribe((participants) => {
            if (participants && participants.length > 0) {
                const fileName = `${this.exportFilePrefix}-team-participants`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    participants,
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

    public getFullName(participant: Participant): string {
        return `${participant.nom} ${participant.prenoms}`.trim();
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
        this.selectionChange.emit([...this.selectedParticipants]);
    }

    public onAssign(): void {
        this.assignRequested.emit();
    }

    public onRemove(): void {
        if (this.selectedParticipants.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.removeRequested.emit([...this.selectedParticipants]);
    }

    public onReassign(): void {
        if (this.selectedParticipants.length === 0) {
            this.toastService.warning(
                this.translate.instant(
                    'TEAM_ORGANIZATION.TEAM.MANAGEMENT_AFFECTED.MESSAGES.NO_SELECTION'
                )
            );
            return;
        }
        this.reassignRequested.emit([...this.selectedParticipants]);
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
