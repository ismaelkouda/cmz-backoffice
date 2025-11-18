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
import { TEAM_TABLE } from '@presentation/pages/team-organization/data-access/team/constants/team-table.constant';
import { Team } from '@presentation/pages/team-organization/domain/entities/team.entity';
import { SearchTableComponent } from '@shared/components/search-table/search-table.component';
import { TableButtonHeaderComponent } from '@shared/components/table-button-header/table-button-header.component';
import { TableTitleComponent } from '@shared/components/table-title/table-title.component';
import { TableConfig } from '@shared/interfaces/table-config';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, take } from 'rxjs';

@Component({
    selector: 'app-table-team',
    standalone: true,
    templateUrl: './table-team.component.html',
    styleUrls: ['./table-team.component.scss'],
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
export class TableTeamComponent {
    @Input() spinner: boolean = false;
    @Input() listTeams$!: Observable<Team[]>;
    @Output() teamRequested = new EventEmitter<{
        team: Team;
        action:
            | 'view'
            | 'edit'
            | 'delete'
            | 'enable'
            | 'disable'
            | 'tenants'
            | 'participants';
    }>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() addTeamRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = TEAM_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listTeams$.pipe(take(1)).subscribe((teams) => {
            if (teams && teams.length > 0) {
                const fileName = `${this.exportFilePrefix}-teams`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    teams,
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

    public onActionClicked(
        item: Team,
        action:
            | 'view'
            | 'edit'
            | 'delete'
            | 'enable'
            | 'disable'
            | 'tenants'
            | 'participants'
    ): void {
        this.teamRequested.emit({ team: item, action });
    }

    public onTenantsClicked(item: Team): void {
        this.teamRequested.emit({ team: item, action: 'tenants' });
    }

    public onParticipantsClicked(item: Team): void {
        this.teamRequested.emit({ team: item, action: 'participants' });
    }

    public onAddTeam(): void {
        this.addTeamRequested.emit();
    }

    public isTeamActive(team: Team): boolean {
        return (
            (team?.statut ?? '').toLowerCase() === 'actif' ||
            (team?.statut ?? '').toLowerCase() === 'active'
        );
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
