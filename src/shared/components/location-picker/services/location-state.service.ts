import { Injectable, signal } from '@angular/core';

import { LocationCoordinates } from '../models/location-coordinates.model';

@Injectable({ providedIn: 'root' })
export class LocationStateService {
    readonly selectedCoordinates = signal<LocationCoordinates | null>(null);
    readonly loadingAddress = signal<boolean>(false);
    readonly currentAddress = signal<string | null>(null);

    public setSelected(coords: LocationCoordinates): void {
        this.selectedCoordinates.set({ ...coords });
    }

    public clear(): void {
        this.selectedCoordinates.set(null);
        this.currentAddress.set(null);
    }
}
