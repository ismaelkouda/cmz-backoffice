import { computed, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import { ResourceState } from '@shared/domain/interfaces/resource-state.type';
import { UiFeedbackService } from '@shared/domain/services/ui-feedback.service';

Injectable({ providedIn: 'root' });

export interface Filter {
    toDto(): Record<string, string | string[]>;
}
export class ObjectBaseFacade<TEntity, TFilter> {
    protected readonly _state = signal<ResourceState<TEntity>>({
        data: null,
        loading: false,
        error: null,
        lastFetch: 0,
    });

    readonly state = this._state.asReadonly();

    readonly items = computed(() => this._state().data);
    readonly loading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);

    protected readonly _filter = signal<TFilter | null>(null);

    protected fetch(
        filter: TFilter,
        fetch$: Observable<TEntity>,
        ui?: UiFeedbackService,
        staleTime = 0,
        force = false,
        skipSameFilter = false
    ): void {
        const current = this._state();

        if (!force && !this.shouldFetch(current, staleTime)) {
            return;
        }

        if (current.loading) {
            return;
        }

        if (!skipSameFilter) {
            const prev = this.normalize(this._filter());
            const curr = this.normalize(filter);

            /* const prevEmpty = this.isEmpty(prev); */
            const currEmpty = this.isEmpty(curr);

            if (!currEmpty) {
                const same = this.isSameFilter(prev, curr);

                if (same) {
                    return;
                }
            }
        }

        this._filter.set(filter);

        this._state.update((s) => ({
            ...s,
            loading: true,
            error: null,
        }));

        fetch$
            .pipe(
                tap((data) => {
                    this._state.set({
                        data,
                        loading: false,
                        error: null,
                        lastFetch: Date.now(),
                    });
                }),
                catchError((err) => {
                    this._state.update((s) => ({
                        ...s,
                        loading: false,
                        error: err,
                    }));

                    ui?.notifyError(err);

                    return throwError(() => err);
                }),
                finalize(() => {
                    this._state.update((s) => ({
                        ...s,
                        loading: false,
                    }));
                })
            )
            .subscribe();
    }

    protected shouldFetch(
        state: ResourceState<TEntity>,
        staleTime: number
    ): boolean {
        const isStale = Date.now() - state.lastFetch > staleTime;
        return !state.data || isStale;
    }

    reset(): void {
        this._state.set({
            data: null,
            loading: false,
            error: null,
            lastFetch: 0,
        });

        this._filter.set(null);
    }

    private normalize(filter: TFilter | null): Record<string, any> {
        if (!filter) {
            return {};
        }

        if (typeof (filter as any).toDto === 'function') {
            return (filter as any).toDto();
        }

        return filter as any;
    }

    private isEmpty(filter: Record<string, any>): boolean {
        return Object.keys(filter).length === 0;
    }

    private isSameFilter(
        a: Record<string, any>,
        b: Record<string, any>
    ): boolean {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();

        if (aKeys.length !== bKeys.length) {
            return false;
        }

        return aKeys.every((key) => {
            const valA = a[key];
            const valB = b[key];

            if (Array.isArray(valA) && Array.isArray(valB)) {
                if (valA.length !== valB.length) {
                    return false;
                }
                return valA.every((v, i) => v === valB[i]);
            }

            return valA === valB;
        });
    }
}
