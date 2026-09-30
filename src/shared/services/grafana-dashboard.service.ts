import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import {
    BehaviorSubject,
    Observable,
    of,
    shareReplay,
    switchMap,
    take,
} from 'rxjs';

import {
    DashboardTokenResponseDto,
    GrafanaVariablesResponse,
} from '@shared/interfaces/grafana.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

interface GrafanaTokenState {
    dashboardUid: string;
    expiresAt: number;
    refreshTimer: ReturnType<typeof setTimeout> | null;
    readonly url$: BehaviorSubject<string | null>;
    readonly loading$: BehaviorSubject<boolean>;
    readonly error$: BehaviorSubject<string | null>;
}

interface VariablesCache {
    tokens: Record<string, string>;
    expiresAt: number;
    source: Observable<Record<string, string>>;
}

const VARIABLES_TTL_FALLBACK_MS = 5 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class GrafanaDashboardService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    private variablesCache: VariablesCache | null = null;
    private inFlight: Observable<Record<string, string>> | null = null;
    private readonly states = new Map<string, GrafanaTokenState>();

    url$(key: string): Observable<string | null> {
        return this.ensureState(key).url$.asObservable();
    }

    loading$(key: string): Observable<boolean> {
        return this.ensureState(key).loading$.asObservable();
    }

    error$(key: string): Observable<string | null> {
        return this.ensureState(key).error$.asObservable();
    }

    load(key: string, options?: FetchOptions): void {
        const state = this.ensureState(key);

        if (state.loading$.getValue()) {
            return;
        }

        state.loading$.next(true);
        state.error$.next(null);

        this.getVariables(options?.forceRefresh === true)
            .pipe(take(1))
            .subscribe({
                next: (tokens) => {
                    const dashboardUid = tokens[key];
                    if (!dashboardUid) {
                        state.loading$.next(false);
                        state.error$.next(
                            `Aucun token Grafana pour la cle "${key}".`
                        );
                        return;
                    }

                    this.fetchDashboardToken(state, key, dashboardUid);
                },
                error: () => {
                    state.loading$.next(false);
                    state.error$.next(
                        'Erreur lors de la recuperation des variables Grafana.'
                    );
                },
            });
    }

    private fetchDashboardToken(
        state: GrafanaTokenState,
        key: string,
        dashboardUid: string
    ): void {
        this.http
            .post<DashboardTokenResponseDto>(
                `${this.baseUrl}dashboards/token`,
                { dashboard_uid: dashboardUid }
            )
            .subscribe({
                next: (response) => {
                    state.loading$.next(false);

                    if (response?.error || !response?.data?.embed_url) {
                        state.error$.next(
                            response?.message || 'Erreur API Grafana.'
                        );
                        return;
                    }

                    state.dashboardUid = dashboardUid;
                    state.expiresAt =
                        Date.now() + (response.data.expires_in || 0) * 1000;
                    state.error$.next(null);
                    state.url$.next(response.data.embed_url);
                    this.scheduleRefresh(key);
                },
                error: () => {
                    state.loading$.next(false);
                    state.error$.next(
                        'Erreur lors de la recuperation du token Grafana.'
                    );
                },
            });
    }

    /**
     * Returns the dashboard-variable mapping, re-fetching from the API when the
     * cached copy is expired (`expires_in`) or has not been loaded yet.
     * Concurrent callers share a single in-flight request.
     * @param force
     */
    private getVariables(force = false): Observable<Record<string, string>> {
        const cache = this.variablesCache;
        if (!force && cache && !this.isVariablesExpired(cache)) {
            return cache.source;
        }

        if (!force && this.inFlight) {
            return this.inFlight;
        }

        this.inFlight = this.http
            .get<GrafanaVariablesResponse>(`${this.baseUrl}variables`)
            .pipe(
                switchMap((response) => {
                    const tokens =
                        response?.error || !response?.data ? {} : response.data;
                    const expiresAt =
                        Date.now() +
                        (response?.expires_in || 0) * 1000 +
                        (response?.expires_in ? 0 : VARIABLES_TTL_FALLBACK_MS);
                    this.variablesCache = {
                        tokens,
                        expiresAt,
                        source: of(tokens),
                    };
                    return of(tokens);
                }),
                shareReplay({ bufferSize: 1, refCount: false })
            );

        return this.inFlight;
    }

    private isVariablesExpired(cache: VariablesCache): boolean {
        return !cache.tokens || Date.now() >= cache.expiresAt;
    }

    private scheduleRefresh(key: string): void {
        const state = this.states.get(key);
        if (!state) {
            return;
        }

        if (state.refreshTimer) {
            clearTimeout(state.refreshTimer);
        }

        const remaining = state.expiresAt - Date.now();
        const delay = Math.max(remaining - 5000, 1000);

        state.refreshTimer = setTimeout(() => {
            this.refreshKey(key);
        }, delay);
    }

    private refreshKey(key: string): void {
        const state = this.states.get(key);
        if (!state) {
            return;
        }

        this.getVariables(true)
            .pipe(take(1))
            .subscribe((tokens) => {
                if (!tokens[key]) {
                    return;
                }
                // this.fetchDashboardToken(state, key, tokens[key]);
            });
    }

    private ensureState(key: string): GrafanaTokenState {
        let state = this.states.get(key);
        if (!state) {
            state = {
                dashboardUid: '',
                expiresAt: 0,
                refreshTimer: null,
                url$: new BehaviorSubject<string | null>(null),
                loading$: new BehaviorSubject<boolean>(false),
                error$: new BehaviorSubject<string | null>(null),
            };
            this.states.set(key, state);
        }

        return state;
    }
}
