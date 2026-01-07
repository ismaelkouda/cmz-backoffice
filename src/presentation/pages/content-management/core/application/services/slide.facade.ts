import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreateSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/create-slide.use-case';
import { DeleteSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/delete-slide.use-case';
import { DisableSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/disable-slide.use-case';
import { EnableSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/enable-slide.use-case';
import { GetSlideByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/get-slide-by-id.use-case';
import { FetchSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/slide.use-case';
import { UpdateSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/update-slide.use-case';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { SlideFilter } from '@presentation/pages/content-management/core/domain/value-objects/slide-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideFacade extends BaseFacade<SlideEntity, SlideFilter> {
    public readonly slide$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchSlideUseCase,
        private readonly getByIdUseCase: GetSlideByIdUseCase,
        private readonly createUseCase: CreateSlideUseCase,
        private readonly updateUseCase: UpdateSlideUseCase,
        private readonly deleteUseCase: DeleteSlideUseCase,
        private readonly enableUseCase: EnableSlideUseCase,
        private readonly disableUseCase: DisableSlideUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchSlide(
        filter: SlideFilter,
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

    getSlideById(id: string): Observable<SlideEntity> {
        return this.getByIdUseCase.execute(id);
    }

    createSlide(payload: FormData): Observable<SlideEntity> {
        return this.createUseCase.execute(payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.CREATE')
                );
                this.refresh();
            })
        );
    }

    updateSlide(id: string, payload: FormData): Observable<SlideEntity> {
        return this.updateUseCase.execute({ id, data: payload }).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    deleteSlide(id: string): Observable<SimpleResponseDto<void>> {
        return this.deleteUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.DELETE')
                );
                this.refresh();
            })
        );
    }

    enableSlide(id: string): Observable<SimpleResponseDto<void>> {
        return this.enableUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    disableSlide(id: string): Observable<SimpleResponseDto<void>> {
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
