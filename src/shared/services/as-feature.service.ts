import { Injectable } from '@angular/core';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class AsFeatureService {
    constructor(private encodingService: EncodingDataService) {}

    public getAsAccessFeature(): string[] {
        return this.encodingService.getData('modules');
    }

    public setAsAccessFeature(value: string[]): void {
        this.encodingService.saveData('modules', value);
    }

    public hasFeature(feature: string): boolean {
        this.encodingService.getData('modules');
        const asAccessFeature = this.encodingService.getData(
            'modules'
        ) as Array<string>;
        return asAccessFeature.includes(feature);
    }
}
