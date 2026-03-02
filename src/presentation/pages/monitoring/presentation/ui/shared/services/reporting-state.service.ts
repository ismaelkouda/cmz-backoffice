import { Injectable, computed, signal } from '@angular/core';

export interface MonitoringState {
    isLoading: boolean;
    hasError: boolean;
    isFullscreen: boolean;
    lastUpdated: Date | null;
    connectionStatus: 'connected' | 'loading' | 'error';
}

@Injectable()
export class MonitoringStateService {
    private readonly state = signal<MonitoringState>({
        isLoading: false,
        hasError: false,
        isFullscreen: false,
        lastUpdated: null,
        connectionStatus: 'loading',
    });

    public readonly isLoading = computed(() => this.state().isLoading);
    public readonly hasError = computed(() => this.state().hasError);
    public readonly isFullscreen = computed(() => this.state().isFullscreen);
    public readonly lastUpdated = computed(() => this.state().lastUpdated);
    public readonly connectionStatus = computed(
        () => this.state().connectionStatus
    );

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
        status: MonitoringState['connectionStatus']
    ): void {
        this.state.update((prev) => ({ ...prev, connectionStatus: status }));
    }

    public updateLastUpdated(): void {
        this.state.update((prev) => ({ ...prev, lastUpdated: new Date() }));
    }
}
