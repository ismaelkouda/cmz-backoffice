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
import { AGENT_TABLE } from '@presentation/pages/team-organization/data-access/agent/constants/agent-table.constant';
import { AgentIa } from '@presentation/pages/team-organization/domain/entities/agent-ia.entity';
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
    selector: 'app-table-agent-ia',
    standalone: true,
    templateUrl: './table-agent-ia.component.html',
    styleUrls: ['./table-agent-ia.component.scss'],
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
export class TableAgentIaComponent {
    @Input() spinner: boolean = false;
    @Input() listAgents$!: Observable<AgentIa[]>;
    @Output() agentRequested = new EventEmitter<{
        agent: AgentIa;
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'tenants';
    }>();
    @Output() refreshRequested = new EventEmitter<void>();
    @Output() addAgentRequested = new EventEmitter<void>();

    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );

    public readonly table: TableConfig = AGENT_TABLE;

    constructor(
        private readonly toastService: ToastrService,
        private readonly clipboardService: ClipboardService,
        private readonly tableExportExcelFileService: TableExportExcelFileService,
        private readonly translate: TranslateService
    ) {}

    public onExportExcel(): void {
        this.listAgents$.pipe(take(1)).subscribe((agents) => {
            if (agents && agents.length > 0) {
                const fileName = `${this.exportFilePrefix}-agents-ia`;
                this.tableExportExcelFileService.exportAsExcelFile(
                    agents,
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
                'TEAM_ORGANIZATION.AGENT_IA.LABELS.STATUS.ACTIVE'
            );
        }
        if (normalized === 'inactive' || normalized === 'inactif') {
            return this.translate.instant(
                'TEAM_ORGANIZATION.AGENT_IA.LABELS.STATUS.INACTIVE'
            );
        }

        return status;
    }

    public onActionClicked(
        item: AgentIa,
        action: 'view' | 'edit' | 'delete' | 'enable' | 'disable' | 'tenants'
    ): void {
        this.agentRequested.emit({ agent: item, action });
    }

    public onTenantsClicked(item: AgentIa): void {
        this.agentRequested.emit({ agent: item, action: 'tenants' });
    }

    public onAddAgent(): void {
        this.addAgentRequested.emit();
    }

    public isAgentActive(agent: AgentIa): boolean {
        return (
            (agent?.statut ?? '').toLowerCase() === 'actif' ||
            (agent?.statut ?? '').toLowerCase() === 'active'
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
