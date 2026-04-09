import { Injectable, signal } from '@angular/core';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';

@Injectable({ providedIn: 'root' })
export class LocationStateService {
    readonly selectedCoordinates = signal<Coordinates | null>(null);
    readonly loadingAddress = signal<boolean>(false);
    readonly currentAddress = signal<string | null>(null);

    public setSelected(coords: Coordinates): void {
        this.selectedCoordinates.set({ ...coords });
    }

    public clear(): void {
        this.selectedCoordinates.set(null);
        this.currentAddress.set(null);
    }
}
