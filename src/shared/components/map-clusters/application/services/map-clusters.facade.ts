import { inject, Injectable } from '@angular/core';
import { BaseFacade } from '@shared/application/services/base-facade';
import { shouldFetch } from '@shared/application/services/facade.utils';
import { MapClustersFilterDto } from '@shared/components/map-clusters/application/dto/map-clusters-filter.dto';
import { MapClustersQuery } from '@shared/components/map-clusters/application/queries/map-clusters.query';
import { MapClustersBus } from '@shared/components/map-clusters/application/queries-bus/map-clusters.bus';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

@Injectable({ providedIn: 'root' })
export class MapClustersFacade extends BaseFacade<
    MapClustersEntity,
    MapClustersFilterDto
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly filterBus = inject(MapClustersBus);

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    read(
        filter: MapClustersFilterDto,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh = false
    ): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (
            !shouldFetch(
                forceRefresh,
                hasData,
                this.lastFetchTimestamp,
                this.STALE_TIME
            )
        ) {
            return;
        }

        const command = new MapClustersQuery(
            filter.minLat,
            filter.maxLat,
            filter.minLng,
            filter.maxLng
        );
        const fetch$ = this.filterBus.dispatch(command, page);
        this.fetchWithFilterAndPage(
            filter,
            page,
            fetch$,
            this.uiFeedbackService
        );

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    // refresh(): void {
    //     this.filterSubject.next(null);
    //     this.pageSubject.next(PAGINATION_CONST.DEFAULT_PAGE);
    //     const filter = this.filterSubject.getValue();
    //     const page = this.pageSubject.getValue();
    //     const command = new MapClustersQuery(
    //         filter.minLat,
    //         filter.maxLat,
    //         filter.minLng,
    //         filter.maxLng,
    //     );
    //     const fetch$ = this.filterBus.dispatch(command, page);
    //     this.fetchWithFilterAndPage(null, page, fetch$, this.uiFeedbackService);
    //     this.lastFetchTimestamp = Date.now();
    // }

    // changePage(page: string): void {
    //     const filter = this.filterSubject.getValue();
    //     if (!filter) {
    //         return;
    //     }
    //     const command = new MapClustersQuery(
    //         filter?.initiatorPhoneNumber,
    //         filter?.uniqId,
    //         filter?.reportType,
    //         filter?.operators,
    //         filter?.source,
    //         filter?.startDate,
    //         filter?.endDate
    //     );
    //     const fetch$ = this.filterBus.dispatch(command, page);
    //     this.fetchWithFilterAndPage(
    //         filter,
    //         page,
    //         fetch$,
    //         this.uiFeedbackService
    //     );
    //     this.lastFetchTimestamp = Date.now();
    // }

    // refreshWithLastFilterAndPage(): void {
    //     const filter = this.filterSubject.getValue();
    //     const page = this.pageSubject.getValue();
    //     const command = new MapClustersQuery(
    //         filter?.initiatorPhoneNumber,
    //         filter?.uniqId,
    //         filter?.reportType,
    //         filter?.operators,
    //         filter?.source,
    //         filter?.startDate,
    //         filter?.endDate
    //     );
    //     const fetch$ = this.filterBus.dispatch(command, page);
    //     this.fetchWithFilterAndPage(
    //         filter,
    //         page,
    //         fetch$,
    //         this.uiFeedbackService
    //     );
    //     this.lastFetchTimestamp = Date.now();
    // }

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
