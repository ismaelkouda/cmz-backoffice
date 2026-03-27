import { Injectable } from '@angular/core';
import { EncodingDataService } from '@shared/domain/services/encoding-data.service';

@Injectable({
    providedIn: 'root',
})
export class AsFeatureService {
    constructor(private readonly encodingService: EncodingDataService) {}

    public getAsAccessFeature(): string[] | null {
        return this.encodingService.getData('modules');
    }

    public setAsAccessFeature(value: string[]): void {
        this.encodingService.saveData('modules', value, true);
    }

    public hasFeature(feature: string): boolean {
        this.encodingService.getData('modules');
        const asAccessFeature = this.encodingService.getData(
            'modules'
        ) as string[];
        return asAccessFeature.includes(feature);
    }
}
