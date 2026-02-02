import { inject, Injectable } from '@angular/core';

import { SimpleBaseFacade } from '@shared/application/base/simple-base-facade';

import { ReportEntity } from '../../domain/entities/report/report.entity';
import { FetchReportUseCase } from '../use-cases/report/fetch-report.use-case';

@Injectable({
    providedIn: 'root',
})
export class ReportFacade extends SimpleBaseFacade<ReportEntity, undefined> {
    private readonly fetchReportUseCase = inject(FetchReportUseCase);
    readonly requests$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    fetchReport(forceRefresh = false): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.fetchReportUseCase.execute();
        this.fetchData(null, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const fetch = this.fetchReportUseCase.execute();
        this.fetchData(null, fetch);

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
        const hasData = this.itemsSubject.getValue() !== null;
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
            hasData: this.itemsSubject.getValue() !== null,
        };
    }
}
