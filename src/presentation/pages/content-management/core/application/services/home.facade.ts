import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { HomeFilter } from '@presentation/pages/content-management/core/domain/value-objects/home-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import {
    CreateHomeUseCase,
    DeleteHomeUseCase,
    DisableHomeUseCase,
    EnableHomeUseCase,
    FetchHomeUseCase,
    GetHomeByIdUseCase,
    UpdateHomeUseCase
} from '../use-cases/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeFacade extends BaseFacade<HomeEntity, HomeFilter> {
    readonly home$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchHomeUseCase,
        private readonly getByIdUseCase: GetHomeByIdUseCase,
        private readonly createUseCase: CreateHomeUseCase,
        private readonly updateUseCase: UpdateHomeUseCase,
        private readonly deleteUseCase: DeleteHomeUseCase,
        private readonly enableUseCase: EnableHomeUseCase,
        private readonly disableUseCase: DisableHomeUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchHome(
        filter: HomeFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.fetchUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    getHomeById(id: string): Observable<HomeEntity> {
        return this.getByIdUseCase.execute(id);
    }

    createHome(payload: FormData): Observable<HomeEntity> {
        return this.createUseCase.execute(payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.CREATE')
                );
                this.refresh();
            })
        );
    }

    updateHome(id: string, payload: FormData): Observable<HomeEntity> {
        return this.updateUseCase.execute(id, payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    deleteHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.deleteUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.DELETE')
                );
                this.refresh();
            })
        );
    }

    enableHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.enableUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    disableHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.disableUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch = this.fetchUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch = this.fetchUseCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    private shouldFetch(forceRefresh: boolean): boolean {
        if (forceRefresh) {
            return true;
        }
        if (!this.hasInitialized) {
            return true;
        }
        const isStale = Date.now() - this.lastFetchTimestamp > this.STALE_TIME;
        if (isStale) {
            return true;
        }
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!hasData) {
            return true;
        }

        return false;
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
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }
}
