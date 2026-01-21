import { inject, Injectable } from "@angular/core";
import { AccessLogsFilterDto } from "@presentation/pages/settings-security/core/application/dtos/access-logs-filter.dtos";
import { AccessLogsUseCase } from "@presentation/pages/settings-security/core/application/use-cases/access-logs/access-logs.use-case";
import { AccessLogsEntity } from "@presentation/pages/settings-security/core/domain/entities/access-logs/access-logs.entity";
import { BaseFacade } from "@shared/application/base/base-facade";
import { shouldFetch } from "@shared/application/base/facade.utils";
import { UiFeedbackService } from "@shared/application/ui/ui-feedback.service";
import { PAGINATION_CONST } from "@shared/constants/pagination.constants";


@Injectable({
    providedIn: 'root'
})
export class AccessLogsFacade extends BaseFacade<AccessLogsEntity, AccessLogsFilterDto> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly useCase = inject(AccessLogsUseCase);

    readonly accessLogs$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    readAll(filter: AccessLogsFilterDto | null = {}, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);
        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);
        this.fetchWithFilterAndPage(null, firstPage, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;
        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    refreshWithLastFilterAndPage(): void {
        const currentFilter = this.filterSubject.getValue();
        const currentPage = this.pageSubject.getValue();
        this.fetchWithFilterAndPage(currentFilter, currentPage, this.useCase.readAll.bind(this.useCase), this.uiFeedbackService);
        this.lastFetchTimestamp = Date.now();
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue() !== null,
        };
    }
}
