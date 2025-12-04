/* import { AsyncPipe, CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { TableConfig, TableExportExcelFileService } from '@shared/services/table-export-excel-file.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccessLogsFacade } from '../../application/access-logs.facade';
import { ACCESS_LOGS_TABLE } from '../../domain/constants/access-logs/access-logs-table.constant';
import { AccessLogsFilterPayloadEntity } from '../../domain/entities/access-logs/access-logs-filter-payload.entity';
import { AccessLogsEntity } from '../../domain/entities/access-logs/access-logs.entity';
import { AccessLogsFilter } from '../../domain/value-objects/access-logs-filter.vo';
import { FilterAccessLogsComponent } from '../../feature/access-logs/filter-access-logs/filter-access-logs.component';
import { TableAccessLogsComponent } from '../../feature/access-logs/table-access-logs/table-access-logs.component';

@Component({
    selector: 'app-access-logs',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        BreadcrumbComponent,
        PageTitleComponent,
        PaginationComponent,
        FilterAccessLogsComponent,
        TableAccessLogsComponent,
        AsyncPipe,
    ],
    templateUrl: './access-logs.component.html',
    styleUrls: ['./access-logs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessLogsComponent implements OnInit, OnDestroy {
    private readonly title = inject(Title);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly accessLogsFacade = inject(AccessLogsFacade);
    private readonly appCustomizationService = inject(AppCustomizationService);
    private readonly tableExportExcelFileService = inject(TableExportExcelFileService);
    readonly routeParams = toSignal(this.activatedRoute.queryParams, {
        initialValue: {}
    });
    private readonly exportFilePrefix = this.normalizeExportPrefix(
        this.appCustomizationService.config.app.name
    );
    public module!: string;
    public subModule!: string;
    public readonly tableConfig: TableConfig = ACCESS_LOGS_TABLE;
    public readonly accessLogs$ = this.accessLogsFacade.accessLogs$;
    public readonly pagination$ = this.accessLogsFacade.pagination$;
    public readonly loading$ = this.accessLogsFacade.isLoading$;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.setupRouteData();
        this.loadData();
        console.log("routeParams", this.routeParams())
    }

    private loadData(): void {
        const defaultFilter = AccessLogsFilter.create();
        this.accessLogsFacade.fetchAccessLogs(defaultFilter, '1', false);
    }

    private setupRouteData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.title.setTitle(
                    data['title'] ?? 'COMMUNICATION.ACCESS_LOGS.TITLE'
                );
                this.module = data['module'] ?? 'COMMUNICATION.LABEL';
                this.subModule =
                    data['subModule'] ?? 'COMMUNICATION.ACCESS_LOGS.LABEL';
            });
    }

    onFilter(payload: AccessLogsFilterPayloadEntity): void {
        const filter = AccessLogsFilter.create(payload);
        this.accessLogsFacade.fetchAccessLogs(filter, '1', true);
    }

    onPageChange(page: number): void {
        this.accessLogsFacade.changePage(page);
    }

    onRefresh(): void {
        this.accessLogsFacade.refresh();
    }

    onExportExcel(accessLogs: AccessLogsEntity[]): void {
        this.tableExportExcelFileService.exportAsExcelFile(
            accessLogs,
            this.tableConfig,
            `${this.exportFilePrefix}-access-logs`
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
 */