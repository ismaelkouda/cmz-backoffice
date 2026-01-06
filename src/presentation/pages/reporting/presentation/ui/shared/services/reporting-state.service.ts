import { Injectable, computed, signal } from '@angular/core';

export interface ReportingState {
    isLoading: boolean;
    hasError: boolean;
    isFullscreen: boolean;
    lastUpdated: Date | null;
    connectionStatus: 'connected' | 'loading' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ReportingStateService {
    private readonly state = signal<ReportingState>({
        isLoading: false,
        hasError: false,
        isFullscreen: false,
        lastUpdated: null,
        connectionStatus: 'loading',
    });

    // Computed signals pour un accès réactif
    public readonly isLoading = computed(() => this.state().isLoading);
    public readonly hasError = computed(() => this.state().hasError);
    public readonly isFullscreen = computed(() => this.state().isFullscreen);
    public readonly lastUpdated = computed(() => this.state().lastUpdated);
    public readonly connectionStatus = computed(
        () => this.state().connectionStatus
    );

    // Méthodes pour mettre à jour l'état
    public setLoading(loading: boolean): void {
        this.state.update((prev) => ({ ...prev, isLoading: loading }));
    }

    public setError(error: boolean): void {
        this.state.update((prev) => ({ ...prev, hasError: error }));
    }

    public setFullscreen(fullscreen: boolean): void {
        this.state.update((prev) => ({ ...prev, isFullscreen: fullscreen }));
    }

    public updateConnectionStatus(
        status: ReportingState['connectionStatus']
    ): void {
        this.state.update((prev) => ({ ...prev, connectionStatus: status }));
    }

    public updateLastUpdated(): void {
        this.state.update((prev) => ({ ...prev, lastUpdated: new Date() }));
    }
}
