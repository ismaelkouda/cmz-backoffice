import { Injectable, signal, computed } from '@angular/core';

export type PermissionState = 'granted' | 'denied' | 'prompt';

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Bounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export interface MapCluster {
    latitude: number;
    longitude: number;
    count: number;
}

export interface MapState {
    userPosition: LatLng | null;
    bounds: Bounds | null;
    clusters: MapCluster[];
    loading: boolean;
    permission: PermissionState;
    error: string | null;
}

const initialState: MapState = {
    userPosition: null,
    bounds: null,
    clusters: [],
    loading: false,
    permission: 'prompt',
    error: null,
};

@Injectable({
    providedIn: 'root',
})
export class MapStore {
    private readonly state = signal<MapState>(initialState);

    public readonly userPosition = computed(() => this.state().userPosition);
    public readonly bounds = computed(() => this.state().bounds);
    public readonly clusters = computed(() => this.state().clusters);
    public readonly loading = computed(() => this.state().loading);
    public readonly permission = computed(() => this.state().permission);
    public readonly error = computed(() => this.state().error);

    public readonly hasBounds = computed(() => this.bounds() !== null);
    public readonly hasClusters = computed(() => this.clusters().length > 0);
    public readonly hasError = computed(() => !!this.error());

    public readonly isPermissionGranted = computed(
        () => this.permission() === 'granted'
    );
    public readonly isPermissionDenied = computed(
        () => this.permission() === 'denied'
    );
    public readonly isPermissionPrompt = computed(
        () => this.permission() === 'prompt'
    );

    public readonly canFetchClusters = computed(() => {
        return this.isPermissionGranted() && this.bounds() !== null;
    });

    public denyPermission(): void {
        this.patchState({
            permission: 'denied',
            userPosition: null,
            bounds: null,
            clusters: [],
            loading: false,
            error: null,
        });
    }

    public setPermission(permission: PermissionState): void {
        this.patchState({ permission });
    }

    public setUserPosition(position: LatLng): void {
        this.patchState({
            userPosition: position,
            error: null,
        });
    }

    private patchState(partial: Partial<MapState>): void {
        this.state.update((current) => ({
            ...current,
            ...partial,
        }));
    }

    public setBounds(bounds: Bounds): void {
        const current = this.state().bounds;

        if (this.areBoundsEqual(current, bounds)) {
            return;
        }

        this.patchState({ bounds });
    }

    public setClusters(clusters: MapCluster[]): void {
        this.patchState({
            clusters: [...clusters],
            loading: false,
            error: null,
        });
    }

    public startLoading(): void {
        this.patchState({
            loading: true,
            error: null,
        });
    }

    public setLoading(loading: boolean): void {
        this.patchState({ loading });
    }

    public setError(message: string | null): void {
        this.patchState({
            error: message,
            clusters: [],
            loading: false,
        });
    }

    public clearClusters(): void {
        this.patchState({
            clusters: [],
        });
    }

    public reset(): void {
        this.state.set({ ...initialState });
    }

    private areBoundsEqual(b1: Bounds | null, b2: Bounds | null): boolean {
        if (!b1 || !b2) {
            return false;
        }
        const epsilon = 0.0001;
        return (
            Math.abs(b1.minLat - b2.minLat) < epsilon &&
            Math.abs(b1.maxLat - b2.maxLat) < epsilon &&
            Math.abs(b1.minLng - b2.minLng) < epsilon &&
            Math.abs(b1.maxLng - b2.maxLng) < epsilon
        );
    }
}
