import { Injectable } from '@angular/core';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class AsFeatureService {
    constructor(private storage: EncodingDataService) {}

    public getAsAccessFeature(): string[] {
        return this.storage.getData('modules');
    }

    public setAsAccessFeature(value: string[]): void {
        this.storage.saveData('modules', JSON.stringify(value));
    }

    public hasFeature(feature: string): boolean {
        this.storage.getData('modules');
        const asAccessFeature = this.storage.getData('modules');
        return asAccessFeature.includes(feature);
    }
}
