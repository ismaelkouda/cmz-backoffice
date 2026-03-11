import { inject, Injectable } from '@angular/core';
import { SimpleBaseFacade } from '@shared/application/services/simple-base-facade';

import { NodeEntity } from '../../domain/entities/node/node.entity';
import { FetchNodeUseCase } from '../use-cases/node/fetch-node.use-case';

@Injectable({
    providedIn: 'root',
})
export class NodeFacade extends SimpleBaseFacade<NodeEntity, undefined> {
    private readonly fetchNodeUseCase = inject(FetchNodeUseCase);
    readonly nodes$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    fetchNode(forceRefresh = false): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.fetchNodeUseCase.execute();
        this.fetchData(null, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const fetch = this.fetchNodeUseCase.execute();
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
